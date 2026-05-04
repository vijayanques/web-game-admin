# ✅ Top Picks Implementation Checklist

Use this checklist to track your progress.

---

## 🗄️ Database Setup

- [ ] Open your PostgreSQL database
- [ ] Run the SQL from `database/user_activity_schema.sql`
- [ ] Verify table exists: `SELECT * FROM user_activity;`
- [ ] Check indexes created successfully

**Time: 5 minutes**

---

## 🔧 Backend Implementation

- [ ] Open your backend Node.js server
- [ ] Add `POST /api/user-activity` endpoint
- [ ] Add `GET /api/top-picks` endpoint
- [ ] Update database connection to match your setup
- [ ] Restart your backend server

**Test Backend:**
```bash
# Test 1: Track activity
curl -X POST http://192.168.1.118:8000/api/user-activity \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "gameId": 5, "categoryId": 2}'

# Expected: {"success": true}

# Test 2: Get recommendations
curl http://192.168.1.118:8000/api/top-picks?userId=1

# Expected: {"success": true, "data": [...]}
```

- [ ] Test 1 passes ✅
- [ ] Test 2 passes ✅

**Time: 10 minutes**

---

## 🎨 Frontend Integration

- [ ] Open your home page (e.g., `src/app/page.tsx`)
- [ ] Import TopPicks component
- [ ] Add `<TopPicks userId={userId} />` to your page
- [ ] Replace `userId` with actual user ID from auth

**Example:**
```tsx
import TopPicks from '@/components/Home/Top_picks';

export default function HomePage() {
  const userId = 1; // TODO: Get from auth
  return <TopPicks userId={userId} />;
}
```

- [ ] Component added to page ✅

**Time: 2 minutes**

---

## 🧪 Frontend Testing

- [ ] Start dev server: `npm run dev`
- [ ] Open browser: `http://localhost:3001`
- [ ] Open DevTools (F12) → Network tab
- [ ] Check for request to `/api/top-picks`
- [ ] Verify games are displaying
- [ ] Click on a game
- [ ] Check for POST to `/api/user-activity`
- [ ] Verify no console errors

**Time: 5 minutes**

---

## 📊 Database Verification

- [ ] Open your database
- [ ] Run: `SELECT * FROM user_activity WHERE user_id = 1;`
- [ ] Verify activity records are being created
- [ ] Check timestamps are correct

**Time: 2 minutes**

---

## 🎯 Optional Enhancements

- [ ] Add authentication (replace hardcoded userId)
- [ ] Track activity on game detail pages
- [ ] Add loading skeleton improvements
- [ ] Customize badge logic
- [ ] Add Redis caching
- [ ] Monitor performance

---

## 🐛 Troubleshooting

If something doesn't work, check:

### No games showing?
- [ ] Backend is running
- [ ] User has played games (check database)
- [ ] Backend returns data (test with curl)
- [ ] No console errors

### Images not loading?
- [ ] Thumbnail URLs are correct in database
- [ ] Images are accessible
- [ ] Next.js image config is correct

### Activity not tracking?
- [ ] Backend endpoint works (test with curl)
- [ ] No network errors in DevTools
- [ ] Database foreign keys are correct

---

## ✅ Final Verification

Run through this complete test:

1. [ ] Open your app in browser
2. [ ] See Top Picks section with games
3. [ ] Click on a game
4. [ ] Check database: `SELECT * FROM user_activity;`
5. [ ] See new record in database
6. [ ] Refresh page
7. [ ] Recommendations update based on activity

---

## 🎉 Success Criteria

You're done when:
- ✅ Games display on the page
- ✅ Clicking games tracks activity
- ✅ Activity appears in database
- ✅ Recommendations update based on user behavior
- ✅ No errors in console
- ✅ Mobile and desktop layouts work

---

## 📈 Total Time Estimate

- Database: 5 min
- Backend: 10 min
- Frontend: 2 min
- Testing: 5 min

**Total: ~22 minutes**

---

## 📚 Documentation Reference

- **START_HERE.md** ← Start with this
- **QUICK_REFERENCE.md** - Quick commands
- **BACKEND_IMPLEMENTATION.md** - Detailed backend guide
- **TOP_PICKS_README.md** - Complete documentation

---

## 🆘 Still Stuck?

1. Check `START_HERE.md` for detailed steps
2. Review `backend-example/top-picks-routes.js` for complete code
3. Check browser console for errors
4. Test backend with curl commands
5. Verify database table exists

---

**Good luck! You've got this! 🚀**
