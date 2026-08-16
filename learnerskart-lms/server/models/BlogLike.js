const mongoose = require('mongoose');

const blogLikeSchema = new mongoose.Schema(
  {
    blogId: {
      type: String,
      required: [true, 'Please provide a blog ID'],
    },
    userId: {
      type: String,
      default: null,
    },
    fingerprint: {
      type: String,
      required: [true, 'Please provide a device/visitor fingerprint'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BlogLike', blogLikeSchema);
