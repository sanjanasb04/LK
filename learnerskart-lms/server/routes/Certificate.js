const express = require('express');
const router = express.Router();
const { getMyCertificates, verifyCertificate, issueCertificate } = require('../controllers/certificatesController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get('/me', protect, getMyCertificates);
router.get('/verify/:certId', verifyCertificate); // Public
router.post('/issue', protect, authorize('admin', 'instructor'), issueCertificate);

module.exports = router;
