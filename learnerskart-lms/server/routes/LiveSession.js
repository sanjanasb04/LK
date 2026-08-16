const express = require('express');
const router = express.Router();
const { 
  getLiveSessions, 
  createLiveSession, 
  updateSessionStatus, 
  joinLiveSession 
} = require('../controllers/liveSessionController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.route('/')
  .get(protect, getLiveSessions)
  .post(protect, authorize('admin', 'instructor'), createLiveSession);

router.patch('/:id/status', protect, authorize('admin', 'instructor'), updateSessionStatus);
router.post('/:id/join', protect, joinLiveSession);

module.exports = router;
