import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { withSecurityProtection } from "@/lib/apiSecurityWrapper";
import validateInput from "@/security/InputValidator.js";

async function registerHandler(req: Request) {
  const { email, name, password } = await req.json();

  // 🛡️ Validation supplémentaire des emails
  if (!email || !email.includes('@')) {
    return NextResponse.json(
      { error: "Email invalide" },
      { status: 400 }
    );
  }

  // Sanitisation supplémentaire
  const sanitizedEmail = validateInput.sanitizeString(email).toLowerCase().trim();
  const sanitizedName = validateInput.sanitizeString(name).trim();
  const sanitizedPassword = validateInput.sanitizeString(password);

  if (!sanitizedEmail || !sanitizedName || !sanitizedPassword) {
    return NextResponse.json(
      { error: "Données invalides. Veuillez vérifier vos informations." },
      { status: 400 }
    );
  }

  // Vérifier si l'email existe déjà
  const existingUser = await prisma.user.findUnique({ where: { email: sanitizedEmail } });
  if (existingUser) {
    return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 400 });
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);

  // Créer l'utilisateur
  await prisma.user.create({
    data: {
      email: sanitizedEmail,
      name: sanitizedName,
      password: hashedPassword,
      role: "USER", // Tous les nouveaux utilisateurs ont le rôle "USER" par défaut
    },
  });

  return NextResponse.json({ message: "Inscription réussie !" });
}

// ✅ Création d'un nouvel utilisateur avec protections de sécurité
export const POST = withSecurityProtection(registerHandler);
