-- User Activity Tracking Table (PostgreSQL Version)
CREATE TABLE IF NOT EXISTS user_activity (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    game_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys (adjust based on your existing schema)
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Indexes for faster queries
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_game_id ON user_activity(game_id);
CREATE INDEX idx_user_activity_category_id ON user_activity(category_id);
CREATE INDEX idx_user_activity_played_at ON user_activity(played_at);

-- Query to get user's most played category
-- This finds the category the user has played the most
CREATE OR REPLACE VIEW user_top_category AS
SELECT 
    user_id,
    category_id,
    COUNT(*) as play_count
FROM user_activity
GROUP BY user_id, category_id;

-- Query to get top picks for a user
-- This is the main recommendation query
-- Replace this with your backend implementation
/*
SELECT 
    g.id,
    g.title as name,
    c.name as category,
    g.thumbnail,
    g.game_url as url
FROM games g
INNER JOIN categories c ON g.category_id = c.id
WHERE g.category_id = (
    -- Get user's most played category
    SELECT category_id
    FROM user_activity
    WHERE user_id = ?
    GROUP BY category_id
    ORDER BY COUNT(*) DESC
    LIMIT 1
)
AND g.id NOT IN (
    -- Exclude games already played by user
    SELECT game_id
    FROM user_activity
    WHERE user_id = ?
)
AND g.is_active = true
ORDER BY g.rating DESC, g.created_at DESC
LIMIT 10;
*/
