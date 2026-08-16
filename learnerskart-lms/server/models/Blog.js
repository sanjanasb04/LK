const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a blog title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide the blog content'],
    },
    excerpt: {
      type: String,
      required: [true, 'Please provide a short excerpt'],
    },
    image: {
      type: String,
      required: [true, 'Please provide a blog banner image URL or path'],
    },
    author: {
      name: { type: String, default: 'LearnersKart Team' },
      avatar: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' },
    },
    category: {
      type: String,
      default: 'General',
    },
    tags: {
      type: [String],
      default: [],
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    readTime: {
      type: String,
      default: '5 mins',
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
