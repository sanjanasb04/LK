const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Get user certificates
// @route   GET /api/certificates/me
const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.user.id })
      .populate('course', 'title category totalDuration thumbnail');
    
    res.status(200).json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Certificates Error' });
  }
};

// @desc    Get certificate by ID
// @route   GET /api/certificates/:id
const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('user', 'name')
      .populate('course', 'title category totalDuration totalLessons');

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    // Security check: Only owner or admin can view detail
    if (certificate.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized access to certificate details' });
    }

    res.status(200).json({ success: true, certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Certificate Lookup Error' });
  }
};

// @desc    Public verification of a certificate
// @route   GET /api/certificates/verify/:certId
const verifyCertificate = async (req, res) => {
  try {
    const { certId } = req.params;
    
    // Look up by verification code
    const certificate = await Certificate.findOne({ verificationId: certId })
      .populate('user', 'name designation avatar')
      .populate('course', 'title category totalDuration instructor')
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name signature' }
      });

    if (!certificate) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid Certificate verification ID. No match found on platform records.' 
      });
    }

    res.status(200).json({ 
      success: true, 
      valid: true,
      message: 'Certificate is authentic and valid.',
      certificate 
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    res.status(500).json({ success: false, message: 'Platform Verification Query Error' });
  }
};

// @desc    Manually generate a certificate (admin fallback/instructor issue)
// @route   POST /api/certificates/issue
const issueCertificate = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (!enrollment) {
      return res.status(400).json({ success: false, message: 'Student is not enrolled in this course' });
    }

    // Prevent duplicate certificates
    const existing = await Certificate.findOne({ user: userId, course: courseId });
    if (existing) {
      return res.status(200).json({ success: true, message: 'Certificate already issued', certificate: existing });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const verificationId = `LK-${new Date().getFullYear()}-${course.slug.toUpperCase().slice(0, 4)}-${Math.floor(10000 + Math.random() * 90000)}`;

    const certificate = await Certificate.create({
      user: userId,
      course: courseId,
      enrollment: enrollment._id,
      verificationId,
      pdfUrl: `/uploads/certificates/${verificationId}.pdf`,
      templateSnapshot: {
        instructorSignature: 'John Smith, Lead PMP Instructor',
        ceoSignature: 'CEO, LearnersKart'
      }
    });

    // Map to enrollment
    enrollment.certificateId = certificate._id;
    enrollment.isCompleted = true;
    enrollment.completedAt = new Date();
    await enrollment.save();

    res.status(201).json({ success: true, certificate });
  } catch (error) {
    console.error('Issue Certificate Error:', error);
    res.status(500).json({ success: false, message: 'Server Issuance Error' });
  }
};

module.exports = {
  getMyCertificates,
  getCertificateById,
  verifyCertificate,
  issueCertificate
};
