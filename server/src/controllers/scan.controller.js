/**
 * Scan Controller
 * Handles crop photo analysis, scan saving with Cloudinary integration,
 * scan history retrieval, pagination, filtering, and deletion.
 */

const { analyzeCropImage } = require('../services/gemini.service');
const { uploadImage, deleteImage } = require('../config/cloudinary');
const Scan = require('../models/Scan');
const fallbackStore = require('../models/fallbackStore');
const { getDbStatus } = require('../config/db');

/**
 * Public Scan Endpoint - analyzes photo without requiring an account
 * POST /api/scan
 */
async function scanCrop(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload or capture a crop photo to analyze.'
      });
    }

    const preferredCrop = req.body.crop || 'auto';
    const analysis = await analyzeCropImage(req.file.buffer, req.file.mimetype, preferredCrop);

    return res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Save Scan to Account
 * POST /api/scans (Requires Auth)
 */
async function saveScan(req, res, next) {
  try {
    const userId = req.user._id || req.user.id;
    let { fullResult, imageUrl, imagePublicId } = req.body;

    // If client sent raw JSON in fullResult as string, parse it
    if (typeof fullResult === 'string') {
      try {
        fullResult = JSON.parse(fullResult);
      } catch (e) {
        // keep as is
      }
    }

    // If a new photo file is being uploaded alongside save
    if (req.file) {
      const uploadRes = await uploadImage(req.file);
      imageUrl = uploadRes.url;
      imagePublicId = uploadRes.publicId;
    }

    if (!imageUrl) {
      // If no file uploaded, check if client provided a base64 or temporary image
      if (req.body.imageBase64) {
        const matches = req.body.imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const buffer = Buffer.from(matches[2], 'base64');
          const mockFile = { buffer, mimetype: matches[1] };
          const uploadRes = await uploadImage(mockFile);
          imageUrl = uploadRes.url;
          imagePublicId = uploadRes.publicId;
        }
      }
    }

    if (!fullResult) {
      return res.status(400).json({
        success: false,
        error: 'Full diagnosis result is required to save scan.'
      });
    }

    const scanData = {
      user: userId,
      imageUrl: imageUrl || '/placeholder-crop.jpg',
      imagePublicId: imagePublicId || '',
      crop: fullResult.crop || 'Unknown',
      plantPart: fullResult.plantPart || 'leaf',
      status: fullResult.status || 'uncertain',
      diseaseName: fullResult.diseaseName || 'Condition Analyzed',
      confidence: fullResult.confidence || 0,
      severity: fullResult.severity || 'none',
      fullResult
    };

    let savedScan;
    if (getDbStatus()) {
      savedScan = await Scan.create(scanData);
    } else {
      savedScan = fallbackStore.createScan(scanData);
    }

    return res.status(201).json({
      success: true,
      message: 'Crop scan saved successfully to your history.',
      data: savedScan
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get User's Scans with Pagination and Crop Filter
 * GET /api/scans (Requires Auth)
 */
async function getScans(req, res, next) {
  try {
    const userId = req.user._id || req.user.id;
    const { crop, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    if (getDbStatus()) {
      const query = { user: userId };
      if (crop && crop.toLowerCase() !== 'all') {
        query.crop = new RegExp(`^${crop}$`, 'i');
      }

      const [scans, total] = await Promise.all([
        Scan.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Scan.countDocuments(query)
      ]);

      return res.status(200).json({
        success: true,
        data: {
          scans,
          total,
          page: pageNum,
          totalPages: Math.ceil(total / limitNum) || 1
        }
      });
    } else {
      const result = fallbackStore.findScansByUser(userId, {
        crop,
        page: pageNum,
        limit: limitNum
      });

      return res.status(200).json({
        success: true,
        data: result
      });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Get Single Scan by ID
 * GET /api/scans/:id (Requires Auth)
 */
async function getScanById(req, res, next) {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    let scan;
    if (getDbStatus()) {
      scan = await Scan.findOne({ _id: id, user: userId }).lean();
    } else {
      scan = fallbackStore.findScanById(id, userId);
    }

    if (!scan) {
      return res.status(404).json({
        success: false,
        error: 'Scan record not found or you do not have permission to view it.'
      });
    }

    return res.status(200).json({
      success: true,
      data: scan
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a Scan
 * DELETE /api/scans/:id (Requires Auth)
 */
async function deleteScan(req, res, next) {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    let scan;
    if (getDbStatus()) {
      scan = await Scan.findOneAndDelete({ _id: id, user: userId });
    } else {
      scan = fallbackStore.deleteScan(id, userId);
    }

    if (!scan) {
      return res.status(404).json({
        success: false,
        error: 'Scan not found or already deleted.'
      });
    }

    // Clean up stored image
    if (scan.imagePublicId) {
      await deleteImage(scan.imagePublicId);
    }

    return res.status(200).json({
      success: true,
      message: 'Scan deleted successfully from your history.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  scanCrop,
  saveScan,
  getScans,
  getScanById,
  deleteScan
};
