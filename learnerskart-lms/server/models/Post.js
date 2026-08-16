const mongoose = require('mongoose');
const Comment = require('./Comment');

const PostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true }, // e.g. "PMP Study Group", "General Discussion"
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  tags: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  isPinned: { type: Boolean, default: false },
  isAnnouncement: { type: Boolean, default: false },
  comments: [Comment.schema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);
