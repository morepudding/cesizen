    # Documentation de Protection Sécuritaire

## Vue d'ensemble

Ce système de sécurité multi-couches protège votre application contre les principales vulnérabilités identifiées : Brute Force, DoS/DDoS, et les vulnérabilités OWASP Top 10.

## 1. Protection contre les Attaques Brute Force

### Comment ça fonctionne
- **Détection** : Surveillance des tentatives de connexion par IP + username
- **Limitation progressive** : Blocage temporaire croissant (1min → 4h)
- **Stockage Redis** : Persistance des tentatives entre les redémarrages

### Types d'attaques couvertes
- **Classic Wordlist** : Limite à 5 tentatives/15min
- **Attaques ciblées** : Blocage spécifique par compte
- **Password spraying** : Protection par IP globale

### Exemple de protection
```
Tentative 1-5 : Autorisées
Tentative 6+ : Blocage 1 minute
Récidive : Blocage 5 minutes → 15min → 1h → 4h
```

## 2. Protection DoS/DDoS

### Mécanismes de défense

#### Rate Limiting
- **Global** : 100 requêtes/minute par IP
- **Login** : 5 tentatives/minute
- **API** : 1000 appels/minute
- **Upload** : 10 fichiers/5 minutes

#### Détection de Flood
- **UDP Flood** : Seuil 50 paquets/seconde
- **SYN Flood** : Seuil 30 connexions/seconde
- **Blocage automatique** : 5 minutes lors de détection

### Headers de réponse
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 45
```

## 3. Protection OWASP Top 10

### A01 - Broken Access Control
- Validation des permissions par middleware
- Contrôle des accès par rôle

### A02 - Cryptographic Failures
- Chiffrement des mots de passe (bcrypt)
- Validation des certificats SSL/TLS

### A03 - Injection (SQL/NoSQL/XSS)
#### Protection SQL Injection
```javascript
// Détection des patterns malveillants
SELECT, INSERT, UPDATE, DELETE, DROP, UNION
--, #, /*, */
OR 1=1, AND 1=1
```

#### Protection XSS
```javascript
// Filtrage des balises dangereuses
<script>, <iframe>, javascript:
on* attributes (onclick, onload...)
```

### A04 - Insecure Design
- Validation stricte des entrées
- Sanitisation automatique

### A05 - Security Misconfiguration
- Headers de sécurité automatiques
- Configuration par défaut sécurisée

## 4. Système de Monitoring

### Niveaux de logging
- **INFO** : Activité normale
- **WARNING** : Tentatives suspectes
- **CRITICAL** : Attaques détectées

### Types d'événements surveillés
- `BRUTE_FORCE_ATTEMPT` : Tentatives de force brute
- `RATE_LIMIT` : Dépassement de limites
- `SUSPICIOUS_ACTIVITY` : Activité anormale
- `FLOOD_DETECTION` : Attaques de flood

### Format des logs
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "WARNING",
  "event": "BRUTE_FORCE_ATTEMPT",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "details": {
    "username": "admin",
    "success": false,
    "timestamp": 1705315800000
  }
}
```

## 5. Configuration et Personnalisation

### Ajustement des seuils
```javascript
// Dans BruteForceProtection.js
this.maxAttempts = 5;           // Tentatives avant blocage
this.progressiveLockout = [1, 5, 15, 60, 240]; // Minutes de blocage

// Dans RateLimiter.js
this.rules = {
  global: { requests: 100, window: 60 },
  login: { requests: 5, window: 60 }
};
```

### Validation des mots de passe
- Longueur minimale : 8 caractères
- Complexité requise : minuscule, majuscule, chiffre, caractère spécial

## 6. Réponse aux Incidents

### Actions automatiques
1. **Détection** → Log de l'événement
2. **Seuil dépassé** → Blocage temporaire
3. **Attaque critique** → Alerte immédiate
4. **Persistance** → Stockage Redis pour analyse

### Codes de réponse HTTP
- `429 Too Many Requests` : Rate limiting
- `400 Bad Request` : Input invalide
- `403 Forbidden` : IP bloquée

## 7. Maintenance et Surveillance

### Surveillance quotidienne
- Analyse des logs de sécurité
- Vérification des IPs bloquées
- Statistiques des tentatives d'attaque

### Nettoyage automatique
- Expiration des blocages temporaires
- Rotation des logs (quotidienne)
- Nettoyage des données Redis

## 8. Tests de Sécurité

### Tests recommandés
```bash
# Test rate limiting
for i in {1..150}; do curl http://localhost:3000/api; done

# Test brute force
for i in {1..10}; do 
  curl -X POST http://localhost:3000/login \
    -d "username=admin&password=wrong$i"
done

# Test injection SQL
curl "http://localhost:3000/api?id=1' OR '1'='1"
```

### Validation des protections
- [ ] Brute force bloqué après 5 tentatives
- [ ] Rate limiting activé à 100 req/min
- [ ] SQL injection détectée et bloquée
- [ ] XSS filtré automatiquement
- [ ] Logs générés pour chaque tentative

## 9. Alertes et Notifications

### Configuration des alertes
- Email pour les attaques critiques
- Slack pour les tentatives de brute force
- Dashboard temps réel pour le monitoring

### Métriques importantes
- Nombre de tentatives bloquées/jour
- IPs les plus agressives
- Types d'attaques les plus fréquents
- Temps de réponse moyen

## Conclusion

Ce système offre une protection robuste et évolutive contre les principales menaces de sécurité web. La surveillance continue et les logs détaillés permettent une analyse forensique complète en cas d'incident.
