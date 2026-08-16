const express = require('express');
const router = express.Router();
const { getMentors } = require('../controllers/mentorController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const Mentor = require('../models/Mentor');

router.get('/', protect, getMentors);

// @desc    Self register / update availability as mentor
// @route   POST /api/mentors/profile
router.post('/profile', protect, authorize('mentor', 'admin'), async (req, res) => {
  try {
    const { bio, specializations, hourlyRate, availability } = req.body;
    let mentor = await Mentor.findOne({ user: req.user.id });
    
    if (mentor) {
      if (bio) mentor.bio = bio;
      if (specializations) mentor.specializations = specializations;
      if (hourlyRate !== undefined) mentor.hourlyRate = hourlyRate;
      if (availability) mentor.availability = availability;
      await mentor.save();
    } else {
      mentor = await Mentor.create({
        user: req.user.id,
        bio: bio || 'Expert PMP Coach',
        specializations: specializations || ['PMP'],
        hourlyRate: hourlyRate || 0,
        availability: availability || []
      });
    }

    res.status(200).json({ success: true, mentor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Mentor Profile Update Error' });
  }
});

module.exports = router;
