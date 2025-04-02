// seed.js
// Ce script nettoie puis peuple la base de données PostgreSQL avec des données pour les tables définies dans votre schéma Prisma.
// Assurez-vous d'avoir configuré votre fichier .env avec la variable DATABASE_URL.

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log("Test : seed.js lancé");

async function main() {
  console.log("========== Début du script seed ==========");

  // 0. Test de connexion
  try {
    await prisma.$connect();
    console.log("Connexion à la base de données établie avec succès.");
  } catch (error) {
    console.error("Erreur lors de la connexion à la base de données :", error);
    process.exit(1);
  }

  // 1. Nettoyage des anciennes données
  console.log("Nettoyage des anciennes données...");
  await prisma.favorite.deleteMany();
  await prisma.emotion.deleteMany();
  await prisma.stressResult.deleteMany();
  await prisma.pageContent.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.stressQuestion.deleteMany();
  await prisma.emotionType.deleteMany();
  await prisma.user.deleteMany();
  console.log("Anciennes données supprimées.");

  // 2. Insertion de données pour StressQuestion
  console.log("Insertion des questions de stress...");
  const stressQuestionsData = [
    { event: "Examens finaux", points: 10 },
    { event: "Entretien d'embauche", points: 8 },
    { event: "Déménagement", points: 7 },
    { event: "Présentation devant un public", points: 9 },
    { event: "Conflit au travail", points: 6 },
    { event: "Changement de carrière", points: 8 },
    { event: "Séparation", points: 10 },
    { event: "Perte d'un proche", points: 10 },
    { event: "Accident de voiture", points: 9 },
    { event: "Décision importante", points: 7 }
  ];
  await prisma.stressQuestion.createMany({ data: stressQuestionsData });
  console.log(`${stressQuestionsData.length} questions de stress insérées.`);

  // 3. Insertion de nombreux utilisateurs (avec ajout d'un admin)
  console.log("Création des utilisateurs...");
  const userInfos = [
    { email: "admin@example.com", password: "adminpassword", name: "Admin", role: "admin" }, // Utilisateur admin
    { email: "alice@example.com", password: "password", name: "Alice", role: "user" },
    { email: "bob@example.com", password: "password", name: "Bob", role: "user" },
    { email: "charlie@example.com", password: "password", name: "Charlie", role: "user" },
    { email: "david@example.com", password: "password", name: "David", role: "user" },
    { email: "eve@example.com", password: "password", name: "Eve", role: "user" },
    { email: "frank@example.com", password: "password", name: "Frank", role: "user" },
    { email: "grace@example.com", password: "password", name: "Grace", role: "user" },
    { email: "heidi@example.com", password: "password", name: "Heidi", role: "user" },
    { email: "ivan@example.com", password: "password", name: "Ivan", role: "user" },
    { email: "judy@example.com", password: "password", name: "Judy", role: "user" }
  ];
  const users = [];
  for (const info of userInfos) {
    const user = await prisma.user.create({ data: info });
    console.log(`Utilisateur créé : ${user.email} (${user.role})`);
    users.push(user);
  }
  console.log(`${users.length} utilisateurs insérés.`);

  // 4. Insertion de résultats de stress (StressResult)
  console.log("Insertion des résultats de stress...");
  const stressResultsData = [];
  for (let i = 0; i < 15; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const totalScore = Math.floor(Math.random() * 100);
    stressResultsData.push({
      userId: randomUser.id,
      totalScore: totalScore,
      createdAt: new Date()
    });
  }
  for (const res of stressResultsData) {
    await prisma.stressResult.create({ data: res });
  }
  console.log(`${stressResultsData.length} résultats de stress insérés.`);

  // 5. Insertion des types d'émotions (EmotionType) avec hiérarchie
  console.log("Insertion des types d'émotions...");
  const emotionTypes = [];

  // Types d'émotions principales
  const primaryEmotions = [
    { name: "Joie", level: 1, color: "border-yellow-500", bgColor: "bg-yellow-50" },
    { name: "Tristesse", level: 1, color: "border-blue-500", bgColor: "bg-blue-50" },
    { name: "Colère", level: 1, color: "border-red-500", bgColor: "bg-red-50" },
    { name: "Peur", level: 1, color: "border-indigo-500", bgColor: "bg-indigo-50" },
    { name: "Surprise", level: 1, color: "border-orange-500", bgColor: "bg-orange-50" },
    { name: "Dégoût", level: 1, color: "border-green-500", bgColor: "bg-green-50" }
  ];
  for (const emotion of primaryEmotions) {
    const created = await prisma.emotionType.create({ data: emotion });
    console.log(`Emotion principale créée : ${created.name}`, {
      id: created.id,
      color: created.color,
      bgColor: created.bgColor
    });
    emotionTypes.push(created);
  }

  // Sous-émotions pour "Joie"
  const joieType = emotionTypes.find(e => e.name === "Joie");
  const sousEmotionsJoie = [
    { name: "Contentement", level: 2, parentId: joieType.id },
    { name: "Fierté", level: 2, parentId: joieType.id },
    { name: "Amusement", level: 2, parentId: joieType.id }
  ];
  for (const emotion of sousEmotionsJoie) {
    const created = await prisma.emotionType.create({ data: emotion });
    console.log(`Sous-émotion de Joie créée : ${created.name}`);
    emotionTypes.push(created);
  }

  // Sous-émotions pour "Tristesse"
  const tristesseType = emotionTypes.find(e => e.name === "Tristesse");
  const sousEmotionsTristesse = [
    { name: "Chagrin", level: 2, parentId: tristesseType.id },
    { name: "Solitude", level: 2, parentId: tristesseType.id },
    { name: "Désespoir", level: 2, parentId: tristesseType.id }
  ];
  for (const emotion of sousEmotionsTristesse) {
    const created = await prisma.emotionType.create({ data: emotion });
    console.log(`Sous-émotion de Tristesse créée : ${created.name}`);
    emotionTypes.push(created);
  }

  // Sous-émotions pour "Colère"
  const colereType = emotionTypes.find(e => e.name === "Colère");
  const sousEmotionsColere = [
    { name: "Irritation", level: 2, parentId: colereType.id },
    { name: "Fureur", level: 2, parentId: colereType.id },
    { name: "Rancœur", level: 2, parentId: colereType.id }
  ];
  for (const emotion of sousEmotionsColere) {
    const created = await prisma.emotionType.create({ data: emotion });
    console.log(`Sous-émotion de Colère créée : ${created.name}`);
    emotionTypes.push(created);
  }
  console.log(`${emotionTypes.length} types d'émotions (principaux et sous-émotions) insérés.`);

  // 6. Insertion des émotions (Emotion)
  console.log("Insertion des émotions...");
  const emotionsData = [];
  for (let i = 0; i < 20; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomEmotionType = emotionTypes[Math.floor(Math.random() * emotionTypes.length)];
    emotionsData.push({
      userId: randomUser.id,
      emotionId: randomEmotionType.id,
      date: new Date(),
      comment: `Ceci est le commentaire de l'émotion numéro ${i + 1}`
    });
  }
  for (const emo of emotionsData) {
    await prisma.emotion.create({ data: emo });
  }
  console.log(`${emotionsData.length} émotions insérées.`);

  // 7. Insertion d'activités (Activity)
  console.log("Insertion des activités...");
  const activitiesData = [
    { title: "Yoga Matinal", description: "Séance de yoga pour bien démarrer la journée", category: "Bien-être", duration: "30 minutes", level: "Débutant", location: "Parc", equipment: "Tapis de yoga", isActive: true },
    { title: "Course à Pied", description: "Entraînement de course pour améliorer l'endurance", category: "Sport", duration: "45 minutes", level: "Intermédiaire", location: "Piste", equipment: "Chaussures de course", isActive: true },
    { title: "Atelier de Peinture", description: "Exprimez votre créativité avec la peinture", category: "Art", duration: "2 heures", level: "Tous niveaux", location: "Atelier", equipment: "Pinceaux et toiles", isActive: true },
    { title: "Cours de Cuisine", description: "Apprenez à cuisiner des plats délicieux", category: "Gastronomie", duration: "1h30", level: "Débutant", location: "Cuisine communautaire", equipment: "Ustensiles de cuisine", isActive: true },
    { title: "Méditation Guidée", description: "Session de méditation pour réduire le stress", category: "Bien-être", duration: "20 minutes", level: "Tous niveaux", location: "Studio", equipment: "Tapis", isActive: true },
    { title: "Danse Moderne", description: "Cours de danse pour se dépenser en s'amusant", category: "Danse", duration: "1 heure", level: "Intermédiaire", location: "Salle de danse", equipment: "Chaussures de danse", isActive: true },
    { title: "Séance de HIIT", description: "Entraînement intensif pour brûler des calories", category: "Sport", duration: "30 minutes", level: "Avancé", location: "Gym", equipment: "Aucun", isActive: true },
    { title: "Atelier d'Écriture", description: "Stimulez votre créativité littéraire", category: "Art", duration: "1 heure", level: "Tous niveaux", location: "Bibliothèque", equipment: "Cahier et stylo", isActive: true },
    { title: "Cours de Photographie", description: "Apprenez les bases de la photographie", category: "Art", duration: "2 heures", level: "Débutant", location: "Studio photo", equipment: "Appareil photo", isActive: true },
    { title: "Randonnée en Nature", description: "Découvrez la nature lors d'une randonnée", category: "Aventure", duration: "3 heures", level: "Intermédiaire", location: "Montagne", equipment: "Chaussures de randonnée", isActive: true }
  ];
  const activities = [];
  for (const activity of activitiesData) {
    const created = await prisma.activity.create({ data: activity });
    console.log(`Activité créée : ${created.title}`);
    activities.push(created);
  }
  console.log(`${activities.length} activités insérées.`);

  // 8. Insertion des favoris (Favorite)
  console.log("Insertion des favoris...");
  const favoritesData = [];
  // Pour chaque utilisateur, on sélectionne aléatoirement 1 à 3 activités à mettre en favoris
  for (const user of users) {
    const nbFav = Math.floor(Math.random() * 3) + 1;
    const shuffledActivities = activities.sort(() => 0.5 - Math.random());
    for (let i = 0; i < nbFav; i++) {
      favoritesData.push({
        userId: user.id,
        activityId: shuffledActivities[i].id,
        createdAt: new Date()
      });
    }
  }
  for (const fav of favoritesData) {
    await prisma.favorite.create({ data: fav });
  }
  console.log(`${favoritesData.length} favoris insérés.`);

  // 9. Insertion du contenu des pages (PageContent)
  console.log("Insertion des contenus des pages...");
  const pageContentsData = [
    { page: "accueil", title: "Bienvenue sur notre plateforme", content: "Découvrez un univers riche en activités et en émotions pour améliorer votre bien-être au quotidien." },
    { page: "a-propos", title: "À propos de nous", content: "Nous sommes passionnés par le développement personnel et le bien-être, et nous mettons tout en œuvre pour vous offrir la meilleure expérience possible." },
    { page: "contact", title: "Contactez-nous", content: "Pour toute question ou suggestion, n'hésitez pas à nous contacter via notre formulaire de contact." },
    { page: "faq", title: "Foire aux questions", content: "Retrouvez ici toutes les réponses aux questions fréquemment posées par notre communauté." },
    { page: "blog", title: "Notre Blog", content: "Lisez nos articles, suivez nos conseils et découvrez les dernières actualités sur le bien-être et le développement personnel." }
  ];
  for (const page of pageContentsData) {
    await prisma.pageContent.create({ data: page });
    console.log(`Contenu de la page '${page.page}' inséré.`);
  }
  console.log(`${pageContentsData.length} contenus de pages insérés.`);

  console.log("========== Toutes les données ont été insérées avec succès ! ==========");
}

main()
  .catch(e => {
    console.error("Erreur lors de l'exécution du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Déconnexion de la base de données. Fin du script seed.");
  });
