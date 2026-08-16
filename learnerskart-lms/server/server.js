require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    credentials: true
  }
});

// Set socketio as app property for access within controllers
app.set('socketio', io);

// Load Socket Handlers
const registerSocketHandlers = require('./socket/socketHandlers');
registerSocketHandlers(io);

// Middlewares
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(cookieParser());

// Cors setup
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true
}));

// Setup public uploads folder
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Serve a static default certificate directory
const certDir = path.join(uploadsDir, 'certificates');
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir, { recursive: true });
}

// Import all API routes
const userRoutes = require('./routes/User');
const courseRoutes = require('./routes/Course');
const progressRoutes = require('./routes/Progress');
const quizRoutes = require('./routes/Quiz');
const quizAttemptRoutes = require('./routes/QuizAttempt');
const certificateRoutes = require('./routes/Certificate');
const badgeRoutes = require('./routes/Badge');
const xpActivityRoutes = require('./routes/XPActivity');
const noteRoutes = require('./routes/Note');
const batchRoutes = require('./routes/Batch');
const liveSessionRoutes = require('./routes/LiveSession');
const mentorRoutes = require('./routes/Mentor');
const mentorSessionRoutes = require('./routes/MentorSession');
const communityRoutes = require('./routes/Community');
const postRoutes = require('./routes/Post');
const commentRoutes = require('./routes/Comment');
const notificationRoutes = require('./routes/Notification');
const moduleRoutes = require('./routes/Module');
const lessonRoutes = require('./routes/Lesson');
const adminRoutes = require('./routes/admin');
const enrollmentRoutes = require('./routes/Enrollment');
const uploadRoutes = require('./routes/upload.routes');
const blogRoutes = require('./routes/Blog');
const paymentRoutes = require('./routes/Payment');


// Mount routes
app.use('/api/auth', userRoutes); // User maps auth routes
app.use('/api/users', userRoutes); // User maps user profile endpoints
app.use('/api/courses', courseRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/quiz-attempts', quizAttemptRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/xp', xpActivityRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/live-sessions', liveSessionRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/mentor-sessions', mentorSessionRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'LMS Backend Server running smoothly' });
});

// Root route
app.get('/', (req, res) => {
  res.send('LearnersKart LMS API Gateway is online.');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('LMS Backend Unhandled Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`LMS server listening on port ${PORT}`);
});
