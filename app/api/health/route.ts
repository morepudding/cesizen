import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test basique de connexion base de données
    // (Tu peux ajouter une requête Prisma simple si nécessaire)
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'CESIZen',
      version: '1.0.0'
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Service check failed'
    }, { status: 500 });
  }
}
