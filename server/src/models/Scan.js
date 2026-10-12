/**
 * Scan Model
 * Stores analyzed crop photos, detected conditions, and complete diagnosis JSON.
 */

const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Scan image URL is required']
  },
  imagePublicId: {
    type: String,
    default: ''
  },
  crop: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true,
    index: true
  },
  plantPart: {
    type: String,
    default: 'leaf'
  },
  status: {
    type: String,
    enum: ['healthy', 'diseased', 'uncertain'],
    default: 'uncertain',
    index: true
  },
  diseaseName: {
    type: String,
    required: true,
    trim: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe', 'none'],
    default: 'none'
  },
  fullResult: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

const Scan = mongoose.models.Scan || mongoose.model('Scan', scanSchema);

module.exports = Scan;
