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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, gameId, categoryId } = body;

    // Validate required fields
    if (!userId || !gameId || !categoryId) {
      return NextResponse.json(
        {
          success: false,
          error: 'userId, gameId, and categoryId are required'
        },
        { status: 400 }
      );
    }

    // Insert user activity
    await pool.query(
      'INSERT INTO user_activity (user_id, game_id, category_id) VALUES (?, ?, ?)',
      [userId, gameId, categoryId]
    );

    return NextResponse.json({
      success: true,
      message: 'Activity tracked successfully'
    });

  } catch (error) {
    console.error('Error tracking activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track activity' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get user's activity history
    const [activities] = await pool.query<any[]>(
      `SELECT 
        ua.id,
        ua.played_at,
        g.id as game_id,
        g.title as game_name,
        g.slug as game_slug,
        g.thumbnail,
        c.id as category_id,
        c.name as category_name
       FROM user_activity ua
       INNER JOIN games g ON ua.game_id = g.id
       INNER JOIN categories c ON ua.category_id = c.id
       WHERE ua.user_id = ?
       ORDER BY ua.played_at DESC
       LIMIT 50`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      data: activities,
      count: activities.length
    });

  } catch (error) {
    console.error('Error fetching user activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user activity' },
      { status: 500 }
    );
  }
}
