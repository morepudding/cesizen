// ===== HELPER DE MONITORING CESIZEN =====
// Fonctions utilitaires pour instrumenter l'application

import {
  incrementHttpRequests,
  recordHttpDuration,
  incrementUserSignups,
  incrementUserLogins,
  incrementActivitiesCreated,
  incrementZenGardenVisits,
  incrementStressTestsCompleted,
  incrementErrors
} from '../app/api/metrics/route';

// Mesurer automatiquement les requêtes HTTP
export function instrumentHttpRequest(method: string, path: string, statusCode: number, duration: number) {
  incrementHttpRequests(method, path, statusCode);
  recordHttpDuration(method, path, statusCode, duration);
}

// Tracker les événements business
export function trackUserSignup() {
  incrementUserSignups();
  console.log('📈 Métrique: Nouveau signup utilisateur');
}

export function trackUserLogin(success: boolean) {
  incrementUserLogins(success);
  console.log(`📈 Métrique: Connexion ${success ? 'réussie' : 'échouée'}`);
}

export function trackActivityCreated() {
  incrementActivitiesCreated();
  console.log('📈 Métrique: Nouvelle activité créée');
}

export function trackZenGardenVisit() {
  incrementZenGardenVisits();
  console.log('📈 Métrique: Visite du jardin zen');
}

export function trackStressTestCompleted() {
  incrementStressTestsCompleted();
  console.log('📈 Métrique: Test de stress terminé');
}

export function trackError(errorType: string) {
  incrementErrors(errorType);
  console.log(`🚨 Métrique: Erreur ${errorType}`);
}

// Helper pour mesurer la durée d'une fonction
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = (Date.now() - start) / 1000;
    console.log(`⏱️ ${name} exécuté en ${duration}s`);
    return result;
  } catch (error) {
    trackError(name + '_error');
    throw error;
  }
}

// Simuler de l'activité pour tester (développement seulement)
export function simulateActivity() {
  if (process.env.NODE_ENV !== 'development') return;
  
  console.log('🎯 Simulation d\'activité utilisateur...');
  
  // Simuler des signups
  for (let i = 0; i < 3; i++) {
    setTimeout(() => trackUserSignup(), i * 1000);
  }
  
  // Simuler des connexions
  setTimeout(() => trackUserLogin(true), 2000);
  setTimeout(() => trackUserLogin(true), 3000);
  setTimeout(() => trackUserLogin(false), 4000);
  
  // Simuler des activités
  setTimeout(() => trackActivityCreated(), 5000);
  setTimeout(() => trackActivityCreated(), 6000);
  
  // Simuler des visites zen garden
  setTimeout(() => trackZenGardenVisit(), 7000);
  setTimeout(() => trackZenGardenVisit(), 8000);
  setTimeout(() => trackZenGardenVisit(), 9000);
  
  // Simuler des tests de stress
  setTimeout(() => trackStressTestCompleted(), 10000);
  
  console.log('✅ Simulation terminée dans 10 secondes');
}
