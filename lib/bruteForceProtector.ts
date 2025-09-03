import { NextRequest, NextResponse } from 'next/server';

// 🥊 Protection Brute Force simple en mémoire pour Next.js
class NextBruteForceProtector {
    private attempts: Map<string, { count: number; lockedUntil: number; lockoutLevel: number }> = new Map();
    private readonly maxAttempts = 5;
    private readonly progressiveLockout = [1, 5, 15, 60, 240]; // minutes

    isBlocked(identifier: string): { blocked: boolean; remainingTime?: number } {
        const attemptData = this.attempts.get(identifier);
        
        if (!attemptData) {
            return { blocked: false };
        }

        const now = Date.now();
        
        if (attemptData.lockedUntil && now < attemptData.lockedUntil) {
            const remainingTime = Math.ceil((attemptData.lockedUntil - now) / 1000);
            return { blocked: true, remainingTime };
        }

        return { blocked: false };
    }

    recordFailedAttempt(identifier: string): { blocked: boolean; remainingTime?: number } {
        const now = Date.now();
        const attemptData = this.attempts.get(identifier) || { count: 0, lockedUntil: 0, lockoutLevel: 0 };
        
        attemptData.count++;
        
        if (attemptData.count >= this.maxAttempts) {
            const lockoutMinutes = this.progressiveLockout[attemptData.lockoutLevel] || 240;
            attemptData.lockedUntil = now + (lockoutMinutes * 60 * 1000);
            attemptData.lockoutLevel = Math.min(attemptData.lockoutLevel + 1, this.progressiveLockout.length - 1);
            attemptData.count = 0;
            
            this.attempts.set(identifier, attemptData);
            
            const remainingTime = Math.ceil((attemptData.lockedUntil - now) / 1000);
            return { blocked: true, remainingTime };
        }
        
        this.attempts.set(identifier, attemptData);
        return { blocked: false };
    }

    recordSuccessfulLogin(identifier: string): void {
        this.attempts.delete(identifier);
    }

    getRemainingAttempts(identifier: string): number {
        const attemptData = this.attempts.get(identifier);
        if (!attemptData) return this.maxAttempts;
        
        return Math.max(0, this.maxAttempts - attemptData.count);
    }
}

const bruteForceProtector = new NextBruteForceProtector();

export function withBruteForceProtection(handler: (req: NextRequest) => Promise<NextResponse>) {
    return async (req: NextRequest) => {
        // Appliquer seulement aux tentatives de connexion
        if (req.method === 'POST' && req.url.includes('/auth/signin')) {
            const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
            
            const blockCheck = bruteForceProtector.isBlocked(ip);
            if (blockCheck.blocked) {
                return NextResponse.json(
                    { 
                        error: 'Too many login attempts',
                        message: `Account locked. Try again in ${blockCheck.remainingTime} seconds`,
                        lockoutRemaining: blockCheck.remainingTime
                    },
                    { status: 429 }
                );
            }
            
            // Continuer avec la requête originale
            const response = await handler(req);
            
            // Si la connexion échoue (401), enregistrer la tentative
            if (response.status === 401 || response.status === 400) {
                const result = bruteForceProtector.recordFailedAttempt(ip);
                if (result.blocked) {
                    return NextResponse.json(
                        { 
                            error: 'Too many login attempts',
                            message: `Account locked after failed attempts. Try again in ${result.remainingTime} seconds`,
                            lockoutRemaining: result.remainingTime
                        },
                        { status: 429 }
                    );
                }
            }
            
            // Si la connexion réussit (200), nettoyer les tentatives
            if (response.status === 200) {
                bruteForceProtector.recordSuccessfulLogin(ip);
            }
            
            return response;
        }
        
        return handler(req);
    };
}

export default bruteForceProtector;
