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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Fetch game by slug
    const [games] = await pool.query<any[]>(
      `SELECT 
        g.id,
        g.title,
        g.slug,
        g.description,
        g.thumbnail,
        g.game_url,
        g.iframe_url,
        g.rating,
        g.is_active,
        g.created_at,
        g.updated_at,
        c.id as category_id,
        c.name as category,
        c.slug as category_slug
       FROM games g
       LEFT JOIN categories c ON g.category_id = c.id
       WHERE g.slug = ?
       LIMIT 1`,
      [slug]
    );

    if (games.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Game not found' },
        { status: 404 }
      );
    }

    const game = games[0];

    // Enrich game data with additional fields
    const enrichedGame = {
      ...game,
      developer: 'Game Studio', // TODO: Add developer field to database
      votes: '1,400,526', // TODO: Calculate from user_activity or add votes table
      released: new Date(game.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      technology: 'HTML5',
      platforms: ['Browser (desktop, mobile, tablet)'],
      wiki: 'Fandom',
      
      // Game-specific content (can be stored in separate tables or JSON fields)
      howToPlay: [
        {
          title: 'Start Playing',
          body: `Begin your adventure in ${game.title} by following the on-screen instructions.`
        },
        {
          title: 'Master the Controls',
          body: 'Practice the basic controls to improve your gameplay skills.'
        },
        {
          title: 'Complete Objectives',
          body: 'Work through the game objectives to unlock new features and achievements.'
        }
      ],
      
      gameModes: [
        {
          name: 'Classic Mode',
          desc: 'Experience the traditional gameplay with standard rules and objectives.'
        },
        {
          name: 'Challenge Mode',
          desc: 'Test your skills with increased difficulty and special challenges.'
        }
      ],
      
      tips: [
        'Take your time to learn the game mechanics',
        'Practice regularly to improve your skills',
        'Explore all available features and modes',
        'Join the community to learn from other players'
      ],
      
      features: [
        'Engaging gameplay mechanics',
        'Multiple game modes to explore',
        'Regular updates with new content',
        'Cross-platform compatibility',
        'Free to play in your browser',
        'No downloads required'
      ],
      
      tags: [
        { label: game.category || 'Action', count: 121 },
        { label: 'Browser', count: 1983 },
        { label: 'Multiplayer', count: 335 },
        { label: 'Free', count: 500 }
      ],
      
      controls: [
        { key: 'WASD / Arrow Keys', action: 'Move character' },
        { key: 'Mouse', action: 'Look around / Aim' },
        { key: 'Left Click', action: 'Primary action' },
        { key: 'Right Click', action: 'Secondary action' },
        { key: 'Space', action: 'Jump' },
        { key: 'Shift', action: 'Sprint' },
        { key: 'E', action: 'Interact' },
        { key: 'Esc', action: 'Pause / Menu' }
      ]
    };

    return NextResponse.json({
      success: true,
      data: enrichedGame
    });

  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch game data' },
      { status: 500 }
    );
  }
}
