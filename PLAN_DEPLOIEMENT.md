# Plan de Déploiement - CESIZen

## Vue d'ensemble

Plan de déploiement pour CESIZen basé sur la stack technologique Next.js 15.1.6 et l'infrastructure Vercel + Supabase. Ce document couvre les processus de déploiement développement et production.

## Architecture de Déploiement

### Environnements Configurés

**Développement Local**
- Next.js dev server : `npm run dev --turbopack`
- PostgreSQL : Supabase (connection pooling)
- Docker : `npm run docker:dev`
- Hot reload activé

**Staging/Preview**  
- Vercel Preview deployments
- Branch-based deployments automatiques
- Base de données : Supabase (même instance, schémas séparés)
- Tests automatisés sur PR

**Production**
- Vercel Production
- Domaine principal : cesizen.app (selon configuration)
- Base de données : Supabase Production
- CDN global Vercel Edge Network

### Stack Technologique

**Frontend/Backend**
- Next.js 15.1.6 (App Router)
- TypeScript 5.7.3
- Tailwind CSS 3.4.17
- React 19.0.0

**Base de Données**
- PostgreSQL (Supabase)
- Prisma ORM 6.3.1
- Connection pooling activé
- Migrations automatiques

**Authentification**
- NextAuth 4.24.11
- Providers configurables
- Sessions JWT sécurisées

## Processus de Déploiement

### GitFlow Implémenté

**Branches Principales**
- `main` : Production stable
- `develop` : Intégration continue (si utilisée)
- `feature/*` : Nouvelles fonctionnalités
- `hotfix/*` : Corrections urgentes production

**Branch Protection Configurée**
- Pull Request obligatoire pour main
- Code review requis (1+ approbation)
- Tests automatisés qui passent
- Branch à jour avant merge

### CI/CD Pipeline

**GitHub Actions Workflow**
```yaml
# Triggers automatiques
- Push sur main → Déploiement production
- Push sur branches → Preview deployment  
- Pull Request → Tests + Preview
```

**Étapes Pipeline**
1. **Checkout code** : Récupération du code source
2. **Install dependencies** : `npm ci` pour installation rapide
3. **Build application** : `npm run build`
4. **Run tests** : `npm run test:run`
5. **Security audit** : `npm audit`
6. **Deploy Vercel** : Déploiement automatique selon branche

### Scripts de Déploiement

**Scripts Package.json Configurés**
```json
{
  "build": "prisma generate && next build",
  "start": "next start",
  "postinstall": "prisma generate",
  "db:push": "prisma db push",
  "db:seed": "tsx prisma/seed.ts"
}
```

**Docker Deployment**
```bash
# Développement
npm run docker:dev          # Lance l'environnement dev
npm run docker:dev:build    # Build + lancement
npm run docker:dev:logs     # Voir les logs

# Production
npm run docker:prod         # Environnement production
npm run docker:prod:build   # Build production optimisé
```

## Configuration Environnements

### Variables d'Environnement Requises

**Base (.env.local / .env.production)**
```bash
# Base de données
DATABASE_URL=postgresql://user:pass@host:5432/db

# NextAuth
NEXTAUTH_SECRET=secret-key-256-bits
NEXTAUTH_URL=https://your-domain.com

# Email (optionnel)
EMAIL_USER=your-email@domain.com
EMAIL_PASS=app-specific-password
```

**Docker (.env.docker)**
- Variables spécifiques containerisation
- Séparation secrets développement/production
- Configuration réseau Docker

### Configuration Vercel

**Vercel Settings**
- Build Command : `npm run build`
- Output Directory : `.next`
- Install Command : `npm ci`
- Node Version : 18.x

**Environment Variables**
- Production secrets configurés via Vercel dashboard
- Preview deployments avec variables de test
- Automatic HTTPS avec certificats Let's Encrypt

## Base de Données et Migrations

### Supabase Configuration

**Features Utilisées**
- PostgreSQL database
- Connection pooling (pgbouncer)
- Automatic backups
- Real-time subscriptions (si activées)

**Schema Management**
- Prisma migrations : `npx prisma migrate deploy`
- Schema generation : `npx prisma generate`
- Seed data : `npm run db:seed`

### Processus de Migration

**Développement → Production**
1. Développement local avec Prisma
2. Migration fichier généré
3. Review migration dans PR
4. Application automatique lors déploiement
5. Vérification intégrité post-déploiement

**Script de Migration** (prisma/seed.ts)
- Données de démonstration
- Configuration initiale
- Types d'émotions prédéfinis
- Utilisateur admin par défaut

## Monitoring et Surveillance

### Métriques de Déploiement

**Vercel Analytics Intégré**
- Build time monitoring
- Deployment success rate
- Performance metrics post-deploy
- Error tracking temps réel

**Health Checks Disponibles**
- API routes health : `/api/health`
- Database connectivity check
- Authentication service status
- Static assets availability

### Monitoring Applicatif

**Outils Configurés**
- Vercel Web Analytics : performance utilisateur
- Prometheus client : métriques custom (`prom-client`)
- Sentry (si configuré) : error tracking
- Supabase Dashboard : DB performance

**Scripts de Vérification**
```bash
npm run test:run        # Tests automatisés
npm run security-test   # Tests sécurité
npm run lint           # Quality checks
```

## Rollback et Recovery

### Stratégies de Rollback

**Vercel Deployments**
- Rollback instantané via dashboard
- Previous deployments toujours disponibles
- Atomic deployments (tout ou rien)
- Zero downtime switching

**Base de Données**
- Point-in-time recovery Supabase
- Schema rollback via migrations Prisma
- Backup automatiques quotidiens

### Procédures d'Urgence

**Détection Problème**
1. Monitoring automatique détecte erreur
2. Alerts via Vercel notifications
3. Investigation via logs Vercel/Supabase

**Rollback Rapide**
1. Identification version stable précédente
2. Rollback deployment via Vercel
3. Vérification fonctionnement
4. Communication incident si nécessaire

## Sécurité Déploiement

### Protection Pipeline

**GitHub Security**
- Branch protection avec reviews obligatoires
- Dependabot pour mises à jour sécurisées
- Secret scanning activé
- Actions avec permissions minimales

**Vercel Security**
- Environment variables chiffrées
- HTTPS automatique et forcé
- Headers de sécurité configurés
- Preview deployments avec authentification

### Configuration Sécurisée

**Docker Deployment**
- Multi-stage builds optimisés
- Non-root user dans containers
- Secrets via environment variables
- Network isolation configurée

## Documentation et Guides

### Guides de Déploiement Disponibles

**DevOps Guides Créés**
- DEVOPS_NIVEAU_1.md : Dependabot, Auto-deploy, Lighthouse
- DEVOPS_NIVEAU_2.md : CodeQL Security, Docker, Branch Protection  
- DEVOPS_NIVEAU_3.md : Monitoring avancé, Prometheus, Grafana

**Docker Documentation**
- DOCKER_README.md : Guide complet Docker
- DOCKER_IMPLEMENTATION_PLAN.md : Plan d'implémentation

### Processus d'Onboarding

**Nouveau Développeur**
1. Clone repository
2. `npm install` - Installation dépendances
3. Copy `.env.example` to `.env.local`
4. `npm run db:push` - Setup base de données
5. `npm run dev` - Lancement développement local

**Avec Docker**
1. `npm run docker:dev:build` - Setup complet en 5 minutes
2. Application disponible sur http://localhost:3000

## Performance et Optimisation

### Build Optimizations

**Next.js Configurations**
- Turbopack pour dev (`--turbopack`)
- Static optimization automatique
- Image optimization intégrée
- Bundle analyzer disponible

**Vercel Edge Features**
- Edge functions pour performance
- Global CDN pour assets statiques
- Automatic compression (gzip/brotli)
- Smart caching stratégies

### Metrics Cibles

**Performance**
- Build time < 2 minutes
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse score > 90

**Déploiement**
- Zero downtime deployments
- Rollback time < 30 secondes
- Success rate > 99.9%

---

**Responsable Déploiement** : Équipe DevOps CESIZen  
**Dernière mise à jour** : Septembre 2025
**Révision** : Mensuelle ou lors de changements majeurs
