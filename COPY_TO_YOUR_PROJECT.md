# 📋 Copy These Files to Your Project

Tamara project ma aa files copy karva padse.

---

## Step 1: Copy API Files 📁

### File 1: `src/lib/api/user-activity.ts`
Location: `games_admin/src/lib/api/user-activity.ts`

Copy this file to your project at the same location.

### File 2: `src/app/api/top-picks/route.ts`
Location: `games_admin/src/app/api/top-picks/route.ts`

Create folder `src/app/api/top-picks/` and copy this file.

### File 3: `src/app/api/user-activity/route.ts`
Location: `games_admin/src/app/api/user-activity/route.ts`

Create folder `src/app/api/user-activity/` and copy this file.

### File 4: `src/types/user-activity.ts`
Location: `games_admin/src/types/user-activity.ts`

Create folder `src/types/` and copy this file.

---

## Step 2: Replace Your Top_picks.tsx 🔄

Your current file: `game_web_app/components/Home/Top_picks.tsx`

Replace it with: `games_admin/src/components/Home/Top_picks.tsx`

---

## Step 3: Backend Setup 🔧

### MySQL Table:
```sql
CREATE TABLE user_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    category_id INT NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_activity_user_id (user_id),
    INDEX idx_user_activity_category_id (category_id)
) ENGINE=InnoDB;
```

### Backend Routes:
Copy from: `games_admin/backend-example/top-picks-routes-mysql.js`

Add to your backend server.

---

## Step 4: Use Component 🎨

In your page file:
```tsx
import TopPicks from '@/components/Home/Top_picks';

<TopPicks userId={1} />  // Replace 1 with actual user ID
```

---

## Quick Copy Commands (if same machine):

```bash
# Copy API files
cp games_admin/src/lib/api/user-activity.ts your_project/src/lib/api/
cp -r games_admin/src/app/api/top-picks your_project/src/app/api/
cp -r games_admin/src/app/api/user-activity your_project/src/app/api/
cp -r games_admin/src/types your_project/src/

# Copy component
cp games_admin/src/components/Home/Top_picks.tsx your_project/components/Home/
```

---

## Files You Need:

1. ✅ `src/lib/api/user-activity.ts`
2. ✅ `src/app/api/top-picks/route.ts`
3. ✅ `src/app/api/user-activity/route.ts`
4. ✅ `src/types/user-activity.ts`
5. ✅ `components/Home/Top_picks.tsx` (replace existing)
6. ✅ Backend routes (MySQL version)

---

## Environment Variable:

Add to `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://192.168.1.118:8000
```

---

That's it! Badhu copy karyo pachi, restart your dev server:
```bash
npm run dev
```
