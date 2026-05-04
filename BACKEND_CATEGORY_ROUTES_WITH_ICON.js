// ============================================
// UPDATED CATEGORY ROUTES WITH ICON SUPPORT
// ============================================
// Copy this code to your backend at: http://192.168.1.118:8000
// File location: game_web_backend/src/routes/categories.js
//
// This replaces your existing category routes to support icon field

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads (if you still want image support)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/categories/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ============================================
// GET /api/categories - Fetch all active categories
// ============================================
router.get('/', async (req, res) => {
  try {
    const pool = req.app.get('pool'); // Get pool from app
    
    const [categories] = await pool.query(
      `SELECT id, name, slug, description, icon, is_active as isActive, 
              created_at as createdAt, updated_at as updatedAt
       FROM categories
       WHERE is_active = 1
       ORDER BY name ASC`
    );

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// ============================================
// GET /api/categories/admin/all - Fetch all categories (including inactive)
// ============================================
router.get('/admin/all', async (req, res) => {
  try {
    const pool = req.app.get('pool');
    
    const [categories] = await pool.query(
      `SELECT 
        c.id, 
        c.name, 
        c.slug, 
        c.description, 
        c.icon,
        c.is_active as isActive,
        c.created_at as createdAt,
        c.updated_at as updatedAt,
        COUNT(g.id) as gameCount
       FROM categories c
       LEFT JOIN games g ON c.id = g.category_id
       GROUP BY c.id
       ORDER BY c.name ASC`
    );

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching all categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// ============================================
// GET /api/categories/:id - Fetch single category
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const { id } = req.params;

    const [categories] = await pool.query(
      `SELECT id, name, slug, description, icon, is_active as isActive,
              created_at as createdAt, updated_at as updatedAt
       FROM categories
       WHERE id = ?`,
      [id]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: categories[0]
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
});

// ============================================
// POST /api/categories - Create new category
// ============================================
router.post('/', async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const { name, description, icon } = req.body;

    // Validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name and description are required',
        error: 'Validation error'
      });
    }

    // Generate slug from name
    const slug = name.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Check if category with same name or slug exists
    const [existing] = await pool.query(
      'SELECT id FROM categories WHERE name = ? OR slug = ?',
      [name, slug]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists',
        error: 'Duplicate category'
      });
    }

    // Insert category with icon
    const [result] = await pool.query(
      `INSERT INTO categories (name, slug, description, icon, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, 1, NOW(), NOW())`,
      [name, slug, description, icon || 'Tag']
    );

    res.json({
      success: true,
      message: 'Category created successfully',
      data: {
        id: result.insertId,
        name,
        slug,
        description,
        icon: icon || 'Tag',
        isActive: true
      }
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
});

// ============================================
// PUT /api/categories/:id - Update category
// ============================================
router.put('/:id', async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const { id } = req.params;
    const { name, description, icon, isActive } = req.body;

    // Check if category exists
    const [existing] = await pool.query(
      'SELECT id FROM categories WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Generate slug from name if name is provided
    let slug;
    if (name) {
      slug = name.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (slug) {
      updates.push('slug = ?');
      values.push(slug);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (icon !== undefined) {
      updates.push('icon = ?');
      values.push(icon);
    }
    if (isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(isActive ? 1 : 0);
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    await pool.query(
      `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
});

// ============================================
// DELETE /api/categories/:id - Delete category
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const { id } = req.params;

    // Check if category has games
    const [games] = await pool.query(
      'SELECT COUNT(*) as count FROM games WHERE category_id = ?',
      [id]
    );

    if (games[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${games[0].count} game(s) associated with it.`,
        error: 'Category has games'
      });
    }

    // Delete category
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
});

module.exports = router;
