const Mentor = require('../models/Mentor');
const MentorSession = require('../models/MentorSession');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { awardXP } = require('./courseController');

// @desc    List all mentors with filters
// @route   GET /api/mentors
const getMentors = async (req, res) => {
  try {
    const { specialization, minRating, maxPrice } = req.query;
    let query = {};

    if (specialization) {
      query.specializations = { $in: [specialization] };
    }
    if (minRating) {
      query.avgRating = { $gte: parseFloat(minRating) };
    }
    if (maxPrice) {
      query.hourlyRate = { $lte: parseFloat(maxPrice) };
    }

    const mentors = await Mentor.find(query)
      .populate('user', 'name email avatar designation company location');

    res.status(200).json({ success: true, mentors });
  } catch (error) {
    console.error('Get Mentors Error:', error);
    res.status(500).json({ success: false, message: 'Server Mentors List Error' });
  }
};

// @desc    Book a mentor session
// @route   POST /api/mentor-sessions
const bookMentorSession = async (req, res) => {
  try {
    const { mentorId, date, timeSlot, type, agenda, paymentId } = req.body;

    const mentor = await Mentor.findById(mentorId).populate('user');
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor profile not found' });
    }

    // Mock payment receipt ID if free or not supplied
    const txId = paymentId || 'tx_mentor_' + Math.random().toString(36).substr(2, 9);

    const session = await MentorSession.create({
      user: req.user.id,
      mentor: mentorId,
      date,
      timeSlot,
      type,
      agenda,
      paymentId: txId,
      meetingLink: 'https://meet.google.com/mock-mentor-session',
      status: 'Pending'
    });

    // Notify Mentor (User)
    await Notification.create({
      user: mentor.user._id,
      type: 'mentor_session',
      title: '📅 New Mentorship Booking',
      message: `Learner "${req.user.name}" booked a session on "${type}" for ${new Date(date).toDateString()} at ${timeSlot}`,
      link: '/lms/mentorship'
    });

    // Award +20 XP to learner for taking initiative and booking a mentor session
    await awardXP(req.user.id, 'mentor_booking', 20, { badgeId: mentorId.toString() });

    res.status(201).json({ success: true, session });
  } catch (error) {
    console.error('Book Session Error:', error);
    res.status(500).json({ success: false, message: 'Server Session Booking Error' });
  }
};

// @desc    Get current user's session bookings
// @route   GET /api/mentor-sessions/me
const getMyBookings = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'mentor') {
      const mentorProfile = await Mentor.findOne({ user: req.user.id });
      if (!mentorProfile) {
        return res.status(200).json({ success: true, sessions: [] });
      }
      query = { mentor: mentorProfile._id };
    } else {
      query = { user: req.user.id };
    }

    const sessions = await MentorSession.find(query)
      .populate('user', 'name avatar email')
      .populate({
        path: 'mentor',
        populate: { path: 'user', select: 'name avatar designation' }
      })
      .sort({ date: 1 });

    res.status(200).json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Bookings Error' });
  }
};

// @desc    Confirm / Cancel session (by mentor or learner)
// @route   PATCH /api/mentor-sessions/:id
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, meetingLink } = req.body;

    const session = await MentorSession.findById(id).populate('user').populate({
      path: 'mentor',
      populate: { path: 'user' }
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session booking not found' });
    }

    if (status) session.status = status;
    if (notes) session.notes = notes;
    if (meetingLink) session.meetingLink = meetingLink;

    await session.save();

    // Trigger Notification for confirmation/cancellation
    let targetUserId = session.user._id;
    if (req.user.id.toString() === session.user._id.toString()) {
      targetUserId = session.mentor.user._id;
    }

    await Notification.create({
      user: targetUserId,
      type: 'mentor_session',
      title: `📅 Mentor Session: ${status}`,
      message: `Your booking for ${new Date(session.date).toDateString()} has been ${status.toLowerCase()}`,
      link: '/lms/mentorship'
    });

    // Update sessionsCompleted count on mentor if Completed
    if (status === 'Completed') {
      await Mentor.findByIdAndUpdate(session.mentor._id, { $inc: { sessionsCompleted: 1 } });
    }

    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Update Booking Error' });
  }
};

// @desc    Add feedback for a session
// @route   POST /api/mentor-sessions/:id/feedback
const addSessionFeedback = async (req, res) => {
  try {
    const { score, comment } = req.body;
    const { id } = req.params;

    const session = await MentorSession.findById(id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    session.feedback = { score, comment };
    await session.save();

    // Update Mentor Ratings average
    const mentor = await Mentor.findById(session.mentor);
    if (mentor) {
      mentor.ratings.push({
        user: req.user.id,
        score,
        review: comment
      });

      const totalScore = mentor.ratings.reduce((acc, curr) => acc + curr.score, 0);
      mentor.avgRating = Number((totalScore / mentor.ratings.length).toFixed(1));
      await mentor.save();
    }

    res.status(200).json({ success: true, message: 'Feedback submitted successfully', session });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Feedback Error' });
  }
};

module.exports = {
  getMentors,
  bookMentorSession,
  getMyBookings,
  updateBookingStatus,
  addSessionFeedback
};
