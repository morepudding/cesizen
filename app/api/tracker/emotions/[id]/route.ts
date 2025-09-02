import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { emotionsStore } from "@/lib/emotionsStore";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    // TEMPORAIRE: Désactivation auth pour test local
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    // }

    const userId = session?.user?.id || "1"; // User par défaut pour test

    const emotionId = parseInt(params.id);
    if (isNaN(emotionId)) {
      return new NextResponse("ID d'émotion invalide", { status: 400 });
    }

    // Trouver l'index de l'émotion à supprimer
    const emotionIndex = emotionsStore.findIndex(emotion => 
      emotion.id === emotionId && emotion.userId === Number(userId)
    );

    if (emotionIndex === -1) {
      return new NextResponse("Émotion non trouvée", { status: 404 });
    }

    // Supprimer l'émotion du store
    const deletedEmotion = emotionsStore.splice(emotionIndex, 1)[0];

    console.log(`Émotion supprimée pour user ${userId}:`, deletedEmotion);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de l'émotion :", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
} 