// ============================================
// GAME SEARCH API ROUTE
// ============================================
// Add this to your Express backend server
// This provides search functionality for games

const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'your_database_name'
};

// ============================================
// SEARCH GAMES ENDPOINT
// ============================================
// GET /api/games/search?q=searchTerm
router.get('/api/games/search', async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    const searchQuery = req.query.q || '';
    
    if (!searchQuery || searchQuery.trim().length < 2) {
      return res.json({
        success: true,
        data: [],
        message: 'Search query too short'
      });
    }

    // Search in games table - adjust column names based on your schema
    const [games] = await connection.execute(
      `SELECT 
        g.id,
        g.title,
        g.slug,
        g.thumbnail_url,
        g.description,
        c.name as category_name,
        c.id as category_id
      FROM games g
      LEFT JOIN categories c ON g.category_id = c.id
      WHERE g.title LIKE ? 
        OR g.description LIKE ?
        OR c.name LIKE ?
      ORDER BY 
        CASE 
          WHEN g.title LIKE ? THEN 1
          WHEN g.title LIKE ? THEN 2
          ELSE 3
        END,
        g.title ASC
      LIMIT 10`,
      [
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `${searchQuery}%`,  // Starts with
        `%${searchQuery}%`  // Contains
      ]
    );

    res.json({
      success: true,
      data: games,
      count: games.length
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching games',
      error: error.message
    });
  } finally {
    await connection.end();
  }
});

module.exports = router;

// ============================================
// USAGE IN YOUR MAIN SERVER FILE (server.js or app.js)
// ============================================
/*

const searchRoutes = require('./routes/search'); // Adjust path as needed

// Add this line with your other routes
app.use(searchRoutes);

*/

// ============================================
// ALTERNATIVE: If you want to add it directly to your existing routes file
// ============================================
/*

// Add this to your existing games routes file:

app.get('/api/games/search', async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    const searchQuery = req.query.q || '';
    
    if (!searchQuery || searchQuery.trim().length < 2) {
      return res.json({
        success: true,
        data: [],
        message: 'Search query too short'
      });
    }

    const [games] = await connection.execute(
      `SELECT 
        g.id,
        g.title,
        g.slug,
        g.thumbnail_url,
        g.description,
        c.name as category_name,
        c.id as category_id
      FROM games g
      LEFT JOIN categories c ON g.category_id = c.id
      WHERE g.title LIKE ? 
        OR g.description LIKE ?
        OR c.name LIKE ?
      ORDER BY 
        CASE 
          WHEN g.title LIKE ? THEN 1
          WHEN g.title LIKE ? THEN 2
          ELSE 3
        END,
        g.title ASC
      LIMIT 10`,
      [
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `${searchQuery}%`,
        `%${searchQuery}%`
      ]
    );

    res.json({
      success: true,
      data: games,
      count: games.length
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching games',
      error: error.message
    });
  } finally {
    await connection.end();
  }
});

*/
