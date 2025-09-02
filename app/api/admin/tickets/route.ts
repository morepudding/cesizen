import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Récupérer tous les tickets (pour les admins)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    console.log("🔍 Admin récupération de tous les tickets");

    // Pour le moment, utilisons des tickets simulés
    const mockTickets = [
      {
        id: 1,
        subject: "Problème de connexion",
        description: "Je n'arrive pas à me connecter à mon compte",
        type: "AIDE",
        priority: "HAUTE",
        status: "OUVERT",
        createdAt: "2025-01-15T10:30:00.000Z",
        updatedAt: "2025-01-15T10:30:00.000Z",
        userId: 1,
        user: {
          name: "Jean Dupont",
          email: "jean.dupont@example.com"
        }
      },
      {
        id: 2,
        subject: "Bug dans le tracker d'émotions",
        description: "L'application plante quand je sauvegarde mes émotions",
        type: "BUG",
        priority: "MOYENNE",
        status: "EN_COURS",
        createdAt: "2025-01-14T14:20:00.000Z",
        updatedAt: "2025-01-14T16:45:00.000Z",
        userId: 2,
        user: {
          name: "Marie Martin",
          email: "marie.martin@example.com"
        }
      },
      {
        id: 3,
        subject: "Suggestion d'amélioration",
        description: "Serait-il possible d'ajouter plus d'activités de méditation ?",
        type: "SUGGESTION",
        priority: "BASSE",
        status: "RESOLU",
        createdAt: "2025-01-13T09:15:00.000Z",
        updatedAt: "2025-01-13T17:30:00.000Z",
        userId: 3,
        user: {
          name: "Pierre Durand",
          email: "pierre.durand@example.com"
        }
      }
    ];

    console.log("📋 Retour de", mockTickets.length, "tickets simulés");

    return NextResponse.json(mockTickets);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des tickets:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Mettre à jour le statut d'un ticket
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "ID et statut requis" }, { status: 400 });
    }

    const validStatuses = ["OUVERT", "EN_COURS", "RESOLU", "FERME"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    console.log("🔄 Mise à jour du ticket", id, "vers le statut", status);

    // Pour le moment, simuler la mise à jour
    const mockUpdatedTicket = {
      id: parseInt(id),
      status,
      updatedAt: new Date().toISOString(),
    };

    console.log("✅ Ticket mis à jour (simulation):", mockUpdatedTicket);

    return NextResponse.json(mockUpdatedTicket);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du ticket:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Supprimer un ticket (optionnel)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    console.log("🗑️ Suppression du ticket", id, "(simulation)");

    // Pour le moment, simuler la suppression
    return NextResponse.json({ message: "Ticket supprimé avec succès (simulation)" });
  } catch (error) {
    console.error("Erreur lors de la suppression du ticket:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
