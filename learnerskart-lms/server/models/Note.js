const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  noteTime: { type: Number, default: 0 }, // Position in video (seconds) when note was made
  content: { type: String, required: true },
  tags: [{ type: String }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);
