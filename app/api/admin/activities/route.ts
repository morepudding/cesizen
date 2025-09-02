import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// ✅ Créer une activité
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, category, duration, level, location, equipment } = body;

    if (!title || !description || !category || !duration || !level || !location) {
      return NextResponse.json({ error: "Tous les champs obligatoires doivent être remplis" }, { status: 400 });
    }

    const activity = await prisma.activity.create({
      data: { title, description, category, duration, level, location, equipment, isActive: true },
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Erreur lors de la création de l'activité :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// ✅ Modifier une activité
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await req.json();
    const { id, title, description, category, duration, level, location, equipment } = body;

    if (!id || !title || !description || !category || !duration || !level || !location) {
      return NextResponse.json({ error: "Tous les champs obligatoires doivent être remplis" }, { status: 400 });
    }

    const updatedActivity = await prisma.activity.update({
      where: { id },
      data: { title, description, category, duration, level, location, equipment },
    });

    return NextResponse.json(updatedActivity);
  } catch (error) {
    console.error("Erreur lors de la modification de l'activité :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// ✅ Désactiver une activité
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "L'ID de l'activité est requis" }, { status: 400 });
    }

    const disabledActivity = await prisma.activity.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json(disabledActivity);
  } catch (error) {
    console.error("Erreur lors de la désactivation de l'activité :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// ✅ Récupérer toutes les activités
export async function GET() {
  const activities = await prisma.activity.findMany();
  return NextResponse.json(activities);
}


export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "L'ID de l'activité est requis" }, { status: 400 });
    }

    await prisma.activity.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Activité supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'activité :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}