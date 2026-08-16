const mongoose = require('mongoose');

const MentorSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // e.g. "18:00"
  type: { 
    type: String, 
    enum: ['Career Guidance', 'Exam Strategy', 'Technical Doubts', 'Mock Interview'], 
    default: 'Career Guidance' 
  },
  agenda: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], 
    default: 'Pending' 
  },
  paymentId: { type: String, default: '' },
  meetingLink: { type: String, default: '' },
  notes: { type: String, default: '' },
  feedback: {
    score: { type: Number },
    comment: { type: String }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MentorSession', MentorSessionSchema);
