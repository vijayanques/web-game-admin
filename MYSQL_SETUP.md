# 🚀 MySQL Setup Guide for Top Picks

Since you're using MySQL, follow these MySQL-specific instructions.

---

## Step 1: Create Database Table (MySQL) ✅

### Option 1: Simple Version (No Foreign Keys)
If you want to test quickly without foreign key constraints:

```sql
CREATE TABLE user_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    category_id INT NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_activity_user_id (user_id),
    INDEX idx_user_activity_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Option 2: Full Version (With Foreign Keys)
If your database has `users`, `games`, and `categories` tables:

```sql
CREATE TABLE user_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    category_id INT NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    
    INDEX idx_user_activity_user_id (user_id),
    INDEX idx_user_activity_game_id (game_id),
    INDEX idx_user_activity_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### How to Run:

**Option A: MySQL Command Line**
```bash
mysql -u your_username -p your_database_name < database/user_activity_schema_mysql.sql
```

**Option B: MySQL Workbench / phpMyAdmin**
1. Open your database tool
2. Copy the SQL above
3. Paste and execute

**Option C: Direct Command**
```bash
mysql -u root -p
USE your_database_name;
# Paste the SQL here
```

### Verify It Worked:
```sql
SHOW TABLES LIKE 'user_activity';
DESCRIBE user_activity;
SELECT * FROM user_activity LIMIT 1;
```

---

## Step 2: Update Backend Queries for MySQL

The queries in `backend-example/top-picks-routes.js` use PostgreSQL syntax (`$1`, `$2`). 

For MySQL, you need to change them to use `?` placeholders.

### MySQL Backend Example:

```javascript
const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// POST /api/user-activity - Track game plays
router.post('/api/user-activity', async (req, res) => {
  try {
    const { userId, gameId, categoryId } = req.body;

    if (!userId || !gameId || !categoryId) {
      return res.status(400).json({
        success: false,
        error: 'userId, gameId, and categoryId are required'
      });
    }

    await pool.query(
      'INSERT INTO user_activity (user_id, game_id, category_id) VALUES (?, ?, ?)',
      [userId, gameId, categoryId]
    );

    res.json({
      success: true,
      message: 'Activity tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track activity'
    });
  }
});

// GET /api/top-picks - Get recommendations
router.get('/api/top-picks', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
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
        data: popularGames
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
      data: recommendedGames
    });
  } catch (error) {
    console.error('Error fetching top picks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top picks'
    });
  }
});

module.exports = router;
```

### Key MySQL Differences:

1. **Placeholders**: Use `?` instead of `$1, $2, $3`
2. **Boolean**: Use `1` and `0` instead of `true` and `false`
3. **Interval**: Use `DATE_SUB(NOW(), INTERVAL 7 DAY)` instead of `NOW() - INTERVAL '7 days'`
4. **Result**: MySQL returns `[rows, fields]`, so use `const [rows] = await pool.query()`

---

## Step 3: Install MySQL Package

If you haven't already, install the MySQL package:

```bash
npm install mysql2
```

---

## Step 4: Test Your Backend

```bash
# Test activity tracking
curl -X POST http://192.168.1.118:8000/api/user-activity \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "gameId": 5, "categoryId": 2}'

# Expected: {"success": true, "message": "Activity tracked successfully"}

# Test recommendations
curl http://192.168.1.118:8000/api/top-picks?userId=1

# Expected: {"success": true, "data": [...]}
```

---

## Step 5: Verify in Database

```sql
-- Check if activity was tracked
SELECT * FROM user_activity WHERE user_id = 1;

-- Check what categories user has played
SELECT category_id, COUNT(*) as play_count
FROM user_activity
WHERE user_id = 1
GROUP BY category_id
ORDER BY play_count DESC;
```

---

## Complete MySQL Backend File

I've created a complete MySQL version for you. Save this as `backend-example/top-picks-routes-mysql.js`:

---

## Quick MySQL Commands

```sql
-- Create table
CREATE TABLE user_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    category_id INT NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_activity_user_id (user_id),
    INDEX idx_user_activity_category_id (category_id)
) ENGINE=InnoDB;

-- Insert test data
INSERT INTO user_activity (user_id, game_id, category_id) 
VALUES (1, 5, 2), (1, 7, 2), (1, 9, 3);

-- Check data
SELECT * FROM user_activity;

-- Find top category for user
SELECT category_id, COUNT(*) as play_count
FROM user_activity
WHERE user_id = 1
GROUP BY category_id
ORDER BY play_count DESC
LIMIT 1;

-- Drop table (if you need to start over)
DROP TABLE user_activity;
```

---

## Summary for MySQL

1. ✅ Use `user_activity_schema_mysql.sql` file
2. ✅ Change `$1, $2` to `?` in queries
3. ✅ Use `mysql2` package instead of `pg`
4. ✅ Use `1/0` instead of `true/false`
5. ✅ Use `DATE_SUB()` for date intervals

Everything else stays the same! The frontend doesn't need any changes.
