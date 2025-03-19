import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../../../../lib/email";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "Aucun compte trouvé avec cet email." }, { status: 404 });
  }

  // Générer un token de réinitialisation
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpires = new Date(Date.now() + 3600000); // Expire en 1h

  await prisma.user.update({
    where: { email },
    data: { resetToken, resetTokenExpires },
  });

  // 📧 Envoyer l'email avec le lien de réinitialisation
  await sendResetPasswordEmail(email, resetToken);

  return NextResponse.json({ message: "Un email a été envoyé pour réinitialiser votre mot de passe." });
}
