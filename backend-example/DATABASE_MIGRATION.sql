-- ============================================
-- DATABASE MIGRATION: Add last_login_at column
-- ============================================
-- Run this SQL command in your MySQL database

-- Add last_login_at column to users table
ALTER TABLE users 
ADD COLUMN last_login_at TIMESTAMP NULL DEFAULT NULL 
AFTER level;

-- Optional: Add index for better query performance
CREATE INDEX idx_last_login_at ON users(last_login_at);

-- Verify the column was added
DESCRIBE users;

-- Test query to see the new column
SELECT id, username, email, last_login_at FROM users LIMIT 5;
