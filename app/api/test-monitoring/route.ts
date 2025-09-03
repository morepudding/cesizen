import { NextResponse } from 'next/server';
import { simulateActivity } from '../../../lib/monitoring';

// Route de test pour simuler l'activité utilisateur (développement seulement)
export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only available in development' }, { status: 403 });
  }

  try {
    simulateActivity();
    return NextResponse.json({ 
      success: true, 
      message: 'Activité utilisateur simulée pendant 10 secondes'
    });
  } catch (error) {
    console.error('Erreur simulation:', error);
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Monitoring test endpoint ready' 
  });
}
