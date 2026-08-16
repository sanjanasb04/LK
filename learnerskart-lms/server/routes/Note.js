const express = require('express');
const router = express.Router();
const { getNotes, createNote, updateNote, deleteNote, exportNotes } = require('../controllers/notesController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getNotes)
  .post(protect, createNote);

router.get('/export', protect, exportNotes);

router.route('/:id')
  .put(protect, updateNote)
  .delete(protect, deleteNote);

module.exports = router;
