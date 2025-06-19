const express = require('express');
const app = express();

// Importation des middlewares de sécurité
const bruteForceProtection = require('./security/BruteForceProtection');
const rateLimiter = require('./security/RateLimiter');
const inputValidator = require('./security/InputValidator');
const securityLogger = require('./security/SecurityLogger');

// Middlewares de sécurité (à placer avant les routes)
app.use(securityLogger.middleware());
app.use(inputValidator.middleware());
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

module.exports = app;