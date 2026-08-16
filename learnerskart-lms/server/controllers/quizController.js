const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Progress = require('../models/Progress');
const Notification = require('../models/Notification');
const { awardXP, checkAndAwardBadges } = require('./courseController');
const fs = require('fs');
const path = require('path');

// @desc    Get quiz details (without correct answers for learners)
// @route   GET /api/quiz/:quizId
const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Hide correct answers if role is learner
    let responseQuestions = quiz.questions;
    if (req.user.role === 'learner') {
      responseQuestions = quiz.questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        difficulty: q.difficulty,
        pointsValue: q.pointsValue
      }));
    }

    res.status(200).json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        course: quiz.course,
        module: quiz.module,
        timeLimit: quiz.timeLimit,
        passPercentage: quiz.passPercentage,
        attemptsAllowed: quiz.attemptsAllowed,
        questions: responseQuestions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Quiz Error' });
  }
};

// @desc    Submit a quiz attempt
// @route   POST /api/quiz/:quizId/attempt
const submitQuizAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers, lessonId, courseId } = req.body; // array of { questionId, answer }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    let correctCount = 0;
    const gradedAnswers = quiz.questions.map(q => {
      const userAnswerObj = answers.find(a => a.questionId.toString() === q._id.toString());
      const userAnswerText = userAnswerObj ? userAnswerObj.answer : '';
      const isCorrect = q.correctAnswer.trim().toLowerCase() === userAnswerText.trim().toLowerCase();
      
      if (isCorrect) {
        correctCount++;
      }

      return {
        questionId: q._id,
        answer: userAnswerText,
        isCorrect
      };
    });

    const scorePercentage = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = scorePercentage >= quiz.passPercentage;

    // Create QuizAttempt
    const attempt = await QuizAttempt.create({
      user: req.user.id,
      quiz: quizId,
      answers: gradedAnswers,
      score: scorePercentage,
      passed
    });

    // Save to Progress attempts for lesson completeness tracking
    if (lessonId && courseId) {
      let progress = await Progress.findOne({ user: req.user.id, course: courseId, lesson: lessonId });
      
      const newAttempt = {
        score: scorePercentage,
        passed,
        attemptedAt: new Date()
      };

      if (progress) {
        if (!progress.quizAttempts) {
          progress.quizAttempts = [];
        }
        progress.quizAttempts.push(newAttempt);
        // Automatically mark lesson completed if they pass the quiz!
        if (passed) {
          progress.isCompleted = true;
          progress.completedAt = new Date();
        }
        await progress.save();
      } else {
        progress = await Progress.create({
          user: req.user.id,
          course: courseId,
          lesson: lessonId,
          isCompleted: passed,
          completedAt: passed ? new Date() : null,
          quizAttempts: [newAttempt]
        });
      }
    }

    // Award XP if passed
    let xpAwarded = 0;
    let xpResults = null;
    let badgeResults = [];

    if (passed) {
      // XP Logic:
      // Perfect score (100%): +100 XP
      // Score >= 80%: +75 XP
      // Score >= 60% (and passed): +50 XP
      if (scorePercentage === 100) {
        xpAwarded = 100;
      } else if (scorePercentage >= 80) {
        xpAwarded = 75;
      } else {
        xpAwarded = 50;
      }

      xpResults = await awardXP(req.user.id, 'quiz_pass', xpAwarded, { lessonId, courseId });

      await Notification.create({
        user: req.user.id,
        type: 'lesson_complete',
        title: '🧪 Quiz Passed!',
        message: `Passed quiz "${quiz.title}" with ${scorePercentage}%. Earned +${xpAwarded} XP!`,
        link: ''
      });

      // Check badge awards
      const socketIo = req.app.get('socketio');
      badgeResults = await checkAndAwardBadges(req.user.id, socketIo);
    }

    res.status(200).json({
      success: true,
      attempt,
      scorePercentage,
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
      xpAwarded,
      xpResults,
      badgeResults,
      questions: quiz.questions // send full questions with explanations and answers back to show feedback
    });
  } catch (error) {
    console.error('Quiz Submission Error:', error);
    res.status(500).json({ success: false, message: 'Server Quiz Submission Error' });
  }
};

// @desc    Get user's attempts for a quiz
// @route   GET /api/quiz/:quizId/attempts
const getQuizAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user.id, quiz: req.params.quizId })
      .sort({ attemptedAt: -1 });
    
    res.status(200).json({ success: true, attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Quiz Attempts Error' });
  }
};

// @desc    Get all quizzes (with questionCount included)
// @route   GET /api/quiz
const getAllQuizzes = async (req, res) => {
  try {
    const rawQuizzes = await Quiz.find();
    const quizzes = rawQuizzes.map(q => {
      const obj = q.toObject ? q.toObject() : { ...q };
      obj.questionCount = obj.questions ? obj.questions.length : 0;
      delete obj.questions;
      return obj;
    });
    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Quiz List Error' });
  }
};

// @desc    Delete quiz set by ID or Title
// @route   DELETE /api/quiz/:quizId
const deleteQuiz = async (req, res) => {
  try {
    const target = req.params.quizId;
    let quiz = null;
    
    try {
      quiz = await Quiz.findByIdAndDelete(target);
    } catch (e) {
      // Ignore Invalid ObjectId format error to fallback to title search
    }

    if (!quiz) {
      quiz = await Quiz.findOneAndDelete({ title: new RegExp(`^${target}$`, 'i') });
    }
    if (!quiz) {
      quiz = await Quiz.findOneAndDelete({ title: { $regex: target, $options: 'i' } });
    }

    // Also update Quiz.json directly for local DB persistence
    const jsonPath = path.join(__dirname, '../data/json_db/Quiz.json');
    if (fs.existsSync(jsonPath)) {
      try {
        const raw = fs.readFileSync(jsonPath, 'utf8');
        const list = JSON.parse(raw);
        const targetClean = target.trim().toLowerCase();
        const filtered = list.filter(q => q._id !== target && (q.title || '').trim().toLowerCase() !== targetClean);
        fs.writeFileSync(jsonPath, JSON.stringify(filtered, null, 2), 'utf8');
      } catch (e) {
        console.warn('Could not write Quiz.json deletion:', e);
      }
    }

    res.status(200).json({ success: true, message: 'Quiz set deleted successfully' });
  } catch (error) {
    console.error('Quiz Deletion Error:', error);
    res.status(500).json({ success: false, message: 'Server Quiz Deletion Error: ' + error.message });
  }
};

// @desc    Parse uploaded document text into MCQs automatically
// @route   POST /api/quiz/parse-document
const parseDocument = async (req, res) => {
  try {
    const { documentText, title, accessLevel, testType } = req.body;
    const text = documentText || '';
    const extracted = [];

    if (text.trim().length > 20) {
      const blocks = text.split(/(?=\b(?:Question|\bQ\d*[\.\:\)]|\d{1,3}[\.\:\)])\s+)/i);
      
      blocks.forEach((block) => {
        const str = block.trim();
        if (str.length < 15) return;

        const qMatch = str.match(/^(?:Question\s*\d*[\.\:\)]?|\bQ\d*[\.\:\)]?|\d{1,3}[\.\:\)])?\s*([\s\S]+?)(?=\b[A-Da-d1-4][\.\:\)]|\n[A-Da-d1-4][\.\:\)]|$)/i);
        const questionText = qMatch ? qMatch[1].trim().replace(/^\d+[\.\:\)]\s*/, '') : str.substring(0, 180);

        const opts = [];
        const optMatches = [...str.matchAll(/(?:^|\n|\s)[A-Da-d1-4][\.\:\)]\s*([^\n]+)/g)];
        optMatches.forEach(m => {
          if (m[1] && m[1].trim()) opts.push(m[1].trim());
        });

        const optionsObj = {
          A: opts[0] || 'Analyze baseline metrics and impact',
          B: opts[1] || 'Evaluate change request via Integrated Change Control',
          C: opts[2] || 'Update risk register and notify sponsor',
          D: opts[3] || 'Perform Root Cause Analysis (RCA)'
        };

        const ansMatch = str.match(/(?:Answer|Ans|Correct Answer|Key)\s*[:\-]?\s*([A-Da-d1-4])/i);
        let correctAnswer = 'B';
        if (ansMatch) {
          const char = ansMatch[1].toUpperCase();
          if (['A','1'].includes(char)) correctAnswer = 'A';
          else if (['B','2'].includes(char)) correctAnswer = 'B';
          else if (['C','3'].includes(char)) correctAnswer = 'C';
          else if (['D','4'].includes(char)) correctAnswer = 'D';
        }

        const expMatch = str.match(/(?:Explanation|Rationale|Note)\s*[:\-]?\s*([^\n]+)/i);
        const explanation = expMatch ? expMatch[1].trim() : 'PMBOK Guide & Quality Control Standards dictate standard change evaluation before implementation.';

        if (questionText.length > 5) {
          extracted.push({
            _id: `q_${Date.now()}_${extracted.length}`,
            question: questionText,
            questionText: questionText,
            options: optionsObj,
            correctAnswer,
            explanation,
            domain: extracted.length % 3 === 0 ? 'People' : (extracted.length % 3 === 1 ? 'Process' : 'Business Environment'),
            difficulty: 'medium',
            pointsValue: 10
          });
        }
      });
    }

    res.status(200).json({
      success: true,
      totalParsedCount: extracted.length,
      questions: extracted,
      preview: extracted.slice(0, 3)
    });
  } catch (error) {
    console.error('Parse Document Error:', error);
    res.status(500).json({ success: false, message: 'Parsing Error: ' + error.message });
  }
};

// @desc    Create new quiz set
// @route   POST /api/quiz
const createQuiz = async (req, res) => {
  try {
    const { title, course, module, timeLimit, passPercentage, questions, category, accessLevel } = req.body;
    const quiz = await Quiz.create({
      _id: req.body._id || 'quiz_' + Math.random().toString(36).substr(2, 9),
      title,
      course,
      module,
      timeLimit,
      passPercentage,
      questions,
      category: category || 'mock',
      accessLevel: accessLevel || 'free'
    });
    res.status(201).json({ success: true, quiz });
  } catch (error) {
    console.error('Quiz Creation Error:', error);
    res.status(500).json({ success: false, message: 'Server Quiz Creation Error' });
  }
};

module.exports = {
  getQuiz,
  submitQuizAttempt,
  getQuizAttempts,
  getAllQuizzes,
  deleteQuiz,
  createQuiz,
  parseDocument
};
