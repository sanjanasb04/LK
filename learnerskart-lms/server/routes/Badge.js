const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Get all badges
// @route   GET /api/badges
router.get('/', async (req, res) => {
  try {
    const badges = await Badge.find();
    res.status(200).json({ success: true, badges });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Badges Error' });
  }
});

// @desc    Get my earned badges
// @route   GET /api/badges/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const earnedSlugs = user.badges || [];
    const badges = await Badge.find({ slug: { $in: earnedSlugs } });

    res.status(200).json({ success: true, badges });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server My Badges Error' });
  }
});

module.exports = router;
