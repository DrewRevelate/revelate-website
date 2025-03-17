/**
 * Simple script to check API status
 * Run with: node src/scripts/check-api.js
 */

const https = require('https');

const options = {
  hostname: 'revelate-operations-33be6715fef8.herokuapp.com',
  port: 443,
  path: '/api/test',
  method: 'GET',
  headers: {
    'User-Agent': 'API Status Check Script'
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
  console.error('Error checking API:', error.message);
  process.exit(1);
});

req.end();