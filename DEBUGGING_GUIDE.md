# 🔍 Debugging Guide - Why Top Picks Not Working

Follow these steps to find out what's wrong.

---

## Step 1: Check Browser Console 🖥️

1. Open your app in browser: `http://localhost:3001`
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Look for any RED errors

### Common Errors:

**Error: "Cannot find module '@/lib/api/user-activity'"**
- Solution: The file exists, restart your dev server
```bash
npm run dev
```

**Error: "Failed to fetch"**
- Solution: Backend is not running or wrong URL

**Error: "userId is required"**
- Solution: You didn't pass userId to component

---

## Step 2: Check Network Tab 🌐

1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh the page
4. Look for request to `/api/top-picks`

### What to check:

**If you DON'T see `/api/top-picks` request:**
- Component is not being used on the page
- userId is not provided
- Component didn't mount

**If you see `/api/top-picks` request:**
- Click on it
- Check the **Status Code**:
  - ✅ 200 = Success
  - ❌ 400 = Bad request (missing userId)
  - ❌ 404 = Endpoint not found
  - ❌ 500 = Server error

- Check the **Response** tab:
  - Should see: `{"success": true, "data": [...]}`
  - If empty data: `{"success": true, "data": []}`

---

## Step 3: Test Backend Directly 🔧

Open terminal and test your backend:

```bash
# Test 1: Check if backend is running
curl http://192.168.1.118:8000/

# Test 2: Test top-picks endpoint
curl http://192.168.1.118:8000/api/top-picks?userId=1

# Test 3: Test activity tracking
curl -X POST http://192.168.1.118:8000/api/user-activity \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "gameId": 5, "categoryId": 2}'
```

### Expected Results:

**Test 2 should return:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Game Name",
      "category": "Action",
      "thumbnail": "/images/game.jpg",
      "url": "/game/slug"
    }
  ]
}
```

**If you get an error:**
- Backend routes not added
- Database connection failed
- Table doesn't exist

---

## Step 4: Check Database 🗄️

Open your MySQL database and run:

```sql
-- Check if table exists
SHOW TABLES LIKE 'user_activity';

-- Check table structure
DESCRIBE user_activity;

-- Check if there's any data
SELECT * FROM user_activity LIMIT 10;

-- Check your games table
SELECT id, title, category_id, thumbnail, game_url, is_active 
FROM games 
WHERE is_active = 1 
LIMIT 5;

-- Check categories
SELECT * FROM categories LIMIT 5;
```

### What to verify:

- [ ] `user_activity` table exists
- [ ] `games` table has data
- [ ] `categories` table has data
- [ ] Games have `is_active = 1`
- [ ] Games have valid `thumbnail` and `game_url`

---

## Step 5: Check Component Usage 📄

Where did you add the TopPicks component?

### Check your page file:

```tsx
// Example: src/app/page.tsx
import TopPicks from '@/components/Home/Top_picks';

export default function HomePage() {
  const userId = 1; // ⚠️ Make sure this is set!
  
  return (
    <div>
      <TopPicks userId={userId} />
    </div>
  );
}
```

### Common mistakes:

❌ **Forgot to import:**
```tsx
// Missing: import TopPicks from '@/components/Home/Top_picks';
<TopPicks userId={1} />
```

❌ **Forgot userId:**
```tsx
<TopPicks /> // ❌ No userId provided
```

❌ **userId is undefined:**
```tsx
const userId = undefined;
<TopPicks userId={userId} /> // ❌ Component won't fetch
```

---

## Step 6: Check Environment Variables 🔐

Check if your `.env.local` file has:

```env
NEXT_PUBLIC_API_URL=http://192.168.1.118:8000
```

**Important:** 
- Must start with `NEXT_PUBLIC_`
- Restart dev server after changing `.env.local`

---

## Step 7: Add Debug Logging 🐛

Temporarily add console.logs to see what's happening:

### In your page file:
```tsx
export default function HomePage() {
  const userId = 1;
  console.log('🔍 HomePage - userId:', userId);
  
  return <TopPicks userId={userId} />;
}
```

### In TopPicks component (already has logs):
The component already logs errors. Check console for:
```
Failed to fetch top picks: [error details]
```

---

## Common Issues & Solutions 🔧

### Issue 1: "Nothing shows up"

**Possible causes:**
1. Component not added to page
2. userId not provided
3. Backend not running
4. No games in database

**Debug:**
```tsx
// Add this temporarily to your page
<div>
  <h1>Testing Top Picks</h1>
  <p>User ID: {userId || 'NOT SET'}</p>
  <TopPicks userId={1} />
</div>
```

---

### Issue 2: "Loading forever"

**Possible causes:**
1. Backend not responding
2. Wrong API URL
3. CORS error

**Debug:**
- Check Network tab for failed requests
- Check Console for CORS errors
- Test backend with curl

**Fix CORS (if needed):**
```javascript
// In your backend
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3001'
}));
```

---

### Issue 3: "Empty data []"

**Possible causes:**
1. User has no activity in database
2. No games match the criteria
3. All games already played

**Debug:**
```sql
-- Check user activity
SELECT * FROM user_activity WHERE user_id = 1;

-- Check available games
SELECT COUNT(*) FROM games WHERE is_active = 1;
```

**Solution:**
- Add test data to user_activity table
- Make sure you have active games in database

---

### Issue 4: "Images not loading"

**Possible causes:**
1. Wrong thumbnail URLs
2. Images don't exist
3. Next.js image config

**Debug:**
```sql
-- Check thumbnail URLs
SELECT id, title, thumbnail FROM games LIMIT 5;
```

**Fix:**
Make sure thumbnails are:
- Valid URLs: `/images/game.jpg`
- Or full URLs: `https://example.com/game.jpg`

---

## Quick Test Script 📝

Run this to test everything:

```bash
# 1. Check backend
echo "Testing backend..."
curl http://192.168.1.118:8000/api/top-picks?userId=1

# 2. Check database
echo "Checking database..."
mysql -u root -p -e "USE your_database; SELECT COUNT(*) FROM user_activity;"

# 3. Check frontend
echo "Starting frontend..."
cd games_admin
npm run dev
```

---

## Still Not Working? 🆘

### Create a test page:

Create `src/app/test-top-picks/page.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import TopPicks from '@/components/Home/Top_picks';

export default function TestPage() {
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    // Test API directly
    fetch('/api/top-picks?userId=1')
      .then(res => res.json())
      .then(data => {
        console.log('API Response:', data);
        setTestResult(JSON.stringify(data, null, 2));
      })
      .catch(err => {
        console.error('API Error:', err);
        setTestResult('Error: ' + err.message);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Top Picks Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">API Response:</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {testResult || 'Loading...'}
        </pre>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Component:</h2>
        <TopPicks userId={1} />
      </div>
    </div>
  );
}
```

Visit: `http://localhost:3001/test-top-picks`

---

## Checklist ✅

Go through this checklist:

- [ ] Database table `user_activity` created
- [ ] Backend routes added to server
- [ ] Backend server is running
- [ ] Backend responds to curl test
- [ ] Frontend dev server running (`npm run dev`)
- [ ] Component imported in page
- [ ] userId passed to component
- [ ] No errors in browser console
- [ ] Network tab shows API request
- [ ] API returns data (not empty)

---

## Get Help 📞

If still stuck, provide these details:

1. **Browser Console Errors** (screenshot)
2. **Network Tab** (screenshot of /api/top-picks request)
3. **Backend Response** (from curl test)
4. **Database Check** (result of SELECT * FROM user_activity)
5. **Where you added component** (file path and code)

This will help identify the exact issue!
