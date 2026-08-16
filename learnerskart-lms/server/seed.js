const mongoose = require('mongoose');

// Load environment first
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
if (process.env.USE_MOCK_DB === 'true') {
  require('./config/mockMongoose');
}

const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');
const Module = require('./models/Module');
const Lesson = require('./models/Lesson');
const Badge = require('./models/Badge');
const Mentor = require('./models/Mentor');
const Batch = require('./models/Batch');
const Community = require('./models/Community');
const Post = require('./models/Post');
const LiveSession = require('./models/LiveSession');
const Quiz = require('./models/Quiz');

// Read Environment properties fallback
const dbUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/learnerskart_lms';

async function seed() {
  try {
    console.log('Connecting to database:', dbUri);
    await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB. Starting seed sequence...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Module.deleteMany({}),
      Lesson.deleteMany({}),
      Badge.deleteMany({}),
      Mentor.deleteMany({}),
      Batch.deleteMany({}),
      Post.deleteMany({}),
      LiveSession.deleteMany({}),
      Quiz.deleteMany({})
    ]);
    console.log('Database cleared.');

    // 1. Create Default Badges
    const badges = await Badge.create([
      {
        slug: 'streak-master',
        name: 'Streak Master 🔥',
        description: 'Completed studies for 7 consecutive days.',
        icon: '⚡',
        criteria: 'Streak equals 7'
      },
      {
        slug: 'forum-expert',
        name: 'Forum Expert 💬',
        description: 'Posted a helpful answer inside the Doubt Corner.',
        icon: '🗣️',
        criteria: 'Helped solve community doubts'
      },
      {
        slug: 'quiz-ace',
        name: 'Quiz Ace 🏆',
        description: 'Passed an assessment check with a score of 100%.',
        icon: '💯',
        criteria: '100% quiz accuracy'
      }
    ]);
    console.log('Created Badges.');

    // 2. Create Users
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Rahul123', salt);
    const instPasswordHash = await bcrypt.hash('Instructor123', salt);
    const mentorPasswordHash = await bcrypt.hash('Mentor123', salt);
    const adminPasswordHash = await bcrypt.hash('Admin123', salt);

    const users = await User.create([
      {
        name: 'Rahul Krishnamurthy',
        email: 'rahul.pmp@gmail.com',
        phone: '+91 99999 99999',
        passwordHash: passwordHash,
        role: 'learner',
        xp: 2340,
        streak: 7,
        badges: ['streak-master']
      },
      {
        name: 'Authorized Instructor',
        email: 'instructor@learnerskart.com',
        phone: '+91 88888 88888',
        passwordHash: instPasswordHash,
        role: 'instructor'
      },
      {
        name: 'John Smith (Mentor)',
        email: 'mentor@learnerskart.com',
        phone: '+91 77777 77777',
        passwordHash: mentorPasswordHash,
        role: 'mentor',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        designation: 'PMP authorized trainer & Scrum Coach'
      },
      {
        name: 'Platform Administrator',
        email: 'admin@learnerskart.com',
        phone: '+91 66666 66666',
        passwordHash: adminPasswordHash,
        role: 'admin'
      }
    ]);
    console.log('Created Users.');

    const learner = users[0];
    const instructor = users[1];
    const mentorUser = users[2];

    // 3. Define Modules & Lessons for PMP
    const module1 = {
      title: 'Module 1: Project Environment Fundamentals',
      order: 1,
      lessons: [
        {
          _id: 'mock_lesson_l101',
          title: 'L101: Introduction to PMBOK 7th Edition Framework',
          type: 'video',
          content: 'https://www.w3schools.com/html/mov_bbb.mp4',
          duration: 10,
          order: 1
        },
        {
          _id: 'mock_lesson_l102',
          title: 'L102: Project vs Program vs Portfolio structures',
          type: 'video',
          content: 'https://www.w3schools.com/html/mov_bbb.mp4',
          duration: 15,
          order: 2
        },
        {
          _id: 'mock_lesson_l103',
          title: 'L103: Code of Ethics and Professional Conduct handbook',
          type: 'pdf',
          content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          duration: 20,
          order: 3
        }
      ]
    };

    const module2 = {
      title: 'Module 2: Project Initiating Processes Group',
      order: 2,
      lessons: [
        {
          _id: 'mock_lesson_l201',
          title: 'L201: Designing and Authorizing the Project Charter',
          type: 'video',
          content: 'https://www.w3schools.com/html/mov_bbb.mp4',
          duration: 12,
          order: 1
        },
        {
          _id: 'mock_lesson_l202',
          title: 'L202: Identifying and Profiling Key Stakeholders',
          type: 'video',
          content: 'https://www.w3schools.com/html/mov_bbb.mp4',
          duration: 18,
          order: 2
        },
        {
          _id: 'mock_lesson_l203',
          title: 'L203: Module 1-2 Assessment Checkpoint',
          type: 'quiz',
          content: 'q101',
          duration: 15,
          order: 3
        }
      ]
    };

    // 4. Create the 8 official LearnersKart courses
    const courses = await Course.create([
      {
        title: 'PMP® Certification Training Framework',
        slug: 'pmp-certification-training',
        subtitle: 'Master Agile, Predictive, and Hybrid Project Management Methodologies',
        description: 'Acquire 35 contact hours from authorized PMI partner. Learn critical paths, risk analysis and benefits planning.',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150',
        instructor: instructor._id,
        category: 'Project Management',
        level: 'Intermediate',
        price: 14999,
        isFree: false,
        isPublished: true,
        modules: [module1, module2],
        totalLessons: 6
      },
      {
        title: 'Lean Six Sigma Green Belt (LSSGB) Certification',
        slug: 'lean-six-sigma-green-belt',
        subtitle: 'Master Quality Management, DMAIC Methodologies, and Process Improvement',
        description: 'Learn to define, measure, analyze, improve, and control organizational processes. Includes case studies.',
        thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=150',
        instructor: instructor._id,
        category: 'Quality Management',
        level: 'Intermediate',
        price: 14999,
        isFree: false,
        isPublished: true,
        modules: [
          {
            title: 'Module 1: Define Phase & Project Charters',
            order: 1,
            lessons: [
              {
                _id: 'mock_lesson_lssgb_101',
                title: 'L101: Introduction to Lean Principles & DMAIC',
                type: 'video',
                content: 'https://www.w3schools.com/html/mov_bbb.mp4',
                duration: 12,
                order: 1
              },
              {
                _id: 'mock_lesson_lssgb_102',
                title: 'L102: Creating a Six Sigma Project Charter',
                type: 'pdf',
                content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                duration: 18,
                order: 2
              }
            ]
          }
        ],
        totalLessons: 2
      },
      {
        title: 'Lean Six Sigma Black Belt (LSSBB) Training',
        slug: 'lean-six-sigma-black-belt',
        subtitle: 'Lead Enterprise-Level Improvement Projects and Advanced Quality Operations',
        description: 'Advanced quality management, statistical hypothesis testing, design of experiments, and change management.',
        thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=150',
        instructor: instructor._id,
        category: 'Quality Management',
        level: 'Expert',
        price: 21999,
        isFree: false,
        isPublished: true,
        modules: [
          {
            title: 'Module 1: Advanced Measure and Analyze Phases',
            order: 1,
            lessons: [
              {
                _id: 'mock_lesson_lssbb_101',
                title: 'L101: Central Limit Theorem & Population Distributions',
                type: 'video',
                content: 'https://www.w3schools.com/html/mov_bbb.mp4',
                duration: 15,
                order: 1
              }
            ]
          }
        ],
        totalLessons: 1
      },
      {
        title: 'CBAP® – Certified Business Analysis Professional',
        slug: 'cbap-business-analysis',
        subtitle: 'Align with IIBA BABOK Guide v3.0 to Become a Premier Business Analyst Expert',
        description: 'Deep dive into requirements analysis, design definition, and solution evaluation strategies.',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=150',
        instructor: instructor._id,
        category: 'Business Analysis',
        level: 'Expert',
        price: 18999,
        isFree: false,
        isPublished: true,
        modules: [
          {
            title: 'Module 1: Business Analysis Planning and Monitoring',
            order: 1,
            lessons: [
              {
                _id: 'mock_lesson_cbap_101',
                title: 'L101: Core BABOK Guide Structures & Knowledge Areas',
                type: 'video',
                content: 'https://www.w3schools.com/html/mov_bbb.mp4',
                duration: 10,
                order: 1
              }
            ]
          }
        ],
        totalLessons: 1
      },
      {
        title: 'ECBA™ – Entry Certificate in Business Analysis',
        slug: 'ecba-business-analysis',
        subtitle: 'Launch Your Business Analysis Career with IIBA Foundational Training',
        description: 'Foundational training in requirements mapping, stakeholder collaboration, and core business terms.',
        thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=150',
        instructor: instructor._id,
        category: 'Business Analysis',
        level: 'Beginner',
        price: 8499,
        isFree: false,
        isPublished: true,
        modules: [
          {
            title: 'Module 1: Introduction to Business Analysis',
            order: 1,
            lessons: [
              {
                _id: 'mock_lesson_ecba_101',
                title: 'L101: Understanding requirements vs designs',
                type: 'video',
                content: 'https://www.w3schools.com/html/mov_bbb.mp4',
                duration: 8,
                order: 1
              }
            ]
          }
        ],
        totalLessons: 1
      },
      {
        title: 'PMI-ACP® Agile Certified Practitioner Prep',
        slug: 'pmi-acp-agile-practitioner',
        subtitle: 'Master Scrum, Kanban, Lean, and XP Frameworks for the PMI-ACP Exam',
        description: 'Comprehensive preparation for the PMI-ACP exam. Includes Agile methodologies, velocity tracking and Scrum.',
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=150',
        instructor: instructor._id,
        category: 'Agile',
        level: 'Intermediate',
        price: 0,
        isFree: true,
        isPublished: true,
        modules: [
          {
            title: 'Module 1: Agile Principles & Mindset',
            order: 1,
            lessons: [
              {
                _id: 'mock_lesson_pmiacp_101',
                title: 'L101: The Agile Manifesto and Twelve Principles',
                type: 'video',
                content: 'https://www.w3schools.com/html/mov_bbb.mp4',
                duration: 10,
                order: 1
              }
            ]
          }
        ],
        totalLessons: 1
      },
      {
        title: 'DevOps Practitioner Certification',
        slug: 'devops-practitioner',
        subtitle: 'Bridge Software Development and IT Operations with CI/CD, Docker and Kubernetes',
        description: 'Learn pipeline automation, deployment cycles, container orchestration, and server monitoring.',
        thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=150',
        instructor: instructor._id,
        category: 'DevOps',
        level: 'Intermediate',
        price: 16999,
        isFree: false,
        isPublished: true,
        modules: [
          {
            title: 'Module 1: Continual Integration and CI/CD Pipelines',
            order: 1,
            lessons: [
              {
                _id: 'mock_lesson_devops_101',
                title: 'L101: Automated Testing Integration in Pipelines',
                type: 'video',
                content: 'https://www.w3schools.com/html/mov_bbb.mp4',
                duration: 15,
                order: 1
              }
            ]
          }
        ],
        totalLessons: 1
      },
      {
        title: 'SAFe® 6.0 Product Owner / Product Manager (POPM)',
        slug: 'safe-product-owner-product-manager',
        subtitle: 'Deliver Customer Value in a Lean Enterprise with SAFe Framework POPM Role',
        description: 'Learn backlog refinement, planning program increments, and leading product strategy in large teams.',
        thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=150',
        instructor: instructor._id,
        category: 'SAFe',
        level: 'Expert',
        price: 27999,
        isFree: false,
        isPublished: true,
        modules: [
          {
            title: 'Module 1: Product Owner and Product Manager Roles in SAFe',
            order: 1,
            lessons: [
              {
                _id: 'mock_lesson_safe_101',
                title: 'L101: Backlog Grooming and User Story Mapping',
                type: 'video',
                content: 'https://www.w3schools.com/html/mov_bbb.mp4',
                duration: 12,
                order: 1
              }
            ]
          }
        ],
        totalLessons: 1
      }
    ]);

    const pmpCourse = courses[0];

    // Create default Quiz for Test 4 (Linked to PMP course)
    await Quiz.create({
      _id: 'q101',
      title: 'Module 1-2 Assessment Checkpoint',
      course: pmpCourse._id,
      timeLimit: 15,
      passPercentage: 80,
      questions: [
        {
          _id: 'ques1',
          questionText: 'A project manager is facing a risk of scheduling delays due to weather disruptions. They decide to outsource the construction work to a local firm, transferring the risk. What response strategy is this?',
          options: ['Avoid', 'Mitigate', 'Transfer', 'Accept'],
          correctAnswer: 'Transfer',
          explanation: 'Transferring risk allocates ownership of threat consequences to a third party.'
        },
        {
          _id: 'ques2',
          questionText: 'Activities on the critical path of a scheduling network have a total float of how many days?',
          options: ['0 days', '1 day', 'Depends on milestones', 'Infinity'],
          correctAnswer: '0 days',
          explanation: 'Activities on the critical path dictate the project deadline and thus have ZERO float.'
        }
      ]
    });

    // Create Mock Test 1 (PMP Course)
    await Quiz.create({
      _id: 'mock_test_pmp_01',
      title: 'Full PMP® Exam Simulation (Set 01)',
      course: pmpCourse._id,
      timeLimit: 180,
      passPercentage: 80,
      questions: [
        {
          _id: 'mq1',
          questionText: 'An agile development team is sizing user stories. They notice that a particular story has significant technical uncertainty. What should the team do next?',
          options: [
            'Size the story with high story points to buffer risk.',
            'Postpone the story to the final release cycle.',
            'Schedule a technical spike to research and reduce uncertainty.',
            'Assign the story to the most senior developer without sizing.'
          ],
          correctAnswer: 'Schedule a technical spike to research and reduce uncertainty.',
          explanation: 'In Agile, a Spike is a short timebox dedicated to research, prototyping, or resolving technical unknowns, allowing story sizing later.'
        },
        {
          _id: 'mq2',
          questionText: 'During a sprint, a stakeholder approaches a developer directly to request a critical modification. What should the developer do?',
          options: [
            'Decline the request and refer the stakeholder to the Product Owner.',
            'Accept the request and implement the modification immediately.',
            'Consult with the Scrum Master to get approval.',
            'Inform the Project Manager to update the scheduling spreadsheet.'
          ],
          correctAnswer: 'Decline the request and refer the stakeholder to the Product Owner.',
          explanation: 'The Product Owner holds sole responsibility for managing the product backlog and defining priorities. Stakeholders must route changes through them.'
        },
        {
          _id: 'mq3',
          questionText: 'A project manager is performing a cost analysis and calculates an EV of 50,000, and a PV of 60,000. What is the status of the project schedule?',
          options: [
            'Ahead of schedule (SPI = 1.2)',
            'Behind schedule (SPI = 0.83)',
            'On schedule (SPI = 1.0)',
            'Cannot be determined without AC'
          ],
          correctAnswer: 'Behind schedule (SPI = 0.83)',
          explanation: 'SPI = EV / PV = 50000 / 60000 = 0.83. Since SPI is less than 1.0, the project is behind schedule.'
        }
      ]
    });

    // Create Mock Test 2 (PMP Course)
    await Quiz.create({
      _id: 'mock_test_pmp_02',
      title: 'Full PMP® Exam Simulation (Set 02)',
      course: pmpCourse._id,
      timeLimit: 180,
      passPercentage: 80,
      questions: [
        {
          _id: 'mq2_1',
          questionText: 'A product owner repeatedly changes requirements during a sprint, causing confusion. What should the scrum master do?',
          options: [
            'Instruct the developers to ignore the product owner.',
            'Facilitate a meeting between the PO and team to realign on sprint goals.',
            'Cancel the sprint immediately.',
            'File a complaint with the project manager.'
          ],
          correctAnswer: 'Facilitate a meeting between the PO and team to realign on sprint goals.',
          explanation: 'Scrum Masters are servant leaders who facilitate communication and alignment to help the team meet goals.'
        },
        {
          _id: 'mq2_2',
          questionText: 'A project manager calculates CPI is 1.1, and SPI is 0.9. What is the project state?',
          options: [
            'Under budget and ahead of schedule.',
            'Over budget and behind schedule.',
            'Under budget and behind schedule.',
            'Over budget and ahead of schedule.'
          ],
          correctAnswer: 'Under budget and behind schedule.',
          explanation: 'CPI > 1 means under budget. SPI < 1 means behind schedule.'
        }
      ]
    });

    // Create Practice Quiz - People (PMP Course)
    await Quiz.create({
      _id: 'practice_people_01',
      title: 'PMP® Practice Quiz: People Domain',
      course: pmpCourse._id,
      timeLimit: 20,
      passPercentage: 70,
      questions: [
        {
          _id: 'pq_pe_1',
          questionText: 'A project manager notices conflicts between team members regarding task responsibilities. What tool or matrix should they review first?',
          options: ['CPM Schedule Network', 'RACI Matrix', 'Resource Breakdown Structure', 'Communications Management Plan'],
          correctAnswer: 'RACI Matrix',
          explanation: 'The RACI matrix (Responsible, Accountable, Consulted, Informed) maps task assignments and role definitions to clarify boundaries.'
        },
        {
          _id: 'pq_pe_2',
          questionText: 'A team member is underperforming. What should the project manager do first?',
          options: [
            'Report the member to HR.',
            'Meet with the member privately to understand their challenges.',
            'Assign their work to another developer.',
            'Issue a formal written warning.'
          ],
          correctAnswer: 'Meet with the member privately to understand their challenges.',
          explanation: 'Collaborative problem solving and individual conversations are the first steps to resolving team performance issues.'
        }
      ]
    });

    // Create Practice Quiz - Process (PMP Course)
    await Quiz.create({
      _id: 'practice_process_01',
      title: 'PMP® Practice Quiz: Process Domain',
      course: pmpCourse._id,
      timeLimit: 25,
      passPercentage: 70,
      questions: [
        {
          _id: 'pq_pr_1',
          questionText: 'Which mathematical formula is used to calculate the variance of an activity duration in PERT?',
          options: [
            '((Pessimistic - Optimistic) / 6)^2',
            '(Optimistic + 4*MostLikely + Pessimistic) / 6',
            'Pessimistic - Optimistic',
            '((Pessimistic - Optimistic) / 2)^2'
          ],
          correctAnswer: '((Pessimistic - Optimistic) / 6)^2',
          explanation: 'PERT standard deviation is (P - O) / 6. The variance is standard deviation squared, which yields ((P - O) / 6)^2.'
        },
        {
          _id: 'pq_pr_2',
          questionText: 'A project manager wants to analyze resource allocations across dates. What diagram should they use?',
          options: ['Gantt Chart', 'Resource Histogram', 'Fishbone Diagram', 'Scatter Plot'],
          correctAnswer: 'Resource Histogram',
          explanation: 'Resource Histograms visually graph resource allocations and loads over time to identify over-allocations.'
        }
      ]
    });

    // Create Practice Quiz - Business (PMP Course)
    await Quiz.create({
      _id: 'practice_business_01',
      title: 'PMP® Practice Quiz: Business Environment',
      course: pmpCourse._id,
      timeLimit: 15,
      passPercentage: 70,
      questions: [
        {
          _id: 'pq_be_1',
          questionText: 'To ensure a new project complies with international regulatory standards, what document must define the key constraints?',
          options: ['Project Charter', 'Project Business Case', 'Benefits Management Plan', 'Scope Management Plan'],
          correctAnswer: 'Project Charter',
          explanation: 'Compliance conditions, high-level requirements and governance boundaries are formally authorized inside the Project Charter.'
        },
        {
          _id: 'pq_be_2',
          questionText: 'An organization is shifting to agile. What is the project manager\'s role in aligning business strategy?',
          options: [
            'Continue enforcing rigid processes.',
            'Help transition the team and educate stakeholders on value delivery.',
            'Delegate all strategy to the product owner.',
            'Refuse the shift to protect traditional timelines.'
          ],
          correctAnswer: 'Help transition the team and educate stakeholders on value delivery.',
          explanation: 'Agile project managers act as change agents, helping the team adapt and aligning business stakeholders.'
        }
      ]
    });

    console.log('Created Course, Modules, Lessons & Quizzes.');

    // 6. Create Mentor Slot details
    await Mentor.create({
      user: mentorUser._id,
      hourlyRate: 1500,
      specialties: ['PMP Calculations', 'Agile Product Backlog Management', 'Resume Review'],
      availability: [
        { day: 'Monday', slots: ['10:00 AM', '02:00 PM', '04:00 PM'] },
        { day: 'Thursday', slots: ['10:00 AM', '11:00 AM', '03:00 PM'] }
      ]
    });
    console.log('Created Mentor slots.');

    // 7. Create Batches
    await Batch.create({
      name: 'PMP-AUGUST-COHORT',
      course: pmpCourse._id,
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-10-30'),
      mode: 'Online',
      learners: [learner._id]
    });
    console.log('Created Cohort Batch.');

    // 8. Create Live Sessions
    await LiveSession.create([
      {
        topic: '🔴 PMP Earned Value Management (EVM) Live Practice Group',
        course: pmpCourse._id,
        instructor: instructor._id,
        startTime: new Date(Date.now() + 10 * 60 * 1000), // in 10 minutes
        meetingLink: 'https://zoom.us/test',
        duration: 60,
        status: 'Upcoming',
        maxSeats: 50,
        mode: 'Zoom'
      },
      {
        topic: 'PERT Standard Deviation Calculation Masterclass',
        course: pmpCourse._id,
        instructor: instructor._id,
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
        recordingUrl: 'https://youtube.com',
        duration: 45,
        status: 'Completed',
        maxSeats: 100,
        mode: 'YouTube Live'
      }
    ]);
    console.log('Created Live sessions & records.');

    // 9. Create Community posts
    await Post.create([
      {
        category: '📚 PMP Study Group',
        title: 'Formula sheet for Earned Value Management (EVM)',
        body: 'Here is a quick cheat sheet for PMBOK formula calculations: CV = EV - AC, SV = EV - PV, CPI = EV / AC, SPI = EV / PV. Good luck!',
        author: learner._id,
        tags: ['EVM', 'calculations', 'PMP'],
        likes: [learner._id],
        comments: [
          {
            author: instructor._id,
            body: 'Excellent summary Rahul! Make sure to also remember that an index greater than 1.0 is favorable.',
            createdAt: new Date()
          }
        ]
      },
      {
        category: '🆘 Doubt Corner',
        title: 'Critical Path Method float calculation question',
        body: 'If an activity has an early start (ES) of 5, late start (LS) of 8, early finish (EF) of 12, late finish (LF) of 15, what is its slack?',
        author: learner._id,
        tags: ['CPM', 'Float', 'Schedule'],
        likes: []
      }
    ]);
    console.log('Created Community posts.');

    console.log('Database seeding successfully completed! Enjoy coding.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding process failed:', err);
    process.exit(1);
  }
}

seed();
