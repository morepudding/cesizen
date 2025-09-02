import { NextResponse } from "next/server";
import { withSecurityProtection } from "@/lib/apiSecurityWrapper";

// � Handler pour les tests de sécurité - GET
async function handleGET(req: Request) {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const search = searchParams.get('search');
    const testParam = searchParams.get('req') || searchParams.get('dos') || searchParams.get('id');
    
    // Simuler une réponse normale
    return NextResponse.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        test_param: testParam,
        search: search 
    });
}

// 🚦 Handler pour les tests de sécurité - POST
async function handlePOST(req: Request) {
    try {
        const body = await req.json();
        
        // Route de test pour validation des entrées
        return NextResponse.json({ 
            status: 'ok',
            received: body,
            timestamp: new Date().toISOString()
        });
    } catch {
        return NextResponse.json(
            { error: 'Invalid JSON' }, 
            { status: 400 }
        );
    }
}

// Export avec protections de sécurité complètes
export const GET = withSecurityProtection(handleGET);
export const POST = withSecurityProtection(handlePOST);
