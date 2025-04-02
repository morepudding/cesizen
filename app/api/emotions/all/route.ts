import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const emotions = await prisma.emotionType.findMany({
      include: {
        parent: true
      },
      orderBy: { id: "asc" }, // Trier les émotions par ID
    });
    return NextResponse.json(emotions);
  } catch (error) {
    console.error("Erreur lors de la récupération de toutes les émotions :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
