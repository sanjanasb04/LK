const Batch = require('../models/Batch');

// @desc    Get batches list
// @route   GET /api/batches
const getBatches = async (req, res) => {
  try {
    const { courseId } = req.query;
    let query = {};
    if (courseId) query.course = courseId;

    const batches = await Batch.find(query)
      .populate('course', 'title')
      .populate('instructor', 'name')
      .populate('learners', 'name email');

    res.status(200).json({ success: true, batches });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Batches Lookup Error' });
  }
};

// @desc    Create a batch
// @route   POST /api/batches
const createBatch = async (req, res) => {
  try {
    const { name, course, startDate, endDate, maxLearners, instructor, mode } = req.body;

    const batch = await Batch.create({
      name,
      course,
      startDate,
      endDate,
      maxLearners,
      instructor,
      mode
    });

    res.status(201).json({ success: true, batch });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Batch Creation Error' });
  }
};

// @desc    Assign a student/learner to a batch
// @route   POST /api/batches/:id/assign
const assignLearner = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const batch = await Batch.findById(id);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    if (batch.learners.includes(userId)) {
      return res.status(400).json({ success: false, message: 'User already assigned to this batch' });
    }

    if (batch.learners.length >= batch.maxLearners) {
      return res.status(400).json({ success: false, message: 'Batch cohort is full' });
    }

    batch.learners.push(userId);
    await batch.save();

    res.status(200).json({ success: true, message: 'Learner assigned successfully', batch });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Batch Assignment Error' });
  }
};

module.exports = {
  getBatches,
  createBatch,
  assignLearner
};
