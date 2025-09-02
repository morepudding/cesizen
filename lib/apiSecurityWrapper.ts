import { NextRequest, NextResponse } from 'next/server';
import bruteForceProtector from './bruteForceProtector';
import rateLimiter from './rateLimiter';
import validateInput from '../security/InputValidator.js';

export function getClientIP(req: Request | NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0] : '127.0.0.1';
}

export function withSecurityProtection(
  handler: (req: Request) => Promise<Response>,
  options: {
    checkBruteForce?: boolean;
    validateInputs?: boolean;
    enableRateLimit?: boolean;
  } = {}
) {
  const { checkBruteForce = true, validateInputs = true, enableRateLimit = true } = options;

  return async (req: Request): Promise<Response> => {
    const clientIP = getClientIP(req);    try {
      // 🚦 Vérification rate limiting
      if (enableRateLimit) {
        const isRateLimited = rateLimiter.isRateLimited(clientIP);
        if (isRateLimited) {
          const info = rateLimiter.getClientInfo(clientIP);
          return NextResponse.json(
            { 
              error: "Trop de requêtes. Veuillez réessayer plus tard.",
              retryAfter: Math.ceil((info.resetTime - Date.now()) / 1000)
            },            { 
              status: 429,
              headers: {
                'X-RateLimit-Limit': '30',
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': info.resetTime.toString(),
                'Retry-After': Math.ceil((info.resetTime - Date.now()) / 1000).toString()
              }
            }
          );
        }
      }

      // 🛡️ Vérification brute force protection
      if (checkBruteForce) {
        const blockResult = bruteForceProtector.isBlocked(clientIP);
        if (blockResult.blocked) {
          return NextResponse.json(
            { 
              error: "Trop de tentatives. Veuillez réessayer plus tard.",
              retryAfter: blockResult.remainingTime 
            },
            { status: 429 }
          );
        }
      }      // 🛡️ Validation des inputs (pour toutes les méthodes)
      if (validateInputs) {
        // Vérifier les paramètres de requête pour toutes les méthodes
        const url = new URL(req.url);
        for (const [key, value] of url.searchParams.entries()) {
          if (validateInput.detectSQLInjection(value) || validateInput.detectXSS(value)) {
            if (checkBruteForce) {
              bruteForceProtector.recordFailedAttempt(clientIP);
            }
            return NextResponse.json(
              { error: `Caractères dangereux détectés dans le paramètre: ${key}` },
              { status: 400 }
            );
          }
        }

        // Vérifier le body pour POST/PUT/PATCH
        if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
          try {
            const body = await req.clone().json();
            
            for (const [key, value] of Object.entries(body)) {
              if (typeof value === 'string') {
                if (validateInput.detectSQLInjection(value) || validateInput.detectXSS(value)) {
                  if (checkBruteForce) {
                    bruteForceProtector.recordFailedAttempt(clientIP);
                  }
                  return NextResponse.json(
                    { error: `Caractères dangereux détectés dans le champ: ${key}` },
                    { status: 400 }
                  );
                }
              }
            }
          } catch {
            // Si pas de body JSON, continuer
          }
        }
      }      // Exécuter le handler original
      const response = await handler(req);
        // 🚦 Ajouter les headers de rate limiting à la réponse
      if (enableRateLimit) {
        const info = rateLimiter.getClientInfo(clientIP);
        response.headers.set('X-RateLimit-Limit', '50');
        response.headers.set('X-RateLimit-Remaining', info.remaining.toString());
        response.headers.set('X-RateLimit-Reset', info.resetTime.toString());
      }
      
      // 🛡️ Si succès (status 200-299), reset brute force
      if (checkBruteForce && response.status >= 200 && response.status < 300) {
        bruteForceProtector.recordSuccessfulLogin(clientIP);
      }
      
      return response;

    } catch (error) {
      if (checkBruteForce) {
        bruteForceProtector.recordFailedAttempt(clientIP);
      }
      console.error('Security wrapper error:', error);
      return NextResponse.json(
        { error: "Erreur interne du serveur" },
        { status: 500 }
      );
    }
  };
}

export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
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
