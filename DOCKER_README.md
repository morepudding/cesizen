# 🐳 CESIZen Docker - Guide Complet

## 📋 Vue d'ensemble

CESIZen est maintenant entièrement containerisé avec Docker ! Cette configuration permet de :
- 🏗️ Développement local isolé
- 🚀 Déploiement production simplifié  
- 🔧 Environnement cohérent équipe
- 📦 Distribution facile

## 🛠️ Prérequis

- **Docker Desktop** installé et démarré
- **Node.js 18+** (pour développement local optionnel)
- **Git** pour cloner le projet

## 🚀 Démarrage Rapide

### 1. **Environnement de Développement** (Recommandé)
```bash
# Lancer l'application en mode développement
npm run docker:dev:build

# Voir les logs en temps réel
npm run docker:dev:logs

# Arrêter l'application
npm run docker:dev:stop
```

**➡️ Application disponible sur http://localhost:3000**

### 2. **Environnement de Production**
```bash
# Copier le template d'environnement
cp .env.docker.example .env.docker

# Modifier .env.docker avec tes vraies variables
# Puis lancer :
npm run docker:prod:build

# Voir les logs
npm run docker:prod:logs

# Arrêter
npm run docker:prod:stop
```

## 📝 Scripts Docker Disponibles

| Script | Description | Usage |
|--------|-------------|-------|
| `docker:dev` | Lancer dev (sans rebuild) | Usage quotidien |
| `docker:dev:build` | Lancer dev + rebuild | Après changements Docker |
| `docker:dev:stop` | Arrêter dev | Nettoyage |
| `docker:dev:logs` | Voir logs dev | Debug |
| `docker:prod` | Lancer production | Déploiement |
| `docker:prod:build` | Lancer prod + rebuild | Nouvelle version |
| `docker:prod:stop` | Arrêter production | Maintenance |
| `docker:prod:logs` | Voir logs prod | Monitoring |

## 🔧 Configuration

### Variables d'environnement (.env.docker)
```bash
# Base de données
DATABASE_URL=postgresql://user:password@host:5432/database

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Email (optionnel)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password
```

### Fichiers Docker
- `Dockerfile` : Configuration image multi-stage
- `docker-compose.yml` : Environnement développement
- `docker-compose.prod.yml` : Environnement production
- `.dockerignore` : Optimisation build
- `.env.docker` : Variables production

## 🏗️ Architecture Docker

```
┌─────────────────────────┐
│   CESIZen App           │
│   (Next.js 15.1.6)     │
│   Port: 3000           │
└─────────────────────────┘
           │
           │ Réseau Docker
           │
┌─────────────────────────┐
│   PostgreSQL            │
│   (Version 13-alpine)   │
│   Port: 5432           │
└─────────────────────────┘
```

## 🚨 Dépannage

### Erreur "port 3000 déjà utilisé"
```bash
# Arrêter tous les conteneurs
docker stop $(docker ps -q)

# Ou changer le port dans docker-compose.yml
ports:
  - "3001:3000"  # localhost:3001 au lieu de 3000
```

### Erreur de build
```bash
# Nettoyer Docker
docker system prune -f

# Rebuild complet
npm run docker:dev:build
```

### Erreur base de données
```bash
# Vérifier la variable DATABASE_URL
echo $DATABASE_URL

# Tester la connexion
docker exec cesizen-app-dev npm run db:push
```

## 📚 Commandes Docker Utiles

```bash
# Voir les conteneurs actifs
docker ps

# Accéder au conteneur
docker exec -it cesizen-app-dev sh

# Voir les logs détaillés
docker logs cesizen-app-dev --follow

# Nettoyer les images inutiles
docker image prune -f
```

## 🎯 Avantages Docker pour CESIZen

✅ **Consistance** : Même environnement partout  
✅ **Isolation** : Pas de conflits de dépendances  
✅ **Portabilité** : Fonctionne sur Windows/Mac/Linux  
✅ **Scalabilité** : Facile à déployer  
✅ **Développement** : Onboarding rapide équipe  

---

## 📞 Support

- 🐛 **Problème Docker** : Vérifier Docker Desktop démarré
- 🔧 **Erreur build** : `docker system prune` puis rebuild
- 📧 **Questions** : Consulter les logs `npm run docker:dev:logs`

**🎉 CESIZen est maintenant prêt pour Docker !**
