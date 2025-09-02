import express from 'express';

const app = express();

// Importation des middlewares de sécurité
import bruteForceProtection from './security/BruteForceProtection.js';
import rateLimiter from './security/RateLimiter.js';
import inputValidator from './security/InputValidator.js';
import securityLogger from './security/SecurityLogger.js';
import csrfProtection from './security/CSRFProtection.js';
import corsConfig from './security/CORSConfig.js';

// Middlewares de sécurité (ordre important)
app.use(corsConfig.middleware());           // CORS en premier
app.use(securityLogger.middleware());       // Logging de sécurité
app.use(inputValidator.middleware());       // Validation des entrées
app.use(csrfProtection.middleware());       // Protection CSRF
app.use(rateLimiter.middleware('global'));

// Protection spécifique pour les routes de login
app.use('/login', rateLimiter.middleware('login'));
app.use('/login', bruteForceProtection.middleware());

// Middleware de détection de flood
app.use(async (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    
    if (await rateLimiter.isBlocked(ip)) {
        return res.status(429).json({ error: 'IP temporarily blocked' });
    }
    
    next();
});

// ...existing code...

export default app;