import { NextRequest, NextResponse } from 'next/server';

// 🚦 Rate Limiter simple en mémoire pour Next.js
class NextRateLimiter {
    private requests: Map<string, { count: number; resetTime: number }> = new Map();
    private readonly limit = 30; // 30 requêtes pour détecter le rate limiting facilement
    private readonly windowMs = 60 * 1000; // 1 minute

    isRateLimited(ip: string): boolean {
        const now = Date.now();
        const clientData = this.requests.get(ip);

        if (!clientData) {
            this.requests.set(ip, { count: 1, resetTime: now + this.windowMs });
            return false;
        }

        if (now > clientData.resetTime) {
            // Fenêtre expirée, reset
            this.requests.set(ip, { count: 1, resetTime: now + this.windowMs });
            return false;
        }

        if (clientData.count >= this.limit) {
            return true; // Rate limited
        }

        clientData.count++;
        return false;
    }

    getClientInfo(ip: string): { remaining: number; resetTime: number } {
        const clientData = this.requests.get(ip);
        if (!clientData || Date.now() > clientData.resetTime) {
            return { remaining: this.limit - 1, resetTime: Date.now() + this.windowMs };
        }
        return { 
            remaining: Math.max(0, this.limit - clientData.count),
            resetTime: clientData.resetTime 
        };
    }
}

const rateLimiter = new NextRateLimiter();

export function withRateLimit(handler: (req: NextRequest) => Promise<NextResponse>) {
    return async (req: NextRequest) => {
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        
        if (rateLimiter.isRateLimited(ip)) {
            const info = rateLimiter.getClientInfo(ip);
            const response = NextResponse.json(
                { error: 'Rate limit exceeded', retryAfter: Math.ceil((info.resetTime - Date.now()) / 1000) },
                { status: 429 }
            );
            
            response.headers.set('X-RateLimit-Limit', '100');
            response.headers.set('X-RateLimit-Remaining', '0');
            response.headers.set('X-RateLimit-Reset', info.resetTime.toString());
            
            return response;
        }

        const info = rateLimiter.getClientInfo(ip);
        const response = await handler(req);
        
        response.headers.set('X-RateLimit-Limit', '100');
        response.headers.set('X-RateLimit-Remaining', info.remaining.toString());
        response.headers.set('X-RateLimit-Reset', info.resetTime.toString());
        
        return response;
    };
}

export default rateLimiter;
