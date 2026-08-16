const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const upload = require('../middleware/upload');

// @desc    Add a lesson to a specific module in a course
// @route   POST /api/lessons/:courseId/module/:moduleId
router.post('/:courseId/module/:moduleId', protect, authorize('instructor', 'admin'), upload.single('mediaFile'), async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const { title, type, content, duration, isFreePreview, order } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const moduleObj = course.modules.id(moduleId);
    if (!moduleObj) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    let mediaUrl = content || '';
    let cloudinaryId = '';

    // If file is uploaded
    if (req.file) {
      mediaUrl = req.file.path || `/uploads/${req.file.filename}`;
      cloudinaryId = req.file.filename || '';
    }

    const newLesson = {
      title,
      type,
      content: mediaUrl,
      duration: Number(duration) || 0,
      isFreePreview: isFreePreview === 'true' || isFreePreview === true,
      order: Number(order) || moduleObj.lessons.length,
      cloudinaryId
    };

    moduleObj.lessons.push(newLesson);

    // Update course totals
    course.totalLessons += 1;
    course.totalDuration += Number(duration) || 0;

    await course.save();

    res.status(201).json({ success: true, course, lesson: moduleObj.lessons[moduleObj.lessons.length - 1] });
  } catch (error) {
    console.error('Add Lesson Error:', error);
    res.status(500).json({ success: false, message: 'Server Lesson Creation Error' });
  }
});

module.exports = router;
