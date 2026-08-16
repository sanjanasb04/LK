const mongoose = require('mongoose');

const LiveSessionSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  topic: { type: String, required: true, trim: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  duration: { type: Number, default: 60 }, // in minutes
  mode: { 
    type: String, 
    enum: ['Zoom', 'Google Meet', 'MS Teams'], 
    default: 'Zoom' 
  },
  meetingLink: { type: String, default: '' },
  maxSeats: { type: Number, default: 30 },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { 
    type: String, 
    enum: ['Upcoming', 'Live', 'Completed'], 
    default: 'Upcoming' 
  },
  recordingUrl: { type: String, default: '' } // Archived link
}, {
  timestamps: true
});

module.exports = mongoose.model('LiveSession', LiveSessionSchema);
