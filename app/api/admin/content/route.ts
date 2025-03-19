import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

// ✅ Récupérer le contenu d'une page
export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = url.searchParams.get("page");

  if (!page) return NextResponse.json({ error: "Page requise" }, { status: 400 });

  const content = await prisma.pageContent.findUnique({
    where: { page },
  });

  return NextResponse.json(content || { page, title: "", content: "" });
}

// ✅ Modifier le contenu d'une page
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { page, title, content } = await req.json();
  if (!page || !title || !content) {
    return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
  }

  const updatedContent = await prisma.pageContent.upsert({
    where: { page },
    update: { title, content },
    create: { page, title, content },
  });

  return NextResponse.json(updatedContent);
}
