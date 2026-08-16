const express = require('express');
const router = express.Router();
const { 
  getCourses, 
  getCourseBySlug, 
  createCourse, 
  updateCourse, 
  enrollInCourse,
  getCourseProgress,
  deleteCourse
} = require('../controllers/courseController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.route('/')
  .get(getCourses)
  .post(protect, authorize('instructor', 'admin'), createCourse);

router.route('/:slug')
  .get(getCourseBySlug);

router.route('/:id')
  .put(protect, authorize('instructor', 'admin'), updateCourse)
  .delete(protect, authorize('instructor', 'admin'), deleteCourse);

router.route('/:id/enroll')
  .post(protect, enrollInCourse);

router.route('/:id/my-progress')
  .get(protect, getCourseProgress);

module.exports = router;
