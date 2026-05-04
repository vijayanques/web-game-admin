// MySQL Backend Implementation for Top Picks Feature
// Use this file if you're using MySQL database

const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

// Create MySQL connection pool
// Update these credentials to match your database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

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
       VALUES (?, ?, ?, NOW())`,
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
    const [topCategoryResult] = await pool.query(
      `SELECT category_id, COUNT(*) as play_count
       FROM user_activity
       WHERE user_id = ?
       GROUP BY category_id
       ORDER BY play_count DESC
       LIMIT 1`,
      [userId]
    );

    // If user has no activity, return popular games
    if (topCategoryResult.length === 0) {
      const [popularGames] = await pool.query(
        `SELECT 
          g.id,
          g.title as name,
          c.name as category,
          g.thumbnail,
          g.game_url as url,
          CASE 
            WHEN g.rating >= 4.5 THEN 'hot'
            WHEN g.updated_at > DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 'updated'
            ELSE NULL
          END as badge
         FROM games g
         INNER JOIN categories c ON g.category_id = c.id
         WHERE g.is_active = 1
         ORDER BY g.rating DESC, g.created_at DESC
         LIMIT 10`
      );

      return res.json({
        success: true,
        data: popularGames,
      });
    }

    const topCategoryId = topCategoryResult[0].category_id;

    // Step 2: Get recommended games from that category
    const [recommendedGames] = await pool.query(
      `SELECT 
        g.id,
        g.title as name,
        c.name as category,
        g.thumbnail,
        g.game_url as url,
        CASE 
          WHEN g.rating >= 4.5 THEN 'hot'
          WHEN g.updated_at > DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 'updated'
          ELSE NULL
        END as badge
       FROM games g
       INNER JOIN categories c ON g.category_id = c.id
       WHERE g.category_id = ?
         AND g.id NOT IN (
           SELECT game_id 
           FROM user_activity 
           WHERE user_id = ?
         )
         AND g.is_active = 1
       ORDER BY g.rating DESC, g.created_at DESC
       LIMIT 10`,
      [topCategoryId, userId]
    );

    res.json({
      success: true,
      data: recommendedGames,
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

    const [stats] = await pool.query(
      `SELECT 
        c.id as category_id,
        c.name as category_name,
        COUNT(*) as play_count,
        COUNT(DISTINCT ua.game_id) as unique_games
       FROM user_activity ua
       INNER JOIN categories c ON ua.category_id = c.id
       WHERE ua.user_id = ?
       GROUP BY c.id, c.name
       ORDER BY play_count DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user stats',
    });
  }
});

// Export the router
module.exports = router;

// Usage in your main server file:
// const topPicksRoutes = require('./routes/top-picks-routes-mysql');
// app.use(topPicksRoutes);
