import { NextRequest, NextResponse } from 'next/server';
import { httpRequestDuration, httpRequestsTotal, errorsTotal } from './app/api/metrics/route';

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Ignorer les ressources statiques et le endpoint metrics
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/metrics') ||
    pathname.includes('.') // fichiers statiques
  ) {
    return NextResponse.next();
  }

  let response: NextResponse;
  let statusCode = 200;

  try {
    // Continuer avec la requête
    response = NextResponse.next();
    
    // Récupérer le code de statut de la réponse
    response.headers.set('x-middleware-cache', 'no-cache');
    statusCode = response.status;

  } catch (error) {
    // En cas d'erreur dans le middleware
    console.error('Middleware error:', error);
    statusCode = 500;
    
    // Compteur d'erreurs
    errorsTotal.inc({
      error_type: 'middleware_error',
      route: pathname
    });
    
    response = new NextResponse('Internal Server Error', { status: 500 });
  }

  // Mesurer le temps de réponse
  const duration = (Date.now() - startTime) / 1000;
  
  // Enregistrer les métriques
  httpRequestDuration.observe(
    {
      method: method,
      route: pathname,
      status_code: statusCode.toString()
    },
    duration
  );

  httpRequestsTotal.inc({
    method: method,
    route: pathname,
    status_code: statusCode.toString()
  });

  return response;
}

// Configuration des routes à surveiller
export const config = {
  matcher: [
    /*
     * Surveiller toutes les routes sauf :
     * - api/metrics (éviter la boucle)
     * - _next/static (fichiers statiques)
     * - favicon.ico et autres assets
     */
    '/((?!_next/static|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)',
  ],
};
