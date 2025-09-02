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
  // Joie (level 1)
  { id: 1, name: 'Joie', color: 'border-yellow-500' },
  { id: 2, name: 'Amusement', color: null },
  { id: 3, name: 'Fierté', color: null },
  { id: 4, name: 'Optimisme', color: null },
  { id: 5, name: 'Enthousiasme', color: null },
  { id: 6, name: 'Soulagement', color: null },
  { id: 7, name: 'Contentement', color: null },
  
  // Tristesse (level 1)
  { id: 8, name: 'Tristesse', color: 'border-blue-500' },
  { id: 9, name: 'Mélancolie', color: null },
  { id: 10, name: 'Nostalgie', color: null },
  { id: 11, name: 'Déception', color: null },
  { id: 12, name: 'Chagrin', color: null },
  { id: 13, name: 'Solitude', color: null },
  { id: 14, name: 'Regret', color: null },
  
  // Colère (level 1)
  { id: 15, name: 'Colère', color: 'border-red-500' },
  { id: 16, name: 'Frustration', color: null },
  { id: 17, name: 'Irritation', color: null },
  { id: 18, name: 'Agacement', color: null },
  { id: 19, name: 'Rage', color: null },
  { id: 20, name: 'Indignation', color: null },
  { id: 21, name: 'Exaspération', color: null },
  
  // Peur (level 1)
  { id: 22, name: 'Peur', color: 'border-purple-500' },
  { id: 23, name: 'Anxiété', color: null },
  { id: 24, name: 'Inquiétude', color: null },
  { id: 25, name: 'Stress', color: null },
  { id: 26, name: 'Panique', color: null },
  { id: 27, name: 'Appréhension', color: null },
  { id: 28, name: 'Nervosité', color: null },
  
  // Surprise (level 1)
  { id: 29, name: 'Surprise', color: 'border-orange-500' },
  { id: 30, name: 'Étonnement', color: null },
  { id: 31, name: 'Stupéfaction', color: null },
  { id: 32, name: 'Émerveillement', color: null },
  { id: 33, name: 'Confusion', color: null },
  { id: 34, name: 'Perplexité', color: null },
  { id: 35, name: 'Choc', color: null },
  
  // Dégoût (level 1)
  { id: 36, name: 'Dégoût', color: 'border-green-500' },
  { id: 37, name: 'Aversion', color: null },
  { id: 38, name: 'Répulsion', color: null },
  { id: 39, name: 'Écœurement', color: null },
  { id: 40, name: 'Mépris', color: null },
  { id: 41, name: 'Répugnance', color: null },
  { id: 42, name: 'Rejet', color: null },
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
