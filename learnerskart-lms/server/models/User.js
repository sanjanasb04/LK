const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  passwordHash: { type: String },
  role: { 
    type: String, 
    enum: ['learner', 'instructor', 'admin', 'mentor'], 
    default: 'learner' 
  },
  avatar: { type: String, default: '' },
  googleId: { type: String, default: '' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  linkedIn: { type: String, default: '' },
  company: { type: String, default: '' },
  designation: { type: String, default: '' },
  
  // Gamification properties
  xp: { type: Number, default: 0 },
  level: { type: String, default: 'Bronze' }, // Bronze, Silver, Gold, Platinum, Diamond
  streak: { type: Number, default: 0 },
  lastLoginDate: { type: Date },
  longestStreak: { type: Number, default: 0 },
  badges: [{ type: String }], // Array of Badge slugs
  
  refreshToken: { type: String },
  isVerified: { type: Boolean, default: false },
  isSuspended: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
