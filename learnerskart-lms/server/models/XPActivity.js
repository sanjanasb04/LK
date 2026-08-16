const mongoose = require('mongoose');

const XPActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // 'login', 'lesson_complete', 'quiz_pass', etc.
  xpEarned: { type: Number, required: true },
  meta: {
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    badgeId: { type: String }
  }
}, {
  timestamps: { createdAt: true, updatedAt: false } // Only track creation date
});

module.exports = mongoose.model('XPActivity', XPActivitySchema);
