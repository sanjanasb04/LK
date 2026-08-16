const express = require('express');
const router = express.Router();
const { 
  bookMentorSession, 
  getMyBookings, 
  updateBookingStatus, 
  addSessionFeedback 
} = require('../controllers/mentorController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, bookMentorSession);

router.get('/me', protect, getMyBookings);

router.patch('/:id', protect, updateBookingStatus);
router.post('/:id/feedback', protect, addSessionFeedback);

module.exports = router;
