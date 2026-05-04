// Example Backend Implementation (Node.js/Express)
// This is a reference implementation - adapt to your backend framework

const express = require('express');
const router = express.Router();

// Assuming you have a database connection pool
// const pool = require('./db');

/**
 * POST /api/user-activity
 * Track user game play activity
 */
router.post('/api/user-activity', async (req, res) => {
  try {
    const { userId, gameId, categoryId } = req.body;

    // Validate input
    if (!userId || !gameId || !categoryId) {
      return res.status(400).json({
        success: false,
        error: 'userId, gameId, and categoryId are required',
      });
    }

    // Insert activity record
    await pool.query(
      `INSERT INTO user_activity (user_id, game_id, category_id, played_at) 
       VALUES ($1, $2, $3, NOW())`,
      [userId, gameId, categoryId]
    );

    res.json({
      success: true,
      message: 'Activity tracked successfully',
    });
  } catch (error) {
    console.error('Error tracking activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track activity',
    });
  }
});

/**
 * GET /api/top-picks?userId={id}
 * Get personalized game recommendations
 */
router.get('/api/top-picks', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required',
      });
    }

    // Step 1: Find user's most played category
    const topCategoryResult = await pool.query(
      `SELECT category_id, COUNT(*) as play_count
       FROM user_activity
       WHERE user_id = $1
       GROUP BY category_id
       ORDER BY play_count DESC
       LIMIT 1`,
      [userId]
    );

    // If user has no activity, return popular games
    if (topCategoryResult.rows.length === 0) {
      const popularGames = await pool.query(
        `SELECT 
          g.id,
          g.title as name,
          c.name as category,
          g.thumbnail,
          g.game_url as url,
          CASE 
            WHEN g.rating >= 4.5 THEN 'hot'
            WHEN g.updated_at > NOW() - INTERVAL '7 days' THEN 'updated'
            ELSE NULL
          END as badge
         FROM games g
         INNER JOIN categories c ON g.category_id = c.id
         WHERE g.is_active = true
         ORDER BY g.rating DESC, g.created_at DESC
         LIMIT 10`
      );

      return res.json({
        success: true,
        data: popularGames.rows,
      });
    }

    const topCategoryId = topCategoryResult.rows[0].category_id;

    // Step 2: Get recommended games from that category
    const recommendedGames = await pool.query(
      `SELECT 
        g.id,
        g.title as name,
        c.name as category,
        g.thumbnail,
        g.game_url as url,
        CASE 
          WHEN g.rating >= 4.5 THEN 'hot'
          WHEN g.updated_at > NOW() - INTERVAL '7 days' THEN 'updated'
          ELSE NULL
        END as badge
       FROM games g
       INNER JOIN categories c ON g.category_id = c.id
       WHERE g.category_id = $1
         AND g.id NOT IN (
           SELECT game_id 
           FROM user_activity 
           WHERE user_id = $2
         )
         AND g.is_active = true
       ORDER BY g.rating DESC, g.created_at DESC
       LIMIT 10`,
      [topCategoryId, userId]
    );

    res.json({
      success: true,
      data: recommendedGames.rows,
    });
  } catch (error) {
    console.error('Error fetching top picks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top picks',
    });
  }
});

/**
 * GET /api/user-stats/:userId
 * Get user activity statistics (optional - for analytics)
 */
router.get('/api/user-stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await pool.query(
      `SELECT 
        c.id as category_id,
        c.name as category_name,
        COUNT(*) as play_count,
        COUNT(DISTINCT ua.game_id) as unique_games
       FROM user_activity ua
       INNER JOIN categories c ON ua.category_id = c.id
       WHERE ua.user_id = $1
       GROUP BY c.id, c.name
       ORDER BY play_count DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: stats.rows,
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user stats',
    });
  }
});

module.exports = router;
