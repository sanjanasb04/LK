const express = require('express');
const router = express.Router();
const { getQuiz, getAllQuizzes, createQuiz, deleteQuiz, parseDocument } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.route('/')
  .get(getAllQuizzes)
  .post(protect, authorize('instructor', 'admin'), createQuiz);

router.post('/parse-document', parseDocument);

router.route('/:quizId')
  .get(protect, getQuiz)
  .delete(deleteQuiz);

module.exports = router;
