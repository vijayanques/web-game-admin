# 🚀 START HERE - Get Top Picks Working

Follow these steps in order to get the Top Picks feature working perfectly.

---

## Step 1: Create Database Table ✅

### For MySQL (You're using this):

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

**How to run:**
```bash
# Option 1: MySQL command line
mysql -u your_username -p your_database_name < database/user_activity_schema_mysql.sql

# Option 2: Copy and paste into MySQL Workbench or phpMyAdmin
```

### For PostgreSQL:

```sql
CREATE TABLE user_activity (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    game_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_category_id ON user_activity(category_id);
```

**Verify it worked:**
```sql
SELECT * FROM user_activity LIMIT 1;
```

---

## Step 2: Add Backend Routes 🔧

Open your backend Node.js/Express server and add these two routes.

### For MySQL Users (You're using this):

1. Open `backend-example/top-picks-routes-mysql.js`
2. Copy all the code
3. Update the database connection credentials
4. Add to your backend server

**Important:** Install MySQL package first:
```bash
npm install mysql2
```

### For PostgreSQL Users:

1. Open `backend-example/top-picks-routes.js`
2. Copy all the code

### Option B: Add routes manually (MySQL version)

Add these two endpoints to your backend (MySQL version):

```javascript
const mysql = require('mysql2/promise');

// Create connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database'
});

// POST /api/user-activity - Track game plays
app.post('/api/user-activity', async (req, res) => {
  const { userId, gameId, categoryId } = req.body;
  
  await pool.query(
    'INSERT INTO user_activity (user_id, game_id, category_id) VALUES (?, ?, ?)',
    [userId, gameId, categoryId]
  );
  
  res.json({ success: true });
});

// GET /api/top-picks?userId=1 - Get recommendations
app.get('/api/top-picks', async (req, res) => {
  const { userId } = req.query;
  
  // Find user's most played category
  const [topCategory] = await pool.query(`
    SELECT category_id 
    FROM user_activity 
    WHERE user_id = ? 
    GROUP BY category_id 
    ORDER BY COUNT(*) DESC 
    LIMIT 1
  `, [userId]);
  
  if (topCategory.length === 0) {
    // Return popular games if user has no activity
    const [games] = await pool.query(`
      SELECT g.id, g.title as name, c.name as category, 
             g.thumbnail, g.game_url as url
      FROM games g
      JOIN categories c ON g.category_id = c.id
      WHERE g.is_active = 1
      ORDER BY g.rating DESC
      LIMIT 10
    `);
    return res.json({ success: true, data: games });
  }
  
  // Get games from user's favorite category
  const [games] = await pool.query(`
    SELECT g.id, g.title as name, c.name as category,
           g.thumbnail, g.game_url as url
    FROM games g
    JOIN categories c ON g.category_id = c.id
    WHERE g.category_id = ?
      AND g.id NOT IN (
        SELECT game_id FROM user_activity WHERE user_id = ?
      )
      AND g.is_active = 1
    ORDER BY g.rating DESC
    LIMIT 10
  `, [topCategory[0].category_id, userId]);
  
  res.json({ success: true, data: games });
});
```

**Key MySQL differences:**
- Use `?` instead of `$1, $2, $3`
- Use `1` instead of `true` for booleans
- MySQL returns `[rows, fields]`, so use `const [rows] = await pool.query()`

**Test your backend:**
```bash
# Test activity tracking
curl -X POST http://192.168.1.118:8000/api/user-activity \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "gameId": 5, "categoryId": 2}'

# Test recommendations
curl http://192.168.1.118:8000/api/top-picks?userId=1
```

---

## Step 3: Add Component to Your Page 🎨

Open the page where you want to show Top Picks (e.g., `src/app/page.tsx` or home page).

```tsx
import TopPicks from '@/components/Home/Top_picks';

export default function HomePage() {
  // Replace with your actual user ID from auth/session
  const userId = 1; 
  
  return (
    <div>
      <h1>Welcome to Games</h1>
      
      {/* Add Top Picks component */}
      <TopPicks userId={userId} />
      
      {/* Rest of your page */}
    </div>
  );
}
```

**If you have authentication:**
```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext'; // Your auth context
import TopPicks from '@/components/Home/Top_picks';

export default function HomePage() {
  const { user } = useAuth();
  
  return (
    <div>
      <h1>Welcome to Games</h1>
      
      {/* Only show if user is logged in */}
      {user && <TopPicks userId={user.id} />}
    </div>
  );
}
```

---

## Step 4: Test Everything ✅

### A. Check Frontend
1. Start your Next.js dev server:
   ```bash
   npm run dev
   ```

2. Open browser: `http://localhost:3001`

3. Open DevTools (F12) → Network tab

4. You should see:
   - Request to `/api/top-picks?userId=1`
   - Games displaying on the page

### B. Test Activity Tracking

1. Click on any game in the Top Picks section

2. Check Network tab for:
   - POST request to `/api/user-activity`

3. Verify in database:
   ```sql
   SELECT * FROM user_activity WHERE user_id = 1;
   ```

---

## Step 5: Add Activity Tracking to Game Pages (Optional) 📊

When users play games, track the activity:

```tsx
// In your game detail page: app/game/[slug]/page.tsx
'use client';

import { useEffect } from 'react';
import { userActivityAPI } from '@/lib/api/user-activity';

export default function GamePage({ params }) {
  const userId = 1; // Get from auth
  const gameId = 5; // Get from your game data
  const categoryId = 2; // Get from your game data
  
  useEffect(() => {
    // Track when user plays the game
    if (userId) {
      userActivityAPI.trackGamePlay(userId, gameId, categoryId)
        .catch(console.error);
    }
  }, [userId, gameId, categoryId]);
  
  return (
    <div>
      {/* Your game content */}
    </div>
  );
}
```

---

## Troubleshooting 🔍

### Problem: "No games showing"
**Solution:**
1. Check browser console for errors
2. Verify backend is running: `curl http://192.168.1.118:8000/api/top-picks?userId=1`
3. Check if user has played games (check `user_activity` table)
4. If no activity, backend should return popular games

### Problem: "Images not loading"
**Solution:**
1. Check `thumbnail` URLs in your database
2. Verify images are accessible
3. Check Next.js image configuration

### Problem: "Activity not tracking"
**Solution:**
1. Check Network tab for failed requests
2. Verify backend endpoint is working
3. Check database foreign key constraints

### Problem: "CORS errors"
**Solution:**
Add CORS to your backend:
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3001'
}));
```

---

## Quick Test Checklist ✅

- [ ] Database table created
- [ ] Backend endpoints added
- [ ] Backend tested with curl
- [ ] Component added to page
- [ ] Page loads without errors
- [ ] Games display correctly
- [ ] Clicking game tracks activity
- [ ] Activity appears in database

---

## What's Next? 🎯

Once everything is working:

1. **Add real user authentication** - Replace hardcoded `userId` with actual user ID
2. **Track on game pages** - Add tracking when users actually play games
3. **Monitor performance** - Check database query speed
4. **Add caching** - Implement Redis if you have high traffic
5. **Customize layout** - Adjust the component design to match your site

---

## Need Help? 📚

Check these files:
- **QUICK_REFERENCE.md** - Quick commands and snippets
- **BACKEND_IMPLEMENTATION.md** - Detailed backend guide
- **USAGE_EXAMPLE.md** - More usage examples
- **TOP_PICKS_README.md** - Complete documentation

---

## Summary

You have 3 main tasks:
1. ✅ Create database table (5 minutes)
2. ✅ Add backend routes (10 minutes)
3. ✅ Add component to page (2 minutes)

Total time: ~20 minutes

**That's it! Your Top Picks feature will be working perfectly.** 🎉
