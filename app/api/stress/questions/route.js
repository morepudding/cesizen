import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const questions = await prisma.stressQuestion.findMany();
    return NextResponse.json(questions);
  } catch (error) {
    console.error("❌ Erreur API /api/stress/questions :", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des questions." }, { status: 500 });
  }
}
