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

    // ÉTAPE 1: Tester d'abord si on peut récupérer l'utilisateur
    console.log("🔍 Recherche de l'utilisateur:", session.user.email);
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    console.log("✅ Utilisateur trouvé:", user.id, user.email);

    // ÉTAPE 2: Pour le moment, retourner juste les infos sans créer le ticket
    const mockTicket = {
      id: Date.now(),
      subject,
      description,
      type,
      priority: priority || "MOYENNE",
      status: "OUVERT",
      userId: user.id,
      createdAt: new Date().toISOString(),
      user: {
        name: user.name,
        email: user.email
      }
    };

    console.log("📝 Ticket simulé créé:", mockTicket);

    return NextResponse.json({ 
      message: "Ticket simulé créé avec succès (mode test)", 
      ticket: mockTicket
    });

  } catch (error) {
    console.error("❌ Erreur création ticket:", error);
    return NextResponse.json({ 
      error: "Erreur serveur", 
      details: error instanceof Error ? error.message : "Erreur inconnue" 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    console.log("🔍 Recherche des tickets pour:", session.user.email);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    console.log("✅ Utilisateur trouvé:", user.id);

    // ÉTAPE 3: Pour le moment, retourner des tickets simulés
    const mockTickets = [
      {
        id: 1,
        subject: "Test - Premier ticket",
        description: "Ceci est un ticket de test",
        type: "AIDE",
        priority: "MOYENNE",
        status: "OUVERT",
        userId: user.id,
        createdAt: new Date().toISOString(),
        user: {
          name: user.name,
          email: user.email
        }
      }
    ];

    console.log("📋 Tickets simulés retournés:", mockTickets);

    return NextResponse.json(mockTickets);

  } catch (error) {
    console.error("❌ Erreur récupération tickets:", error);
    return NextResponse.json({ 
      error: "Erreur serveur", 
      details: error instanceof Error ? error.message : "Erreur inconnue" 
    }, { status: 500 });
  }
}
