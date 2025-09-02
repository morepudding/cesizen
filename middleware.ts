import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// Import des protections
import rateLimiter from './lib/rateLimiter'

function addSecurityHeaders(response: NextResponse) {
  // Headers de sécurité critiques renforcés
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Headers de sécurité supplémentaires
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self'; " +
    "connect-src 'self'; " +
    "frame-ancestors 'none';"
  );
  
  return response;
}

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] ||
         request.headers.get('x-real-ip') ||
         '127.0.0.1';
}

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;
    const clientIP = getClientIP(req);
      // Appliquer rate limiting sur toutes les APIs sensibles
    if (pathname.startsWith('/api/')) {
      const isRateLimited = rateLimiter.isRateLimited(clientIP);
      if (isRateLimited) {
        const response = new Response('Too Many Requests - Rate limit exceeded', {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
          },
        });
        return addSecurityHeaders(NextResponse.json(
          { error: 'Too Many Requests - Rate limit exceeded' },
          { status: 429, headers: response.headers }
        ));
      }
    }
    
    // Créer la réponse
    const response = NextResponse.next();
    
    // Ajouter les headers de sécurité
    return addSecurityHeaders(response);
  },
  {    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Autoriser l'API de test sans authentification
        if (pathname.startsWith('/api/test')) {
          return true;
        }
        
        // Pour les APIs d'authentification, autoriser sans token
        if (pathname.startsWith('/api/auth')) {
          return true;
        }
        
        // Vérifier si on accède à /tracker ou ses sous-routes
        if (pathname.startsWith('/tracker')) {
          // Bloquer l'accès si pas de token (pas authentifié)
          return !!token
        }
        
        // Pour les autres routes protégées (/dashboard), autoriser si token présent
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
          return !!token
        }
        
        // Pour les autres APIs, exiger une authentification
        if (pathname.startsWith('/api/')) {
          return !!token
        }
        
        return !!token
      },
    },
  }
)

export const config = { 
  matcher: [
    "/dashboard/:path*", 
    "/tracker/:path*", 
    "/admin/:path*",
    "/api/:path*"
  ] 
}
