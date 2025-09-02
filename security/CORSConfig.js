class CORSConfig {
    constructor() {
        this.allowedOrigins = [
            'https://cesizen.vercel.app',
            'https://www.cesizen.com',
            ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
        ];
    }

    middleware() {
        return (req, res, next) => {
            const origin = req.headers.origin;
            
            // Vérifier si l'origine est autorisée
            if (this.allowedOrigins.includes(origin)) {
                res.setHeader('Access-Control-Allow-Origin', origin);
            }
            
            // Headers de sécurité CORS
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Max-Age', '86400'); // 24h
            
            // Répondre aux preflight requests
            if (req.method === 'OPTIONS') {
                return res.status(200).end();
            }
            
            next();
        };
    }
}

const corsConfig = new CORSConfig();
export default corsConfig;
