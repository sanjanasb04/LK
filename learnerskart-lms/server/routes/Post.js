const express = require('express');
const router = express.Router();
const { 
  getPosts, 
  getPostById, 
  createPost, 
  likePost, 
  addComment 
} = require('../controllers/communityController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getPosts)
  .post(protect, createPost);

router.route('/:id')
  .get(protect, getPostById);

router.post('/:id/like', protect, likePost);
router.post('/:id/comments', protect, addComment);

module.exports = router;
