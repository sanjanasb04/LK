const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  isPrivate: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Community', CommunitySchema);
