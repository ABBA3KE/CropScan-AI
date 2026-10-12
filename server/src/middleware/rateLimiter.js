/**
 * Rate Limiting Middleware
 * Protects AI scan endpoints and authentication routes from abuse.
 */

const rateLimit = require('express-rate-limit');

// Rate limiter for crop scanning (AI Gemini calls)
const scanRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 scan requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many scan requests from this IP address. Please wait 15 minutes before scanning again.'
  }
});

// Rate limiter for authentication routes (login / register)
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 auth attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

module.exports = {
  scanRateLimiter,
  authRateLimiter
};
