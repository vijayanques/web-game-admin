# Top Picks for You - Dynamic Recommendation System

A personalized game recommendation feature that tracks user activity and suggests games based on their most played category.

## Features

✅ Track user game play activity  
✅ Identify user's favorite game category  
✅ Recommend games from preferred category  
✅ Exclude already played games  
✅ Responsive design (mobile, tablet, desktop)  
✅ Loading states and error handling  
✅ API caching for performance  
✅ Beautiful bento-style layout  

## Architecture

```
┌─────────────────┐
│   Frontend      │
│  (Next.js)      │
│                 │
│  TopPicks       │
│  Component      │
└────────┬────────┘
         │
         │ API Calls
         │
┌────────▼────────┐
│  Next.js API    │
│  Routes         │
│                 │
│  /api/top-picks │
│  /api/user-     │
│   activity      │
└────────┬────────┘
         │
         │ HTTP
         │
┌────────▼────────┐
│   Backend       │
│  (Your API)     │
│                 │
│  Database       │
│  (PostgreSQL)   │
└─────────────────┘
```

## File Structure

```
games_admin/
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── top-picks/
│   │       │   └── route.ts          # Top picks API route
│   │       └── user-activity/
│   │           └── route.ts          # Activity tracking route
│   ├── components/
│   │   └── Home/
│   │       └── Top_picks.tsx         # Main component
│   ├── lib/
│   │   ├── api/
│   │   │   └── user-activity.ts      # API client functions
│   │   └── hooks/
│   │       └── useTopPicks.ts        # Custom React hook
│   └── types/
│       └── user-activity.ts          # TypeScript types
├── database/
│   └── user_activity_schema.sql      # Database schema
├── BACKEND_IMPLEMENTATION.md         # Backend guide
├── USAGE_EXAMPLE.md                  # Usage examples
└── TOP_PICKS_README.md              # This file
```

## Quick Start

### 1. Database Setup

Run the SQL schema to create the user activity table:

```bash
psql -U your_user -d your_database -f database/user_activity_schema.sql
```

### 2. Backend Implementation

Implement the two required endpoints in your backend:

- `POST /api/user-activity` - Track game plays
- `GET /api/top-picks?userId={id}` - Get recommendations

See `BACKEND_IMPLEMENTATION.md` for detailed implementation guide.

### 3. Environment Configuration

Create/update `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Use the Component

```tsx
import TopPicks from '@/components/Home/Top_picks';

export default function HomePage() {
  const userId = 1; // Get from your auth system
  
  return <TopPicks userId={userId} />;
}
```

## How It Works

### 1. User Activity Tracking

When a user plays a game, track it:

```typescript
await userActivityAPI.trackGamePlay(userId, gameId, categoryId);
```

This stores:
- User ID
- Game ID
- Category ID
- Timestamp

### 2. Category Analysis

The backend analyzes which category the user plays most:

```sql
SELECT category_id, COUNT(*) as play_count
FROM user_activity
WHERE user_id = ?
GROUP BY category_id
ORDER BY play_count DESC
LIMIT 1
```

### 3. Game Recommendations

Fetch games from the user's favorite category, excluding already played games:

```sql
SELECT g.id, g.title, g.thumbnail, g.game_url
FROM games g
WHERE g.category_id = (user's top category)
  AND g.id NOT IN (user's played games)
  AND g.is_active = true
ORDER BY g.rating DESC
LIMIT 10
```

### 4. Display

The component displays recommendations in a responsive layout:
- Mobile/Tablet: 2-column grid
- Desktop: Bento-style layout with featured games

## API Reference

### Track User Activity

```http
POST /api/user-activity
Content-Type: application/json

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

### Get Top Picks

```http
GET /api/top-picks?userId=1
```

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

## Component Props

### TopPicks

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| userId | number | No | User ID for personalized recommendations |

## Custom Hook

### useTopPicks

```typescript
const { games, loading, error, trackGamePlay } = useTopPicks(userId);
```

**Returns:**
- `games`: Array of recommended games
- `loading`: Loading state
- `error`: Error message if any
- `trackGamePlay`: Function to track game plays

## Optimization

### Caching Strategy

1. **API Route Cache**: 5 minutes (Next.js revalidate)
2. **Client Cache**: Use React Query for additional caching
3. **Database Indexes**: On user_id, category_id, game_id

### Performance Tips

- Limit results to 6-10 games
- Use database indexes
- Implement Redis caching for high traffic
- Track activity asynchronously (fire and forget)
- Use CDN for game thumbnails

## Customization

### Change Layout

Edit `Top_picks.tsx` to modify the grid layout:

```tsx
// Change from 2 columns to 3 columns on mobile
<div className="grid grid-cols-3 gap-1.5 sm:gap-2 lg:hidden">
```

### Add More Badges

Add new badge types in the Badge component:

```tsx
if (badge === "new") return (
  <span className="...">New</span>
);
```

### Modify Recommendation Logic

Update the backend query to:
- Consider multiple categories
- Weight recent plays more heavily
- Include trending games
- Add collaborative filtering

## Troubleshooting

### No recommendations showing

1. Check if userId is provided
2. Verify user has played games (check user_activity table)
3. Check backend API is running
4. Verify NEXT_PUBLIC_API_URL is correct

### Games not tracking

1. Check network tab for API errors
2. Verify backend endpoint is working
3. Check database constraints (foreign keys)

### Images not loading

1. Verify thumbnail URLs are correct
2. Check Next.js image configuration
3. Ensure images are accessible

## Future Enhancements

- [ ] Multi-category recommendations
- [ ] Collaborative filtering (users with similar taste)
- [ ] Time-based weighting (recent plays matter more)
- [ ] A/B testing different recommendation algorithms
- [ ] Real-time updates with WebSockets
- [ ] Machine learning-based recommendations
- [ ] Social recommendations (friends' favorites)

## License

Part of the games_admin project.
