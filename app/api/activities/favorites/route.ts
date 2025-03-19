import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

// ✅ Ajouter une activité aux favoris
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifie si le body est bien reçu
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Erreur lors de la lecture du body :", error);
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    if (!body || !body.activityId) {
      return NextResponse.json({ error: "L'ID de l'activité est requis" }, { status: 400 });
    }

    const { activityId } = body;

    // Vérifie si l'activité existe
    const activityExists = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activityExists) {
      return NextResponse.json({ error: "L'activité demandée n'existe pas" }, { status: 404 });
    }

    // Vérifie si le favori existe déjà
    const existingFavorite = await prisma.favorite.findFirst({
      where: { 
        userId: session.user.id, 
        activityId 
      },
    });

    if (existingFavorite) {
      return NextResponse.json({ message: "L'activité est déjà en favori" }, { status: 409 });
    }

    // Ajoute le favori
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        activityId,
      },
      include: {
        activity: true,
      },
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.error("Erreur lors de l'ajout aux favoris :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}


// ✅ Récupérer les favoris de l'utilisateur
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: Number(session.user.id) },
      include: {
        activity: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
          },
        },
      },
    });

    return NextResponse.json(favorites || []); // Renvoie un tableau vide si aucun favori
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}


// ✅ Supprimer une activité des favoris
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { activityId } = await req.json();

    if (!activityId) {
      return NextResponse.json({ error: "L'ID de l'activité est requis" }, { status: 400 });
    }

    // Vérifie si le favori existe
    const existingFavorite = await prisma.favorite.findFirst({
      where: { userId: Number(session.user.id), activityId },
    });

    if (!existingFavorite) {
      return NextResponse.json({ error: "Ce favori n'existe pas" }, { status: 404 });
    }

    // Supprime le favori
    await prisma.favorite.delete({
      where: { id: existingFavorite.id },
    });

    return NextResponse.json({ message: "Favori supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du favori :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
