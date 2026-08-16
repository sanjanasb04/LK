const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
  issueDate: { type: Date, default: Date.now },
  verificationId: { type: String, required: true, unique: true }, // LK-YYYY-COURSE-NUMBER format
  pdfUrl: { type: String, default: '' },
  templateSnapshot: { type: mongoose.Schema.Types.Mixed, default: {} } // Saves the customization parameters when issued
}, {
  timestamps: true
});

module.exports = mongoose.model('Certificate', CertificateSchema);
