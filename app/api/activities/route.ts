import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackActivityCreated } from "../../../lib/monitoring";

// ✅ Récupérer toutes les activités
export async function GET() {
  try {
    const activities = await prisma.activity.findMany();
    return NextResponse.json(activities);
  } catch (error) {
    console.error("Erreur lors de la récupération des activités :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// ✅ Ajouter une activité (ADMIN uniquement)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, category } = body;

    if (!title || !description || !category) {
      return NextResponse.json({ error: "Données incomplètes" }, { status: 400 });
    }

    const newActivity = await prisma.activity.create({
      data: { title, description, category },
    });

    // 📈 Tracker la création d'activité pour les métriques
    trackActivityCreated();

    return NextResponse.json(newActivity);
  } catch (error) {
    console.error("Erreur lors de l'ajout d'une activité :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
