/**
 * CropScan AI - Main Backend Server Entrypoint
 * Node.js Express Server with security middleware, MongoDB integration,
 * Cloudinary image storage, and Google Gemini AI pathology diagnosis.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');

const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { APP_CONFIG } = require('./config/crops.config');

// Route modules
const scanRoutes = require('./routes/scan.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 5002;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Initialize Database connection
connectDB();

// 1. Security Headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// 2. Strict CORS Configuration
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: This origin is not allowed.'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// 3. Request Parsers
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Static uploads folder for locally saved scan photos
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// 5. Health Check & Project Info Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    appName: APP_CONFIG.projectName,
    author: APP_CONFIG.author,
    timestamp: new Date().toISOString()
  });
});

// 6. Mount API Routes
app.use('/api', scanRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 7. 404 Route Handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// 8. Central Error Handler
app.use(errorHandler);

// Start listening
const server = app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🌾  ${APP_CONFIG.projectName} API Server`);
  console.log(`🚀  Running at: http://localhost:${PORT}`);
  console.log(`🔒  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💡  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================\n`);
});

module.exports = { app, server };
