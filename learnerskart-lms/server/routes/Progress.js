const express = require('express');
const router = express.Router();
const { completeLesson, saveWatchTime } = require('../controllers/courseController');
const { protect } = require('../middleware/auth');

router.post('/lesson/:lessonId/complete', protect, completeLesson);
router.post('/lesson/:lessonId/watch-time', protect, saveWatchTime);

module.exports = router;
