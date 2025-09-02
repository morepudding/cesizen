import redis from 'redis';
const client = redis.createClient();

class BruteForceProtection {
    constructor() {
        this.maxAttempts = 5;
        this.lockoutTime = 15 * 60 * 1000; // 15 minutes
        this.progressiveLockout = [1, 5, 15, 60, 240]; // minutes
    }

    async checkAttempts(ip, username) {
        const key = `login_attempts:${ip}:${username}`;
        const attempts = await client.get(key);
        
        if (!attempts) return { allowed: true, remaining: this.maxAttempts };
        
        const attemptData = JSON.parse(attempts);
        const now = Date.now();
        
        if (attemptData.lockedUntil && now < attemptData.lockedUntil) {
            const remainingTime = Math.ceil((attemptData.lockedUntil - now) / 1000);
            return { 
                allowed: false, 
                lockoutRemaining: remainingTime,
                message: `Account locked. Try again in ${remainingTime} seconds`
            };
        }
        
        return { allowed: true, remaining: this.maxAttempts - attemptData.count };
    }

    async recordFailedAttempt(ip, username) {
        const key = `login_attempts:${ip}:${username}`;
        const attempts = await client.get(key);
        
        let attemptData = attempts ? JSON.parse(attempts) : { count: 0, lockoutLevel: 0 };
        attemptData.count++;
        
        if (attemptData.count >= this.maxAttempts) {
            const lockoutMinutes = this.progressiveLockout[attemptData.lockoutLevel] || 240;
            attemptData.lockedUntil = Date.now() + (lockoutMinutes * 60 * 1000);
            attemptData.lockoutLevel = Math.min(attemptData.lockoutLevel + 1, this.progressiveLockout.length - 1);
            attemptData.count = 0;
        }
        
        await client.setex(key, 3600, JSON.stringify(attemptData));
        return attemptData;
    }

    async recordSuccessfulLogin(ip, username) {
        const key = `login_attempts:${ip}:${username}`;
        await client.del(key);
    }

    middleware() {
        return async (req, res, next) => {
            if (req.path === '/login' && req.method === 'POST') {
                const ip = req.ip || req.connection.remoteAddress;
                const username = req.body.username;
                
                const check = await this.checkAttempts(ip, username);
                if (!check.allowed) {
                    return res.status(429).json({
                        error: 'Too many login attempts',
                        message: check.message,
                        lockoutRemaining: check.lockoutRemaining
                    });
                }
                
                req.bruteForceCheck = check;
            }
            next();
        };
    }
}

const bruteForceProtection = new BruteForceProtection();
export default bruteForceProtection;
