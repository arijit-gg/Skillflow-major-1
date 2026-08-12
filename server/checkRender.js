const https = require('https');

console.log('[Testing Render] Sending HTTP GET to https://skillflow-major-1.onrender.com/api/health ...');

const req = https.get('https://skillflow-major-1.onrender.com/api/health', (res) => {
  console.log(`[Render Response Status]: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    console.log('[Render Response Body]:', data);
  });
});

req.on('error', (err) => {
  console.error('[Render Error]:', err.message);
});

req.setTimeout(30000, () => {
  console.warn('[Render Warning] Request timed out after 30 seconds. Cold start spin-up in progress...');
});
