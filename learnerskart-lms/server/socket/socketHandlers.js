const Notification = require('../models/Notification');

const registerSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('Realtime socket client connected:', socket.id);

    // Client joins a private channel matching their User ID
    socket.on('join-room', (userId) => {
      socket.join(userId);
      console.log(`Socket ${socket.id} joined channel: ${userId}`);
    });

    // Client joins a course specific room for doubt discussion
    socket.on('join-course', (courseId) => {
      socket.join(courseId);
      console.log(`Socket ${socket.id} joined course doubts room: ${courseId}`);
    });

    // Student asks a doubt in a lesson
    socket.on('new-doubt', async (data) => {
      // data: { courseId, lessonId, questionText, userName }
      // Broadcast to course room (instructors + students active)
      socket.to(data.courseId).emit('doubt-broadcast', {
        lessonId: data.lessonId,
        questionText: data.questionText,
        userName: data.userName,
        timestamp: new Date()
      });
      console.log(`New doubt in course ${data.courseId}: ${data.questionText}`);
    });

    // Notification broadcast helper
    socket.on('send-notification', async (data) => {
      // data: { userId, title, message, type, link }
      // Save notification to DB
      try {
        const notif = await Notification.create({
          user: data.userId,
          type: data.type || 'live_session',
          title: data.title,
          message: data.message,
          link: data.link || ''
        });

        // Emit to specific user room
        io.to(data.userId).emit('notification', notif);
      } catch (err) {
        console.error('Socket notification save error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket client disconnected:', socket.id);
    });
  });
};

module.exports = registerSocketHandlers;
