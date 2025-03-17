/**
 * Simple script to check database status
 * Run with: node src/scripts/check-db-status.js
 */

const https = require('https');

const options = {
  hostname: 'revelate-operations-33be6715fef8.herokuapp.com',
  port: 443,
  path: '/api/status',
  method: 'GET',
  headers: {
    'User-Agent': 'Database Status Check Script'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:');
    console.log(data);
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('Error checking database status:', error.message);
  process.exit(1);
});

req.end();