/**
 * Authentication Middleware
 * Validates JWT tokens from httpOnly cookies or Authorization header.
 * Attaches the authenticated user object to req.user.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fallbackStore = require('../models/fallbackStore');
const { getDbStatus } = require('../config/db');

async function requireAuth(req, res, next) {
  try {
    // 1. Retrieve token from cookie or Authorization header
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in or sign up.'
      });
    }

    // 2. Verify token
    const secret = process.env.JWT_SECRET || 'cropscan_ai_super_secret_jwt_key_2026';
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Session expired or invalid token. Please log in again.'
      });
    }

    // 3. Locate user
    let user;
    if (getDbStatus()) {
      user = await User.findById(decoded.id).select('-passwordHash');
    } else {
      user = fallbackStore.findUserById(decoded.id);
      if (user) {
        delete user.passwordHash;
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User account not found.'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication processing error'
    });
  }
}

module.exports = {
  requireAuth
};
