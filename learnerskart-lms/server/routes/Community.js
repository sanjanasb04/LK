const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/communityController');
const { protect } = require('../middleware/auth');
const Community = require('../models/Community');

router.get('/categories', getCategories);

// @desc    Admin create forum category
// @route   POST /api/community/categories
router.post('/categories', protect, async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    const category = await Community.create({ name, slug, description });
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Category Creation Error' });
  }
});

module.exports = router;
