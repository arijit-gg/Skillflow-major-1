const https = require('https');

const postData = JSON.stringify({
  email: 'recruiter@smarthire.com',
  password: 'SmartHire2026!',
});

const options = {
  hostname: 'skillflow-major-1.onrender.com',
  port: 443,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

console.log('[Test Render Login] Sending login request to https://skillflow-major-1.onrender.com/api/auth/login ...');

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let responseBody = '';
  res.on('data', (chunk) => (responseBody += chunk));
  res.on('end', () => {
    console.log('RESPONSE:', responseBody);
  });
});

req.on('error', (e) => {
  console.error('ERROR:', e.message);
});

req.write(postData);
req.end();
