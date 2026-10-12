/**
 * Generates sample JPEG test images for the evaluation dataset
 * Uses minimal valid JPEG headers so the files are real valid images.
 */

const fs = require('fs');
const path = require('path');
const labels = require('./dataset/labels.json');

// Minimal valid 1x1 base64 JPEG
const validJpegBase64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
const baseBuffer = Buffer.from(validJpegBase64, 'base64');

function generateImages() {
  console.log('Generating evaluation sample images...');
  for (const item of labels) {
    const fullPath = path.join(__dirname, 'dataset', item.filename);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, baseBuffer);
    console.log(`- Created ${item.filename} (${item.crop} - ${item.diseaseName})`);
  }
  console.log('Sample test dataset ready.');
}

generateImages();
