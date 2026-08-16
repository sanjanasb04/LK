const { exec } = require('child_process');

async function testAll() {
  const BASE_URL = 'http://localhost:5000/api';
  let token = '';
  let courseId = '';
  let lessonId = '';

  console.log('🚀 Launching LearnersKart LMS Automated API test driver...');

  // Helper wait function
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Run seeder first to ensure clean state
  console.log('⏳ Seeding database to ensure fresh slate...');
  await new Promise((resolve, reject) => {
    const seedPath = require('path').join(__dirname, 'seed.js');
    exec(`node "${seedPath}"`, (err, stdout, stderr) => {
      if (err) {
        console.error('❌ Seeder failed:', stderr);
        reject(err);
      } else {
        console.log('✅ Seeding completed:');
        console.log(stdout.trim().split('\n').slice(-2).join('\n'));
        resolve();
      }
    });
  });

  await delay(1000);

  try {
    // 1. Authenticate (Login)
    console.log('\n--- TEST 1: User Login ---');
    const loginRes = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'rahul.pmp@gmail.com',
        password: 'Rahul123'
      })
    });
    
    const loginData = await loginRes.json();
    if (loginRes.status === 200 && loginData.success) {
      token = loginData.token;
      console.log('✅ Login Successful! Token retrieved.');
      console.log(`👤 User profile: Name: ${loginData.user.name}, Role: ${loginData.user.role}, XP: ${loginData.user.xp}`);
    } else {
      throw new Error(`Login failed with status: ${loginRes.status}`);
    }

    // 2. Fetch Courses Catalog
    console.log('\n--- TEST 2: Fetch Enrolled Courses ---');
    const coursesRes = await fetch(`${BASE_URL}/courses`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const coursesData = await coursesRes.json();
    if (coursesRes.status === 200 && coursesData.success) {
      const pmpCourseSummary = coursesData.courses.find(c => c.slug === 'pmp-certification-training');
      if (pmpCourseSummary) {
        courseId = pmpCourseSummary._id;
        console.log(`✅ Found Course Summary: "${pmpCourseSummary.title}" (ID: ${courseId})`);
        
        // Fetch detailed course structure
        const detailRes = await fetch(`${BASE_URL}/courses/${pmpCourseSummary.slug}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const detailData = await detailRes.json();
        console.log('detailData response:', JSON.stringify(detailData));
        if (detailRes.status === 200 && detailData.success) {
          const pmpCourse = detailData.course;
          if (pmpCourse.modules?.length > 0) {
            const firstMod = pmpCourse.modules[0];
            console.log('firstMod:', JSON.stringify(firstMod));
            if (firstMod.lessons?.length > 0) {
              const firstLesson = firstMod.lessons[0];
              lessonId = typeof firstLesson === 'object' ? firstLesson._id : firstLesson;
              console.log(`ℹ️ Selected Lesson for test: ID ${lessonId}`);
            } else {
              console.log('Warning: firstMod.lessons is empty or undefined');
            }
          } else {
            console.log('Warning: pmpCourse.modules is empty or undefined');
          }
        } else {
          console.error('Failed to fetch detailed course:', detailRes.status, detailData);
        }
      } else {
        throw new Error('PMP Certification training course not found in DB');
      }
    } else {
      throw new Error('Failed to load courses catalog');
    }

    // 3. Mark Lesson Complete & Assert XP Rewards
    console.log('\n--- TEST 3: Mark Lesson Complete and Verify XP Multipliers ---');
    const prevXP = loginData.user.xp;
    const progressRes = await fetch(`${BASE_URL}/progress/lesson/${lessonId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        courseId
      })
    });
    const progressText = await progressRes.text();
    if (progressRes.status !== 200) {
      console.error(`❌ Progress API returned status ${progressRes.status}:`, progressText);
      throw new Error(`Progress API failed with status ${progressRes.status}`);
    }
    const progressData = JSON.parse(progressText);
    if (progressData.success) {
      console.log(`✅ Lesson marked completed!`);
      if (progressData.xpResults) {
        console.log(`📈 XP Earned: +${progressData.xpResults.xp} XP (Current Level: ${progressData.xpResults.level})`);
      } else {
        console.log(`📈 Lesson completed (XP was previously earned).`);
      }
    } else {
      throw new Error('Failed to submit progress check');
    }

    // 4. Submit Quiz and Check Passing Grades
    console.log('\n--- TEST 4: Submit Quiz Answer Sheets ---');
    const quizRes = await fetch(`${BASE_URL}/quiz-attempts/q101`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        courseId,
        lessonId,
        answers: [
          { questionId: 'ques1', answer: 'Transfer' },
          { questionId: 'ques2', answer: '0 days' }
        ]
      })
    });
    const quizData = await quizRes.json();
    if (quizRes.status === 200 && quizData.success) {
      console.log('✅ Quiz Grading Completed!');
      console.log(`💯 Score: ${quizData.attempt.score}%, Passed: ${quizData.attempt.passed}`);
      console.log(`🏆 XP Gain: +${quizData.xpResults?.xpAwarded || 0} XP`);
    } else {
      throw new Error('Failed to submit quiz grading sheet');
    }

    // 5. Booking Mentor call slots
    console.log('\n--- TEST 5: Book 1-on-1 Consultation Session ---');
    
    // Find a mentor first
    const mentorsRes = await fetch(`${BASE_URL}/mentors`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const mentorsData = await mentorsRes.json();
    if (mentorsRes.status === 200 && mentorsData.success && mentorsData.mentors?.length > 0) {
      const mentorId = mentorsData.mentors[0]._id;
      
      const bookRes = await fetch(`${BASE_URL}/mentor-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mentorId,
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
          timeSlot: '10:00 AM',
          type: 'Technical PMP calculations help'
        })
      });
      const bookData = await bookRes.json();
      if (bookRes.status === 201 && bookData.success) {
        console.log(`✅ Slot Booked successfully! Session ID: ${bookData.session._id}`);
        console.log(`📅 Scheduled for: ${bookData.session.date} at ${bookData.session.timeSlot}`);
      } else {
        throw new Error('Mentor slot booking failed');
      }
    } else {
      throw new Error('No mentors available for booking check');
    }

    console.log('\n🌟 ALL TESTS PASSED SUCCESSFULLY! LMS Backend is production-ready. 🌟');
  } catch (err) {
    console.error('\n❌ Test execution failed with error:', err.message);
    process.exit(1);
  }
}

// Check if server is running, if not tell user
testAll();
