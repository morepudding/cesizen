# 🧪 Guide de Tests de Sécurité - CESIZen

Ce guide explique comment tester toutes les défenses de sécurité de votre application CESIZen.

## 🚀 Démarrage Rapide

### 1. Démarrer l'application
```bash
npm run dev
```

### 2. Lancer les tests automatisés
```bash
# Tests complets avec Node.js
npm run security-test

# Tests avec PowerShell (Windows)
npm run security-test-ps
```

## 🎯 Types de Tests Disponibles

### ✅ Tests Automatisés (Node.js)

Le script `security-tests.js` teste automatiquement :

- **🥊 Protection Brute Force** : 6 tentatives de connexion
- **🚦 Rate Limiting** : 110 requêtes rapides 
- **💉 SQL Injection** : 4 payloads malveillants
- **🛡️ XSS Protection** : 3 scripts malveillants
- **🔒 Security Headers** : Headers de sécurité requis

```bash
node security/security-tests.js
```

### ✅ Tests PowerShell (Windows)

Le script PowerShell offre plus de flexibilité :

```powershell
# Tous les tests
.\security\security-test.ps1

# Tests spécifiques
.\security\security-test.ps1 -TestType brute
.\security\security-test.ps1 -TestType rate
.\security\security-test.ps1 -TestType sql
.\security\security-test.ps1 -TestType xss
.\security\security-test.ps1 -TestType headers

# URL personnalisée
.\security\security-test.ps1 -BaseUrl "https://votre-app.vercel.app"
```

## 🔧 Tests Manuels avec cURL

### Test Brute Force
```bash
# Tenter 6 connexions échouées
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/signin \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
  echo " - Tentative $i"
done
```

### Test Rate Limiting
```bash
# 50 requêtes rapides en parallèle
for i in {1..50}; do
  curl -s http://localhost:3000/api/test?req=$i &
done
wait
```

### Test SQL Injection
```bash
# Tester différents payloads SQL
curl "http://localhost:3000/api/test?search=%27%20OR%20%271%27%3D%271"
curl "http://localhost:3000/api/test?search=%27%3B%20DROP%20TABLE%20users%3B%20--"
```

### Test XSS
```bash
# Tester des scripts malveillants
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"comment":"<script>alert(\"XSS\")</script>"}'
```

### Test Headers de Sécurité
```bash
# Vérifier les headers
curl -I http://localhost:3000/
```

## 📊 Interprétation des Résultats

### ✅ Résultats Attendus

- **Brute Force** : Blocage après 5-6 tentatives (HTTP 429)
- **Rate Limiting** : Certaines requêtes bloquées (HTTP 429)
- **SQL Injection** : Requêtes malveillantes rejetées (HTTP 400)
- **XSS** : Scripts bloqués (HTTP 400)
- **Headers** : Présence des headers de sécurité

### 🎯 Score de Sécurité

- **90-100%** : 🛡️ Excellent niveau de sécurité
- **70-89%** : ✅ Bon niveau de sécurité
- **50-69%** : ⚠️ Améliorations nécessaires
- **<50%** : 🚨 Problèmes critiques

## 🔍 Tests Avancés

### Test de Performance sous Charge
```bash
# 1000 requêtes en 10 secondes
seq 1 1000 | xargs -n1 -P10 -I{} curl -s http://localhost:3000/api/test
```

### Test CSRF (si implémenté)
```bash
# Requête sans token CSRF
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"data":"test"}'
```

### Test CORS
```bash
# Requête cross-origin
curl -H "Origin: https://malicious-site.com" \
  http://localhost:3000/api/test
```

## 🛠️ Personnalisation des Tests

### Modifier les Seuils

Dans `security/security-tests.js` :
```javascript
// Modifier le nombre de tentatives
const maxAttempts = 6;

// Modifier le nombre de requêtes pour rate limiting
const maxRequests = 110;
```

### Ajouter de Nouveaux Tests

```javascript
async testCustomSecurity() {
    this.log('\n🔧 Testing Custom Security...', 'info');
    // Votre test personnalisé
}
```

## 📝 Logs et Monitoring

Les tests génèrent automatiquement :

- **Logs de sécurité** : `logs/security/`
- **Rapports de tests** : Console avec couleurs
- **Métriques** : Temps de réponse, taux de succès

## 🚨 Que Faire en Cas d'Échec ?

### Brute Force non bloqué
1. Vérifier Redis est démarré
2. Contrôler `BruteForceProtection.js`
3. Vérifier l'middleware dans `app.js`

### Rate Limiting non actif
1. Contrôler `RateLimiter.js`
2. Vérifier la configuration Redis
3. Tester avec moins de requêtes

### Injections non bloquées
1. Vérifier `InputValidator.js`
2. Contrôler les patterns de détection
3. Tester la sanitisation

## 🎯 Bonnes Pratiques

1. **Tester régulièrement** : Après chaque déploiement
2. **Tester en production** : Avec des outils externes
3. **Monitoring continu** : Surveiller les logs
4. **Mise à jour** : Garder les dépendances à jour

## 📞 Support

En cas de problème avec les tests :
1. Vérifier que l'application fonctionne
2. Contrôler les logs d'erreur
3. Tester individuellement chaque protection

---

🛡️ **CESIZen Security Tests** - Protégez votre application efficacement !
