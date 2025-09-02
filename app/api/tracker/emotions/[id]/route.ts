import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const emotionId = parseInt(params.id);
    if (isNaN(emotionId)) {
      return new NextResponse("ID d'émotion invalide", { status: 400 });
    }

    // Vérifier que l'émotion appartient bien à l'utilisateur
    const emotion = await prisma.emotion.findFirst({
      where: {
        id: emotionId,
        userId: Number(session.user.id),
      },
    });

    if (!emotion) {
      return new NextResponse("Émotion non trouvée", { status: 404 });
    }

    // Supprimer l'émotion
    await prisma.emotion.delete({
      where: {
        id: emotionId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de l'émotion :", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
} 