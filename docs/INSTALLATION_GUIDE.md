# Guide d'Installation - Système de Sécurité

## Prérequis

### Dépendances Node.js
```bash
npm install redis validator isomorphic-dompurify bcrypt helmet
```

### Installation Redis
```bash
# Windows (avec Chocolatey)
choco install redis-64

# Ou télécharger depuis : https://github.com/microsoftarchive/redis/releases
```

## Installation Étape par Étape

### 1. Configuration Redis
```bash
# Démarrer Redis
redis-server

# Tester la connexion
redis-cli ping
# Réponse attendue: PONG
```

### 2. Configuration de l'application
```javascript
// Dans app.js, ajouter avant les routes :
const bruteForceProtection = require('./security/BruteForceProtection');
const rateLimiter = require('./security/RateLimiter');
const inputValidator = require('./security/InputValidator');
const securityLogger = require('./security/SecurityLogger');

app.use(securityLogger.middleware());
app.use(inputValidator.middleware());
app.use(rateLimiter.middleware('global'));
```

### 3. Variables d'environnement
```env
# .env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
LOG_LEVEL=info
SECURITY_ALERTS_EMAIL=admin@votre-domaine.com
```

### 4. Headers de sécurité
```javascript
// Ajouter helmet pour les headers de sécurité
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true
  }
}));
```

## Configuration Avancée

### Personnalisation des règles
```javascript
// Dans security/config.js (nouveau fichier)
module.exports = {
  bruteForce: {
    maxAttempts: 5,
    lockoutTime: 15 * 60 * 1000,
    progressiveLockout: [1, 5, 15, 60, 240]
  },
  rateLimit: {
    global: { requests: 100, window: 60 },
    login: { requests: 3, window: 60 },
    api: { requests: 1000, window: 60 }
  },
  validation: {
    maxInputLength: 255,
    passwordMinLength: 8
  }
};
```

### Monitoring avec PM2
```json
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'cesizen-app',
    script: 'app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: './logs/app.log',
    error_file: './logs/error.log',
    out_file: './logs/out.log'
  }]
};
```

## Tests de Validation

### Script de test automatique
```bash
#!/bin/bash
# test_security.sh

echo "Testing Rate Limiting..."
for i in {1..105}; do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
done | tail -5

echo "Testing Brute Force Protection..."
for i in {1..7}; do
  curl -X POST http://localhost:3000/login \
    -d "username=test&password=wrong" \
    -s -o /dev/null -w "Attempt $i: %{http_code}\n"
done
```

## Surveillance et Maintenance

### Script de monitoring quotidien
```bash
#!/bin/bash
# daily_security_check.sh

# Analyser les logs de sécurité
LOG_FILE="./logs/security/security-$(date +%Y-%m-%d).log"

echo "=== Rapport de Sécurité Quotidien ===" > daily_report.txt
echo "Date: $(date)" >> daily_report.txt
echo "" >> daily_report.txt

# Compter les tentatives de brute force
BRUTE_FORCE=$(grep "BRUTE_FORCE_ATTEMPT" $LOG_FILE | wc -l)
echo "Tentatives de Brute Force: $BRUTE_FORCE" >> daily_report.txt

# IPs les plus actives
echo "Top 10 IPs:" >> daily_report.txt
grep -o '"ip":"[^"]*"' $LOG_FILE | sort | uniq -c | sort -nr | head -10 >> daily_report.txt
```

### Rotation des logs
```javascript
// scripts/log_rotation.js
const fs = require('fs');
const path = require('path');

async function rotateSecurityLogs() {
  const logDir = path.join(__dirname, '../logs/security');
  const files = await fs.promises.readdir(logDir);
  
  // Compresser les logs de plus de 7 jours
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  for (const file of files) {
    const filePath = path.join(logDir, file);
    const stats = await fs.promises.stat(filePath);
    
    if (stats.mtime < sevenDaysAgo && file.endsWith('.log')) {
      // Compresser et archiver
      const gzip = require('zlib').createGzip();
      const readable = fs.createReadStream(filePath);
      const writable = fs.createWriteStream(`${filePath}.gz`);
      
      readable.pipe(gzip).pipe(writable);
      await fs.promises.unlink(filePath);
    }
  }
}

// Programmer l'exécution quotidienne
setInterval(rotateSecurityLogs, 24 * 60 * 60 * 1000);
```

## Dépannage

### Problèmes courants

#### Redis non connecté
```bash
# Vérifier le statut de Redis
redis-cli ping

# Si erreur de connexion
sudo systemctl start redis
# ou sur Windows
net start redis
```

#### Logs non générés
```bash
# Vérifier les permissions
chmod 755 logs/
chmod 644 logs/security/

# Créer le dossier si nécessaire
mkdir -p logs/security
```

#### Rate limiting trop restrictif
```javascript
// Ajuster temporairement dans RateLimiter.js
this.rules.global.requests = 500; // Augmenter la limite
```

### Monitoring des performances
```javascript
// Ajouter un middleware de performance
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) { // > 1 seconde
      console.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
  });
  next();
});
```

Cette installation vous donnera une protection complète et un système de surveillance robuste.
