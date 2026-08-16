const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// @desc    Add a module to a course
// @route   POST /api/modules/:courseId
router.post('/:courseId', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { title, description, order } = req.body;
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    course.modules.push({ title, description, order: order || course.modules.length });
    await course.save();

    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Module Addition Error' });
  }
});

module.exports = router;
