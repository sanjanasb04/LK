const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }, // Should match one of the option texts or option index (we'll save as exact option text string)
  explanation: { type: String, default: '' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  pointsValue: { type: Number, default: 10 }
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  questions: [QuestionSchema],
  category: { type: String, enum: ['mock', 'practice'], default: 'mock' },
  accessLevel: { type: String, enum: ['demo', 'free', 'premium'], default: 'free' },
  price: { type: Number, default: 0 },
  timeLimit: { type: Number, default: 30 }, // in minutes
  passPercentage: { type: Number, default: 80 },
  attemptsAllowed: { type: Number, default: 0 } // 0 means unlimited
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', QuizSchema);
module.exports.questionSchema = QuestionSchema;
