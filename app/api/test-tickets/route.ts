import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// API de test simple pour vérifier la connexion
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Test simple pour voir si l'authentification marche
    return NextResponse.json({ 
      message: "API test réussie",
      user: {
        email: session.user.email,
        name: session.user.name,
        role: session.user.role
      }
    });

  } catch (error) {
    console.error("Erreur API test:", error);
    return NextResponse.json({ 
      error: "Erreur serveur", 
      details: error instanceof Error ? error.message : "Erreur inconnue" 
    }, { status: 500 });
  }
}
