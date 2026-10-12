/**
 * Cloudinary & Local Image Storage Service
 * Handles uploading scanned crop images to Cloudinary Free Tier,
 * with automatic fallback to local disk storage if Cloudinary keys are not configured.
 */

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('[Storage] Cloudinary initialized for cloud image storage.');
} else {
  console.log('[Storage] Cloudinary not configured. Using local /uploads disk storage fallback.');
}

/**
 * Uploads a file buffer or local file path to storage
 * @param {Object} file - Multer file object
 * @returns {Promise<{ url: string, publicId: string }>}
 */
async function uploadImage(file) {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  // 1. If Cloudinary is configured, upload to Cloudinary
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'cropscan_ai',
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }]
        },
        (error, result) => {
          if (error) {
            console.error('[Cloudinary Error]', error);
            return reject(error);
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  // 2. Local disk fallback
  const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const extension = file.mimetype.split('/')[1] || 'jpg';
  const filename = `scan-${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
  const filepath = path.join(uploadsDir, filename);

  fs.writeFileSync(filepath, file.buffer);

  return {
    url: `/uploads/${filename}`,
    publicId: filename
  };
}

/**
 * Deletes an image by publicId
 */
async function deleteImage(publicId) {
  if (!publicId) return;

  if (isCloudinaryConfigured) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.warn(`[Cloudinary Warning] Could not delete cloud image ${publicId}:`, err.message);
    }
  } else {
    // Delete local file if exists
    const filepath = path.join(__dirname, '..', '..', 'uploads', publicId);
    if (fs.existsSync(filepath)) {
      try {
        fs.unlinkSync(filepath);
      } catch (err) {
        console.warn(`[Storage Warning] Could not delete local image ${publicId}:`, err.message);
      }
    }
  }
}

module.exports = {
  uploadImage,
  deleteImage,
  isCloudinaryConfigured
};
