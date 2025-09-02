import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { emotionsStore, incrementNextId, EMOTION_TYPES } from "@/lib/emotionsStore";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // TEMPORAIRE: Désactivation auth pour test local
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    // }

    const userId = session?.user?.id || "1"; // User par défaut pour test

    // Filtrer par utilisateur
    const userEmotions = emotionsStore.filter(emotion => 
      emotion.userId === Number(userId)
    );

    console.log(`Émotions récupérées pour user ${userId}:`, userEmotions.length);
    return NextResponse.json(userEmotions);
  } catch (error) {
    console.error("Erreur dans GET /api/tracker/emotions:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // TEMPORAIRE: Désactivation auth pour test local
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    // }

    const userId = session?.user?.id || "1"; // User par défaut pour test

    const body = await req.json();
    const { emotionId, comment } = body;

    if (!emotionId) {
      return NextResponse.json({ error: "L'émotion est requise" }, { status: 400 });
    }

    // Trouver le type d'émotion
    const emotionType = EMOTION_TYPES.find(et => et.id === Number(emotionId));
    if (!emotionType) {
      return NextResponse.json({ error: "Type d'émotion invalide" }, { status: 400 });
    }

    // Créer nouvelle émotion
    const newEmotion = {
      id: incrementNextId(),
      userId: Number(userId),
      emotionId: Number(emotionId),
      comment: comment || null,
      date: new Date().toISOString(),
      emotionType: emotionType
    };

    // Ajouter au store
    emotionsStore.push(newEmotion);

    console.log(`Émotion ajoutée pour user ${userId}:`, newEmotion);
    return NextResponse.json(newEmotion);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'émotion:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // TEMPORAIRE: Désactivation auth pour test local
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    // }

    const userId = session?.user?.id || "1"; // User par défaut pour test

    // Récupérer l'ID de l'émotion à supprimer depuis l'URL ou le body
    const url = new URL(req.url);
    const emotionIdToDelete = url.searchParams.get('id');
    
    if (!emotionIdToDelete) {
      // Essayer de récupérer l'ID depuis le body
      const body = await req.json().catch(() => ({}));
      const id = body.id;
      
      if (!id) {
        return NextResponse.json({ error: "ID de l'émotion requis" }, { status: 400 });
      }
    }

    const targetId = emotionIdToDelete || (await req.json()).id;
    
    // Trouver l'index de l'émotion à supprimer
    const emotionIndex = emotionsStore.findIndex(emotion => 
      emotion.id === Number(targetId) && emotion.userId === Number(userId)
    );

    if (emotionIndex === -1) {
      return NextResponse.json({ error: "Émotion non trouvée" }, { status: 404 });
    }

    // Supprimer l'émotion du store
    const deletedEmotion = emotionsStore.splice(emotionIndex, 1)[0];

    console.log(`Émotion supprimée pour user ${userId}:`, deletedEmotion);
    return NextResponse.json({ message: "Émotion supprimée avec succès", emotion: deletedEmotion });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'émotion:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
