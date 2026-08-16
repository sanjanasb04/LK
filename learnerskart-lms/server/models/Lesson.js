const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['video', 'pdf', 'quiz', 'text', 'link', 'reading'], 
    default: 'video' 
  },
  content: { type: String, default: '' }, // Text content, url, file link, or quiz ref id
  duration: { type: Number, default: 0 }, // in minutes
  isFreePreview: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  cloudinaryId: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lesson', LessonSchema);
module.exports.schema = LessonSchema;
