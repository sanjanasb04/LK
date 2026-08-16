const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  isCompleted: { type: Boolean, default: false },
  watchedSeconds: { type: Number, default: 0 },
  completedAt: { type: Date },
  quizAttempts: [{
    score: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    attemptedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

ProgressSchema.index({ user: 1, course: 1, lesson: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);
