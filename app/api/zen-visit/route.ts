import { NextResponse } from 'next/server';
import { trackZenGardenVisit } from '../../../lib/monitoring';

// Endpoint pour tracker les visites du jardin zen
export async function POST() {
  try {
    trackZenGardenVisit();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur tracking zen garden:', error);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}
