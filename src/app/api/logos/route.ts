import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

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
    const type = searchParams.get('type');

    let query = 'SELECT id, type, url, alt_text, link_url, is_active, created_at, updated_at FROM logos';
    const params: any[] = [];

    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }

    const [logos] = await pool.query<any[]>(query, params);

    return NextResponse.json({
      success: true,
      data: logos,
      count: logos.length
    });
  } catch (error) {
    console.error('Error fetching logos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch logos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, url, alt_text, link_url } = body;

    if (!type || !url) {
      return NextResponse.json(
        { success: false, error: 'type and url are required' },
        { status: 400 }
      );
    }

    if (!['header', 'footer'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'type must be either "header" or "footer"' },
        { status: 400 }
      );
    }

    // Check if logo of this type already exists
    const [existing] = await pool.query<any[]>(
      'SELECT id FROM logos WHERE type = ?',
      [type]
    );

    if (existing.length > 0) {
      // Update existing
      await pool.query(
        'UPDATE logos SET url = ?, alt_text = ?, link_url = ? WHERE type = ?',
        [url, alt_text || null, link_url || null, type]
      );

      const [updated] = await pool.query<any[]>(
        'SELECT id, type, url, alt_text, link_url, is_active, created_at, updated_at FROM logos WHERE type = ?',
        [type]
      );

      return NextResponse.json({
        success: true,
        data: updated[0],
        message: 'Logo updated successfully'
      });
    } else {
      // Create new
      const result = await pool.query(
        'INSERT INTO logos (type, url, alt_text, link_url) VALUES (?, ?, ?, ?)',
        [type, url, alt_text || null, link_url || null]
      );

      const [inserted] = await pool.query<any[]>(
        'SELECT id, type, url, alt_text, link_url, is_active, created_at, updated_at FROM logos WHERE type = ?',
        [type]
      );

      return NextResponse.json({
        success: true,
        data: inserted[0],
        message: 'Logo created successfully'
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating/updating logo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create/update logo' },
      { status: 500 }
    );
  }
}
