const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Batch = require('../models/Batch');
const Mentor = require('../models/Mentor');
const LiveSession = require('../models/LiveSession');

// @desc    Get dashboard statistics for administrator
// @route   GET /api/admin/stats
const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeThisMonth = await User.countDocuments({ role: 'learner', isSuspended: false });
    const newThisWeek = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const draftCourses = await Course.countDocuments({ isPublished: false, isUnderReview: false });
    const reviewCourses = await Course.countDocuments({ isUnderReview: true });

    const totalEnrollments = await Enrollment.countDocuments();
    const totalCompletions = await Enrollment.countDocuments({ isCompleted: true });

    // Mock revenue from payments
    const enrollments = await Enrollment.find().populate('course', 'price');
    const revenue = enrollments.reduce((acc, curr) => {
      if (curr.course && curr.course.price) {
        return acc + curr.course.price;
      }
      return acc;
    }, 0);

    // Mock Top Courses by Enrollment
    const courseEnrollmentCounts = {};
    const allEnrollments = await Enrollment.find().populate('course', 'title');
    allEnrollments.forEach(en => {
      if (en.course) {
        const title = en.course.title;
        courseEnrollmentCounts[title] = (courseEnrollmentCounts[title] || 0) + 1;
      }
    });

    const topCourses = Object.keys(courseEnrollmentCounts).map(title => ({
      title,
      enrollments: courseEnrollmentCounts[title]
    })).sort((a, b) => b.enrollments - a.enrollments).slice(0, 5);

    // Mock active users timeline (last 7 days)
    const dailyActiveUsers = [
      { day: 'Mon', active: Math.floor(Math.random() * 50) + 200 },
      { day: 'Tue', active: Math.floor(Math.random() * 50) + 210 },
      { day: 'Wed', active: Math.floor(Math.random() * 50) + 230 },
      { day: 'Thu', active: Math.floor(Math.random() * 50) + 220 },
      { day: 'Fri', active: Math.floor(Math.random() * 50) + 240 },
      { day: 'Sat', active: Math.floor(Math.random() * 50) + 180 },
      { day: 'Sun', active: Math.floor(Math.random() * 50) + 190 }
    ];

    res.status(200).json({
      success: true,
      stats: {
        users: { totalUsers, activeThisMonth, newThisWeek },
        courses: { total: totalCourses, published: publishedCourses, draft: draftCourses, review: reviewCourses },
        enrollments: { total: totalEnrollments, completions: totalCompletions },
        revenue,
        topCourses,
        dailyActiveUsers
      }
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ success: false, message: 'Server Stats Error' });
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Users Lookup Error' });
  }
};

// @desc    Update user status / role (Admin suspension control)
// @route   PATCH /api/admin/users/:id
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isSuspended } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role) user.role = role;
    if (isSuspended !== undefined) user.isSuspended = isSuspended;

    await user.save();

    res.status(200).json({ success: true, message: 'User settings updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server User Modification Error' });
  }
};

// @desc    Download reports (excel mock)
// @route   GET /api/admin/reports/:type
const downloadReport = async (req, res) => {
  try {
    const { type } = req.params; // 'enrollment', 'revenue', 'quiz'
    let data = '';

    if (type === 'enrollment') {
      const enrollments = await Enrollment.find().populate('user', 'name email').populate('course', 'title');
      data = 'Learner Name,Email,Course Enrolled,Date Enrolled,Completed\n';
      enrollments.forEach(en => {
        if (en.user && en.course) {
          data += `"${en.user.name}","${en.user.email}","${en.course.title}","${en.enrolledAt.toDateString()}","${en.isCompleted ? 'Yes' : 'No'}"\n`;
        }
      });
    } else if (type === 'revenue') {
      const enrollments = await Enrollment.find().populate('user', 'name email').populate('course', 'title price');
      data = 'Learner Name,Email,Course,Price Paid,Payment ID,Date\n';
      enrollments.forEach(en => {
        if (en.user && en.course) {
          data += `"${en.user.name}","${en.user.email}","${en.course.title}",₹${en.course.price},"${en.paymentId}","${en.enrolledAt.toDateString()}"\n`;
        }
      });
    } else {
      data = 'Report Column 1,Column 2,Column 3\nMock Data 1,Mock Data 2,Mock Data 3\n';
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=report-${type}-${Date.now()}.csv`);
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Report Generation Error' });
  }
};

module.exports = {
  getPlatformStats,
  getAllUsers,
  updateUserStatus,
  downloadReport
};
