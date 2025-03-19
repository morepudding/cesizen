import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log("✅ Creating admin...");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.user.create({
      data: {
        email: "admin@cesizen.com",
        name: "Admin",
        password: hashedPassword,
        role: "admin",  // ✅ Supprimé `updatedAt`, Prisma le mettra à jour automatiquement
      },
    });

    console.log("🎉 Admin user created successfully:", admin);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
