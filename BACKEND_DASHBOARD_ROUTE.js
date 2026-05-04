// ============================================
// DASHBOARD STATS API ROUTE
// ============================================
// Add this route to your Express.js backend server at http://192.168.1.118:8000
// 
// Instructions:
// 1. Copy this code to your backend server
// 2. Make sure you have mysql2 installed: npm install mysql2
// 3. Update the database credentials to match your setup
// 4. Restart your backend server

const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

// Create MySQL connection pool (reuse if already exists)
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
// ROUTE: Get Dashboard Statistics
// ============================================
router.get('/api/dashboard/stats', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Get total users
    const [totalUsersResult] = await connection.query(
      'SELECT COUNT(*) as count FROM users WHERE is_active = 1'
    );
    const totalUsers = totalUsersResult[0].count;

    // Get total games
    const [totalGamesResult] = await connection.query(
      'SELECT COUNT(*) as count FROM games WHERE is_active = 1'
    );
    const totalGames = totalGamesResult[0].count;

    // Get active players (users who played in last 24 hours)
    const [activePlayersResult] = await connection.query(
      `SELECT COUNT(DISTINCT user_id) as count 
       FROM user_activity 
       WHERE played_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)`
    );
    const activePlayers = activePlayersResult[0].count;

    // Get total revenue (if you have a transactions/payments table)
    const [revenueResult] = await connection.query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM transactions 
       WHERE status = 'completed'`
    );
    const totalRevenue = revenueResult[0].total;

    // Calculate average session time (in minutes, convert to hours and minutes)
    const [avgSessionResult] = await connection.query(
      `SELECT AVG(TIMESTAMPDIFF(MINUTE, session_start, session_end)) as avg_minutes
       FROM user_sessions
       WHERE session_end IS NOT NULL
       AND session_start >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );
    const avgMinutes = avgSessionResult[0].avg_minutes || 0;
    const hours = Math.floor(avgMinutes / 60);
    const minutes = Math.round(avgMinutes % 60);
    const avgSession = `${hours}h ${minutes}m`;

    // Calculate conversion rate (users who made a purchase / total users)
    const [conversionResult] = await connection.query(
      `SELECT 
        (COUNT(DISTINCT user_id) * 100.0 / NULLIF((SELECT COUNT(*) FROM users WHERE is_active = 1), 0)) as rate
       FROM transactions
       WHERE status = 'completed'`
    );
    const conversion = parseFloat(conversionResult[0].rate || 0).toFixed(1);

    // Calculate user growth (percentage change from last month)
    const [userGrowthResult] = await connection.query(
      `SELECT 
        (COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) * 100.0 / 
         NULLIF(COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY) 
                           AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END), 0)) - 100 as growth
       FROM users`
    );
    const userGrowth = parseFloat(userGrowthResult[0].growth || 0).toFixed(1);

    // Calculate game engagement (average plays per game)
    const [gameEngagementResult] = await connection.query(
      `SELECT 
        (COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM games WHERE is_active = 1), 0)) as engagement
       FROM user_activity
       WHERE played_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );
    const gameEngagement = parseFloat(gameEngagementResult[0].engagement || 0).toFixed(1);

    // Calculate player retention (users who played this month and last month)
    const [retentionResult] = await connection.query(
      `SELECT 
        (COUNT(DISTINCT CASE WHEN played_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN user_id END) * 100.0 /
         NULLIF(COUNT(DISTINCT CASE WHEN played_at >= DATE_SUB(NOW(), INTERVAL 60 DAY) 
                                    AND played_at < DATE_SUB(NOW(), INTERVAL 30 DAY) THEN user_id END), 0)) as retention
       FROM user_activity`
    );
    const playerRetention = parseFloat(retentionResult[0].retention || 0).toFixed(1);

    // Get user growth chart data (last 6 months)
    const [userGrowthChart] = await connection.query(
      `SELECT 
        DATE_FORMAT(created_at, '%b') as name,
        COUNT(*) as value
       FROM users
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY MONTH(created_at), DATE_FORMAT(created_at, '%b')
       ORDER BY MONTH(created_at)`
    );

    // Get revenue chart data (last 6 months)
    const [revenueChart] = await connection.query(
      `SELECT 
        DATE_FORMAT(created_at, '%b') as name,
        COALESCE(SUM(amount), 0) as value
       FROM transactions
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       AND status = 'completed'
       GROUP BY MONTH(created_at), DATE_FORMAT(created_at, '%b')
       ORDER BY MONTH(created_at)`
    );

    // Get active players chart data (last 6 months)
    const [activePlayersChart] = await connection.query(
      `SELECT 
        DATE_FORMAT(played_at, '%b') as name,
        COUNT(DISTINCT user_id) as value
       FROM user_activity
       WHERE played_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY MONTH(played_at), DATE_FORMAT(played_at, '%b')
       ORDER BY MONTH(played_at)`
    );

    // Get revenue distribution by source
    const [revenueDistribution] = await connection.query(
      `SELECT 
        payment_type as name,
        ROUND((SUM(amount) * 100.0 / NULLIF((SELECT SUM(amount) FROM transactions WHERE status = 'completed'), 0)), 0) as value
       FROM transactions
       WHERE status = 'completed'
       GROUP BY payment_type
       ORDER BY value DESC`
    );

    // Get game performance data (last 7 days, top 3 games)
    const [topGames] = await connection.query(
      `SELECT DISTINCT g.title
       FROM games g
       INNER JOIN user_activity ua ON g.id = ua.game_id
       WHERE ua.played_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY g.id, g.title
       ORDER BY COUNT(*) DESC
       LIMIT 3`
    );

    const gameNames = topGames.map(g => g.title);
    
    // Build dynamic query for game performance
    let gamePerformanceQuery = `
      SELECT 
        DATE_FORMAT(played_at, '%a') as name,
        0 as value
    `;
    
    gameNames.forEach(gameName => {
      gamePerformanceQuery += `,
        SUM(CASE WHEN g.title = '${gameName}' THEN 1 ELSE 0 END) as \`${gameName}\`
      `;
    });
    
    gamePerformanceQuery += `
      FROM user_activity ua
      INNER JOIN games g ON ua.game_id = g.id
      WHERE ua.played_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DAYOFWEEK(played_at), DATE_FORMAT(played_at, '%a')
      ORDER BY DAYOFWEEK(played_at)
    `;

    const [gamePerformance] = await connection.query(gamePerformanceQuery);

    connection.release();

    // Return all data
    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalGames,
          activePlayers,
          totalRevenue: parseFloat(totalRevenue),
          avgSession,
          conversion: parseFloat(conversion),
          userGrowth: parseFloat(userGrowth),
          gameEngagement: parseFloat(gameEngagement),
          playerRetention: parseFloat(playerRetention),
        },
        userGrowthChart,
        revenueChart,
        activePlayersChart,
        revenueDistribution,
        gamePerformance,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
      details: error.message,
    });
  }
});

module.exports = router;

// ============================================
// USAGE IN YOUR MAIN SERVER FILE
// ============================================
// const dashboardRoutes = require('./routes/dashboard');
// app.use(dashboardRoutes);
