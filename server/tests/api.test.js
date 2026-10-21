const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/../.env' });

// We require the app
const app = require('../server');

const BASE_PORT = 5099;
let server;
const API_URL = `http://127.0.0.1:${BASE_PORT}/api`;

const runTests = async () => {
  console.log('\n=========================================');
  console.log('🚀 RUNNING COMPREHENSIVE BACKEND API TESTS');
  console.log('=========================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} - ${details}`);
      failed++;
    }
  };

  try {
    // Start temporary test server
    server = app.listen(BASE_PORT);
    // Wait for mongo connection if connecting
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Test 1: Health Check
    const resHealth = await fetch(`${API_URL}/health`);
    const dataHealth = await resHealth.json();
    assert(resHealth.status === 200 && dataHealth.status === 'ok', 'GET /api/health returns 200 OK');

    // Test 2: Register User 1
    const testEmail1 = `user1_${Date.now()}@test.com`;
    const resReg1 = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alice Developer',
        email: testEmail1,
        password: 'password123'
      })
    });
    const dataReg1 = await resReg1.json();
    assert(resReg1.status === 201 && dataReg1.token && dataReg1.user, 'POST /api/auth/register registers new user and returns JWT');
    const token1 = dataReg1.token;
    const user1 = dataReg1.user;

    // Test 3: Duplicate Email Registration Prevention
    const resDup = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alice Imposter',
        email: testEmail1,
        password: 'password999'
      })
    });
    const dataDup = await resDup.json();
    assert(resDup.status === 409 && dataDup.success === false, 'POST /api/auth/register rejects duplicate email with 409 Conflict');

    // Test 4: Register User 2 (For ownership testing)
    const testEmail2 = `user2_${Date.now()}@test.com`;
    const resReg2 = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Bob Reviewer',
        email: testEmail2,
        password: 'securePassword456'
      })
    });
    const dataReg2 = await resReg2.json();
    const token2 = dataReg2.token;
    assert(resReg2.status === 201 && token2, 'POST /api/auth/register registers second user for authorization checks');

    // Test 5: Login with correct credentials
    const resLogin = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail1,
        password: 'password123'
      })
    });
    const dataLogin = await resLogin.json();
    assert(resLogin.status === 200 && dataLogin.token, 'POST /api/auth/login succeeds with valid credentials');

    // Test 6: Login with invalid password
    const resBadLogin = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail1,
        password: 'wrongpassword'
      })
    });
    assert(resBadLogin.status === 401, 'POST /api/auth/login rejects invalid password with 401 Unauthorized');

    // Test 7: GET /api/auth/me with token
    const resMe = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    const dataMe = await resMe.json();
    assert(resMe.status === 200 && dataMe.user.email === testEmail1, 'GET /api/auth/me returns current authenticated user profile');

    // Test 8: GET /api/auth/me without token
    const resMeNoToken = await fetch(`${API_URL}/auth/me`);
    assert(resMeNoToken.status === 401, 'GET /api/auth/me rejects request without token with 401 Unauthorized');

    // Test 9: Create Blog Post as User 1
    const resCreate = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`
      },
      body: JSON.stringify({
        title: 'Mastering Modern Full-Stack Development with React and Node',
        excerpt: 'An in-depth guide to building scalable, secure, and modern web applications with MERN stack.',
        content: 'Full stack development requires a solid understanding of both frontend client architecture and robust backend API security. In this article, we break down REST APIs, authentication patterns, and responsive UI best practices.',
        category: 'Web Development'
      })
    });
    const dataCreate = await resCreate.json();
    assert(resCreate.status === 201 && dataCreate.post && dataCreate.post._id, 'POST /api/posts creates new blog post with author reference');
    const createdPostId = dataCreate.post._id;

    // Test 10: Create Post without required fields
    const resBadCreate = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`
      },
      body: JSON.stringify({ title: 'Hi' })
    });
    assert(resBadCreate.status === 400, 'POST /api/posts rejects invalid input with 400 Bad Request');

    // Test 11: GET /api/posts (Public feed)
    const resFeed = await fetch(`${API_URL}/posts`);
    const dataFeed = await resFeed.json();
    assert(resFeed.status === 200 && Array.isArray(dataFeed.posts) && dataFeed.posts.length > 0, 'GET /api/posts returns array of published posts with pagination metadata');

    // Test 12: GET /api/posts with search filter
    const resSearch = await fetch(`${API_URL}/posts?search=Mastering`);
    const dataSearch = await resSearch.json();
    assert(resSearch.status === 200 && dataSearch.posts.some((p) => p._id === createdPostId), 'GET /api/posts?search=... finds matching posts');

    // Test 13: GET /api/posts/:id (Single post details)
    const resSingle = await fetch(`${API_URL}/posts/${createdPostId}`);
    const dataSingle = await resSingle.json();
    assert(resSingle.status === 200 && dataSingle.post._id === createdPostId, 'GET /api/posts/:id returns single post details with author');

    // Test 14: GET /api/posts/mine for User 1
    const resMine1 = await fetch(`${API_URL}/posts/mine`, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    const dataMine1 = await resMine1.json();
    assert(resMine1.status === 200 && dataMine1.posts.some((p) => p._id === createdPostId), 'GET /api/posts/mine returns posts created by logged-in user');

    // Test 15: GET /api/posts/mine for User 2 (Should not have User 1's post)
    const resMine2 = await fetch(`${API_URL}/posts/mine`, {
      headers: { Authorization: `Bearer ${token2}` }
    });
    const dataMine2 = await resMine2.json();
    assert(resMine2.status === 200 && !dataMine2.posts.some((p) => p._id === createdPostId), 'GET /api/posts/mine isolates user posts properly');

    // Test 16: User 2 attempts to UPDATE User 1's post (Forbidden)
    const resUnauthEdit = await fetch(`${API_URL}/posts/${createdPostId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token2}`
      },
      body: JSON.stringify({
        title: 'Hacked by Bob'
      })
    });
    assert(resUnauthEdit.status === 403, 'PUT /api/posts/:id prevents non-owner from updating post with 403 Forbidden');

    // Test 17: User 1 updates own post (Success)
    const resOwnerEdit = await fetch(`${API_URL}/posts/${createdPostId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`
      },
      body: JSON.stringify({
        title: 'Mastering Modern Full-Stack Development - Updated Edition'
      })
    });
    const dataOwnerEdit = await resOwnerEdit.json();
    assert(resOwnerEdit.status === 200 && dataOwnerEdit.post.title.includes('Updated Edition'), 'PUT /api/posts/:id allows owner to update post');

    // Test 18: User 2 attempts to DELETE User 1's post (Forbidden)
    const resUnauthDel = await fetch(`${API_URL}/posts/${createdPostId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token2}` }
    });
    assert(resUnauthDel.status === 403, 'DELETE /api/posts/:id prevents non-owner from deleting post with 403 Forbidden');

    // Test 19: User 1 deletes own post (Success)
    const resOwnerDel = await fetch(`${API_URL}/posts/${createdPostId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token1}` }
    });
    assert(resOwnerDel.status === 200, 'DELETE /api/posts/:id allows owner to delete post');

    // Test 20: GET deleted post returns 404
    const resGetDeleted = await fetch(`${API_URL}/posts/${createdPostId}`);
    assert(resGetDeleted.status === 404, 'GET /api/posts/:id returns 404 for deleted post');

    // Test 21: Invalid ObjectId format returns 400
    const resInvalidId = await fetch(`${API_URL}/posts/invalid-mongo-id-12345`);
    assert(resInvalidId.status === 400, 'GET /api/posts/:id with malformed ID returns 400 Bad Request');

    console.log('\n-----------------------------------------');
    console.log(`Test Execution Summary: ${passed} Passed, ${failed} Failed`);
    console.log('-----------------------------------------\n');

    if (failed > 0) {
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('Fatal error during test execution:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
    await mongoose.disconnect();
    process.exit();
  }
};

runTests();
