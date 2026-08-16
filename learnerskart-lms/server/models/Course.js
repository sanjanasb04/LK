const mongoose = require('mongoose');
const Module = require('./Module');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  subtitle: { type: String, trim: true },
  description: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  promoVideo: { type: String, default: '' },
  category: { type: String, required: true, trim: true },
  level: { type: String, default: 'Beginner' }, // Beginner, Intermediate, Advanced
  language: { type: String, default: 'English' },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  modules: [Module.schema],
  
  price: { type: Number, default: 0 },
  isFree: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  isUnderReview: { type: Boolean, default: false },
  
  totalLessons: { type: Number, default: 0 },
  totalDuration: { type: Number, default: 0 }, // in minutes
  
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, default: '' },
    date: { type: Date, default: Date.now }
  }],
  avgRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  
  certificateTemplate: { type: String, default: '' }, // Template identification
  dripEnabled: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Auto slugify course title before validation
CourseSchema.pre('validate', function(next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Course', CourseSchema);
