const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const XPActivity = require('../models/XPActivity');
const User = require('../models/User');
const Badge = require('../models/Badge');
const Notification = require('../models/Notification');

// Helper to award XP
const awardXP = async (userId, action, xp, meta = {}) => {
  const user = await User.findById(userId);
  if (!user) return;
  
  user.xp += xp;
  
  // Recalculate level
  const xpThresholds = [
    { level: 'Diamond', minXp: 6000 },
    { level: 'Platinum', minXp: 3000 },
    { level: 'Gold', minXp: 1500 },
    { level: 'Silver', minXp: 500 },
    { level: 'Bronze', minXp: 0 }
  ];
  let oldLevel = user.level;
  for (const threshold of xpThresholds) {
    if (user.xp >= threshold.minXp) {
      user.level = threshold.level;
      break;
    }
  }
  
  await user.save();
  
  // Record XP activity log
  await XPActivity.create({
    user: userId,
    action,
    xpEarned: xp,
    meta
  });

  return { xp, level: user.level, leveledUp: oldLevel !== user.level };
};

// Helper to trigger badges
const checkAndAwardBadges = async (userId, socketIo = null) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    const earnedBadges = user.badges || [];
    const allBadges = await Badge.find();
    const newBadgesEarned = [];

    // Count completed lessons
    const completedProgressCount = await Progress.countDocuments({ user: userId, isCompleted: true });
    
    // Count completed enrollments (courses completed)
    const completedEnrollments = await Enrollment.countDocuments({ user: userId, isCompleted: true });

    // Count quiz attempts
    const quizAttemptsPassed = await Progress.countDocuments({ 
      user: userId, 
      'quizAttempts.passed': true 
    });

    for (const badge of allBadges) {
      if (earnedBadges.includes(badge.slug)) continue;

      let meetsCondition = false;
      
      switch (badge.triggerType) {
        case 'lessons_completed':
          meetsCondition = completedProgressCount >= badge.triggerValue;
          break;
        case 'courses_completed':
          meetsCondition = completedEnrollments >= badge.triggerValue;
          break;
        case 'streak_days':
          meetsCondition = user.streak >= badge.triggerValue;
          break;
        case 'quiz_attempts_passed':
          meetsCondition = quizAttemptsPassed >= badge.triggerValue;
          break;
        default:
          break;
      }

      if (meetsCondition) {
        user.badges.push(badge.slug);
        newBadgesEarned.push(badge);
        
        // Award Badge XP
        if (badge.xpReward > 0) {
          user.xp += badge.xpReward;
          await XPActivity.create({
            user: userId,
            action: 'badge_unlock',
            xpEarned: badge.xpReward,
            meta: { badgeId: badge.slug }
          });
        }

        // Create Notification
        await Notification.create({
          user: userId,
          type: 'badge_unlock',
          title: `🎖️ Badge Unlocked: ${badge.name}`,
          message: `Congratulations! You unlocked the badge "${badge.name}" and earned +${badge.xpReward} XP!`,
          link: '/lms/badges'
        });

        // Socket emission if socketIo available
        if (socketIo) {
          socketIo.to(userId.toString()).emit('notification', {
            type: 'badge_unlock',
            title: `🎖️ Badge Unlocked: ${badge.name}`,
            message: badge.description,
            xpReward: badge.xpReward,
            badge
          });
        }
      }
    }

    if (newBadgesEarned.length > 0) {
      await user.save();
    }

    return newBadgesEarned;
  } catch (err) {
    console.error('Badge awarding error:', err);
    return [];
  }
};

// @desc    Get courses list
// @route   GET /api/courses
const getCourses = async (req, res) => {
  try {
    const { category, level, search, sort, page, limit } = req.query;
    let query = {};

    if (category && category !== 'All') query.category = category;
    if (level) query.level = level;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'rating') {
      sortOption = { avgRating: -1 };
    } else if (sort === 'alphabetical') {
      sortOption = { title: 1 };
    }

    const total = await Course.countDocuments(query);
    let coursesQuery = Course.find(query)
      .select('-modules')
      .populate('instructor', 'name avatar designation')
      .sort(sortOption);

    let pageNum = 1;
    let pages = 1;

    if (limit) {
      pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const skip = (pageNum - 1) * limitNum;
      coursesQuery = coursesQuery.skip(skip).limit(limitNum);
      pages = Math.ceil(total / limitNum) || 1;
    }

    const courses = await coursesQuery;

    res.status(200).json({ success: true, count: courses.length, total, pages, currentPage: pageNum, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Course Error' });
  }
};

// @desc    Get single course by slug
// @route   GET /api/courses/:slug
const getCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug })
      .populate('instructor', 'name avatar designation bio')
      .populate('ratings.user', 'name avatar');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Course Detail Error' });
  }
};

// @desc    Create new course
// @route   POST /api/courses
const createCourse = async (req, res) => {
  try {
    const { title, subtitle, description, category, level, language, price, isFree } = req.body;

    const course = new Course({
      title,
      subtitle,
      description,
      category,
      level,
      language,
      price: isFree ? 0 : price,
      isFree,
      instructor: req.user.id
    });

    await course.save();

    // Trigger Admin notification
    await Notification.create({
      user: req.user.id, // For log tracking
      type: 'enrollment', // Placeholder type
      title: 'Course Pending Review',
      message: `Instructor "${req.user.name}" submitted a new course: "${title}"`,
      link: '/lms/admin/courses'
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    console.error('Course Creation Error:', error);
    res.status(500).json({ success: false, message: 'Server Course Creation Error' });
  }
};

// @desc    Update course details
// @route   PUT /api/courses/:id
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Verify ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized modification' });
    }

    // Save fields
    const allowedUpdates = [
      'title', 'subtitle', 'description', 'thumbnail', 'promoVideo',
      'category', 'level', 'language', 'price', 'isFree', 'isPublished',
      'isUnderReview', 'modules', 'dripEnabled'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        course[field] = req.body[field];
      }
    });

    // Recalculate totals
    let totalLessons = 0;
    let totalDuration = 0;
    if (course.modules) {
      course.modules.forEach(mod => {
        if (mod.lessons) {
          totalLessons += mod.lessons.length;
          mod.lessons.forEach(l => {
            totalDuration += l.duration || 0;
          });
        }
      });
    }
    course.totalLessons = totalLessons;
    course.totalDuration = totalDuration;

    await course.save();

    res.status(200).json({ success: true, course });
  } catch (error) {
    console.error('Course Update Error:', error);
    res.status(500).json({ success: false, message: 'Server Course Update Error' });
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check existing enrollment
    const existingEnrollment = await Enrollment.findOne({ user: req.user.id, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    // Razorpay mock integration
    const paymentId = req.body.paymentId || 'pay_mock_' + Math.random().toString(36).substr(2, 9);

    const enrollment = await Enrollment.create({
      user: req.user.id,
      course: courseId,
      paymentId
    });

    // Create Notification
    await Notification.create({
      user: req.user.id,
      type: 'enrollment',
      title: '📚 Enrolled Successfully',
      message: `You have successfully enrolled in "${course.title}". Start learning now!`,
      link: `/lms/my-courses`
    });

    res.status(200).json({ success: true, enrollment });
  } catch (error) {
    console.error('Enrollment Error:', error);
    res.status(500).json({ success: false, message: 'Server Enrollment Error' });
  }
};

// @desc    Get user's progress in a course
// @route   GET /api/courses/:id/my-progress
const getCourseProgress = async (req, res) => {
  try {
    const courseId = req.params.id;
    const progresses = await Progress.find({ user: req.user.id, course: courseId });
    
    res.status(200).json({ success: true, progresses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Progress Retrieval Error' });
  }
};

// @desc    Mark lesson complete
// @route   POST /api/progress/lesson/:lessonId/complete
const completeLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { courseId } = req.body;

    let progress = await Progress.findOne({ user: req.user.id, course: courseId, lesson: lessonId });

    let alreadyCompleted = false;
    if (progress) {
      alreadyCompleted = progress.isCompleted;
      progress.isCompleted = true;
      progress.completedAt = new Date();
      await progress.save();
    } else {
      progress = await Progress.create({
        user: req.user.id,
        course: courseId,
        lesson: lessonId,
        isCompleted: true,
        completedAt: new Date()
      });
    }

    let xpResults = null;
    let badgeResults = [];

    // Award +30 XP for lesson completion (only if not already completed)
    if (!alreadyCompleted) {
      xpResults = await awardXP(req.user.id, 'lesson_complete', 30, { lessonId, courseId });
      
      // Send notification
      await Notification.create({
        user: req.user.id,
        type: 'lesson_complete',
        title: '⚡ XP Earned!',
        message: `Completed a lesson! Earned +30 XP.`,
        link: ''
      });

      // Check course completion status
      const course = await Course.findById(courseId);
      if (course) {
        // Collect all lesson ids from modules
        const allLessonIds = [];
        course.modules.forEach(m => {
          m.lessons.forEach(l => {
            allLessonIds.push(l._id.toString());
          });
        });

        // Count completed lessons for this course
        const completedCount = await Progress.countDocuments({
          user: req.user.id,
          course: courseId,
          lesson: { $in: allLessonIds },
          isCompleted: true
        });

        const isCourseFullyCompleted = completedCount === allLessonIds.length;
        if (isCourseFullyCompleted) {
          // Check if already completed in enrollment
          const enrollment = await Enrollment.findOne({ user: req.user.id, course: courseId });
          if (enrollment && !enrollment.isCompleted) {
            enrollment.isCompleted = true;
            enrollment.completedAt = new Date();
            await enrollment.save();

            // Award +200 XP for course completion
            await awardXP(req.user.id, 'course_complete', 200, { courseId });

            // Create notification
            await Notification.create({
              user: req.user.id,
              type: 'certificate_ready',
              title: '🏆 Course Completed!',
              message: `Congratulations! You finished "${course.title}". Your certificate is ready to download!`,
              link: '/lms/certificates'
            });
          }
        }
      }

      // Check badge awards
      const socketIo = req.app.get('socketio');
      badgeResults = await checkAndAwardBadges(req.user.id, socketIo);
    }

    res.status(200).json({
      success: true,
      progress,
      xpResults,
      badgeResults
    });
  } catch (error) {
    console.error('Lesson Complete Error:', error);
    res.status(500).json({ success: false, message: 'Server Lesson Completion Error' });
  }
};

// @desc    Save lesson video watch position
// @route   POST /api/progress/lesson/:lessonId/watch-time
const saveWatchTime = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { courseId, watchedSeconds } = req.body;

    let progress = await Progress.findOne({ user: req.user.id, course: courseId, lesson: lessonId });
    if (progress) {
      progress.watchedSeconds = watchedSeconds;
      await progress.save();
    } else {
      progress = await Progress.create({
        user: req.user.id,
        course: courseId,
        lesson: lessonId,
        watchedSeconds
      });
    }

    res.status(200).json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Watch Time Update Error' });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Course Deletion Error' });
  }
};

module.exports = {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  enrollInCourse,
  getCourseProgress,
  completeLesson,
  saveWatchTime,
  awardXP,
  checkAndAwardBadges,
  deleteCourse
};
