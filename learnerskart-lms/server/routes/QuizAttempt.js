const express = require('express');
const router = express.Router();
const { submitQuizAttempt, getQuizAttempts } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

router.post('/:quizId', protect, submitQuizAttempt);
router.get('/:quizId', protect, getQuizAttempts);

module.exports = router;
