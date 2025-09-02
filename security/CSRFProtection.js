import crypto from 'crypto';

class CSRFProtection {
    constructor() {
        this.tokenStore = new Map();
        this.tokenLifetime = 3600000; // 1 heure
    }

    generateToken(sessionId) {
        const token = crypto.randomBytes(32).toString('hex');
        const expiry = Date.now() + this.tokenLifetime;
        
        this.tokenStore.set(sessionId, { token, expiry });
        return token;
    }

    validateToken(sessionId, token) {
        const stored = this.tokenStore.get(sessionId);
        
        if (!stored || stored.expiry < Date.now()) {
            this.tokenStore.delete(sessionId);
            return false;
        }
        
        return stored.token === token;
    }

    middleware() {
        return (req, res, next) => {
            // Générer token pour GET requests
            if (req.method === 'GET') {
                const sessionId = req.session?.id || 'anonymous';
                const csrfToken = this.generateToken(sessionId);
                res.locals.csrfToken = csrfToken;
                res.set('X-CSRF-Token', csrfToken);
            }
            
            // Valider token pour POST/PUT/DELETE
            if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
                const sessionId = req.session?.id || 'anonymous';
                const token = req.headers['x-csrf-token'] || req.body._csrf;
                
                if (!this.validateToken(sessionId, token)) {
                    return res.status(403).json({
                        error: 'CSRF token invalid or missing'
                    });
                }
            }
            
            next();
        };
    }
}

const csrfProtection = new CSRFProtection();
export default csrfProtection;
