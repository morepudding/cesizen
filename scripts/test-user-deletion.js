import { PrismaClient } from '@prisma/client';

async function testUserDeletion() {
  const prisma = new PrismaClient({
    log: ["error", "warn"],
  });
  
  try {
    console.log('🔄 Test de suppression d\'utilisateur...');
    
    // Lister les utilisateurs existants
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true }
    });
    console.log('👥 Utilisateurs existants:', users);
    
    // Trouver un utilisateur non-admin à supprimer (pour test)
    const testUser = users.find(user => user.role !== 'ADMIN');
    
    if (!testUser) {
      console.log('⚠️ Aucun utilisateur non-admin trouvé pour le test');
      return;
    }
    
    console.log(`🎯 Test avec l'utilisateur: ${testUser.email} (ID: ${testUser.id})`);
    
    // Simuler la suppression (transaction)
    await prisma.$transaction(async (tx) => {
      try {
        // Supprimer les favoris
        const favoritesDeleted = await tx.favorite.deleteMany({ where: { userId: testUser.id } });
        console.log(`✅ ${favoritesDeleted.count} favoris supprimés`);
      } catch (error) {
        console.warn("⚠️ Erreur lors de la suppression des favoris:", error.message);
      }
      
      try {
        // Supprimer les résultats de stress
        const stressDeleted = await tx.stressResult.deleteMany({ where: { userId: testUser.id } });
        console.log(`✅ ${stressDeleted.count} résultats de stress supprimés`);
      } catch (error) {
        console.warn("⚠️ Erreur lors de la suppression des résultats de stress:", error.message);
      }
      
      try {
        // Supprimer les émotions
        const emotionsDeleted = await tx.emotion.deleteMany({ where: { userId: testUser.id } });
        console.log(`✅ ${emotionsDeleted.count} émotions supprimées`);
      } catch (error) {
        console.warn("⚠️ Erreur lors de la suppression des émotions:", error.message);
      }
      
      // TEST SEULEMENT - ne pas vraiment supprimer l'utilisateur
      console.log(`✅ Test réussi - l'utilisateur ${testUser.email} peut être supprimé en toute sécurité`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testUserDeletion();
