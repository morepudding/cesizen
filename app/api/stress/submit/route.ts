  import { NextResponse } from "next/server";
  import { prisma } from "@/lib/prisma";

  export async function POST(request: Request) {
    try {
      const { selectedEvents } = await request.json();

      // Vérifier que des événements ont été sélectionnés
      if (!selectedEvents || selectedEvents.length === 0) {
        return NextResponse.json({ error: "Aucun événement sélectionné." }, { status: 400 });
      }

      // Récupérer les points des événements sélectionnés
      const questions = await prisma.stressQuestion.findMany({
        where: { id: { in: selectedEvents } },
        select: { points: true },
      });

      // Calcul du score total
      const totalScore = questions.reduce((sum: number, q: { points: number }) => sum + q.points, 0);

      return NextResponse.json({ totalScore });
    } catch (error) {
      console.error("❌ Erreur API /api/stress/submit :", error);
      return NextResponse.json({ error: "Erreur lors de la soumission du test." }, { status: 500 });
    }
  }
