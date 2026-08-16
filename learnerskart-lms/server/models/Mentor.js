const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, required: true },
  specializations: [{ type: String }], // 'PMP', 'Agile', 'Scrum', 'Risk Management'
  hourlyRate: { type: Number, default: 0 }, // For booking sessions if paid
  availability: [{
    day: { 
      type: String, 
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] 
    },
    slots: [{ type: String }] // Array of strings like "18:00", "18:30"
  }],
  sessionsCompleted: { type: Number, default: 0 },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, min: 1, max: 5 },
    review: { type: String, default: '' },
    date: { type: Date, default: Date.now }
  }],
  avgRating: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Mentor', MentorSchema);
