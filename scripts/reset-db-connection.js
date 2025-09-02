import { PrismaClient } from '@prisma/client';

async function resetConnection() {
  const prisma = new PrismaClient();
  
  try {
    // Fermer toutes les connexions existantes
    await prisma.$disconnect();
    console.log('✅ Connexions Prisma fermées avec succès');
    
    // Reconnecter
    await prisma.$connect();
    console.log('✅ Reconnexion à la base de données réussie');
    
    // Test simple
    const userCount = await prisma.user.count();
    console.log(`✅ Test de connexion réussi - ${userCount} utilisateurs trouvés`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetConnection();
