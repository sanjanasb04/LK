const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// @desc    Get user's enrolled courses
// @route   GET /api/enrollments/me
router.get('/me', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate({
        path: 'course',
        select: 'title slug thumbnail category totalLessons totalDuration avgRating instructor level',
        populate: { path: 'instructor', select: 'name avatar' }
      })
      .populate('certificateId');

    res.status(200).json({ success: true, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Enrollments Error' });
  }
});

// @desc    Get all enrollments (admin only)
// @route   GET /api/enrollments
router.get('/', protect, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('user', 'name email')
      .populate('course', 'title price')
      .sort({ enrolledAt: -1 });

    res.status(200).json({ success: true, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Enrollments Query Error' });
  }
});

module.exports = router;
