import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'games_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const exclude = searchParams.get('exclude');
    const search = searchParams.get('search');

    let query = `
      SELECT 
        g.id,
        g.title as name,
        g.slug,
        g.description,
        g.thumbnail,
        g.game_url as url,
        g.rating,
        g.is_active,
        c.name as tag,
        c.slug as category_slug
      FROM games g
      LEFT JOIN categories c ON g.category_id = c.id
      WHERE g.is_active = 1
    `;

    const params: any[] = [];

    // Filter by category
    if (category) {
      query += ' AND g.category_id = ?';
      params.push(category);
    }

    // Exclude specific game
    if (exclude) {
      query += ' AND g.id != ?';
      params.push(exclude);
    }

    // Search by title
    if (search) {
      query += ' AND g.title LIKE ?';
      params.push(`%${search}%`);
    }

    // Order by rating and limit
    query += ' ORDER BY g.rating DESC, g.created_at DESC LIMIT ?';
    params.push(limit);

    const [games] = await pool.query<any[]>(query, params);

    // Enrich games with additional data
    const enrichedGames = games.map(game => ({
      ...game,
      players: `${Math.floor(Math.random() * 5000) + 500}`, // TODO: Calculate from user_activity
      bg: 'from-orange-500 to-red-700' // Default gradient
    }));

    return NextResponse.json({
      success: true,
      data: enrichedGames,
      count: enrichedGames.length
    });

  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}
