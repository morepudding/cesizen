import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    console.log("=== START GET /api/tracker/emotions ===");
    console.log("Prisma client:", prisma ? "Available" : "UNDEFINED");
    
    const session = await getServerSession(authOptions);
    console.log("Session:", session ? "Found" : "Not found");
    
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    console.log("Session user ID:", session.user.id);

    const url = new URL(req.url);
    const filter = url.searchParams.get("filter");
    console.log("Filter parameter:", filter);

    let dateFilter = {};

    if (filter === "day") {
      dateFilter = { gte: new Date(new Date().setHours(0, 0, 0, 0)) };
    } else if (filter === "week") {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      dateFilter = { gte: weekStart };
    } else if (filter === "month") {
      const monthStart = new Date();
      monthStart.setDate(1);
      dateFilter = { gte: monthStart };
    }

    console.log("Date filter:", dateFilter);
    console.log("Looking for emotions with userId:", Number(session.user.id));

    // Test basic connection to database first
    console.log("Testing database connection...");
    const userCount = await prisma.user.count();
    console.log("Database connection OK. User count:", userCount);

    console.log("Trying to fetch emotions...");
    const emotions = await (prisma as any).userEmotion.findMany({
      where: {
        userId: Number(session.user.id),
        date: dateFilter,
      },
      include: { 
        emotionType: {
          include: {
            parent: true
          }
        }
      },
      orderBy: { date: "desc" },
    });

    console.log("Émotions récupérées:", emotions);
    console.log("=== END GET /api/tracker/emotions ===");
    return NextResponse.json(emotions);
  } catch (error) {
    console.error("=== ERROR in GET /api/tracker/emotions ===");
    console.error("Error details:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session?.user?.id) {
      console.log("No user ID in session");
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: Number(session.user.id) }
    });

    if (!user) {
      console.log("User not found in database");
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const body = await req.json();
    console.log("Request body:", body);
    const { emotionId, comment } = body;

    if (!emotionId) {
      return NextResponse.json({ error: "L'émotion est requise" }, { status: 400 });
    }

    console.log("Creating emotion with:", {
      emotionId: Number(emotionId),
      userId: Number(session.user.id),
      comment: comment || null
    });

    const newEmotion = await (prisma as any).userEmotion.create({
      data: {
        emotionId: Number(emotionId),
        userId: Number(session.user.id),
        comment: comment || null,
      },
      include: { 
        emotionType: {
          include: {
            parent: true
          }
        }
      },
    });

    return NextResponse.json(newEmotion);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'émotion :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
