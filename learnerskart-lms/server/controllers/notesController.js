const Note = require('../models/Note');

// @desc    Get user notes
// @route   GET /api/notes
const getNotes = async (req, res) => {
  try {
    const { courseId, lessonId } = req.query;
    let query = { user: req.user.id };

    if (courseId) query.course = courseId;
    if (lessonId) query.lesson = lessonId;

    const notes = await Note.find(query)
      .populate('course', 'title')
      .populate('lesson', 'title')
      .sort({ noteTime: 1, createdAt: -1 });

    res.status(200).json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Notes Error' });
  }
};

// @desc    Create a note
// @route   POST /api/notes
const createNote = async (req, res) => {
  try {
    const { courseId, lessonId, noteTime, content, tags } = req.body;

    const note = await Note.create({
      user: req.user.id,
      course: courseId,
      lesson: lessonId,
      noteTime,
      content,
      tags: tags || []
    });

    res.status(201).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Note Creation Error' });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
const updateNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (req.body.content) note.content = req.body.content;
    if (req.body.tags) note.tags = req.body.tags;

    await note.save();

    res.status(200).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Note Update Error' });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.status(200).json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Note Deletion Error' });
  }
};

// @desc    Export notes as CSV text file
// @route   GET /api/notes/export
const exportNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id })
      .populate('course', 'title')
      .populate('lesson', 'title');

    let csvContent = 'Course,Lesson,Timestamp (seconds),Content\n';
    notes.forEach(note => {
      if (note.course && note.lesson) {
        csvContent += `"${note.course.title}","${note.lesson.title}",${note.noteTime},"${note.content.replace(/"/g, '""')}"\n`;
      }
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=my-study-notes.csv');
    return res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Notes Export Error' });
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  exportNotes
};
