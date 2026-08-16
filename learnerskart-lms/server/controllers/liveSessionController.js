const LiveSession = require('../models/LiveSession');
const Notification = require('../models/Notification');

// @desc    Get live sessions list (upcoming + past recordings)
// @route   GET /api/live-sessions
const getLiveSessions = async (req, res) => {
  try {
    const { mode, status } = req.query;
    let query = {};

    if (mode) query.mode = mode;
    if (status) query.status = status;

    const sessions = await LiveSession.find(query)
      .populate('course', 'title slug thumbnail')
      .populate('instructor', 'name avatar')
      .sort({ startTime: 1 });

    res.status(200).json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Live Sessions Error' });
  }
};

// @desc    Create a live session
// @route   POST /api/live-sessions
const createLiveSession = async (req, res) => {
  try {
    const { course, topic, startTime, duration, mode, meetingLink, maxSeats } = req.body;

    const session = await LiveSession.create({
      course,
      topic,
      instructor: req.user.id,
      startTime,
      duration,
      mode,
      meetingLink,
      maxSeats
    });

    // Alert all students in system (or those enrolled)
    // For demo, notify current user
    await Notification.create({
      user: req.user.id,
      type: 'live_session',
      title: '📅 New Live Session Scheduled',
      message: `A session on "${topic}" is scheduled for ${new Date(startTime).toLocaleString()}`,
      link: '/lms/live-sessions'
    });

    res.status(201).json({ success: true, session });
  } catch (error) {
    console.error('Create Live Session Error:', error);
    res.status(500).json({ success: false, message: 'Server Live Session Creation Error' });
  }
};

// @desc    Toggle live session state (Live / Completed)
// @route   PATCH /api/live-sessions/:id/status
const updateSessionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, recordingUrl } = req.body;

    const session = await LiveSession.findById(id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Live session not found' });
    }

    if (status) session.status = status;
    if (recordingUrl) session.recordingUrl = recordingUrl;

    await session.save();

    // Notify attendees if session starts
    if (status === 'Live') {
      const socketIo = req.app.get('socketio');
      if (socketIo) {
        // Emit global event for live banners
        socketIo.emit('live-session-start', {
          sessionId: session._id,
          topic: session.topic,
          meetingLink: session.meetingLink
        });
      }
    }

    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Live Session Update Error' });
  }
};

// @desc    Register / Join live session
// @route   POST /api/live-sessions/:id/join
const joinLiveSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await LiveSession.findById(id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.attendees.includes(req.user.id)) {
      return res.status(200).json({ success: true, message: 'Already joined', session });
    }

    if (session.attendees.length >= session.maxSeats) {
      return res.status(400).json({ success: false, message: 'No seats available' });
    }

    session.attendees.push(req.user.id);
    await session.save();

    res.status(200).json({ success: true, message: 'Joined successfully', session });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Live Join Error' });
  }
};

module.exports = {
  getLiveSessions,
  createLiveSession,
  updateSessionStatus,
  joinLiveSession
};
