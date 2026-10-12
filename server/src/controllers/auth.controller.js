/**
 * Auth Controller
 * Handles user registration, login, logout, cookie management, and auth status checks.
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Scan = require('../models/Scan');
const fallbackStore = require('../models/fallbackStore');
const { getDbStatus } = require('../config/db');

// Helper to sign JWT token
function generateToken(userId, email) {
  const secret = process.env.JWT_SECRET || 'cropscan_ai_super_secret_jwt_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id: userId, email }, secret, { expiresIn });
}

// Helper to set httpOnly cookie
function setAuthCookie(res, token) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  });
}

/**
 * Register New User
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check duplicate email
    if (getDbStatus()) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'An account with this email address already exists. Please log in.'
        });
      }

      const passwordHash = await User.hashPassword(password);
      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash
      });

      const token = generateToken(user._id, user.email);
      setAuthCookie(res, token);

      return res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to CropScan AI.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } else {
      const existing = fallbackStore.findUserByEmail(normalizedEmail);
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'An account with this email address already exists. Please log in.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const user = fallbackStore.createUser({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash
      });

      const token = generateToken(user._id, user.email);
      setAuthCookie(res, token);

      return res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to CropScan AI.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Log In Existing User
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and password.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user;
    let isPasswordMatch = false;

    if (getDbStatus()) {
      user = await User.findOne({ email: normalizedEmail });
      if (user) {
        isPasswordMatch = await user.comparePassword(password);
      }
    } else {
      user = fallbackStore.findUserByEmail(normalizedEmail);
      if (user) {
        isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
      }
    }

    if (!user || !isPasswordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please try again.'
      });
    }

    const token = generateToken(user._id || user.id, user.email);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Log Out User
 * POST /api/auth/logout
 */
function logout(req, res) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
}

/**
 * Get Current Authenticated User & Scan Statistics
 * GET /api/auth/me
 */
async function getMe(req, res, next) {
  try {
    const user = req.user;
    const userId = user._id || user.id;

    let scanCount = 0;
    let mostScannedCrop = 'None yet';

    if (getDbStatus()) {
      scanCount = await Scan.countDocuments({ user: userId });

      const topCropAgg = await Scan.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$crop', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]);

      if (topCropAgg.length > 0) {
        mostScannedCrop = topCropAgg[0]._id;
      }
    } else {
      const scansRes = fallbackStore.findScansByUser(userId, { limit: 1000 });
      scanCount = scansRes.total;

      const cropCounts = {};
      scansRes.scans.forEach((s) => {
        cropCounts[s.crop] = (cropCounts[s.crop] || 0) + 1;
      });

      let topCrop = 'None yet';
      let maxC = 0;
      for (const [crop, c] of Object.entries(cropCounts)) {
        if (c > maxC) {
          maxC = c;
          topCrop = crop;
        }
      }
      mostScannedCrop = topCrop;
    }

    return res.status(200).json({
      success: true,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        totalScans: scanCount,
        mostScannedCrop
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  getMe
};
