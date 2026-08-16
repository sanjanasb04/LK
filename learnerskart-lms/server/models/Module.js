const mongoose = require('mongoose');
const Lesson = require('./Lesson');

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
  lessons: [Lesson.schema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Module', ModuleSchema);
module.exports.schema = ModuleSchema;
