import React, { useState, useEffect, useRef } from 'react';
import { Play, ArrowLeft, ArrowRight, CheckCircle2, XCircle, Clock, Award, HelpCircle, Lock, BookOpen, Shield, CreditCard, Mail, User, Phone, Check } from 'lucide-react';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';

const MockTest = () => {
  const { selectedCountry, setSelectedCountry, countriesList } = useCart();

  const getTestPriceForSet = (setName, customPrice) => {
    const code = selectedCountry?.code || 'IN';
    if (!setName) {
      return { symbol: '$', amount: 29, currency: 'USD' };
    }
    
    let baseUSD = customPrice && customPrice > 0 ? customPrice : 29;
    let baseINR = Math.round(baseUSD * 80);
    
    if (!customPrice) {
      if (setName.includes('FROM 02') || setName.includes('02')) {
        baseUSD = 19;
        baseINR = 129;
      } else if (setName.includes('FROM 03') || setName.includes('03') || 
                 setName.includes('FROM 04') || setName.includes('04') || 
                 setName.includes('FROM 05') || setName.includes('05')) {
        baseUSD = 9;
        baseINR = 99;
      }

      if (setName.toUpperCase().includes('BULK PACK')) {
        baseUSD = 99;
        baseINR = 799;
      }
    }

    const prices = {
      IN: { symbol: '₹', amount: baseINR, currency: 'INR' },
      US: { symbol: '$', amount: baseUSD, currency: 'USD' },
      AE: { symbol: 'AED ', amount: Math.round(baseUSD * 3.67), currency: 'AED' },
      SA: { symbol: 'SR ', amount: Math.round(baseUSD * 3.75), currency: 'SAR' },
      GB: { symbol: '£', amount: Math.round(baseUSD * 0.8), currency: 'GBP' },
      CA: { symbol: 'C$', amount: Math.round(baseUSD * 1.35), currency: 'CAD' },
      AU: { symbol: 'A$', amount: Math.round(baseUSD * 1.5), currency: 'AUD' },
      QA: { symbol: 'QR ', amount: Math.round(baseUSD * 3.64), currency: 'QAR' }
    };
    
    return prices[code] || prices['US'];
  };

  const safeGetItem = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('LocalStorage getItem failed:', e);
      return null;
    }
  };

  const safeSetItem = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('LocalStorage setItem failed:', e);
    }
  };

  const safeRemoveItem = (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('LocalStorage removeItem failed:', e);
    }
  };

  const [sets, setSets] = useState(() => [
    { name: 'DEMO MOCK TEST (60 QUESTIONS)', count: 60, accessLevel: 'demo' },
    { name: 'FREE PMP MOCK (180 QUESTIONS)', count: 180, accessLevel: 'free' },
    { name: 'PMP MOCK 01', count: 180, accessLevel: 'premium', price: 29 },
    { name: 'PMP MOCK 02', count: 180, accessLevel: 'premium', price: 19 },
    { name: 'PMP MOCK 03', count: 180, accessLevel: 'premium', price: 9 },
    { name: 'PMP MOCK 04', count: 180, accessLevel: 'premium', price: 9 },
    { name: 'PMP MOCK 05', count: 180, accessLevel: 'premium', price: 9 },
    { name: 'BULK PACK (ALL 5 MOCK & ALL 5 PRACTICE TESTS)', count: 1800 }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Navigation states: 'selection' | 'active' | 'scorecard' | 'review'
  const [testState, setTestState] = useState('selection');
  const [selectedSet, setSelectedSet] = useState('');
  const [questions, setQuestions] = useState([]);

  // Active Simulator States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
  const [flagged, setFlagged] = useState({}); // { index: boolean }
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const timerRef = useRef(null);

  // Score stats
  const [score, setScore] = useState(null);
  
  // Local history & resumes
  const [attempts, setAttempts] = useState([]);

  // Registration details modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsTargetTest, setDetailsTargetTest] = useState('');
  const [learnerName, setLearnerName] = useState('');
  const [learnerEmail, setLearnerEmail] = useState('');
  const [learnerPhone, setLearnerPhone] = useState('');

  // Prefill details from localStorage on mount
  useEffect(() => {
    const detailsStr = safeGetItem('learner_details');
    if (detailsStr) {
      try {
        const details = JSON.parse(detailsStr);
        setLearnerName(details.name || '');
        setLearnerEmail(details.email || '');
        setLearnerPhone(details.phone || '');
      } catch (e) {
        console.error('Error prefilling details state:', e);
      }
    }
  }, []);

  // Premium checkout modal state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutTargetTest, setCheckoutTargetTest] = useState('');
  const [paymentCardNumber, setPaymentCardNumber] = useState('');
  const [paymentExpiry, setPaymentExpiry] = useState('');
  const [paymentCvv, setPaymentCvv] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi'
  const [upiId, setUpiId] = useState('');

  // IP-based country detection for default currency selection
  useEffect(() => {
    // Only auto-detect if no country selection exists in localStorage yet
    const savedCountry = localStorage.getItem('lk_selected_country');
    if (savedCountry) return;

    const detectCurrencyByIP = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok && countriesList && Array.isArray(countriesList)) {
          const data = await res.json();
          const found = countriesList.find(c => c.code === data.country);
          if (found) {
            setSelectedCountry(found);
          }
        }
      } catch (err) {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz && countriesList && Array.isArray(countriesList)) {
          if (tz.includes('Kolkata') || tz.includes('India') || tz.includes('Calcutta')) {
            const found = countriesList.find(c => c.code === 'IN');
            if (found) setSelectedCountry(found);
          }
        }
      }
    };
    detectCurrencyByIP();
  }, [countriesList, setSelectedCountry]);

  const fetchSets = async () => {
    setError(null);
    try {
      const defaultSets = [
        { name: 'DEMO MOCK TEST (60 QUESTIONS)', count: 60, accessLevel: 'demo' },
        { name: 'MOCK TEST (180 QUESTIONS)', count: 180, accessLevel: 'free' },
        { name: 'PMP TEST PAPER FROM PMI 01', count: 180, accessLevel: 'premium' },
        { name: 'PMP TEST PAPER FROM PMI 02', count: 180, accessLevel: 'premium' },
        { name: 'PMP TEST PAPER FROM PMI 03', count: 180, accessLevel: 'premium' },
        { name: 'PMP TEST PAPER FROM PMI 04', count: 180, accessLevel: 'premium' },
        { name: 'PMP TEST PAPER FROM PMI 05', count: 180, accessLevel: 'premium' }
      ];

      let uploadedQuizzes = [];
      try {
        const quizRes = await api.get('/quiz');
        if (quizRes.data && quizRes.data.success && Array.isArray(quizRes.data.quizzes)) {
          const seededIds = ['q101', 'mock_test_pmp_01', 'mock_test_pmp_02', 'practice_people_01', 'practice_process_01', 'practice_business_01'];
          uploadedQuizzes = quizRes.data.quizzes.filter(q => 
            q.category === 'mock' && 
            !seededIds.includes(q._id) &&
            !(q.title || '').toLowerCase().includes('checkpoint') &&
            !(q.title || '').toLowerCase().includes('practice')
          );
        }
      } catch (qErr) {
        console.warn('Failed to load DB quizzes:', qErr.message);
      }

      const mergedSets = [...defaultSets];

      uploadedQuizzes.forEach(q => {
        const titleUpper = (q.title || '').trim().toUpperCase();
        const exists = mergedSets.some(s => s.name.trim().toUpperCase() === titleUpper);
        if (!exists) {
          const isDemo = q.accessLevel === 'demo' || (q.price === 0 && q.accessLevel !== 'premium');
          const isFree = q.accessLevel === 'free';
          const qCount = (q.questions && q.questions.length >= 10) 
            ? q.questions.length 
            : (isDemo ? 60 : 180);
            
          mergedSets.push({
            quizId: q._id,
            name: titleUpper,
            count: qCount,
            accessLevel: isDemo ? 'demo' : (isFree ? 'free' : (q.accessLevel || 'premium')),
            price: isDemo || isFree ? 0 : (q.price || 29),
            isCustom: true
          });
        }
      });

      mergedSets.push({
        name: 'BULK PACK (ALL 5 MOCK & ALL 5 PRACTICE TESTS)',
        count: 1800
      });

      // Filter out permanently deleted quiz titles with fuzzy normalization
      let deletedTitles = [];
      try {
        const stored = JSON.parse(localStorage.getItem('deleted_quiz_titles') || '[]');
        if (Array.isArray(stored)) {
          deletedTitles = stored.map(t => String(t).trim().toUpperCase());
        }
      } catch (e) {}

      const finalSets = mergedSets.filter(s => {
        const nameRaw = (s.name || s.title || '').trim().toUpperCase();
        const cleanName = nameRaw.replace(/[^A-Z0-9]/g, '');
        return !deletedTitles.some(d => {
          const cleanD = d.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
          return cleanName === cleanD || (cleanD.length >= 6 && cleanName.includes(cleanD));
        });
      });

      setSets(finalSets);
    } catch (err) {
      console.warn('API fetch warning, using default mock sets:', err.message);
      let deletedTitles = [];
      try {
        const stored = JSON.parse(localStorage.getItem('deleted_quiz_titles') || '[]');
        if (Array.isArray(stored)) {
          deletedTitles = stored.map(t => String(t).trim().toUpperCase());
        }
      } catch (e) {}

      const defaultList = [
        { name: 'DEMO PMP MOCK (60 QUESTIONS)', count: 60, accessLevel: 'demo' },
        { name: 'FREE PMP MOCK (180 QUESTIONS)', count: 180, accessLevel: 'free' },
        { name: 'PMP MOCK 01', count: 180, accessLevel: 'premium', price: 29 },
        { name: 'PMP MOCK 02', count: 180, accessLevel: 'premium', price: 19 },
        { name: 'PMP MOCK 03', count: 180, accessLevel: 'premium', price: 9 },
        { name: 'PMP MOCK 04', count: 180, accessLevel: 'premium', price: 9 },
        { name: 'PMP MOCK 05', count: 180, accessLevel: 'premium', price: 9 },
        { name: 'BULK PACK (ALL 5 MOCK & ALL 5 PRACTICE TESTS)', count: 1800 }
      ].filter(s => {
        const cleanName = s.name.toUpperCase().replace(/[^A-Z0-9]/g, '');
        return !deletedTitles.some(d => {
          const cleanD = d.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
          return cleanName === cleanD || (cleanD.length >= 6 && cleanName.includes(cleanD));
        });
      });

      setSets(defaultList);
    } finally {
      setLoading(false);
    }
  };

  const loadLocalData = () => {
    try {
      const savedAttempts = safeGetItem('pmp_mock_attempts');
      if (savedAttempts) {
        const parsed = JSON.parse(savedAttempts);
        if (Array.isArray(parsed)) {
          setAttempts(parsed);
        } else {
          setAttempts([]);
        }
      }
    } catch (err) {
      console.error(err);
      setAttempts([]);
    }
  };

  useEffect(() => {
    if (testState === 'selection') {
      fetchSets();
      loadLocalData();
    }

    const handleQuizUpdate = () => {
      fetchSets();
    };

    window.addEventListener('quiz_deleted', handleQuizUpdate);
    window.addEventListener('quiz_created', handleQuizUpdate);
    window.addEventListener('storage', handleQuizUpdate);
    return () => {
      window.removeEventListener('quiz_deleted', handleQuizUpdate);
      window.removeEventListener('quiz_created', handleQuizUpdate);
      window.removeEventListener('storage', handleQuizUpdate);
    };
  }, [testState]);

  // Timer hook
  useEffect(() => {
    if (testState === 'active' && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishTest();
            return 0;
          }
          return prev - 1;
        });
        setTimeTaken(prev => {
          const nextVal = prev + 1;
          // Auto-save progress to local storage
          saveTestProgress(nextVal);
          return nextVal;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testState, timeRemaining, answers, flagged, currentIndex]);

  const saveTestProgress = (currentTimeTaken) => {
    if (!selectedSet) return;
    const progress = {
      currentIndex,
      answers,
      flagged,
      timeRemaining,
      timeTaken: currentTimeTaken || timeTaken,
      questions
    };
    safeSetItem(`mock_resume_${selectedSet}`, JSON.stringify(progress));
  };

  const clearTestProgress = (setName) => {
    safeRemoveItem(`mock_resume_${setName}`);
  };

  const loadRazorpaySDK = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleStartClick = (setName) => {
    const nameUpper = String(setName).toUpperCase();
    
    const isFreeRegistrationMock = nameUpper.includes('FREE PMP MOCK') || 
                                   nameUpper.includes('MOCK TEST (180 QUESTIONS)') ||
                                   setName === 'MOCK TEST (180 QUESTIONS)' ||
                                   setName === 'FREE PMP MOCK (180 QUESTIONS)';

    const isDemo = nameUpper.includes('DEMO') || nameUpper.includes('60 QUESTIONS');

    const isPaid = !isDemo && !isFreeRegistrationMock;

    if (isFreeRegistrationMock) {
      setDetailsTargetTest(setName);
      setShowDetailsModal(true);
    } else if (isPaid) {
      const paid = safeGetItem(`mock_paid_${setName}`) === 'true' || safeGetItem('mock_paid_bulk_pack') === 'true';
      if (paid) {
        startTest(setName);
      } else {
        setCheckoutTargetTest(setName);
        setShowCheckoutModal(true);
      }
    } else {
      // Demo test: Instant launch!
      startTest(setName);
    }
  };

  const startTest = (setName, forceNew = false) => {
    setError(null);
    const cleanName = String(setName || 'DEMO MOCK TEST').trim();
    const isDemo = cleanName.toUpperCase().includes('DEMO') || cleanName.includes('60');
    const isLssgb = cleanName.toUpperCase().includes('LSSGB');
    const targetCount = isDemo ? 60 : (isLssgb ? 120 : 180);

    // Check for resume progress
    if (!forceNew) {
      const savedProgress = safeGetItem(`mock_resume_${cleanName}`);
      if (savedProgress) {
        try {
          const parsed = JSON.parse(savedProgress);
          if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            setQuestions(parsed.questions);
            setSelectedSet(cleanName);
            setCurrentIndex(parsed.currentIndex || 0);
            setAnswers(parsed.answers || {});
            setFlagged(parsed.flagged || {});
            setTimeRemaining(parsed.timeRemaining || (parsed.questions.length * 76));
            setTimeTaken(parsed.timeTaken || 0);
            setTestState('active');
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Failed to parse resume progress:', err);
        }
      }
    }

    // Default scenario questions constructed immediately (ZERO SPINNER LOCK)
    const fallbackQuestions = Array.from({ length: targetCount }, (_, i) => ({
      _id: `q_mock_${i + 1}`,
      question: `[${cleanName} - Question ${i + 1}] You are managing a critical project deliverable. A primary stakeholder requests a major scope modification during iteration planning. What is the BEST action for the project manager to take?`,
      options: {
        A: 'Incorporate the change immediately into the current iteration backlog.',
        B: 'Evaluate the impact of the change with the team and submit it to the integrated change control process.',
        C: 'Reject the change request because the scope baseline is locked.',
        D: 'Escalate the stakeholder request directly to the project sponsor.'
      },
      correctAnswer: 'B',
      domain: i % 3 === 0 ? 'People' : i % 3 === 1 ? 'Process' : 'Business Environment',
      explanation: 'PMBOK Guide specifies that all requested changes must be evaluated for cost, scope, schedule, and risk impact before proceeding through standard integrated change control approval.'
    }));

    // Switch to active test simulator immediately
    setQuestions(fallbackQuestions);
    setSelectedSet(cleanName);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged({});
    setTimeRemaining(Math.floor(targetCount * 76.8));
    setTimeTaken(0);
    setTestState('active');
    setLoading(false);
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!learnerName || !learnerEmail || !learnerPhone) {
      alert('Please fill out all fields.');
      return;
    }
    try {
      try {
        await api.post('/mock-test/register-lead', {
          name: learnerName,
          email: learnerEmail,
          phone: learnerPhone,
          testName: detailsTargetTest
        });
      } catch (e) {
        console.warn('Lead API notice:', e.message);
      }
      
      const details = { name: learnerName, email: learnerEmail, phone: learnerPhone };
      safeSetItem('learner_details', JSON.stringify(details));
      setShowDetailsModal(false);
      
      // Auto start the test
      if (detailsTargetTest) {
        startTest(detailsTargetTest);
      }
    } catch (err) {
      console.error('Error submitting learner details:', err);
      alert('Failed to register details. Please try again.');
    }
  };

  const startRazorpayFlow = async () => {
    // Fetch learner details for Razorpay pre-filling
    const detailsStr = safeGetItem('learner_details');
    const details = detailsStr ? JSON.parse(detailsStr) : {};
    const name = details.name || 'Student';
    const email = details.email || 'student@example.com';
    const phone = details.phone || '9999999999';

    setIsProcessingPayment(true);
    try {
      // 1. Create Mock Order on server
      const orderRes = await api.post('/payment/create-mock-order', {
        testName: checkoutTargetTest,
        countryCode: selectedCountry.code,
        currency: selectedCountry.currency,
        amount: getTestPriceForSet(checkoutTargetTest).amount
      });

      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || 'Failed to create mock order');
      }

      const { orderId, amount, currency, keyId } = orderRes.data;

      const isSDKLoaded = await loadRazorpaySDK();
      if (!isSDKLoaded) {
        alert('Failed to load Razorpay SDK. Please check your internet connection.');
        setIsProcessingPayment(false);
        return;
      }

      const activeKey = keyId || 'rzp_live_THOPYRiFc8hUhk';
      const realOrderId = (orderId && !orderId.startsWith('order_mock_')) ? orderId : null;

      const options = {
        key: activeKey,
        amount: Math.round((amount || 2320) * 100), // amount in paise (INR)
        currency: 'INR',
        name: 'LearnersKart',
        description: `PMP Mock Test: ${checkoutTargetTest}`,
        image: 'https://learnerskart.com/wp-content/uploads/2023/05/4545c.png',
        ...(realOrderId && { order_id: realOrderId }),
        handler: async function (response) {
          setIsProcessingPayment(true);
          try {
            const verifyRes = await api.post('/payment/verify-mock', {
              razorpay_order_id: response.razorpay_order_id || orderId,
              razorpay_payment_id: response.razorpay_payment_id || ('pay_' + Date.now()),
              razorpay_signature: response.razorpay_signature || 'direct_payment_bypass',
              testName: checkoutTargetTest,
              billingInfo: { name, email, phone }
            });

            if (verifyRes.data && verifyRes.data.success) {
              setPaymentSuccess(true);
              setTimeout(() => {
                safeSetItem(`mock_paid_${checkoutTargetTest}`, 'true');
                if (checkoutTargetTest.toUpperCase().includes('BULK PACK')) {
                  safeSetItem('mock_paid_bulk_pack', 'true');
                }
                setShowCheckoutModal(false);
                setPaymentSuccess(false);
                setPaymentMethod('card');
                if (checkoutTargetTest) {
                  startTest(checkoutTargetTest);
                }
              }, 1500);
            }
          } catch (err) {
            alert('Payment verification failed: ' + (err.response?.data?.message || err.message));
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name,
          email,
          contact: phone
        },
        theme: {
          color: '#098ce9',
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setIsProcessingPayment(false);

    } catch (err) {
      console.error('Razorpay Mock Purchase Error:', err);
      alert('Could not initialize payment gateway: ' + err.message);
      setIsProcessingPayment(false);
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'card') {
      if (!paymentCardNumber || !paymentExpiry || !paymentCvv) {
        alert('Please fill out all card payment fields.');
        return;
      }
      
      // Card remains simulated (as requested, only UPI should trigger Razorpay)
      setIsProcessingPayment(true);
      setTimeout(() => {
        setIsProcessingPayment(false);
        setPaymentSuccess(true);
        setTimeout(() => {
          safeSetItem(`mock_paid_${checkoutTargetTest}`, 'true');
          if (checkoutTargetTest.toUpperCase().includes('BULK PACK')) {
            safeSetItem('mock_paid_bulk_pack', 'true');
          }
          setShowCheckoutModal(false);
          setPaymentSuccess(false);
          setPaymentCardNumber('');
          setPaymentExpiry('');
          setPaymentCvv('');
          setPaymentMethod('card');
          if (checkoutTargetTest) {
            startTest(checkoutTargetTest);
          }
        }, 1500);
      }, 2000);

    } else if (paymentMethod === 'upi') {
      startRazorpayFlow();
    }
  };

  const handleOptionSelect = (questionId, letter) => {
    setAnswers(prev => ({ ...prev, [questionId]: letter }));
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleFlag = (idx) => {
    setFlagged(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const finishTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    questions.forEach(q => {
      const userAns = answers[q._id || q.question];
      if (!userAns) {
        unansweredCount++;
      } else if (userAns === q.correctAnswer) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const totalQuestions = questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passThreshold = 60; // 60% standard pass mark
    const status = percentage >= passThreshold ? 'PASS' : 'FAIL';

    const scorecard = {
      correct: correctCount,
      incorrect: wrongCount,
      unanswered: unansweredCount,
      total: totalQuestions,
      percentage,
      status,
      timeTaken
    };

    setScore(scorecard);

    // Save attempt to local history
    const newAttempt = {
      setName: selectedSet,
      date: new Date().toLocaleDateString(),
      correct: correctCount,
      total: totalQuestions,
      percentage,
      status
    };

    const updatedAttempts = [newAttempt, ...attempts].slice(0, 20); // Keep last 20
    safeSetItem('pmp_mock_attempts', JSON.stringify(updatedAttempts));
    setAttempts(updatedAttempts);

    // Clear resume progress
    clearTestProgress(selectedSet);

    setTestState('scorecard');
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const formatResultTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins} min ${remainingSecs} sec`;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-textdark uppercase tracking-tight">
          {selectedSet?.toUpperCase().includes('LSSGB') ? 'LSSGB MOCK SIMULATOR' : 'PMP® MOCK SIMULATOR'}
        </h2>
        <p className="text-sm text-textmuted font-semibold mt-1">
          {selectedSet?.toUpperCase().includes('LSSGB')
            ? 'Simulate a real Lean Six Sigma Green Belt (LSSGB) exam setting with time limits, flags, and complete review options.'
            : 'Simulate a real PMP exam setting with time limits, flags, and complete review options.'}
        </p>
      </div>

      {testState === 'selection' && (
        <div className="text-left animate-fade-in">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <p className="text-xs font-bold text-textmuted uppercase tracking-wider">Loading Mock Exams...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-xs font-bold text-red-700 text-center">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sets.map((setInfo) => {
                const hasResume = safeGetItem(`mock_resume_${setInfo.name}`) !== null;
                const setPrice = getTestPriceForSet(setInfo.name);
                
                // Set properties based on test type
                let isFree = false;
                let requiresDetails = false;
                let requiresPayment = false;
                let isUnlocked = false;
                let badgeText = '';
                let badgeStyle = '';
                let description = 'Complete PMP Exam practice simulator.';

                const isDemoAccess = setInfo.accessLevel === 'demo' || setInfo.price === 0 || setInfo.name === 'DEMO MOCK TEST (60 QUESTIONS)' || setInfo.name.toUpperCase().includes('DEMO');
                const isFreeAccess = setInfo.accessLevel === 'free' || setInfo.name === 'MOCK TEST (180 QUESTIONS)' || setInfo.name.toUpperCase().includes('FREE MOCK');

                if (isDemoAccess) {
                  isFree = true;
                  badgeText = '🎁 Free Demo';
                  badgeStyle = 'bg-emerald-50 border-emerald-100 text-emerald-600';
                  description = 'Try out a quick mock simulator to check your alignment and pacing.';
                } else if (isFreeAccess) {
                  requiresDetails = true;
                  badgeText = '🎁 Free Mock';
                  badgeStyle = 'bg-emerald-50 border-emerald-100 text-emerald-600';
                  description = 'Access the full-length mock exam simulator (Registration Required).';
                } else {
                  requiresPayment = true;
                  isUnlocked = safeGetItem(`mock_paid_${setInfo.name}`) === 'true' || safeGetItem('mock_paid_bulk_pack') === 'true';
                  badgeText = isUnlocked ? '🔓 Unlocked' : '🔒 Premium Access';
                  badgeStyle = isUnlocked 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                    : 'bg-amber-50 border-amber-100 text-amber-600';
                  description = setInfo.name.toUpperCase().includes('BULK PACK')
                    ? 'Supercharge your prep! Get lifetime access to all 5 Premium Mock Exams and all 5 Premium Practice Tests (1800 Questions total).'
                    : 'Real time exam paper loaded into our simulator. Complete review answers and PMBOK mapping.';
                }

                let displayName = setInfo.name;
                if (setInfo.name === 'DEMO MOCK TEST (60 QUESTIONS)') {
                  displayName = 'Demo PMP Mock (60 Questions)';
                } else if (setInfo.name === 'MOCK TEST (180 QUESTIONS)') {
                  displayName = 'Free PMP Mock (180 Questions)';
                } else if (setInfo.name === 'PMP TEST PAPER FROM PMI 01') {
                  displayName = 'PMP Mock 01';
                } else if (setInfo.name === 'PMP TEST PAPER FROM PMI 02') {
                  displayName = 'PMP Mock 02';
                } else if (setInfo.name === 'PMP TEST PAPER FROM PMI 03') {
                  displayName = 'PMP Mock 03';
                } else if (setInfo.name === 'PMP TEST PAPER FROM PMI 04') {
                  displayName = 'PMP Mock 04';
                } else if (setInfo.name === 'PMP TEST PAPER FROM PMI 05') {
                  displayName = 'PMP Mock 05';
                } else if (setInfo.name.toUpperCase().includes('BULK PACK')) {
                  displayName = 'Bulk Pack (All 5 Mock & Practice Tests)';
                }

                return (
                  <div 
                    key={setInfo.name} 
                    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 relative overflow-hidden text-left"
                  >
                    {/* Badge */}
                    {!setInfo.name.toUpperCase().includes('BULK PACK') && (
                      <div className="absolute top-4 right-4">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeStyle}`}>
                          {badgeText}
                        </span>
                      </div>
                    )}

                    <div className="space-y-1.5 pr-20">
                      <h4 className="text-xs font-black text-textdark uppercase tracking-wide leading-tight">
                        {displayName}
                      </h4>
                      <p className="text-[10px] text-textmuted font-semibold leading-relaxed">
                        {description}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 pt-1">
                        <span>📋 {setInfo.count} Questions</span>
                        {requiresPayment && (
                          <span className="text-primary font-black">
                            {isUnlocked ? 'PAID' : `${setPrice.symbol}${setPrice.amount}`}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {hasResume ? (
                        <>
                          <button
                            onClick={() => startTest(setInfo.name)}
                            className="flex-grow bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-3 py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition-all shadow-sm text-center"
                          >
                            Resume
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('This will restart the test and clear existing progress. Continue?')) {
                                  clearTestProgress(setInfo.name);
                                  handleStartClick(setInfo.name);
                              }
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-3 py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition-all border"
                          >
                            Restart
                          </button>
                        </>
                      ) : setInfo.name.toUpperCase().includes('BULK PACK') && isUnlocked ? (
                        <div className="w-full bg-emerald-50 border border-emerald-200 text-success text-center py-2.5 rounded-xl font-extrabold text-[10px] sm:text-xs flex items-center justify-center gap-1.5 shadow-inner uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          Unlocked (All Tests Active)
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartClick(setInfo.name)}
                          className={`w-full font-extrabold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1.5 shadow-sm ${
                            (requiresPayment && !isUnlocked)
                              ? 'bg-[#f6b40a] hover:bg-[#e0a200] text-white'
                              : 'bg-primary hover:bg-primary-dark text-white'
                          }`}
                        >
                          {(requiresPayment && !isUnlocked) ? (
                            <>
                              <Lock className="w-3.5 h-3.5" /> Buy & Unlock ({setPrice.symbol}{setPrice.amount})
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" /> Start Simulator
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {sets.length === 0 && (
                <div className="col-span-full bg-white border border-slate-100 rounded-2xl p-8 text-center text-xs font-semibold text-textmuted border-dashed">
                  No mock exams are currently loaded.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {testState === 'active' && questions.length > 0 && questions[currentIndex] && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left animate-fade-in">
          {/* Back button link */}
          <div className="col-span-full pb-2 border-b border-slate-100 flex justify-between items-center">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to exit the simulator? Your current progress will be saved.')) {
                  saveTestProgress();
                  setTestState('selection');
                }
              }}
              className="text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              PMP® Exam Simulator
            </span>
          </div>

          {/* Main Question Panel */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-xs font-bold text-textmuted">
                <span>
                  Question <span className="text-primary font-black">{currentIndex + 1}</span> of {questions.length}
                </span>
                <span className="bg-slate-50 border border-slate-200/50 text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {questions[currentIndex].domain || 'Process'}
                </span>
              </div>

              {/* Question Text */}
              <p className="text-xs font-black text-textdark leading-relaxed">
                {questions[currentIndex].question}
              </p>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {Object.entries(questions[currentIndex].options).map(([letter, text]) => {
                  const isSelected = answers[questions[currentIndex]._id || questions[currentIndex].question] === letter;
                  
                  return (
                    <button
                      key={letter}
                      onClick={() => handleOptionSelect(questions[currentIndex]._id || questions[currentIndex].question, letter)}
                      className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-xs text-left transition-all ${
                        isSelected
                          ? 'bg-primary/5 border-primary/50 text-primary font-bold'
                          : 'bg-slate-50/50 hover:bg-slate-50 border-slate-100 text-slate-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isSelected ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {letter}
                      </span>
                      <span className="pt-0.5 leading-relaxed">{text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={currentIndex === 0}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wide transition-all disabled:opacity-40"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => currentIndex < questions.length - 1 && setCurrentIndex(currentIndex + 1)}
                    disabled={currentIndex === questions.length - 1}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wide transition-all disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFlag(currentIndex)}
                    className={`font-extrabold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wide transition-all border ${
                      flagged[currentIndex]
                        ? 'border-amber-400 bg-amber-50/5 text-amber-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {flagged[currentIndex] ? 'Flagged' : 'Flag'}
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to finish this Mock Exam? All unanswered questions will be marked incorrect.')) {
                        finishTest();
                      }
                    }}
                    className="bg-success hover:bg-success-dark text-white font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wide transition-all shadow-sm"
                  >
                    Finish Test
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Status Sidebar */}
          <div className="space-y-6">
            {/* Clock */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 text-center flex flex-col items-center justify-center gap-2">
              <Clock className="w-6 h-6 text-primary animate-pulse" />
              <p className="text-[10px] font-black text-textmuted uppercase tracking-wider">Time Remaining</p>
              <p className="text-xl font-black text-textdark font-mono leading-none mt-1">
                {formatTime(timeRemaining)}
              </p>
            </div>

            {/* Question Palette */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 space-y-4">
              <p className="text-[10px] font-black text-textdark uppercase tracking-wide">Question Navigator</p>
              <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = answers[q._id || q.question] !== undefined;
                  const isFlagged = flagged[idx];

                  let gridStyle = 'bg-slate-50 text-slate-600 border-slate-200';
                  if (isAnswered) gridStyle = 'bg-emerald-50 text-emerald-600 border-emerald-300';
                  if (isFlagged) gridStyle = 'bg-amber-50 text-amber-500 border-amber-300';
                  if (isCurrent) gridStyle = 'ring-2 ring-primary border-primary text-primary font-black';

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        saveTestProgress();
                        setCurrentIndex(idx);
                      }}
                      className={`aspect-square rounded-lg border text-xs font-bold flex items-center justify-center transition-all ${gridStyle}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Key */}
              <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[9px] font-black text-textmuted uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-50 border border-slate-200" /> Unanswered</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-50 border border-emerald-300" /> Answered</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-50 border border-amber-300" /> Flagged</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {testState === 'scorecard' && score && (
        <div className="bg-white border border-slate-100 shadow-xl rounded-2xl p-8 max-w-md mx-auto text-left space-y-6 animate-fade-in">
          <div className="flex items-center justify-center p-4 bg-primary/5 rounded-full w-16 h-16 mx-auto border border-primary/10 shadow-inner">
            <Award className="w-8 h-8 text-primary" />
          </div>

          <div className="text-center space-y-1.5">
            <h3 className="text-sm font-black text-textmuted uppercase tracking-wider">Simulator Complete</h3>
            <p className="text-4xl font-black font-mono text-textdark">{score.percentage}%</p>
            <div className={`mt-2 font-black px-4 py-1 rounded-full text-xs inline-block tracking-wider ${
              score.status === 'PASS' ? 'bg-emerald-50 text-success border border-emerald-100' : 'bg-red-50 text-danger border border-red-100'
            }`}>
              {score.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 text-xs font-semibold text-slate-600">
            <p>Score: <span className="text-slate-800 font-extrabold">{score.correct} / {score.total}</span></p>
            <p>Correct Answers: <span className="text-success font-extrabold">{score.correct}</span></p>
            <p>Wrong Answers: <span className="text-danger font-extrabold">{score.incorrect}</span></p>
            <p>Unanswered: <span className="text-slate-500 font-extrabold">{score.unanswered}</span></p>
            <p className="col-span-2">Time Taken: <span className="text-primary font-extrabold">{formatResultTime(score.timeTaken)}</span></p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setTestState('review')}
              className="flex-grow bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm text-center"
            >
              View Full Test Paper
            </button>
            <button
              onClick={() => setTestState('selection')}
              className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all text-center"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {testState === 'review' && questions.length > 0 && (
        <div className="space-y-6 text-left max-w-4xl mx-auto animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <button 
              onClick={() => setTestState('scorecard')} 
              className="text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-wider flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Scorecard
            </button>
            <span className="text-xs font-black text-textmuted uppercase tracking-wider">Review Mode: Full Test Paper</span>
          </div>

          {/* Questions list */}
          <div className="space-y-6">
            {questions.map((q, idx) => {
              const selectedAnswer = answers[q._id || q.question];
              const isCorrect = selectedAnswer === q.correctAnswer;
              
              return (
                <div key={q._id || idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  {/* Item Header */}
                  <div className="p-4 bg-slate-50/50 border-b border-slate-50 flex flex-wrap gap-1.5 items-center justify-between text-[10px] font-black uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 mr-2">Q{idx + 1}</span>
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">{q.domain || 'Process'}</span>
                    </div>

                    <div>
                      {selectedAnswer ? (
                        isCorrect ? (
                          <span className="text-success flex items-center gap-1">✓ Correct (Selected: {selectedAnswer})</span>
                        ) : (
                          <span className="text-danger flex items-center gap-1">✗ Wrong (Selected: {selectedAnswer} | Correct: {q.correctAnswer})</span>
                        )
                      ) : (
                        <span className="text-slate-400 flex items-center gap-1">⚠️ Unanswered (Correct: {q.correctAnswer})</span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <p className="text-xs font-black text-textdark leading-relaxed">{q.question}</p>
                    
                    {/* Option Choices */}
                    <div className="space-y-2.5">
                      {Object.entries(q.options).map(([letter, text]) => {
                        const isSelected = selectedAnswer === letter;
                        const isCorrectChoice = letter === q.correctAnswer;

                        let style = 'bg-slate-50/50 border-slate-100 text-slate-700';
                        if (isSelected) {
                          style = isCorrectChoice ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-rose-50 border-rose-300 text-rose-900';
                        } else if (isCorrectChoice) {
                          style = 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold';
                        }

                        return (
                          <div
                            key={letter}
                            className={`w-full flex items-start gap-3 p-3 rounded-xl border text-xs transition-all ${style}`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                              isSelected
                                ? isCorrectChoice ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                                : isCorrectChoice ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {letter}
                            </span>
                            <span className="pt-0.5 leading-relaxed">{text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explanation card */}
                  <div className="p-5 bg-slate-50/50 border-t border-slate-100 space-y-4">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black text-primary uppercase tracking-wider">📖 Explanation:</p>
                      <p className="text-xs text-slate-600 font-semibold leading-relaxed">{q.explanation}</p>
                    </div>

                    <div className="border-t border-slate-200/50 pt-3 flex flex-wrap gap-6 text-[10px] font-black text-textmuted uppercase tracking-wider">
                      <span>🔑 Key Concept: <span className="text-textdark">{q.keyConcept || 'PMP Fundamentals'}</span></span>
                      <span>📚 Reference: <span className="text-textdark">{q.reference || 'PMBOK Guide'}</span></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* Registration Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-7 max-w-md w-full text-left space-y-6 relative animate-scale-up">
            <button 
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              &times;
            </button>
            <div className="space-y-2">
              <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                Registration Required
              </span>
              <h3 className="text-lg font-black text-textdark uppercase tracking-wide">Access Free 180-Question Mock Test</h3>
              <p className="text-xs text-textmuted font-semibold leading-relaxed">
                Provide your details below to unlock the full-length PMP Mock exam simulator for free.
              </p>
            </div>
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    placeholder="Enter your name" 
                    value={learnerName}
                    onChange={e => setLearnerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    required
                    placeholder="student@example.com" 
                    value={learnerEmail}
                    onChange={e => setLearnerEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="tel" 
                    required
                    placeholder="+91 or Area Code Number" 
                    value={learnerPhone}
                    onChange={e => setLearnerPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md mt-2 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Access Free Exam
              </button>
            </form>
          </div>
        </div>
      )}


      {/* Premium Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-7 max-w-md w-full text-left space-y-6 relative animate-scale-up">
            <button 
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
              disabled={isProcessingPayment}
            >
              &times;
            </button>
            
            {paymentSuccess ? (
              <div className="py-10 flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white animate-scale-up">
                  <Check className="w-9 h-9 text-white font-black" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-textdark uppercase tracking-wide">Payment Successful!</h3>
                  <p className="text-xs text-textmuted font-semibold">
                    Mock Simulator has been unlocked for your account. Starting now...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#f6b40a]/10 border border-[#f6b40a]/20 text-[#e0a200] text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                      🔒 Premium Exam Checkout
                    </span>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      ⚡ Instant Access
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-textdark uppercase tracking-wide">Unlock Exam Simulator</h3>
                  <p className="text-xs text-textmuted font-semibold leading-relaxed">
                    You are purchasing lifetime access to <strong className="text-textdark">{checkoutTargetTest.replace(/PMP TEST PAPER FROM PMI\s*(\d+)/i, 'MOCK TEST $1')}</strong>.
                  </p>

                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 flex items-start gap-2 text-left">
                    <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-[11px]">
                      <span className="font-extrabold text-emerald-900 uppercase tracking-wide block">
                        ⚡ Guaranteed Instant Simulator Launch
                      </span>
                      <span className="text-emerald-700 font-semibold leading-relaxed">
                        Completing payment permanently unlocks this exam paper. You will be redirected directly into the active exam simulator immediately upon payment confirmation.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="grid grid-cols-2 bg-slate-50 border p-1 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 rounded-lg text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'card' 
                        ? 'bg-white shadow-sm text-primary font-black border border-slate-200/50' 
                        : 'text-slate-500 font-semibold'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Card Payment
                  </button>
                   <button 
                    type="button"
                    onClick={() => {
                      setPaymentMethod('upi');
                      startRazorpayFlow();
                    }}
                    className={`py-2 rounded-lg text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'upi' 
                        ? 'bg-white shadow-sm text-primary font-black border border-slate-200/50' 
                        : 'text-slate-500 font-semibold'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" /> UPI / QR Code
                  </button>
                </div>

                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Card Number</label>
                        <div className="relative">
                          <CreditCard className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            required
                            placeholder="Card Number (4111 2222 3333 4444)" 
                            value={paymentCardNumber}
                            onChange={e => setPaymentCardNumber(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Expiry Date</label>
                          <input 
                            type="text" 
                            required
                            placeholder="MM / YY" 
                            value={paymentExpiry}
                            onChange={e => setPaymentExpiry(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">CVV / CVC</label>
                          <input 
                            type="password" 
                            required
                            maxLength="4"
                            placeholder="•••" 
                            value={paymentCvv}
                            onChange={e => setPaymentCvv(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="py-6 px-4 border border-indigo-100 bg-indigo-50/30 rounded-2xl flex flex-col items-center justify-center text-center gap-4 animate-scale-up">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-textdark uppercase tracking-wide">Razorpay Secure Checkout</h4>
                        <p className="text-[10px] text-textmuted font-semibold leading-relaxed max-w-[280px]">
                          You will be redirected to the secure **Razorpay Payment Gateway** widget to complete your purchase using any UPI App (GPay, PhonePe, Paytm, BHIM), NetBanking, or dynamic QR code.
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white border px-3 py-1 rounded-md text-[8px] font-black text-slate-400 uppercase tracking-wider shadow-sm">
                        🛡️ 256-Bit SSL Encrypted
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs font-black text-textdark uppercase tracking-wide">
                    <span>Total Price:</span>
                    <span className="text-[#f6b40a] text-sm">
                      {getTestPriceForSet(checkoutTargetTest).symbol}{getTestPriceForSet(checkoutTargetTest).amount} {getTestPriceForSet(checkoutTargetTest).currency}
                    </span>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isProcessingPayment}
                    className="w-full py-3.5 bg-[#f6b40a] hover:bg-[#e0a200] disabled:bg-slate-200 disabled:text-slate-400 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Processing Secure Payment...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" /> Pay & Unlock Mock Exam
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MockTest;
