# Top Picks Feature - Quick Reference

## 🚀 Quick Start (3 Steps)

### 1. Backend Setup
```sql
-- Create table
CREATE TABLE user_activity (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    game_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Implement Endpoints
```javascript
// POST /api/user-activity
app.post('/api/user-activity', async (req, res) => {
  const { userId, gameId, categoryId } = req.body;
  await db.query(
    'INSERT INTO user_activity (user_id, game_id, category_id) VALUES ($1, $2, $3)',
    [userId, gameId, categoryId]
  );
  res.json({ success: true });
});

// GET /api/top-picks?userId={id}
app.get('/api/top-picks', async (req, res) => {
  const { userId } = req.query;
  // 1. Find top category
  // 2. Get games from that category
  // 3. Exclude played games
  res.json({ success: true, data: games });
});
```

### 3. Use Component
```tsx
import TopPicks from '@/components/Home/Top_picks';

<TopPicks userId={1} />
```

## 📡 API Reference

### Track Activity
```bash
POST /api/user-activity
Body: { "userId": 1, "gameId": 5, "categoryId": 2 }
```

### Get Recommendations
```bash
GET /api/top-picks?userId=1
Response: { "success": true, "data": [...] }
```

## 💻 Code Snippets

### Track Game Play
```tsx
import { userActivityAPI } from '@/lib/api/user-activity';

await userActivityAPI.trackGamePlay(userId, gameId, categoryId);
```

### Use Custom Hook
```tsx
import { useTopPicks } from '@/lib/hooks/useTopPicks';

const { games, loading, error, trackGamePlay } = useTopPicks(userId);
```

### Manual Fetch
```tsx
const response = await fetch(`/api/top-picks?userId=${userId}`);
const { data } = await response.json();
```

## 🗄️ Database Queries

### Find Top Category
```sql
SELECT category_id, COUNT(*) as play_count
FROM user_activity
WHERE user_id = ?
GROUP BY category_id
ORDER BY play_count DESC
LIMIT 1
```

### Get Recommendations
```sql
SELECT g.id, g.title as name, g.thumbnail, g.game_url as url
FROM games g
WHERE g.category_id = ?
  AND g.id NOT IN (SELECT game_id FROM user_activity WHERE user_id = ?)
  AND g.is_active = true
ORDER BY g.rating DESC
LIMIT 10
```

## 🎨 Component Props

```tsx
<TopPicks 
  userId={number}  // Required for personalized picks
/>
```

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://192.168.1.118:8000
```

### Cache Duration
```tsx
// In route.ts
next: { revalidate: 300 } // 5 minutes
```

## 🧪 Testing Commands

```bash
# Test activity tracking
curl -X POST http://192.168.1.118:8000/api/user-activity \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "gameId": 5, "categoryId": 2}'

# Test recommendations
curl http://192.168.1.118:8000/api/top-picks?userId=1

# Check database
psql -d database -c "SELECT * FROM user_activity WHERE user_id = 1;"
```

## 📊 Response Format

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Game Name",
      "category": "Action",
      "thumbnail": "/images/game.jpg",
      "url": "/game/slug",
      "badge": "hot"
    }
  ]
}
```

## 🎯 Badge Types

- `"hot"` - High-rated games (rating >= 4.5)
- `"updated"` - Recently updated (< 7 days)
- `"originals"` - Original/exclusive games
- `null` - No badge

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No games showing | Check if user has activity in database |
| Images not loading | Verify thumbnail URLs |
| API errors | Check NEXT_PUBLIC_API_URL |
| Activity not tracking | Verify backend endpoint |

## 📁 Key Files

```
src/components/Home/Top_picks.tsx       # Main component
src/lib/api/user-activity.ts            # API client
src/lib/hooks/useTopPicks.ts            # Custom hook
src/app/api/top-picks/route.ts          # Next.js route
database/user_activity_schema.sql       # Database schema
```

## 🔗 Documentation

- **TOP_PICKS_README.md** - Full documentation
- **BACKEND_IMPLEMENTATION.md** - Backend guide
- **USAGE_EXAMPLE.md** - Usage examples
- **TOP_PICKS_SETUP.md** - Setup checklist
- **IMPLEMENTATION_SUMMARY.md** - Overview

## ⚡ Performance Tips

1. Add database indexes
2. Implement Redis caching
3. Use CDN for images
4. Batch activity tracking
5. Limit results to 10 games

## 🎨 Customization

```tsx
// Change grid layout
<div className="grid grid-cols-3 gap-2">

// Change number of games
setGames(data.slice(0, 10));

// Add custom badge
if (badge === "new") return <span>New</span>;
```

## 📞 Support

Check the documentation files for detailed information:
- Implementation details → BACKEND_IMPLEMENTATION.md
- Usage patterns → USAGE_EXAMPLE.md
- Setup steps → TOP_PICKS_SETUP.md
