# Games Admin Dashboard

A production-level admin dashboard for managing game categories with real-time API integration using TanStack Query.

## 🎯 Features

### Category Management
- ✅ Create categories with validation
- ✅ Update existing categories
- ✅ Delete categories with confirmation
- ✅ Search categories by name
- ✅ Filter by status (Active/Inactive)
- ✅ Real-time UI updates
- ✅ Responsive design

### State Management
- ✅ TanStack Query v5 for server state
- ✅ Automatic cache invalidation
- ✅ Optimistic updates
- ✅ Error handling and retry logic
- ✅ Loading states

### User Experience
- ✅ Loading indicators
- ✅ Error messages
- ✅ Success notifications
- ✅ Form validation
- ✅ Smooth animations
- ✅ Mobile responsive

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone and setup backend**
```bash
cd game_web_backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run setup
npm run dev
```

2. **Setup admin panel**
```bash
cd games_admin
npm install
cp .env.example .env.local
# Edit .env.local with your API URL
npm run dev
```

3. **Access admin panel**
Open `http://localhost:3000/categories`

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get running in 5 minutes
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Complete integration details
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What's been implemented
- **[FRONTEND_EXAMPLE.md](./FRONTEND_EXAMPLE.md)** - Frontend implementation examples
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Pre-deployment checklist
- **[game_web_backend/SETUP.md](../game_web_backend/SETUP.md)** - Backend setup guide

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **State Management**: TanStack Query v5
- **HTTP Client**: Axios
- **Backend**: Express.js, Sequelize ORM, MySQL
- **Database**: MySQL 8.0+

### Project Structure
```
games_admin/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with QueryProvider
│   │   └── categories/
│   │       └── page.tsx            # Categories page
│   ├── components/
│   │   └── dashboard/
│   │       ├── CategoriesTable.tsx
│   │       ├── CreateCategoryDrawer.tsx
│   │       ├── UpdateCategoryDrawer.tsx
│   │       └── DeleteCategoryModal.tsx
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts           # Axios client
│   │   │   └── categories.ts       # API service
│   │   └── hooks/
│   │       └── useCategories.ts    # TanStack Query hooks
│   └── providers/
│       └── QueryProvider.tsx       # Query client setup
└── package.json
```

## 🔄 Data Flow

### Create Category
```
Form Submit → useCreateCategory() → POST /api/categories → Cache Update → UI Refresh
```

### Update Category
```
Edit Click → Form Pre-fill → Submit → useUpdateCategory() → PUT /api/categories/:id → Cache Update → UI Refresh
```

### Delete Category
```
Delete Click → Confirm → useDeleteCategory() → DELETE /api/categories/:id → Cache Update → UI Refresh
```

### Fetch Categories
```
Component Mount → useCategories() → GET /api/categories → Cache → Render
```

## 🎨 Components

### CategoriesTable
Main table component displaying all categories with search, filter, and action buttons.

**Features:**
- Real-time data from API
- Search functionality
- Status filtering
- Edit/Delete actions
- Loading states
- Error handling

### CreateCategoryDrawer
Drawer for creating new categories with form validation.

**Fields:**
- Category Name (required)
- Description (required)
- Icon/Emoji (required)
- Display Order (optional)

### UpdateCategoryDrawer
Drawer for updating existing categories.

**Features:**
- Pre-filled form data
- All fields editable
- Status toggle
- Validation

### DeleteCategoryModal
Modal for confirming category deletion.

**Features:**
- Confirmation message
- Warning about related games
- Cancel/Delete buttons
- Loading state

## 🔌 API Integration

### Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:id` | Get single category |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |

### Response Format

**Success:**
```json
{
  "success": true,
  "data": { /* category data */ }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🪝 Custom Hooks

### useCategories()
Fetches all categories with caching.

```typescript
const { data: categories, isLoading, isError, error } = useCategories();
```

### useCategoryById(id)
Fetches a single category.

```typescript
const { data: category, isLoading } = useCategoryById(categoryId);
```

### useCreateCategory()
Creates a new category.

```typescript
const createMutation = useCreateCategory();
await createMutation.mutateAsync({ name, description, icon });
```

### useUpdateCategory()
Updates an existing category.

```typescript
const updateMutation = useUpdateCategory();
await updateMutation.mutateAsync({ id, payload });
```

### useDeleteCategory()
Deletes a category.

```typescript
const deleteMutation = useDeleteCategory();
await deleteMutation.mutateAsync(categoryId);
```

## ⚙️ Configuration

### Environment Variables

**Admin Panel (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Backend (.env):**
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=games_db
DB_USER=root
DB_PASSWORD=password
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### TanStack Query Settings
```typescript
{
  staleTime: 1000 * 60 * 5,      // 5 minutes
  gcTime: 1000 * 60 * 10,        // 10 minutes
  retry: 1,                       // Retry once on failure
  refetchOnWindowFocus: false,    // Don't refetch on focus
}
```

## 🧪 Testing

### Manual Testing
1. Create a category
2. Verify it appears in the table
3. Update the category
4. Verify changes are reflected
5. Delete the category
6. Verify it's removed from the table

### API Testing
```bash
# Get all categories
curl http://localhost:5000/api/categories

# Create category
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Action","description":"Action games","icon":"🎮"}'

# Update category
curl -X PUT http://localhost:5000/api/categories/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Action"}'

# Delete category
curl -X DELETE http://localhost:5000/api/categories/1
```

## 🚀 Deployment

### Build
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Deploy the .next folder
```

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for complete deployment guide.

## 🔒 Security

- ✅ CORS configured
- ✅ Input validation
- ✅ Error handling
- ✅ Environment variables for secrets
- ⚠️ TODO: Add authentication
- ⚠️ TODO: Add rate limiting
- ⚠️ TODO: Add request validation

## 📊 Performance

- **Stale Time**: 5 minutes (data considered fresh)
- **GC Time**: 10 minutes (data kept in memory)
- **Retry**: 1 retry on failed requests
- **Caching**: Automatic cache management
- **Bundle Size**: Optimized with code splitting

## 🐛 Troubleshooting

### API Connection Error
```bash
# Verify backend is running
curl http://localhost:5000/health

# Check NEXT_PUBLIC_API_URL in .env.local
cat .env.local

# Check browser console for errors (F12)
```

### Database Connection Error
```bash
# Verify MySQL is running
mysql -u root -p

# Check database credentials in .env
cat .env

# Recreate database
mysql -u root -p -e "DROP DATABASE games_db; CREATE DATABASE games_db;"
npm run setup
```

### CORS Errors
```bash
# Verify CORS_ORIGIN in backend .env
# Should include http://localhost:3000

# Restart backend
npm run dev
```

## 📝 Database Schema

### Categories Table
```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  displayOrder INT DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🎓 Learning Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Next.js Documentation](https://nextjs.org/docs)
- [Axios Documentation](https://axios-http.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Sequelize Documentation](https://sequelize.org/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC

## 👥 Support

For issues or questions:
1. Check the documentation
2. Review error messages
3. Check browser console (F12)
4. Check server logs
5. Verify environment variables

## 🎉 Ready to Deploy!

This implementation is production-ready with:
- ✅ Proper error handling
- ✅ Loading states
- ✅ Cache management
- ✅ Responsive design
- ✅ Type safety
- ✅ Best practices
- ✅ Comprehensive documentation

Start building! 🚀
