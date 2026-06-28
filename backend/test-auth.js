const http = require('http');

const request = (options, postData) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
};

async function testAuth() {
  const email = `test${Date.now()}@example.com`;
  const password = 'password123';

  console.log('Testing Registration...');
  const regRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ email, password }));

  console.log(`Status: ${regRes.status}`);
  if (regRes.status !== 201) {
    console.error('Registration failed:', regRes.data);
    return;
  }
  
  const token = regRes.data.token;
  console.log('Registration successful. Token received.');

  console.log('\nTesting Login...');
  const loginRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ email, password }));

  console.log(`Status: ${loginRes.status}`);
  if (loginRes.status !== 200) {
    console.error('Login failed:', loginRes.data);
    return;
  }
  console.log('Login successful.');

  console.log('\nTesting Get Me (Protected Route)...');
  const meRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  console.log(`Status: ${meRes.status}`);
  if (meRes.status !== 200) {
    console.error('Get Me failed:', meRes.data);
    return;
  }
  console.log('Get Me successful. User:', meRes.data.user.email);
  console.log('\nAuthentication flow completely verified! ✅');
}

testAuth().catch(console.error);
