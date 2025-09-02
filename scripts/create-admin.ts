import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Création des utilisateurs admin...');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  // Admin 1 (existant)
  const admin1 = await prisma.user.upsert({
    where: { email: 'admin@cesizen.com' },
    update: {
      password: hashedPassword,
      role: 'ADMIN'
    },
    create: {
      email: 'admin@cesizen.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN'
    }
  });

  // Admin 2 (nouveau)
  const admin2 = await prisma.user.upsert({
    where: { email: 'admin1@cesizen.com' },
    update: {
      password: hashedPassword,
      role: 'ADMIN'
    },
    create: {
      email: 'admin1@cesizen.com',
      password: hashedPassword,
      name: 'Admin 1',
      role: 'ADMIN'
    }
  });

  console.log('✅ Utilisateurs admin créés avec succès !');
  console.log(`📧 Admin 1: ${admin1.email} | Nom: ${admin1.name}`);
  console.log(`📧 Admin 2: ${admin2.email} | Nom: ${admin2.name}`);
  console.log('🔑 Mot de passe pour les deux: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });