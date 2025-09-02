# 🗄️ Configuration de la base de données de production

Votre application Cesizen nécessite une base de données MySQL pour fonctionner en production. Voici comment la configurer :

## 1. Créer une base de données PlanetScale (gratuit)

1. Allez sur [planetscale.com](https://planetscale.com)
2. Créez un compte gratuit avec GitHub
3. Cliquez sur **"New Database"**
4. Nommez votre base de données : `cesizen`
5. Choisissez la région la plus proche
6. Cliquez sur **"Create database"**

## 2. Obtenir l'URL de connexion

1. Dans votre dashboard PlanetScale, cliquez sur votre base `cesizen`
2. Cliquez sur **"Connect"**
3. Sélectionnez **"Prisma"** comme framework
4. Copiez l'URL qui ressemble à :
   ```
   mysql://username:password@host.planetscale.com/cesizen?sslaccept=strict
   ```

## 3. Configurer Vercel

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Cliquez sur votre projet **cesizen**
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez ces variables :

```env
DATABASE_URL=mysql://votre_url_planetscale_ici
NEXTAUTH_SECRET=supersecretkey123
NEXTAUTH_URL=https://votre-app.vercel.app
EMAIL_USER=bottero.romain1811@gmail.com
EMAIL_PASS=Naala123!
```

## 4. Initialiser la base de données

Une fois configuré, dans votre terminal local :

```bash
# Avec votre URL PlanetScale dans .env
npm run db:push    # Crée les tables
npm run db:seed    # Insère les données initiales
```

## 5. Redéployer

Après avoir configuré les variables d'environnement :
1. Vercel redéploiera automatiquement
2. Ou forcez un redéploiement depuis le dashboard

## 🎯 Résultat

Votre application aura :
- ✅ Un utilisateur admin : `admin@cesizen.com` / `admin123`
- ✅ Toutes les activités de bien-être
- ✅ Les questions de stress
- ✅ Les types d'émotions
- ✅ Base de données prête pour la production

## 🔧 Alternative : Railway

Si vous préférez Railway :
1. [railway.app](https://railway.app)
2. **New Project** → **Provision MySQL**
3. Copiez l'URL de connexion
4. Même configuration dans Vercel
