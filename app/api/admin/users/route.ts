import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }

  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function DELETE(req: Request) {
  try {
    // Vérification de l'authentification et des permissions
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const body = await req.json();
    const { id } = body;

    // Validation de l'ID
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "ID utilisateur invalide" }, { status: 400 });
    }

    const userId = Number(id);

    // Vérifier que l'utilisateur existe avant de le supprimer
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Empêcher la suppression de son propre compte
    if (session.user.id === userId.toString()) {
      return NextResponse.json({ error: "Vous ne pouvez pas supprimer votre propre compte" }, { status: 400 });
    }

    // Supprimer l'utilisateur et toutes ses données associées dans une transaction
    await prisma.$transaction(async (tx) => {
      try {
        // Supprimer les favoris
        await tx.favorite.deleteMany({ where: { userId } });
      } catch (error) {
        console.warn("Erreur lors de la suppression des favoris:", error);
      }
      
      try {
        // Supprimer les résultats de stress
        await tx.stressResult.deleteMany({ where: { userId } });
      } catch (error) {
        console.warn("Erreur lors de la suppression des résultats de stress:", error);
      }
      
      try {
        // Supprimer les émotions
        await tx.emotion.deleteMany({ where: { userId } });
      } catch (error) {
        console.warn("Erreur lors de la suppression des émotions:", error);
      }
      
      // Enfin, supprimer l'utilisateur
      await tx.user.delete({ where: { id: userId } });
    });
    
    return NextResponse.json({ message: "Utilisateur supprimé avec succès." });

  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur lors de la suppression" }, 
      { status: 500 }
    );
  }
}
