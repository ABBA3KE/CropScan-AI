/**
 * In-Memory Fallback Data Store
 * Used automatically when MongoDB is not connected, allowing the application
 * to function seamlessly during local offline testing and defences.
 */

const crypto = require('crypto');

class FallbackStore {
  constructor() {
    this.users = new Map();
    this.scans = new Map();
  }

  // Users
  createUser(userData) {
    const id = new crypto.randomBytes(12).toString('hex');
    const user = {
      _id: id,
      id,
      name: userData.name,
      email: userData.email.toLowerCase(),
      passwordHash: userData.passwordHash,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return { ...user };
  }

  findUserByEmail(email) {
    const target = email.toLowerCase();
    for (const user of this.users.values()) {
      if (user.email === target) return { ...user };
    }
    return null;
  }

  findUserById(id) {
    const user = this.users.get(String(id));
    return user ? { ...user } : null;
  }

  updateUser(id, updates) {
    const user = this.users.get(String(id));
    if (!user) return null;
    const updated = { ...user, ...updates };
    this.users.set(String(id), updated);
    return { ...updated };
  }

  deleteUser(id) {
    // Also cascade delete user's scans
    for (const [scanId, scan] of this.scans.entries()) {
      if (String(scan.user) === String(id)) {
        this.scans.delete(scanId);
      }
    }
    return this.users.delete(String(id));
  }

  // Scans
  createScan(scanData) {
    const id = new crypto.randomBytes(12).toString('hex');
    const scan = {
      _id: id,
      id,
      ...scanData,
      createdAt: new Date()
    };
    this.scans.set(id, scan);
    return { ...scan };
  }

  findScansByUser(userId, { crop, page = 1, limit = 10 } = {}) {
    let list = [];
    for (const scan of this.scans.values()) {
      if (String(scan.user) === String(userId)) {
        if (!crop || crop.toLowerCase() === 'all' || scan.crop.toLowerCase() === crop.toLowerCase()) {
          list.push({ ...scan });
        }
      }
    }

    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paged = list.slice(startIndex, startIndex + limit);

    return {
      scans: paged,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit) || 1
    };
  }

  findScanById(id, userId) {
    const scan = this.scans.get(String(id));
    if (!scan) return null;
    if (userId && String(scan.user) !== String(userId)) return null;
    return { ...scan };
  }

  deleteScan(id, userId) {
    const scan = this.scans.get(String(id));
    if (!scan) return null;
    if (userId && String(scan.user) !== String(userId)) return null;
    this.scans.delete(String(id));
    return scan;
  }
}

const fallbackStore = new FallbackStore();

module.exports = fallbackStore;
