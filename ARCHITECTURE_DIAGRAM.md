# Top Picks Feature - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           TopPicks Component (React)                    │    │
│  │                                                          │    │
│  │  • Displays game recommendations                        │    │
│  │  • Handles user clicks                                  │    │
│  │  • Tracks activity                                      │    │
│  │  • Loading & error states                               │    │
│  └────────────┬───────────────────────────┬────────────────┘    │
│               │                           │                      │
│               │ Fetch                     │ Track                │
│               │ Recommendations           │ Activity             │
│               │                           │                      │
└───────────────┼───────────────────────────┼──────────────────────┘
                │                           │
                │                           │
┌───────────────▼───────────────────────────▼──────────────────────┐
│                    NEXT.JS API ROUTES                             │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────┐    ┌──────────────────────────┐    │
│  │  GET /api/top-picks     │    │ POST /api/user-activity  │    │
│  │                         │    │                          │    │
│  │  • Forwards to backend  │    │ • Forwards to backend    │    │
│  │  • Caches for 5 min     │    │ • Validates input        │    │
│  │  • Error handling       │    │ • Error handling         │    │
│  └────────────┬────────────┘    └────────────┬─────────────┘    │
│               │                              │                   │
└───────────────┼──────────────────────────────┼───────────────────┘
                │                              │
                │ HTTP                         │ HTTP
                │                              │
┌───────────────▼──────────────────────────────▼───────────────────┐
│                    BACKEND API SERVER                             │
│                (http://192.168.1.118:8000)                        │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Recommendation Engine                       │    │
│  │                                                          │    │
│  │  1. Find user's most played category                    │    │
│  │     SELECT category_id, COUNT(*)                        │    │
│  │     FROM user_activity                                  │    │
│  │     WHERE user_id = ?                                   │    │
│  │     GROUP BY category_id                                │    │
│  │     ORDER BY COUNT(*) DESC                              │    │
│  │                                                          │    │
│  │  2. Get games from that category                        │    │
│  │     SELECT * FROM games                                 │    │
│  │     WHERE category_id = ?                               │    │
│  │     AND id NOT IN (played games)                        │    │
│  │     ORDER BY rating DESC                                │    │
│  │                                                          │    │
│  │  3. Return top 10 games                                 │    │
│  └────────────┬────────────────────────────────────────────┘    │
│               │                                                  │
└───────────────┼──────────────────────────────────────────────────┘
                │
                │ SQL Queries
                │
┌───────────────▼──────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                          │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │  user_activity   │  │     games        │  │  categories   │  │
│  ├──────────────────┤  ├──────────────────┤  ├───────────────┤  │
│  │ id               │  │ id               │  │ id            │  │
│  │ user_id          │  │ title            │  │ name          │  │
│  │ game_id          │  │ category_id      │  │ slug          │  │
│  │ category_id      │  │ thumbnail        │  │ description   │  │
│  │ played_at        │  │ game_url         │  │ is_active     │  │
│  └──────────────────┘  │ rating           │  └───────────────┘  │
│                        │ is_active        │                      │
│                        └──────────────────┘                      │
│                                                                   │
│  Indexes:                                                         │
│  • idx_user_activity_user_id                                     │
│  • idx_user_activity_category_id                                 │
│  • idx_games_category_rating                                     │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## Data Flow Sequence

```
┌──────┐                                                    ┌──────────┐
│ User │                                                    │ Database │
└───┬──┘                                                    └────┬─────┘
    │                                                            │
    │ 1. User plays "Racing Game" (Action category)             │
    │────────────────────────────────────────────────────────>  │
    │                                                            │
    │                    INSERT INTO user_activity               │
    │                    (user_id=1, game_id=5, category_id=2)  │
    │                                                            │
    │ 2. User visits homepage                                    │
    │                                                            │
    │ 3. TopPicks component loads                                │
    │    Calls: getTopPicks(userId=1)                           │
    │                                                            │
    │ 4. Backend analyzes user activity                          │
    │    <─────────────────────────────────────────────────────  │
    │                    SELECT category_id, COUNT(*)            │
    │                    FROM user_activity                      │
    │                    WHERE user_id = 1                       │
    │                    GROUP BY category_id                    │
    │                                                            │
    │    Result: Category 2 (Action) - 15 plays                 │
    │                                                            │
    │ 5. Backend fetches Action games                            │
    │    <─────────────────────────────────────────────────────  │
    │                    SELECT * FROM games                     │
    │                    WHERE category_id = 2                   │
    │                    AND id NOT IN (played games)            │
    │                    ORDER BY rating DESC                    │
    │                    LIMIT 10                                │
    │                                                            │
    │ 6. Returns recommendations                                 │
    │    [Game1, Game2, Game3, ...]                             │
    │<───────────────────────────────────────────────────────   │
    │                                                            │
    │ 7. Component displays games                                │
    │    ┌─────────┬─────────┐                                  │
    │    │ Game 1  │ Game 2  │                                  │
    │    ├─────────┼─────────┤                                  │
    │    │ Game 3  │ Game 4  │                                  │
    │    └─────────┴─────────┘                                  │
    │                                                            │
    │ 8. User clicks Game 3                                      │
    │────────────────────────────────────────────────────────>  │
    │                    INSERT INTO user_activity               │
    │                    (user_id=1, game_id=3, category_id=2)  │
    │                                                            │
    │ 9. Navigate to game                                        │
    │                                                            │
```

## Component Hierarchy

```
App
└── HomePage
    └── TopPicks (userId={1})
        ├── useTopPicks() hook
        │   ├── useState (games, loading, error)
        │   ├── useEffect (fetch on mount)
        │   └── trackGamePlay()
        │
        ├── Loading State
        │   └── Skeleton Grid
        │
        ├── Error State
        │   └── null (hidden)
        │
        └── Success State
            ├── Mobile Layout (grid-cols-2)
            │   └── Card × 6
            │       ├── Image
            │       ├── Title
            │       ├── Badge (optional)
            │       └── onClick → trackGamePlay()
            │
            └── Desktop Layout (bento)
                ├── Large Card (left)
                ├── Grid 2×2 (center)
                └── Large Card (right)
```

## API Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    GET /api/top-picks?userId=1                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js API Route                             │
│  • Check cache (5 min TTL)                                       │
│  • If cached → return immediately                                │
│  • If not cached → forward to backend                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Backend: GET /api/top-picks?userId=1                │
│                                                                  │
│  Step 1: Find Top Category                                      │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ SELECT category_id, COUNT(*) as play_count             │    │
│  │ FROM user_activity                                     │    │
│  │ WHERE user_id = 1                                      │    │
│  │ GROUP BY category_id                                   │    │
│  │ ORDER BY play_count DESC                               │    │
│  │ LIMIT 1                                                │    │
│  │                                                         │    │
│  │ Result: category_id = 2 (Action)                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Step 2: Get Recommendations                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ SELECT g.id, g.title, g.thumbnail, g.game_url          │    │
│  │ FROM games g                                           │    │
│  │ WHERE g.category_id = 2                                │    │
│  │   AND g.id NOT IN (                                    │    │
│  │     SELECT game_id FROM user_activity WHERE user_id=1  │    │
│  │   )                                                     │    │
│  │   AND g.is_active = true                               │    │
│  │ ORDER BY g.rating DESC                                 │    │
│  │ LIMIT 10                                               │    │
│  │                                                         │    │
│  │ Result: [Game1, Game2, ..., Game10]                    │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Response to Frontend                          │
│  {                                                               │
│    "success": true,                                              │
│    "data": [                                                     │
│      {                                                           │
│        "id": 1,                                                  │
│        "name": "Speed Racer",                                    │
│        "category": "Action",                                     │
│        "thumbnail": "/images/speed-racer.jpg",                   │
│        "url": "/game/speed-racer",                               │
│        "badge": "hot"                                            │
│      },                                                          │
│      ...                                                         │
│    ]                                                             │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Caching Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                         Caching Layers                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: Browser Cache                                          │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ React Query / SWR                                       │    │
│  │ TTL: 5 minutes                                          │    │
│  │ Stale-while-revalidate                                  │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Layer 2: Next.js API Route Cache                               │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ next: { revalidate: 300 }                               │    │
│  │ TTL: 5 minutes                                          │    │
│  │ Per-user cache key                                      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Layer 3: Redis Cache (Optional)                                │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Key: top-picks:{userId}                                 │    │
│  │ TTL: 5 minutes                                          │    │
│  │ Reduces database load                                   │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Layer 4: Database Query Cache                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ PostgreSQL query cache                                  │    │
│  │ Indexes for fast lookups                                │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Recommendation Algorithm

```
┌─────────────────────────────────────────────────────────────────┐
│                  Recommendation Algorithm                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Input: userId = 1                                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Step 1: Analyze User Activity                           │    │
│  │                                                          │    │
│  │ user_activity table:                                    │    │
│  │ ┌──────────┬─────────┬─────────────┬────────────┐      │    │
│  │ │ user_id  │ game_id │ category_id │ played_at  │      │    │
│  │ ├──────────┼─────────┼─────────────┼────────────┤      │    │
│  │ │    1     │    5    │      2      │ 2024-01-01 │      │    │
│  │ │    1     │    7    │      2      │ 2024-01-02 │      │    │
│  │ │    1     │    9    │      2      │ 2024-01-03 │      │    │
│  │ │    1     │   12    │      3      │ 2024-01-04 │      │    │
│  │ │    1     │   15    │      2      │ 2024-01-05 │      │    │
│  │ └──────────┴─────────┴─────────────┴────────────┘      │    │
│  │                                                          │    │
│  │ Category Analysis:                                      │    │
│  │ • Category 2 (Action): 4 plays                          │    │
│  │ • Category 3 (Puzzle): 1 play                           │    │
│  │                                                          │    │
│  │ Top Category: 2 (Action)                                │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Step 2: Filter Games                                    │    │
│  │                                                          │    │
│  │ Criteria:                                               │    │
│  │ ✓ category_id = 2 (Action)                              │    │
│  │ ✓ is_active = true                                      │    │
│  │ ✗ id NOT IN (5, 7, 9, 15) - already played             │    │
│  │                                                          │    │
│  │ Sort by:                                                │    │
│  │ 1. rating DESC                                          │    │
│  │ 2. created_at DESC                                      │    │
│  │                                                          │    │
│  │ Limit: 10 games                                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Step 3: Enrich with Badges                              │    │
│  │                                                          │    │
│  │ Badge Logic:                                            │    │
│  │ • "hot" → rating >= 4.5                                 │    │
│  │ • "updated" → updated_at < 7 days ago                   │    │
│  │ • "originals" → custom flag                             │    │
│  │ • null → no badge                                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Output: Top 10 Action games (not played, high rated)           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

This architecture provides a scalable, performant, and maintainable recommendation system!
