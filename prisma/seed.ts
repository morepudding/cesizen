import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const stressQuestions = [
  { event: "Décès du conjoint", points: 100 },
  { event: "Divorce", points: 73 },
  { event: "Séparation conjugale", points: 65 },
  { event: "Emprisonnement", points: 63 },
  { event: "Décès d'un proche parent", points: 63 },
  { event: "Blessure ou maladie personnelle", points: 53 },
  { event: "Mariage", points: 50 },
  { event: "Licenciement", points: 47 },
  { event: "Réconciliation conjugale", points: 45 },
  { event: "Retraite", points: 45 },
  { event: "Changement de santé d'un membre de la famille", points: 44 },
  { event: "Grossesse", points: 40 },
  { event: "Difficultés sexuelles", points: 39 },
  { event: "Arrivée d'un nouveau membre dans la famille", points: 39 },
  { event: "Réorganisation professionnelle", points: 39 },
  { event: "Changement de situation financière", points: 38 },
  { event: "Décès d'un ami proche", points: 37 },
  { event: "Changement de type de travail", points: 36 },
  { event: "Changement dans le nombre de disputes conjugales", points: 35 },
  { event: "Hypothèque importante", points: 31 },
  { event: "Saisie d'hypothèque ou de prêt", points: 30 },
  { event: "Changement de responsabilités au travail", points: 29 },
  { event: "Départ d'un enfant du foyer", points: 29 },
  { event: "Problèmes avec la belle-famille", points: 29 },
  { event: "Réussite personnelle exceptionnelle", points: 28 },
  { event: "Conjoint commençant ou arrêtant de travailler", points: 26 },
  { event: "Début ou fin d'études", points: 26 },
  { event: "Changement de conditions de vie", points: 25 },
  { event: "Révision des habitudes personnelles", points: 24 },
  { event: "Difficultés avec son supérieur", points: 23 },
  { event: "Changement d'horaires ou de conditions de travail", points: 20 },
  { event: "Déménagement", points: 20 },
  { event: "Changement d'école", points: 20 },
  { event: "Changement de loisirs", points: 19 },
  { event: "Changement dans les activités religieuses", points: 19 },
  { event: "Changement dans les activités sociales", points: 18 },
  { event: "Petit crédit ou prêt", points: 17 },
  { event: "Changement dans les habitudes de sommeil", points: 16 },
  { event: "Changement dans les réunions de famille", points: 15 },
  { event: "Changement dans les habitudes alimentaires", points: 15 },
  { event: "Vacances", points: 13 },
  { event: "Fêtes de fin d'année", points: 12 },
  { event: "Petite infraction à la loi", points: 11 }
];

const activities = [
  // Activités de Bien-être
  {
    title: "Méditation Zen",
    description: "Une séance de méditation guidée pour apaiser l'esprit et réduire le stress. Apprenez des techniques de respiration et de pleine conscience.",
    category: "BIEN_ETRE",
    duration: "30 minutes",
    level: "Tous niveaux",
    location: "Studio de méditation",
    equipment: "Tapis de yoga, coussin de méditation",
    isActive: true
  },
  {
    title: "Yoga Flow",
    description: "Une séance dynamique de yoga qui combine postures et respiration pour améliorer la flexibilité et la force.",
    category: "BIEN_ETRE",
    duration: "1 heure",
    level: "Intermédiaire",
    location: "Salle de yoga",
    equipment: "Tapis de yoga, briques de yoga",
    isActive: true
  },
  {
    title: "Massage Thérapeutique",
    description: "Séance de massage relaxant pour soulager les tensions musculaires et améliorer la circulation sanguine.",
    category: "BIEN_ETRE",
    duration: "1 heure",
    level: "Tous niveaux",
    location: "Cabinet de massage",
    equipment: "Huile de massage",
    isActive: true
  },

  // Activités Sportives
  {
    title: "Course à Pied en Nature",
    description: "Parcours de course à pied dans des sentiers naturels pour améliorer l'endurance tout en profitant du paysage.",
    category: "SPORT",
    duration: "45 minutes",
    level: "Intermédiaire",
    location: "Parc naturel",
    equipment: "Chaussures de course, bouteille d'eau",
    isActive: true
  },
  {
    title: "Natation Relaxante",
    description: "Séance de natation à rythme modéré pour travailler l'ensemble du corps tout en douceur.",
    category: "SPORT",
    duration: "1 heure",
    level: "Tous niveaux",
    location: "Piscine",
    equipment: "Maillot de bain, bonnet de bain",
    isActive: true
  },
  {
    title: "Pilates",
    description: "Cours de Pilates pour renforcer les muscles profonds et améliorer la posture.",
    category: "SPORT",
    duration: "1 heure",
    level: "Débutant",
    location: "Salle de Pilates",
    equipment: "Tapis de Pilates",
    isActive: true
  },

  // Activités Créatives
  {
    title: "Atelier de Peinture",
    description: "Exprimez votre créativité à travers la peinture. Apprenez différentes techniques et créez votre propre œuvre d'art.",
    category: "ART",
    duration: "2 heures",
    level: "Tous niveaux",
    location: "Atelier d'art",
    equipment: "Pinceaux, peintures, toile",
    isActive: true
  },
  {
    title: "Cours de Photographie",
    description: "Apprenez les bases de la photographie et capturez des moments uniques avec votre appareil photo.",
    category: "ART",
    duration: "2 heures",
    level: "Débutant",
    location: "Studio photo",
    equipment: "Appareil photo",
    isActive: true
  },
  {
    title: "Atelier d'Écriture",
    description: "Stimulez votre créativité littéraire à travers des exercices d'écriture et des discussions en groupe.",
    category: "ART",
    duration: "1h30",
    level: "Tous niveaux",
    location: "Bibliothèque",
    equipment: "Cahier et stylo",
    isActive: true
  },

  // Activités de Pleine Nature
  {
    title: "Randonnée en Montagne",
    description: "Découvrez des sentiers de montagne magnifiques lors d'une randonnée guidée.",
    category: "AVENTURE",
    duration: "4 heures",
    level: "Avancé",
    location: "Massif montagneux",
    equipment: "Chaussures de randonnée, bâtons, sac à dos",
    isActive: true
  },
  {
    title: "Vélo en Forêt",
    description: "Parcours de vélo sur des chemins forestiers pour une expérience nature et sportive.",
    category: "AVENTURE",
    duration: "2 heures",
    level: "Intermédiaire",
    location: "Forêt",
    equipment: "Vélo tout-terrain, casque",
    isActive: true
  },
  {
    title: "Canoë-Kayak",
    description: "Découvrez les rivières et lacs lors d'une sortie en canoë-kayak guidée.",
    category: "AVENTURE",
    duration: "3 heures",
    level: "Intermédiaire",
    location: "Rivière",
    equipment: "Canoë/kayak, gilet de sauvetage",
    isActive: true
  },

  // Activités de Relaxation
  {
    title: "Tai Chi",
    description: "Pratiquez le Tai Chi pour améliorer votre équilibre et votre bien-être général.",
    category: "BIEN_ETRE",
    duration: "1 heure",
    level: "Tous niveaux",
    location: "Parc",
    equipment: "Tenue confortable",
    isActive: true
  },
  {
    title: "Sophrologie",
    description: "Séance de sophrologie pour apprendre à gérer le stress et les émotions.",
    category: "BIEN_ETRE",
    duration: "45 minutes",
    level: "Tous niveaux",
    location: "Centre de sophrologie",
    equipment: "Aucun",
    isActive: true
  },
  {
    title: "Qi Gong",
    description: "Pratiquez le Qi Gong pour harmoniser votre énergie vitale et améliorer votre santé.",
    category: "BIEN_ETRE",
    duration: "1 heure",
    level: "Tous niveaux",
    location: "Salle de Qi Gong",
    equipment: "Tenue confortable",
    isActive: true
  }
];

// Types d'émotions secondaires
const secondaryEmotions: { [key: string]: string[] } = {
  "Joie": ["Amusement", "Fierté", "Optimisme", "Enthousiasme", "Soulagement", "Contentement"],
  "Tristesse": ["Mélancolie", "Nostalgie", "Déception", "Chagrin", "Solitude", "Regret"],
  "Colère": ["Frustration", "Irritation", "Agacement", "Rage", "Indignation", "Exaspération"],
  "Peur": ["Anxiété", "Inquiétude", "Stress", "Panique", "Appréhension", "Nervosité"],
  "Surprise": ["Étonnement", "Stupéfaction", "Émerveillement", "Confusion", "Perplexité", "Choc"],
  "Dégoût": ["Aversion", "Répulsion", "Écœurement", "Mépris", "Répugnance", "Rejet"]
};

// Types d'émotions principales
const primaryEmotions = [
  { name: "Joie", level: 1, color: "border-yellow-500", bgColor: "bg-yellow-50" },
  { name: "Tristesse", level: 1, color: "border-blue-500", bgColor: "bg-blue-50" },
  { name: "Colère", level: 1, color: "border-red-500", bgColor: "bg-red-50" },
  { name: "Peur", level: 1, color: "border-purple-500", bgColor: "bg-purple-50" },
  { name: "Surprise", level: 1, color: "border-orange-500", bgColor: "bg-orange-50" },
  { name: "Dégoût", level: 1, color: "border-green-500", bgColor: "bg-green-50" }
];

// Création de l'utilisateur admin
const createAdminUser = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cesizen.com' },
    update: {},
    create: {
      email: 'admin@cesizen.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN'
    }
  });
  console.log('✅ Utilisateur admin créé');
  return admin;
};

async function main() {
  console.log('🌱 Début du seeding...');

  // Nettoyage des tables
  await prisma.favorite.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.stressQuestion.deleteMany();
  await prisma.userEmotion.deleteMany();
  await prisma.emotionType.deleteMany();
  await prisma.user.deleteMany();

  // Création de l'utilisateur admin
  await createAdminUser();

  // Création des questions de stress
  for (const question of stressQuestions) {
    const created = await prisma.stressQuestion.create({
      data: question
    });
    console.log(`✅ Question de stress créée : ${created.event}`);
  }

  // Création des activités
  for (const activity of activities) {
    const created = await prisma.activity.create({
      data: activity
    });
    console.log(`✅ Activité créée : ${created.title}`);
  }

  // Création des types d'émotions principales et secondaires
  const emotionTypes = [];
  for (const emotion of primaryEmotions) {
    const created = await prisma.emotionType.create({ data: emotion });
    console.log(`Emotion principale créée : ${created.name}`);
    emotionTypes.push(created);

    // Création des émotions secondaires associées
    const secondaryList = secondaryEmotions[emotion.name];
    for (const secondaryName of secondaryList) {
      const secondaryEmotion = await prisma.emotionType.create({
        data: {
          name: secondaryName,
          level: 2,
          parentId: created.id
        }
      });
      console.log(`  └─ Emotion secondaire créée : ${secondaryEmotion.name}`);
    }
  }

  console.log('🌱 Seeding terminé !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
