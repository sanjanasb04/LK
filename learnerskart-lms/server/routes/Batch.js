const express = require('express');
const router = express.Router();
const { getBatches, createBatch, assignLearner } = require('../controllers/batchesController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.route('/')
  .get(protect, getBatches)
  .post(protect, authorize('admin', 'instructor'), createBatch);

router.post('/:id/assign', protect, authorize('admin', 'instructor'), assignLearner);

module.exports = router;
