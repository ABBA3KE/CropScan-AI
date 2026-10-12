/**
 * Upload Middleware
 * Configures Multer for in-memory processing of scanned crop photos.
 * Validates maximum file size (5MB) and acceptable MIME types (JPG, PNG, WEBP).
 */

const multer = require('multer');

// Store files in memory so we can read the buffer directly for Gemini and Cloudinary
const storage = multer.memoryStorage();

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

function fileFilter(req, file, cb) {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Invalid file type. Only JPG, PNG, and WEBP images are supported.');
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB maximum
  },
  fileFilter
});

// Single image handler wrapper for clean error responses
const uploadSingleImage = (fieldName = 'image') => {
  const multerHandler = upload.single(fieldName);

  return (req, res, next) => {
    multerHandler(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: 'Image file is too large. Maximum allowed size is 5 MB.'
          });
        }
        if (err.code === 'INVALID_FILE_TYPE') {
          return res.status(400).json({
            success: false,
            error: err.message
          });
        }
        return res.status(400).json({
          success: false,
          error: err.message || 'Error uploading file'
        });
      }
      next();
    });
  };
};

module.exports = {
  upload,
  uploadSingleImage
};
