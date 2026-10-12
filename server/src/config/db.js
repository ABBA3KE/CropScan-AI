/**
 * Database Connection Module
 * Connects to MongoDB via Mongoose. If connection fails (e.g., local MongoDB not started),
 * logs a clear actionable message and flags the server so local development doesn't crash.
 */

const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cropscan_ai';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5s if MongoDB is not reachable
    });
    isConnected = true;
    console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`\n[Database Warning] Could not connect to MongoDB at "${uri}".`);
    console.warn(`Reason: ${error.message}`);
    console.warn(`[Database Info] Tip: Set MONGODB_URI in .env to a MongoDB Atlas cluster string for cloud persistence.`);
    console.warn(`[Database Info] The server will continue running; in-memory fallback will handle scan & user sessions for live demo.\n`);
    return false;
  }
}

function getDbStatus() {
  return isConnected;
}

module.exports = {
  connectDB,
  getDbStatus
};
