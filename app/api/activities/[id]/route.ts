import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ Récupérer une activité par ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const activityId = Number(params.id);

    if (isNaN(activityId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      return NextResponse.json({ error: "Activité non trouvée" }, { status: 404 });
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'activité :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
