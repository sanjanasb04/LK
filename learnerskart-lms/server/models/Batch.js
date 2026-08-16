const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  maxLearners: { type: Number, default: 30 },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mode: { 
    type: String, 
    enum: ['Online', 'Classroom'], 
    default: 'Online' 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Upcoming', 'Completed'], 
    default: 'Upcoming' 
  },
  learners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Batch', BatchSchema);
