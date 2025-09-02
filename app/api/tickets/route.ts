import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { subject, description, type, priority } = await request.json();

    // Validation simple
    if (!subject || !description || !type) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Créer le ticket
    const ticket = await prisma.ticket.create({
      data: {
        subject,
        description,
        type,
        priority: priority || "MOYENNE",
        userId: user.id
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ 
      message: "Ticket créé avec succès", 
      ticket 
    });

  } catch (error) {
    console.error("Erreur création ticket:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Récupérer les tickets de l'utilisateur
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const tickets = await prisma.ticket.findMany({
      where: { userId: user.id },
      include: {
        responses: {
          include: {
            user: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ tickets });

  } catch (error) {
    console.error("Erreur récupération tickets:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
