const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // '3-day-streak', 'quiz-ace', etc.
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true }, // SVG, emoji, or URL path
  category: { 
    type: String, 
    enum: ['Learning', 'Streaks', 'Assessment', 'Community', 'Milestones', 'Special'],
    default: 'Learning'
  },
  triggerType: { type: String, required: true }, // 'lessons_completed', 'quiz_score_100', 'streak_days', etc.
  triggerValue: { type: mongoose.Schema.Types.Mixed }, // Threshold or matching criteria
  xpReward: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Badge', BadgeSchema);
