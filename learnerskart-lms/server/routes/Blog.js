const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  incrementBlogView,
  toggleBlogLike,
} = require('../controllers/blog.controller');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.route('/')
  .get(getBlogs)
  .post(protect, authorize('admin'), createBlog);

router.route('/:slug')
  .get(getBlogBySlug);

router.route('/:id')
  .put(protect, authorize('admin'), updateBlog)
  .delete(protect, authorize('admin'), deleteBlog);

router.route('/:id/view')
  .post(incrementBlogView);

router.route('/:id/like')
  .post(toggleBlogLike);

module.exports = router;
