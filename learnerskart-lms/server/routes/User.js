const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  logoutUser, 
  refreshAccessToken, 
  googleLogin, 
  getMe, 
  updateMe, 
  updateAvatar 
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Auth endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshAccessToken);
router.post('/google', googleLogin);

// Profile endpoints
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.post('/avatar', protect, upload.single('avatar'), updateAvatar);

module.exports = router;
