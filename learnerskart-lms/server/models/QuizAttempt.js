const mongoose = require('mongoose');

const QuizAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    answer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
  }],
  score: { type: Number, required: true }, // percentage score (0-100)
  passed: { type: Boolean, required: true },
  attemptedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);
