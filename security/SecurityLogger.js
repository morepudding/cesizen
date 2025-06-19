const fs = require('fs').promises;
const path = require('path');

class SecurityLogger {
    constructor() {
        this.logDir = path.join(__dirname, '../logs/security');
        this.ensureLogDirectory();
    }

    async ensureLogDirectory() {
        try {
            await fs.mkdir(this.logDir, { recursive: true });
        } catch (error) {
            console.error('Failed to create log directory:', error);
        }
    }

    async log(level, event, details) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            event,
            ip: details.ip,
            userAgent: details.userAgent,
            details: details.data
        };

        const fileName = `security-${new Date().toISOString().split('T')[0]}.log`;
        const filePath = path.join(this.logDir, fileName);
        
        try {
            await fs.appendFile(filePath, JSON.stringify(logEntry) + '\n');
        } catch (error) {
            console.error('Failed to write security log:', error);
        }

        // Log critique : notification immédiate
        if (level === 'CRITICAL') {
            this.sendAlert(logEntry);
        }
    }

    async logBruteForce(ip, username, success = false) {
        await this.log(success ? 'INFO' : 'WARNING', 'BRUTE_FORCE_ATTEMPT', {
            ip,
            userAgent: null,
            data: { username, success, timestamp: Date.now() }
        });
    }

    async logRateLimit(ip, rule, blocked = false) {
        await this.log(blocked ? 'WARNING' : 'INFO', 'RATE_LIMIT', {
            ip,
            userAgent: null,
            data: { rule, blocked, timestamp: Date.now() }
        });
    }

    async logSuspiciousActivity(ip, userAgent, activity) {
        await this.log('CRITICAL', 'SUSPICIOUS_ACTIVITY', {
            ip,
            userAgent,
            data: { activity, timestamp: Date.now() }
        });
    }

    async logFloodDetection(ip, protocol, blocked = false) {
        await this.log('CRITICAL', 'FLOOD_DETECTION', {
            ip,
            userAgent: null,
            data: { protocol, blocked, timestamp: Date.now() }
        });
    }

    sendAlert(logEntry) {
        // Implémentation des alertes (email, Slack, etc.)
        console.error('SECURITY ALERT:', logEntry);
    }

    middleware() {
        return (req, res, next) => {
            req.securityLogger = this;
            next();
        };
    }
}

module.exports = new SecurityLogger();
