/**
 * Scan Routes
 * Defines public crop scanning and authenticated scan management routes.
 */

const express = require('express');
const router = express.Router();
const {
  scanCrop,
  saveScan,
  getScans,
  getScanById,
  deleteScan
} = require('../controllers/scan.controller');
const { requireAuth } = require('../middleware/auth');
const { uploadSingleImage } = require('../middleware/upload');
const { scanRateLimiter } = require('../middleware/rateLimiter');
const { APP_CONFIG, SUPPORTED_CROPS, GENERAL_CONDITIONS } = require('../config/crops.config');

// Public route to get crop and disease configuration
router.get('/config', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      app: APP_CONFIG,
      crops: SUPPORTED_CROPS,
      conditions: GENERAL_CONDITIONS
    }
  });
});

// Public crop scan endpoint: accepts 1 image, runs AI analysis
router.post('/scan', scanRateLimiter, uploadSingleImage('image'), scanCrop);

// Authenticated scan history management routes
router.post('/scans', requireAuth, uploadSingleImage('image'), saveScan);
router.get('/scans', requireAuth, getScans);
router.get('/scans/:id', requireAuth, getScanById);
router.delete('/scans/:id', requireAuth, deleteScan);

module.exports = router;
