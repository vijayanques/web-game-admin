# Testing Backend Icon Support

## Quick Test

1. Open browser console (F12)
2. Run this command in the console:

```javascript
fetch('http://192.168.1.118:8000/api/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Test Category',
    description: 'Testing icon support',
    icon: 'Sword'
  })
})
.then(res => res.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

3. Check the response in console
4. Check your database - does the `icon` column have 'Sword' or 'Tag'?

## If icon is still 'Tag':

Your backend is NOT using the updated code. You MUST update your backend file.

## Where is your backend?

Your backend is running at: http://192.168.1.118:8000

Common locations:
- D:/vijay/game_web_backend/src/routes/categories.js
- D:/vijay/game_web_backend/routes/categories.js
- D:/vijay/backend/routes/categories.js

## What to update:

Replace your backend category routes with the code from:
`games_admin/BACKEND_CATEGORY_ROUTES_WITH_ICON.js`

The key change needed in your backend POST route:

```javascript
// OLD CODE (doesn't save icon):
const [result] = await pool.query(
  `INSERT INTO categories (name, slug, description, is_active, created_at, updated_at) 
   VALUES (?, ?, ?, 1, NOW(), NOW())`,
  [name, slug, description]
);

// NEW CODE (saves icon):
const [result] = await pool.query(
  `INSERT INTO categories (name, slug, description, icon, is_active, created_at, updated_at) 
   VALUES (?, ?, ?, ?, 1, NOW(), NOW())`,
  [name, slug, description, icon || 'Tag']
);
```

## After updating backend:

1. Restart your backend server
2. Try creating a category with a different icon
3. Check database - icon should now be saved correctly
