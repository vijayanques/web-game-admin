# Top Picks Component - Usage Examples

## Basic Usage

### 1. Using the Component Directly

```tsx
import TopPicks from '@/components/Home/Top_picks';

export default function HomePage() {
  // Get userId from your auth context/session
  const userId = 1; // Replace with actual user ID
  
  return (
    <div className="container mx-auto py-8">
      <TopPicks userId={userId} />
    </div>
  );
}
```

### 2. Using with Authentication Context

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import TopPicks from '@/components/Home/Top_picks';

export default function HomePage() {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto py-8">
      {user && <TopPicks userId={user.id} />}
    </div>
  );
}
```

### 3. Using the Custom Hook

```tsx
'use client';

import { useTopPicks } from '@/lib/hooks/useTopPicks';
import Image from 'next/image';

export default function CustomTopPicks() {
  const userId = 1; // Get from auth
  const { games, loading, error, trackGamePlay } = useTopPicks(userId);

  if (loading) return <div>Loading recommendations...</div>;
  if (error) return <div>Error: {error}</div>;
  if (games.length === 0) return null;

  const handleGameClick = (gameId: number, categoryId: number, url: string) => {
    trackGamePlay(gameId, categoryId);
    window.location.href = url;
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {games.map((game) => (
        <div 
          key={game.id}
          onClick={() => handleGameClick(game.id, parseInt(game.category), game.url)}
          className="cursor-pointer"
        >
          <Image src={game.thumbnail} alt={game.name} width={300} height={200} />
          <h3>{game.name}</h3>
          <p>{game.category}</p>
        </div>
      ))}
    </div>
  );
}
```

### 4. Manual Activity Tracking

```tsx
'use client';

import { userActivityAPI } from '@/lib/api/user-activity';

export default function GamePage({ gameId, categoryId }: { gameId: number; categoryId: number }) {
  const userId = 1; // Get from auth

  const handlePlayGame = async () => {
    try {
      // Track the activity
      await userActivityAPI.trackGamePlay(userId, gameId, categoryId);
      
      // Launch the game
      window.location.href = `/play/${gameId}`;
    } catch (error) {
      console.error('Failed to track game play:', error);
    }
  };

  return (
    <button onClick={handlePlayGame}>
      Play Game
    </button>
  );
}
```

## Advanced Usage

### 5. With React Query for Better Caching

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { userActivityAPI } from '@/lib/api/user-activity';

export default function TopPicksWithQuery({ userId }: { userId: number }) {
  const { data: games, isLoading, error } = useQuery({
    queryKey: ['top-picks', userId],
    queryFn: () => userActivityAPI.getTopPicks(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!userId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading recommendations</div>;

  return (
    <div>
      {games?.map((game) => (
        <div key={game.id}>{game.name}</div>
      ))}
    </div>
  );
}
```

### 6. Server-Side Rendering (SSR)

```tsx
import { userActivityAPI } from '@/lib/api/user-activity';

export default async function ServerTopPicks({ userId }: { userId: number }) {
  const games = await userActivityAPI.getTopPicks(userId);

  return (
    <div className="grid grid-cols-3 gap-4">
      {games.map((game) => (
        <div key={game.id}>
          <img src={game.thumbnail} alt={game.name} />
          <h3>{game.name}</h3>
        </div>
      ))}
    </div>
  );
}
```

## Integration with Game Detail Page

### Track Activity When User Plays a Game

```tsx
// app/game/[slug]/page.tsx
'use client';

import { useEffect } from 'react';
import { userActivityAPI } from '@/lib/api/user-activity';

export default function GameDetailPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const userId = 1; // Get from auth
  const gameId = 5; // Get from game data
  const categoryId = 2; // Get from game data

  useEffect(() => {
    // Track when user views/plays the game
    if (userId) {
      userActivityAPI.trackGamePlay(userId, gameId, categoryId)
        .catch(console.error);
    }
  }, [userId, gameId, categoryId]);

  return (
    <div>
      {/* Game content */}
    </div>
  );
}
```

## Environment Setup

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API Response Format

The backend should return data in this format:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Bloxd Hop",
      "category": "Action",
      "thumbnail": "/images/game.jpg",
      "url": "/game/bloxd-hop",
      "badge": "hot"
    }
  ]
}
```

## Fallback Behavior

- If `userId` is not provided, the component won't render
- If user has no activity, backend should return popular games
- If API fails, component gracefully hides itself
- Loading state shows skeleton placeholders

## Performance Tips

1. The API route caches responses for 5 minutes
2. Use React Query for client-side caching
3. Track activity asynchronously (fire and forget)
4. Limit results to 6-10 games for optimal UX
