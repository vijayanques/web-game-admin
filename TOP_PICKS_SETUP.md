# Top Picks Feature - Setup Checklist

## ✅ Frontend Setup (Completed)

The following files have been created:

- [x] `src/components/Home/Top_picks.tsx` - Main component
- [x] `src/lib/api/user-activity.ts` - API client
- [x] `src/lib/hooks/useTopPicks.ts` - Custom hook
- [x] `src/types/user-activity.ts` - TypeScript types
- [x] `src/app/api/top-picks/route.ts` - Next.js API route
- [x] `src/app/api/user-activity/route.ts` - Activity tracking route

## 🔧 Backend Setup (Required)

You need to implement these in your backend (http://192.168.1.118:8000):

### 1. Database Schema

```bash
# Run this SQL in your database
psql -U your_user -d your_database -f database/user_activity_schema.sql
```

Or manually create the table:

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

### 2. Backend API Endpoints

Implement these two endpoints:

#### POST /api/user-activity
```javascript
// Track when user plays a game
app.post('/api/user-activity', async (req, res) => {
  const { userId, gameId, categoryId } = req.body;
  
  await db.query(
    'INSERT INTO user_activity (user_id, game_id, category_id) VALUES ($1, $2, $3)',
    [userId, gameId, categoryId]
  );
  
  res.json({ success: true });
});
```

#### GET /api/top-picks?userId={id}
```javascript
// Get personalized recommendations
app.get('/api/top-picks', async (req, res) => {
  const { userId } = req.query;
  
  // Find user's most played category
  const topCategory = await db.query(`
    SELECT category_id
    FROM user_activity
    WHERE user_id = $1
    GROUP BY category_id
    ORDER BY COUNT(*) DESC
    LIMIT 1
  `, [userId]);
  
  // Get games from that category (exclude played games)
  const games = await db.query(`
    SELECT 
      g.id,
      g.title as name,
      c.name as category,
      g.thumbnail,
      g.game_url as url
    FROM games g
    JOIN categories c ON g.category_id = c.id
    WHERE g.category_id = $1
      AND g.id NOT IN (
        SELECT game_id FROM user_activity WHERE user_id = $2
      )
      AND g.is_active = true
    ORDER BY g.rating DESC
    LIMIT 10
  `, [topCategory.rows[0].category_id, userId]);
  
  res.json({ success: true, data: games.rows });
});
```

See `BACKEND_IMPLEMENTATION.md` for complete implementation details.

## 🎨 Frontend Integration

### Option 1: Use in a Page

```tsx
// app/page.tsx or any page
import TopPicks from '@/components/Home/Top_picks';

export default function HomePage() {
  const userId = 1; // Get from your auth system
  
  return (
    <div>
      <TopPicks userId={userId} />
    </div>
  );
}
```

### Option 2: Use with Auth Context

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import TopPicks from '@/components/Home/Top_picks';

export default function HomePage() {
  const { user } = useAuth();
  
  return (
    <div>
      {user && <TopPicks userId={user.id} />}
    </div>
  );
}
```

### Option 3: Track Activity on Game Page

```tsx
// app/game/[slug]/page.tsx
'use client';

import { useEffect } from 'react';
import { userActivityAPI } from '@/lib/api/user-activity';

export default function GamePage({ gameId, categoryId }) {
  const userId = 1; // Get from auth
  
  useEffect(() => {
    // Track when user plays the game
    userActivityAPI.trackGamePlay(userId, gameId, categoryId);
  }, []);
  
  return <div>Game content...</div>;
}
```

## 🧪 Testing

### 1. Test Activity Tracking

```bash
# Test the backend endpoint directly
curl -X POST http://192.168.1.118:8000/api/user-activity \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "gameId": 5, "categoryId": 2}'
```

### 2. Test Top Picks

```bash
# Test the backend endpoint
curl http://192.168.1.118:8000/api/top-picks?userId=1
```

### 3. Test Frontend

1. Start your Next.js dev server: `npm run dev`
2. Navigate to the page with TopPicks component
3. Open browser DevTools > Network tab
4. Check API calls to `/api/top-picks`

## 📋 Verification Checklist

- [ ] Database table `user_activity` created
- [ ] Backend endpoint `POST /api/user-activity` working
- [ ] Backend endpoint `GET /api/top-picks` working
- [ ] Environment variable `NEXT_PUBLIC_API_URL` set
- [ ] TopPicks component added to a page
- [ ] User ID is being passed to component
- [ ] Games are displaying correctly
- [ ] Clicking games tracks activity
- [ ] Recommendations update based on user activity

## 🐛 Common Issues

### Issue: "userId is required" error
**Solution:** Make sure you're passing userId prop to TopPicks component

### Issue: No games showing
**Solution:** 
1. Check if user has played any games (check user_activity table)
2. Verify backend is returning data
3. Check browser console for errors

### Issue: Images not loading
**Solution:**
1. Verify thumbnail URLs in database
2. Check Next.js image configuration
3. Ensure images are accessible

### Issue: Activity not tracking
**Solution:**
1. Check network tab for failed requests
2. Verify backend endpoint is working
3. Check database foreign key constraints

## 📚 Documentation

- `TOP_PICKS_README.md` - Complete feature documentation
- `BACKEND_IMPLEMENTATION.md` - Backend implementation guide
- `USAGE_EXAMPLE.md` - Usage examples and patterns

## 🚀 Next Steps

1. Implement backend endpoints
2. Add TopPicks component to your home page
3. Test with real user data
4. Monitor performance and optimize as needed
5. Consider adding caching (Redis) for high traffic

## 💡 Enhancement Ideas

- Add more recommendation algorithms
- Implement collaborative filtering
- Add trending games section
- Create admin dashboard for recommendations
- A/B test different layouts
- Add real-time updates

---

Need help? Check the documentation files or review the code comments.
