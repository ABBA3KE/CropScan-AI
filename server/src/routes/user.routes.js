/**
 * User Routes
 * User profile updates (edit name, change password) and account deletion.
 */

const express = require('express');
const router = express.Router();
const { updateMe, deleteMe } = require('../controllers/user.controller');
const { requireAuth } = require('../middleware/auth');

router.put('/me', requireAuth, updateMe);
router.delete('/me', requireAuth, deleteMe);

module.exports = router;
