# Backend Implementation Guide for Top Picks Feature

## Overview
This guide explains how to implement the backend API endpoints for the "Top Picks for You" feature.

## Database Schema

### User Activity Table
```sql
CREATE TABLE user_activity (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    game_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (game_id) REFERENCES games(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_category_id ON user_activity(category_id);
```

## API Endpoints

### 1. Track User Activity
**Endpoint:** `POST /api/user-activity`

**Request Body:**
```json
{
  "userId": 1,
  "gameId": 5,
  "categoryId": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Activity tracked successfully"
}
```

**Implementation Example (Node.js/Express):**
```javascript
app.post('/api/user-activity', async (req, res) => {
  try {
    const { userId, gameId, categoryId } = req.body;
    
    await db.query(
      'INSERT INTO user_activity (user_id, game_id, category_id) VALUES ($1, $2, $3)',
      [userId, gameId, categoryId]
    );
    
    res.json({ success: true, message: 'Activity tracked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track activity' });
  }
});
```

### 2. Get Top Picks
**Endpoint:** `GET /api/top-picks?userId={id}`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Game Name",
      "category": "Action",
      "thumbnail": "/images/game.jpg",
      "url": "/game/game-slug",
      "badge": "hot"
    }
  ]
}
```

**Implementation Logic:**

```javascript
app.get('/api/top-picks', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Step 1: Find user's most played category
    const topCategoryResult = await db.query(`
      SELECT category_id, COUNT(*) as play_count
      FROM user_activity
      WHERE user_id = $1
      GROUP BY category_id
      ORDER BY play_count DESC
      LIMIT 1
    `, [userId]);

    // If user has no activity, return popular games
    if (topCategoryResult.rows.length === 0) {
      const popularGames = await db.query(`
        SELECT 
          g.id,
          g.title as name,
          c.name as category,
          g.thumbnail,
          g.game_url as url
        FROM games g
        INNER JOIN categories c ON g.category_id = c.id
        WHERE g.is_active = true
        ORDER BY g.rating DESC
        LIMIT 10
      `);
      
      return res.json({ success: true, data: popularGames.rows });
    }

    const topCategoryId = topCategoryResult.rows[0].category_id;

    // Step 2: Get recommended games from that category
    const recommendedGames = await db.query(`
      SELECT 
        g.id,
        g.title as name,
        c.name as category,
        g.thumbnail,
        g.game_url as url
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
      LIMIT 10
    `, [topCategoryId, userId]);

    res.json({ success: true, data: recommendedGames.rows });
  } catch (error) {
    console.error('Error fetching top picks:', error);
    res.status(500).json({ error: 'Failed to fetch top picks' });
  }
});
```

## Optimization

### 1. Caching
Implement Redis caching for top picks:

```javascript
const redis = require('redis');
const client = redis.createClient();

app.get('/api/top-picks', async (req, res) => {
  const { userId } = req.query;
  const cacheKey = `top-picks:${userId}`;
  
  // Check cache first
  const cached = await client.get(cacheKey);
  if (cached) {
    return res.json({ success: true, data: JSON.parse(cached) });
  }
  
  // Fetch from database
  const data = await fetchTopPicks(userId);
  
  // Cache for 5 minutes
  await client.setEx(cacheKey, 300, JSON.stringify(data));
  
  res.json({ success: true, data });
});
```

### 2. Database Indexing
Ensure proper indexes are created:
```sql
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_category_id ON user_activity(category_id);
CREATE INDEX idx_games_category_rating ON games(category_id, rating DESC);
```

### 3. Batch Processing
For high-traffic scenarios, consider batch processing user activity:
```javascript
// Queue activities and insert in batches
const activityQueue = [];

setInterval(async () => {
  if (activityQueue.length > 0) {
    const batch = activityQueue.splice(0, 100);
    await db.query(
      'INSERT INTO user_activity (user_id, game_id, category_id) VALUES ' +
      batch.map((_, i) => `($${i*3+1}, $${i*3+2}, $${i*3+3})`).join(','),
      batch.flatMap(a => [a.userId, a.gameId, a.categoryId])
    );
  }
}, 5000); // Every 5 seconds
```

## Testing

### Test User Activity Tracking
```bash
curl -X POST http://localhost:8000/api/user-activity \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "gameId": 5, "categoryId": 2}'
```

### Test Top Picks
```bash
curl http://localhost:8000/api/top-picks?userId=1
```

## Frontend Integration

The frontend component is already set up to:
1. Fetch top picks on component mount
2. Track game plays when users click on games
3. Handle loading and error states
4. Cache results for 5 minutes

### Usage Example
```tsx
import TopPicks from '@/components/Home/Top_picks';

export default function HomePage() {
  const userId = 1; // Get from auth context
  
  return (
    <div>
      <TopPicks userId={userId} />
    </div>
  );
}
```

## Notes

- Adjust table names and column names based on your existing schema
- Implement proper authentication and authorization
- Consider rate limiting for the tracking endpoint
- Monitor database performance and adjust indexes as needed
- The badge field ('hot', 'updated', 'originals') can be added to your games table or calculated based on game metrics
