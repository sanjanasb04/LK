const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

// @desc    Like a comment (toggle)
// @route   POST /api/comments/:id/like
router.post('/:id/like', protect, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the post containing this comment
    const post = await Post.findOne({ 'comments._id': id });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const comment = post.comments.id(id);
    const likeIndex = comment.likes.indexOf(req.user.id);
    let liked = false;

    if (likeIndex === -1) {
      comment.likes.push(req.user.id);
      liked = true;
    } else {
      comment.likes.splice(likeIndex, 1);
    }

    await post.save();

    res.status(200).json({ 
      success: true, 
      likesCount: comment.likes.length, 
      liked, 
      comment 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Comment Like Error' });
  }
});

module.exports = router;
