/**
 * Auth Routes
 * Defines registration, login, logout, and authenticated session verification.
 */

const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe
} = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rateLimiter');

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);

module.exports = router;
