const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  paymentId: { type: String, default: '' },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  isCompleted: { type: Boolean, default: false },
  certificateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' }
}, {
  timestamps: true
});

// Ensure uniqueness of user-course enrollment
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
