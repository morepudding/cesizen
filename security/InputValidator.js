import validator from 'validator';
import DOMPurify from 'isomorphic-dompurify';

class InputValidator {
    constructor() {        this.sqlPatterns = [
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
            /(--|\#|\/\*|\*\/)/,
            /(\b(OR|AND)\b.*=.*)/i
        ];
          this.xssPatterns = [
            /<script[^>]*>.*<\/script>/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /<iframe[^>]*>.*<\/iframe>/i
        ];
    }

    sanitizeString(input, maxLength = 255) {
        if (!input || typeof input !== 'string') return '';
        
        // Limite la longueur
        input = input.substring(0, maxLength);
        
        // Supprime les caractères de contrôle
        input = input.replace(/[\x00-\x1F\x7F]/g, '');
        
        // Échappe les caractères HTML
        input = DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
        
        return input.trim();
    }

    validateEmail(email) {
        if (!email || !validator.isEmail(email)) {
            return { valid: false, message: 'Invalid email format' };
        }
        return { valid: true, sanitized: validator.normalizeEmail(email) };
    }

    validatePassword(password) {
        const errors = [];
        
        if (!password || password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        
        if (!/(?=.*[a-z])/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        
        if (!/(?=.*[A-Z])/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        
        if (!/(?=.*\d)/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        
        if (!/(?=.*[@$!%*?&])/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    detectSQLInjection(input) {
        if (!input) return false;
        
        return this.sqlPatterns.some(pattern => pattern.test(input));
    }

    detectXSS(input) {
        if (!input) return false;
        
        return this.xssPatterns.some(pattern => pattern.test(input));
    }

    middleware() {
        return (req, res, next) => {
            // Validation des paramètres de requête
            if (req.query) {
                for (const [key, value] of Object.entries(req.query)) {
                    if (typeof value === 'string') {
                        if (this.detectSQLInjection(value) || this.detectXSS(value)) {
                            return res.status(400).json({
                                error: 'Invalid input detected',
                                parameter: key
                            });
                        }
                        req.query[key] = this.sanitizeString(value);
                    }
                }
            }
            
            // Validation du body
            if (req.body) {
                for (const [key, value] of Object.entries(req.body)) {
                    if (typeof value === 'string') {
                        if (this.detectSQLInjection(value) || this.detectXSS(value)) {
                            return res.status(400).json({
                                error: 'Invalid input detected',
                                field: key
                            });
                        }
                        req.body[key] = this.sanitizeString(value);
                    }
                }
            }
            
            next();
        };
    }
}

const inputValidator = new InputValidator();
export default inputValidator;
