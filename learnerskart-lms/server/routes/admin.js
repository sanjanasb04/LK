const express = require('express');
const router = express.Router();
const { getPlatformStats, getAllUsers, updateUserStatus, downloadReport } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get('/stats', protect, authorize('admin'), getPlatformStats);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.patch('/users/:id', protect, authorize('admin'), updateUserStatus);
router.get('/reports/:type', protect, authorize('admin'), downloadReport);

module.exports = router;
