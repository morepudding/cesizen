import redis from 'redis';
const client = redis.createClient();

class RateLimiter {
    constructor() {
        this.rules = {
            global: { requests: 100, window: 60 }, // 100 req/min
            login: { requests: 5, window: 60 },    // 5 login/min
            api: { requests: 1000, window: 60 },   // 1000 API calls/min
            upload: { requests: 10, window: 300 }  // 10 uploads/5min
        };
    }

    async checkLimit(identifier, rule = 'global') {
        const config = this.rules[rule];
        const key = `rate_limit:${rule}:${identifier}`;
        
        const current = await client.get(key);
        const requests = current ? parseInt(current) : 0;
        
        if (requests >= config.requests) {
            const ttl = await client.ttl(key);
            return {
                allowed: false,
                remaining: 0,
                resetTime: ttl,
                message: `Rate limit exceeded. Try again in ${ttl} seconds`
            };
        }
        
        await client.multi()
            .incr(key)
            .expire(key, config.window)
            .exec();
            
        return {
            allowed: true,
            remaining: config.requests - requests - 1,
            resetTime: config.window
        };
    }

    middleware(rule = 'global') {
        return async (req, res, next) => {
            const identifier = req.ip || req.connection.remoteAddress;
            const result = await this.checkLimit(identifier, rule);
            
            res.set({
                'X-RateLimit-Limit': this.rules[rule].requests,
                'X-RateLimit-Remaining': result.remaining,
                'X-RateLimit-Reset': result.resetTime
            });
            
            if (!result.allowed) {
                return res.status(429).json({
                    error: 'Rate limit exceeded',
                    message: result.message,
                    retryAfter: result.resetTime
                });
            }
            
            next();
        };
    }

    // Protection spécifique contre les flood UDP/SYN
    async detectFlood(ip, protocol) {
        const key = `flood_detection:${protocol}:${ip}`;
        const threshold = protocol === 'udp' ? 50 : 30; // requêtes/seconde
        
        const count = await client.incr(key);
        await client.expire(key, 1);
        
        if (count > threshold) {
            await this.blockIP(ip, 300); // Block for 5 minutes
            return { isFlood: true, blocked: true };
        }
        
        return { isFlood: false, count };
    }

    async blockIP(ip, duration) {
        const key = `blocked_ip:${ip}`;
        await client.setex(key, duration, Date.now());
    }

    async isBlocked(ip) {
        const blocked = await client.get(`blocked_ip:${ip}`);
        return !!blocked;
    }
}

const rateLimiter = new RateLimiter();
export default rateLimiter;
