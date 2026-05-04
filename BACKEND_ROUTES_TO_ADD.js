// ============================================
// COPY THIS CODE TO YOUR BACKEND SERVER
// ============================================
// Add these routes to your Express.js backend server at http://192.168.1.118:8000
// 
// Instructions:
// 1. Copy this entire file content
// 2. Add it to your backend server (e.g., in routes/top-picks.js or directly in your main server file)
// 3. Make sure you have mysql2 installed: npm install mysql2
// 4. Update the database credentials below to match your setup
// 5. Restart your backend server

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

// If you're adding this to an existing Express app, skip the app creation
// and just use your existing app variable
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Create MySQL connection pool
// UPDATE THESE CREDENTIALS TO MATCH YOUR DATABASE
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password here
  database: 'your_database_name', // Change to your actual database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ============================================
// ROUTE 1: Track User Activity
// ============================================
app.post('/api/user-activity', async (req, res) => {
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
      details: error.message
    });
  }
});

// ============================================
// ROUTE 2: Get Top Picks (Recommendations)
// ============================================
app.get('/api/top-picks', async (req, res) => {
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
        message: 'Showing popular games (no user activity found)'
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
      message: `Recommendations based on category ${topCategoryId}`
    });
  } catch (error) {
    console.error('Error fetching top picks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top picks',
      details: error.message
    });
  }
});

// ============================================
// OPTIONAL: Test endpoint to verify server is running
// ============================================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// Start server (only if this is your main file)
// ============================================
// If you're adding these routes to an existing server, 
// comment out or remove this section
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://192.168.1.118:${PORT}`);
  console.log(`Test endpoints:`);
  console.log(`  - GET  http://192.168.1.118:${PORT}/api/health`);
  console.log(`  - GET  http://192.168.1.118:${PORT}/api/top-picks?userId=20`);
  console.log(`  - POST http://192.168.1.118:${PORT}/api/user-activity`);
});

// ============================================
// EXPORT (if using as a module)
// ============================================
// If you want to use this as a module in your existing server:
// module.exports = app;
// 
// Then in your main server file:
// const topPicksRoutes = require('./routes/top-picks');
// app.use(topPicksRoutes);
