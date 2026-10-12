/**
 * User Controller
 * Handles profile update (edit name, change password) and account deletion.
 */

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Scan = require('../models/Scan');
const fallbackStore = require('../models/fallbackStore');
const { getDbStatus } = require('../config/db');

/**
 * Update Profile (Name and/or Password)
 * PUT /api/users/me (Requires Auth)
 */
async function updateMe(req, res, next) {
  try {
    const userId = req.user._id || req.user.id;
    const { name, currentPassword, newPassword } = req.body;

    let user;
    if (getDbStatus()) {
      user = await User.findById(userId);
    } else {
      user = fallbackStore.findUserById(userId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User account not found.'
      });
    }

    // Update name
    if (name && name.trim()) {
      user.name = name.trim();
    }

    // If changing password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          error: 'Current password is required to set a new password.'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'New password must be at least 6 characters long.'
        });
      }

      let isMatch = false;
      if (getDbStatus()) {
        isMatch = await user.comparePassword(currentPassword);
      } else {
        isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      }

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          error: 'Current password does not match.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    // Save changes
    if (getDbStatus()) {
      await user.save();
    } else {
      fallbackStore.updateUser(userId, {
        name: user.name,
        passwordHash: user.passwordHash
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: userId,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete User Account & Associated Scans
 * DELETE /api/users/me (Requires Auth)
 */
async function deleteMe(req, res, next) {
  try {
    const userId = req.user._id || req.user.id;

    if (getDbStatus()) {
      // Remove scans first
      await Scan.deleteMany({ user: userId });
      // Remove user
      await User.findByIdAndDelete(userId);
    } else {
      fallbackStore.deleteUser(userId);
    }

    // Clear auth cookie
    res.clearCookie('token');

    return res.status(200).json({
      success: true,
      message: 'Your account and all associated scan data have been permanently deleted.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  updateMe,
  deleteMe
};
