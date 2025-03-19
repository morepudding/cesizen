import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const url = new URL(req.url);
  const filter = url.searchParams.get("filter");

  let dateFilter = {};

  if (filter === "day") {
    dateFilter = { gte: new Date(new Date().setHours(0, 0, 0, 0)) };
  } else if (filter === "week") {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    dateFilter = { gte: weekStart };
  } else if (filter === "month") {
    const monthStart = new Date();
    monthStart.setDate(1);
    dateFilter = { gte: monthStart };
  }

  const emotions = await prisma.emotion.findMany({
    where: {
      userId: session.user.id,
      date: dateFilter,
    },
    include: { emotionType: true }, // ✅ Ajout pour inclure les détails de l’émotion
    orderBy: { date: "desc" },
  });

  return NextResponse.json(emotions);
}


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { emotionId, comment } = body; // Récupère le commentaire

    if (!emotionId) {
      return NextResponse.json({ error: "L'émotion est requise" }, { status: 400 });
    }

    const newEmotion = await prisma.emotion.create({
      data: {
        emotionId: emotionId,
        userId: session.user?.id,
        comment: comment || null, // Inclure le commentaire facultatif
      },
      include: { emotionType: true },
    });

    return NextResponse.json(newEmotion);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'émotion :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
