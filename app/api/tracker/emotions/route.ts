import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// API SIMPLE - Stockage temporaire en mémoire (sera remplacé par la BDD plus tard)
const emotionsStore: Array<{
  id: number;
  userId: number;
  emotionId: number;
  comment: string | null;
  date: string;
  emotionType: { id: number; name: string; color: string | null; };
}> = [];

let nextId = 1;

// Liste des types d'émotions hardcodés pour éviter les problèmes Prisma
const EMOTION_TYPES = [
  { id: 1, name: 'Joie', color: 'border-yellow-500' },
  { id: 2, name: 'Amusement', color: null },
  { id: 3, name: 'Fierté', color: null },
  { id: 8, name: 'Tristesse', color: 'border-blue-500' },
  { id: 9, name: 'Mélancolie', color: null },
  { id: 15, name: 'Colère', color: 'border-red-500' },
  { id: 16, name: 'Frustration', color: null },
  { id: 22, name: 'Peur', color: 'border-purple-500' },
  { id: 23, name: 'Anxiété', color: null },
  { id: 29, name: 'Surprise', color: 'border-orange-500' },
  { id: 36, name: 'Dégoût', color: 'border-green-500' },
];

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
      id: nextId++,
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
