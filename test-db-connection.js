const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'your_database_name',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Config:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    password: dbConfig.password ? '***' : '(empty)'
  });

  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful!');
    
    // Test basic query
    const [result] = await connection.execute('SELECT 1 as test');
    console.log('✅ Basic query test:', result[0].test === 1 ? 'PASS' : 'FAIL');
    
    // Check if users table exists
    try {
      const [tables] = await connection.execute(
        "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN ('users', 'games', 'user_activity', 'transactions')",
        [dbConfig.database]
      );
      
      console.log('\n📊 Found tables:');
      tables.forEach(table => {
        console.log(`   - ${table.TABLE_NAME}`);
      });
      
      if (tables.length === 0) {
        console.log('\n⚠️  No required tables found. You need to create these tables:');
        console.log('   - users');
        console.log('   - games');
        console.log('   - user_activity');
        console.log('   - transactions (optional)');
        console.log('   - user_sessions (optional)');
      }
      
    } catch (tableError) {
      console.log('⚠️  Could not check tables:', tableError.message);
    }
    
    await connection.end();
    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('\n❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if MySQL server is running');
    console.log('2. Verify database credentials in .env file');
    console.log('3. Ensure database exists: CREATE DATABASE your_database_name;');
    console.log('4. Check firewall/network connectivity');
    
    if (connection) {
      await connection.end();
    }
  }
}

testConnection();