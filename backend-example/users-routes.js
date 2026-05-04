// User Management Routes with last_login_at tracking
// Add these routes to your Express backend

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// Assuming you have a database connection
// const db = require('./db'); // Your database connection

// ============================================
// 1. FIRST: Add this column to your database
// ============================================
// Run this SQL command in your MySQL database:
/*
ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP NULL DEFAULT NULL;
*/

// ============================================
// 2. LOGIN ROUTE - Updates last_login_at
// ============================================
router.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // ✅ UPDATE last_login_at on successful login
    await db.query(
      'UPDATE users SET last_login_at = NOW() WHERE id = ?',
      [user.id]
    );

    // Remove password from response
    delete user.password;

    // Add current timestamp as last_login_at
    user.last_login_at = new Date();

    res.json({
      success: true,
      message: 'Login successful',
      data: user
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// ============================================
// 3. GET ALL USERS - Include last_login_at
// ============================================
router.get('/api/users', async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT 
        id, 
        username, 
        email, 
        score, 
        level, 
        created_at, 
        updated_at,
        last_login_at
      FROM users 
      ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// ============================================
// 4. LOGOUT ROUTE (Optional)
// ============================================
// If you want to track when users logout, you can set last_login_at to NULL
// or add a separate last_logout_at column
router.post('/api/users/logout', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Optional: You can set last_login_at to NULL on logout
    // Or keep it as is to show "last seen" time
    // await db.query('UPDATE users SET last_login_at = NULL WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

// ============================================
// 5. DELETE USER
// ============================================
router.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const [users] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user
    await db.query('DELETE FROM users WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

module.exports = router;
