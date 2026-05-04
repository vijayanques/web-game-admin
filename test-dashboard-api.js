#!/usr/bin/env node

/**
 * Test Dashboard API Connection
 * Run: node test-dashboard-api.js
 */

const https = require('https');
const http = require('http');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://game-backend-production-3988.up.railway.app';
const endpoint = '/api/admin/dashboard/stats';
const fullUrl = `${API_URL}${endpoint}`;

console.log('🧪 Testing Dashboard API Connection\n');
console.log('📍 URL:', fullUrl);
console.log('⏳ Sending request...\n');

const url = new URL(fullUrl);
const protocol = url.protocol === 'https:' ? https : http;

const options = {
  hostname: url.hostname,
  port: url.port || (url.protocol === 'https:' ? 443 : 80),
  path: url.pathname + url.search,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
};

const req = protocol.request(options, (res) => {
  console.log(`✅ Status: ${res.statusCode} ${res.statusMessage}`);
  console.log('📋 Headers:', JSON.stringify(res.headers, null, 2));
  console.log('\n📦 Response Body:\n');

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
      
      console.log('\n📊 Statistics Summary:');
      console.log('   Total Users:', json.stats?.totalUsers || 'N/A');
      console.log('   Total Games:', json.stats?.totalGames || 'N/A');
      console.log('   Active Players:', json.stats?.activePlayers || 'N/A');
      console.log('   User Growth:', json.stats?.userGrowth || 'N/A', '%');
      
      if (json.stats?.totalUsers === 0 && json.stats?.totalGames === 0) {
        console.log('\n⚠️  WARNING: All stats are zero!');
        console.log('   This might mean:');
        console.log('   - Database is not connected');
        console.log('   - Database is empty (no users/games)');
        console.log('   - Backend is returning fallback data');
      } else {
        console.log('\n✅ API is working and returning data!');
      }
    } catch (err) {
      console.log('Raw response:', data);
      console.error('\n❌ Failed to parse JSON:', err.message);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Request failed:', err.message);
  console.error('\nPossible causes:');
  console.error('   - Backend server is down');
  console.error('   - Network connectivity issue');
  console.error('   - Wrong API URL');
  console.error('   - Firewall blocking request');
});

req.on('timeout', () => {
  console.error('❌ Request timed out after 10 seconds');
  console.error('\nPossible causes:');
  console.error('   - Backend is sleeping (cold start)');
  console.error('   - Backend is overloaded');
  console.error('   - Network is slow');
  req.destroy();
});

req.end();
