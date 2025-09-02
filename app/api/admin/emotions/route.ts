import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Récupérer la liste de toutes les émotions (niveaux 1 et 2)
export async function GET() {
  try {
    // ➜ Optionnel : vérifier si l'utilisateur est admin
    // const session = await getServerSession(authOptions);
    // if (!session || session.user?.role !== "ADMIN") {
    //   return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    // }

    // On récupère toutes les émotions
    // include children pour voir la hiérarchie, si tu veux
    const emotions = await prisma.emotionType.findMany({
      include: {
        parent: true,        // Voir qui est le parent
        children: true,      // Voir les sous-émotions
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(emotions);
  } catch (error) {
    console.error("❌ Erreur GET /api/admin/emotions :", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des émotions" }, { status: 500 });
  }
}

// Ajouter une nouvelle émotion
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { name, level, parentId } = await request.json();

    // Vérifier les champs requis
    if (!name || !level) {
      return NextResponse.json({ error: "Name et level sont requis" }, { status: 400 });
    }

    // level doit être 1 ou 2 (en théorie)
    // parentId est optionnel si level=1, obligatoire si level=2 ? À toi de voir la logique
    const newEmotion = await prisma.emotionType.create({
      data: {
        name,
        level,
        parentId: parentId || null, // parentId peut être null
      },
    });

    return NextResponse.json(newEmotion);
  } catch (error) {
    console.error("❌ Erreur POST /api/admin/emotions :", error);
    return NextResponse.json({ error: "Erreur lors de la création de l'émotion" }, { status: 500 });
  }
}

// Supprimer une émotion
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    // Suppression de l'émotion
    await prisma.emotionType.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Émotion supprimée." });
  } catch (error) {
    console.error("❌ Erreur DELETE /api/admin/emotions :", error);
    return NextResponse.json({ error: "Erreur lors de la suppression de l'émotion" }, { status: 500 });
  }
}
