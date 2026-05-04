# Dashboard Not Working in Live - Troubleshooting Guide

## Quick Diagnosis Steps

### Step 1: Test API Connection
1. Go to: `https://your-admin-site.com/test-api`
2. Click "Test API Connection"
3. Check the results:
   - ✅ **Success**: API is working, issue is elsewhere
   - ❌ **Error**: API connection problem

### Step 2: Check Browser Console
1. Open your live admin dashboard
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for these messages:
   ```
   🔧 Dashboard API Configuration: { API_URL: "...", ... }
   🔄 Fetching dashboard data from: ...
   ```
5. Check for errors (red text)

### Step 3: Check Network Tab
1. In Developer Tools, go to Network tab
2. Refresh the dashboard page
3. Look for request to `/api/admin/dashboard/stats`
4. Click on it and check:
   - **Status**: Should be 200
   - **Response**: Should contain data
   - **Headers**: Check CORS headers

## Common Issues & Solutions

### Issue 1: Environment Variable Not Set in Production

**Symptoms:**
- API calls go to wrong URL
- Console shows: `API_URL: "http://192.168.1.118:8000"`

**Solution:**
1. Check your deployment platform (Vercel/Railway/etc.)
2. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://game-backend-production-3988.up.railway.app
   ```
3. **Important**: Redeploy after adding env vars (they're baked into build)

**For Vercel:**
- Go to Project Settings → Environment Variables
- Add `NEXT_PUBLIC_API_URL`
- Redeploy

**For Railway:**
- Go to Variables tab
- Add `NEXT_PUBLIC_API_URL`
- Redeploy

### Issue 2: CORS Error

**Symptoms:**
- Console error: "CORS policy: No 'Access-Control-Allow-Origin' header"
- Network tab shows request failed

**Solution:**
Backend is already configured for CORS, but verify:
1. Backend is running: `https://game-backend-production-3988.up.railway.app/health`
2. Should return: `{"status":"OK","message":"Server is running"}`

### Issue 3: Backend Database Not Connected

**Symptoms:**
- API returns all zeros
- Backend logs show: "⚠️ Database not connected"

**Solution:**
1. Check Railway MySQL service is running
2. Verify DATABASE_URL environment variable in backend
3. Check backend logs for database connection errors

### Issue 4: API Timeout

**Symptoms:**
- Loading spinner forever
- Console error: "timeout of 10000ms exceeded"

**Solution:**
1. Backend might be sleeping (cold start)
2. Wait 30 seconds and try again
3. Check backend is deployed and running

### Issue 5: Build-Time vs Runtime

**Symptoms:**
- Works locally but not in production
- Environment variables seem correct

**Solution:**
Next.js bakes `NEXT_PUBLIC_*` vars at build time:
1. Set env vars BEFORE building
2. Rebuild after changing env vars
3. Can't change them after deployment without rebuild

## Testing Checklist

- [ ] Backend health check works: `https://game-backend-production-3988.up.railway.app/health`
- [ ] Backend dashboard endpoint works: `https://game-backend-production-3988.up.railway.app/api/admin/dashboard/stats`
- [ ] Frontend env var is set: Check `/test-api` page
- [ ] No CORS errors in browser console
- [ ] No network errors in Network tab
- [ ] Backend database is connected (check backend logs)

## Manual API Test

Test the backend directly with curl:

```bash
curl https://game-backend-production-3988.up.railway.app/api/admin/dashboard/stats
```

Should return JSON with stats like:
```json
{
  "stats": {
    "totalUsers": 123,
    "totalGames": 45,
    "activePlayers": 67,
    ...
  },
  ...
}
```

## Files Changed for Debugging

1. **games_admin/src/lib/api/dashboard.ts**
   - Added detailed logging
   - Added timeout and retry logic
   - Added error details

2. **games_admin/src/components/pages/Dashboard.tsx**
   - Added client-side only fetching
   - Added retry logic
   - Better error handling

3. **games_admin/src/app/test-api/page.tsx** (NEW)
   - Test page to verify API connection
   - Shows configuration and errors
   - Visit: `/test-api`

## Next Steps

1. Visit `/test-api` on your live site
2. Check browser console for logs
3. Test backend endpoint directly
4. Verify environment variables in deployment platform
5. Redeploy if env vars were missing/wrong

## Still Not Working?

Check these logs:
1. **Frontend logs**: Browser console (F12)
2. **Backend logs**: Railway dashboard → Deployments → View Logs
3. **Database logs**: Railway dashboard → MySQL service → Logs

Look for:
- Connection errors
- Database sync failures
- CORS issues
- Timeout errors
