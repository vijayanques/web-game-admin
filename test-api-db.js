const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/dashboard/stats',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Status Message: ${res.statusMessage}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('\n📊 API Response Summary:');
      console.log(`Success: ${parsed.success}`);
      console.log(`Message: ${parsed.message}`);
      
      if (parsed.success) {
        console.log('\n✅ Database data loaded successfully!');
        console.log(`Total Users: ${parsed.data?.stats?.totalUsers || 'N/A'}`);
        console.log(`Total Games: ${parsed.data?.stats?.totalGames || 'N/A'}`);
        console.log(`Active Players: ${parsed.data?.stats?.activePlayers || 'N/A'}`);
        console.log(`Total Revenue: $${parsed.data?.stats?.totalRevenue || 'N/A'}`);
        console.log(`Data Source: ${parsed.message.includes('database') ? 'Database' : 'Generated'}`);
      } else {
        console.log('\n❌ API Error:', parsed.error);
        console.log('Hint:', parsed.hint || 'No hint provided');
      }
    } catch (e) {
      console.log('Error parsing response:', e.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error.message);
  console.log('\n❌ Cannot connect to API. Check if server is running.');
});

req.end();