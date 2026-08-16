const express = require('express');
const router = express.Router();
const XPActivity = require('../models/XPActivity');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { awardXP } = require('../controllers/courseController');

// @desc    Get leaderboard rankings
// @route   GET /api/xp/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find({ isSuspended: false })
      .select('name avatar level xp streak badges')
      .sort({ xp: -1 })
      .limit(100);

    res.status(200).json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Leaderboard Error' });
  }
});

// @desc    Get my XP activities history
// @route   GET /api/xp/me
router.get('/me', protect, async (req, res) => {
  try {
    const activities = await XPActivity.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    const user = await User.findById(req.user.id).select('xp level streak');

    res.status(200).json({
      success: true,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      history: activities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server XP Profile Error' });
  }
});

// @desc    Admin manually award XP
// @route   POST /api/xp/award
router.post('/award', protect, authorize('admin'), async (req, res) => {
  try {
    const { userId, xpAmount, reason } = req.body;
    
    if (!userId || !xpAmount) {
      return res.status(400).json({ success: false, message: 'Please provide userId and xpAmount' });
    }

    const results = await awardXP(userId, 'admin_award', Number(xpAmount), { badgeId: reason || 'Admin Award' });
    
    res.status(200).json({ 
      success: true, 
      message: `Successfully awarded +${xpAmount} XP to student.`,
      results 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server XP Award Error' });
  }
});

module.exports = router;
