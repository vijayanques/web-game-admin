# Setup & Testing Checklist

## 1. Database Setup

Run this SQL to add gameUrl column:
```sql
ALTER TABLE games ADD COLUMN IF NOT EXISTS gameUrl VARCHAR(500);
```

Or restart your backend with `alter: true` in server.js temporarily:
```javascript
sequelize.sync({ alter: true })
```

## 2. Backend Setup

1. Make sure `.env` has correct values:
```env
PORT=8000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=game_app_db
DB_USER=root
DB_PASSWORD=

CLOUDINARY_CLOUD_NAME=dqslodfmh
CLOUDINARY_API_KEY=668431224373237
CLOUDINARY_API_SECRET=Cg0zNSS0FHUyobnsA6SNt8s5C04
CLOUDINARY_FOLDER=categories_images

CORS_ORIGIN=http://localhost:3000
```

2. Start backend:
```bash
cd game_web_backend
npm start
```

3. Test endpoints:
- http://localhost:8000/health
- http://localhost:8000/api/categories
- http://localhost:8000/api/games

## 3. Admin Panel Setup

1. Start admin:
```bash
cd games_admin
npm run dev
```

2. Open: http://localhost:3000

3. Test creating a game:
   - Fill all fields
   - Upload thumbnail image
   - Enter game URL (e.g., https://example.com/game.html)
   - Click "Create Game"
   - Should see success toast

## 4. Frontend Setup

1. Make sure `.env.local` has:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

2. Start frontend:
```bash
cd game_web_app
npm run dev
```

3. Open: http://localhost:5000 (or whatever port Next.js assigns)

4. Check:
   - Categories should load
   - Games should display under categories
   - Click a game → should go to /game/[id]
   - Game should load in iframe

## 5. Common Issues & Fixes

### Issue: Categories not loading
**Fix:** Check browser console for CORS errors. Make sure backend CORS_ORIGIN matches frontend URL.

### Issue: Images not showing
**Fix:** 
- Check Cloudinary credentials
- Verify images uploaded successfully (check backend logs)
- Check Next.js config has Cloudinary domain

### Issue: Games not showing
**Fix:**
- Check if games exist in database
- Verify games have `isActive = true`
- Check if games are associated with active categories

### Issue: Toast not showing
**Fix:** Make sure Toaster component is in admin layout.tsx

### Issue: Game iframe not loading
**Fix:** 
- Check if gameUrl is saved in database
- Verify the game URL is accessible
- Check browser console for iframe errors

## 6. Testing Flow

1. **Create Category** (Admin):
   - Go to Categories page
   - Click "Create Category"
   - Fill name, description
   - Upload image
   - Submit

2. **Create Game** (Admin):
   - Go to Games page
   - Click "Create Game"
   - Fill all fields
   - Select category
   - Upload thumbnail
   - Enter game URL
   - Submit

3. **View on Frontend**:
   - Open frontend
   - Should see category with game
   - Click game
   - Should open game details page
   - Game should load in iframe

## 7. Database Check

Run these queries to verify data:

```sql
-- Check categories
SELECT * FROM categories WHERE isActive = 1;

-- Check games
SELECT id, title, categoryId, thumbnail, gameUrl, isActive FROM games;

-- Check games with categories
SELECT g.id, g.title, c.name as category, g.thumbnail, g.gameUrl 
FROM games g 
JOIN categories c ON g.categoryId = c.id 
WHERE g.isActive = 1;
```

## 8. API Testing

Use these curl commands or Postman:

```bash
# Get all categories
curl http://localhost:8000/api/categories

# Get all games
curl http://localhost:8000/api/games

# Get game by ID
curl http://localhost:8000/api/games/1
```
