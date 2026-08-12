const https = require('https');

const loginData = JSON.stringify({ email: 'recruiter@smarthire.com', password: 'SmartHire2026!' });

const loginReq = https.request('https://skillflow-major-1.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginData) },
}, (loginRes) => {
  let body = '';
  loginRes.on('data', c => body += c);
  loginRes.on('end', () => {
    const token = JSON.parse(body).token;
    console.log('[Auth] Token acquired. Testing authenticated dashboard response time...');
    
    const start = Date.now();
    const dashReq = https.get('https://skillflow-major-1.onrender.com/api/analytics/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    }, (dashRes) => {
      let dashData = '';
      dashRes.on('data', c => dashData += c);
      dashRes.on('end', () => {
        const duration = Date.now() - start;
        console.log(`⚡ [Dashboard Speed]: ${duration}ms | Status: ${dashRes.statusCode}`);
        console.log('[Summary Metrics]:', JSON.parse(dashData).data?.summary);
      });
    });
  });
});

loginReq.write(loginData);
loginReq.end();
