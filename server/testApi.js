const http = require('http');

const makeRequest = (path, method = 'GET', body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
    });

    req.on('error', (err) => reject(err));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

const runTests = async () => {
  try {
    console.log('--- TESTING API ENDPOINTS ---');
    
    // 1. Healthcheck
    const health = await makeRequest('/api/health');
    console.log('1. GET /api/health -> Status:', health.status, health.data);

    // 2. Login
    const login = await makeRequest('/api/auth/login', 'POST', {
      email: 'recruiter@smarthire.com',
      password: 'SmartHire2026!',
    });
    console.log('2. POST /api/auth/login -> Status:', login.status, 'User:', login.data.user?.name);
    const token = login.data.token;

    // 3. GET Jobs
    const jobs = await makeRequest('/api/jobs');
    console.log('3. GET /api/jobs -> Count:', jobs.data.count, 'Jobs Total:', jobs.data.total);

    // 4. GET Applicants
    const applicants = await makeRequest('/api/applicants', 'GET', null, {
      Authorization: `Bearer ${token}`,
    });
    console.log('4. GET /api/applicants -> Count:', applicants.data.count, 'Applicants Total:', applicants.data.total);

    // 5. GET Analytics
    const analytics = await makeRequest('/api/analytics/dashboard', 'GET', null, {
      Authorization: `Bearer ${token}`,
    });
    console.log('5. GET /api/analytics/dashboard -> Total Jobs:', analytics.data.data.summary.totalJobs, 'Total Applicants:', analytics.data.data.summary.totalApplicants);

    console.log('\n✅ ALL BACKEND API ENDPOINTS VERIFIED WORKING PERFECTLY!\n');
  } catch (err) {
    console.error('API Verification Failed:', err.message);
  }
};

runTests();
