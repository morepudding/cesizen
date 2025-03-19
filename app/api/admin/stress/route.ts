import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

// ✅ Récupérer toutes les questions
export async function GET() {
  const questions = await prisma.stressQuestion.findMany();
  return NextResponse.json(questions);
}

// ✅ Ajouter une nouvelle question
export async function POST(req: Request) {
  const { event, points } = await req.json();

  if (!event || !points) {
    return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
  }

  const newQuestion = await prisma.stressQuestion.create({
    data: { event, points },
  });

  return NextResponse.json(newQuestion);
}

// ✅ Supprimer une question
export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  await prisma.stressQuestion.delete({ where: { id: Number(id) } });

  return NextResponse.json({ message: "Question supprimée." });
}
