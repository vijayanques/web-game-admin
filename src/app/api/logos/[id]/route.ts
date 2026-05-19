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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const logoId = parseInt(id);

    const [logos] = await pool.query<any[]>(
      'SELECT id, type, url, alt_text, link_url, is_active, created_at, updated_at FROM logos WHERE id = ?',
      [logoId]
    );

    if (logos.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Logo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: logos[0]
    });
  } catch (error) {
    console.error('Error fetching logo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch logo' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const logoId = parseInt(id);
    const body = await request.json();
    const { url, alt_text, link_url, is_active } = body;

    // Check if logo exists
    const [existing] = await pool.query<any[]>(
      'SELECT id FROM logos WHERE id = ?',
      [logoId]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Logo not found' },
        { status: 404 }
      );
    }

    // Update logo
    await pool.query(
      'UPDATE logos SET url = ?, alt_text = ?, link_url = ?, is_active = ? WHERE id = ?',
      [url, alt_text || null, link_url || null, is_active !== undefined ? is_active : 1, logoId]
    );

    const [updated] = await pool.query<any[]>(
      'SELECT id, type, url, alt_text, link_url, is_active, created_at, updated_at FROM logos WHERE id = ?',
      [logoId]
    );

    return NextResponse.json({
      success: true,
      data: updated[0],
      message: 'Logo updated successfully'
    });
  } catch (error) {
    console.error('Error updating logo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update logo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const logoId = parseInt(id);

    // Check if logo exists
    const [existing] = await pool.query<any[]>(
      'SELECT id FROM logos WHERE id = ?',
      [logoId]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Logo not found' },
        { status: 404 }
      );
    }

    // Delete logo
    await pool.query('DELETE FROM logos WHERE id = ?', [logoId]);

    return NextResponse.json({
      success: true,
      message: 'Logo deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting logo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete logo' },
      { status: 500 }
    );
  }
}
