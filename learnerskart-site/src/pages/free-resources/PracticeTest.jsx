import React, { useState, useEffect } from 'react';
import { Play, ArrowLeft, CheckCircle2, XCircle, HelpCircle, Lock, Shield, CreditCard, User, Mail, Phone, Check } from 'lucide-react';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';

const PracticeTest = () => {
  const { selectedCountry } = useCart();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutTargetTest, setCheckoutTargetTest] = useState('');
  const [paymentCardNumber, setPaymentCardNumber] = useState('');
  const [paymentExpiry, setPaymentExpiry] = useState('');
  const [paymentCvv, setPaymentCvv] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Lead Details states for Practice Test (180 Questions)
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsTargetTest, setDetailsTargetTest] = useState('');
  const [learnerName, setLearnerName] = useState('');
  const [learnerEmail, setLearnerEmail] = useState('');
  const [learnerPhone, setLearnerPhone] = useState('');

  const getTestPriceForSet = (setName) => {
    const code = selectedCountry?.code || 'IN';
    if (!setName) {
      return { symbol: '$', amount: 29, currency: 'USD' };
    }
    
    // Default base rates in USD and INR for each set number
    let baseUSD = 29;
    let baseINR = 199;
    
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
    try { return localStorage.getItem(key); } catch (e) { return null; }
  };
  const safeSetItem = (key, value) => {
    try { localStorage.setItem(key, value); } catch (e) {}
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

  const startRazorpayFlow = async () => {
    const detailsStr = safeGetItem('learner_details');
    const details = detailsStr ? JSON.parse(detailsStr) : {};
    const name = details.name || 'Student';
    const email = details.email || 'student@example.com';
    const phone = details.phone || '9999999999';

    setIsProcessingPayment(true);
    try {
      const testPrice = getTestPriceForSet(checkoutTargetTest);
      const orderRes = await api.post('/payment/create-mock-order', {
        testName: checkoutTargetTest,
        countryCode: selectedCountry.code,
        currency: selectedCountry.currency,
        amount: testPrice.amount
      });

      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || 'Failed to create order');
      }

      const { isSimulator, keyId, orderId, amount, currency } = orderRes.data;

      if (isSimulator || keyId === 'rzp_test_simulator') {
        setTimeout(() => {
          setIsProcessingPayment(false);
          setPaymentSuccess(true);
          setTimeout(() => {
            safeSetItem(`practice_paid_${checkoutTargetTest}`, 'true');
            if (checkoutTargetTest.toUpperCase().includes('BULK PACK')) {
              safeSetItem('mock_paid_bulk_pack', 'true');
            }
            setShowCheckoutModal(false);
            setPaymentSuccess(false);
            setPaymentMethod('card');
            startSet(checkoutTargetTest);
          }, 1500);
        }, 2000);
        return;
      }

      const isSDKLoaded = await loadRazorpaySDK();
      if (!isSDKLoaded) {
        alert('Failed to load Razorpay SDK.');
        setIsProcessingPayment(false);
        return;
      }

      const options = {
        key: keyId,
        amount: Math.round(amount * 100),
        currency: currency === 'INR' ? 'INR' : currency,
        name: 'LearnersKart',
        description: `PMP Practice Set: ${checkoutTargetTest}`,
        image: 'https://learnerskart.com/wp-content/uploads/2023/05/4545c.png',
        order_id: orderId,
        handler: async function (response) {
          setIsProcessingPayment(true);
          try {
            const verifyRes = await api.post('/payment/verify-mock', {
              razorpay_order_id: response.razorpay_order_id || orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature || 'direct_payment_bypass',
              testName: checkoutTargetTest,
              billingInfo: { name, email, phone }
            });

            if (verifyRes.data.success) {
              setPaymentSuccess(true);
              setTimeout(() => {
                safeSetItem(`practice_paid_${checkoutTargetTest}`, 'true');
                if (checkoutTargetTest.toUpperCase().includes('BULK PACK')) {
                  safeSetItem('mock_paid_bulk_pack', 'true');
                }
                setShowCheckoutModal(false);
                setPaymentSuccess(false);
                setPaymentMethod('card');
                startSet(checkoutTargetTest);
              }, 1500);
            }
          } catch (err) {
            alert('Payment verification failed.');
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: { 
          name, 
          email, 
          contact: phone,
          method: currency === 'INR' ? 'upi' : 'card'
        },
        theme: { color: '#4f46e5' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setIsProcessingPayment(false);

    } catch (err) {
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
      setIsProcessingPayment(true);
      setTimeout(() => {
        setIsProcessingPayment(false);
        setPaymentSuccess(true);
        setTimeout(() => {
          safeSetItem(`practice_paid_${checkoutTargetTest}`, 'true');
          if (checkoutTargetTest.toUpperCase().includes('BULK PACK')) {
            safeSetItem('mock_paid_bulk_pack', 'true');
          }
          setShowCheckoutModal(false);
          setPaymentSuccess(false);
          setPaymentMethod('card');
          startSet(checkoutTargetTest);
        }, 1500);
      }, 2000);
    }
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!learnerName || !learnerEmail || !learnerPhone) {
      alert('Please fill out all fields.');
      return;
    }
    setIsProcessingPayment(true);
    try {
      // Send details to lead API
      await api.post('/mock-test/register-lead', {
        name: learnerName,
        email: learnerEmail,
        phone: learnerPhone,
        testName: detailsTargetTest
      });
      
      const details = { name: learnerName, email: learnerEmail, phone: learnerPhone };
      safeSetItem('learner_details', JSON.stringify(details));
      setShowDetailsModal(false);
      startSet(detailsTargetTest);
    } catch (err) {
      alert('Failed to register details. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleStartClick = (setName) => {
    if (setName === 'PRACTICE TEST (180 QUESTIONS)') {
      const detailsStr = safeGetItem('learner_details');
      if (detailsStr) {
        startSet(setName);
      } else {
        setDetailsTargetTest(setName);
        setShowDetailsModal(true);
      }
    } else {
      const paid = safeGetItem(`practice_paid_${setName}`) === 'true';
      if (paid) {
        startSet(setName);
      } else {
        setCheckoutTargetTest(setName);
        setShowCheckoutModal(true);
      }
    }
  };
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active Test States
  const [testState, setTestState] = useState('start'); // 'start' | 'active' | 'finished'
  const [selectedSet, setSelectedSet] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Answer Submission States per question
  const [selectedOption, setSelectedOption] = useState(''); // Selected before submitting
  const [submittedAnswers, setSubmittedAnswers] = useState({}); // { questionId: submittedOption }
  const [isSubmitted, setIsSubmitted] = useState(false); // Whether current question has been submitted

  const fetchSets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/practice-test/sets');
      if (res.data.success) {
        const fetchedSets = [...res.data.sets];
        fetchedSets.push({
          name: 'BULK PACK (ALL 5 MOCK & ALL 5 PRACTICE TESTS)',
          count: 1800
        });
        setSets(fetchedSets);
      }
    } catch (err) {
      console.error('Error fetching practice sets:', err);
      setError('Failed to retrieve practice test sets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (testState === 'start') {
      fetchSets();
    }
  }, [testState]);

  const startSet = async (setName) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/practice-test', { params: { set: setName } });
      if (res.data && res.data.length > 0) {
        setQuestions(res.data);
        setSelectedSet(setName);
        setCurrentIndex(0);
        setSelectedOption('');
        setSubmittedAnswers({});
        setIsSubmitted(false);
        setTestState('active');
      } else {
        throw new Error(`No questions found in ${setName}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to start practice test.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (letter) => {
    if (isSubmitted) return; // Cannot change selection after submitting
    setSelectedOption(letter);
    const currentQ = questions[currentIndex];
    setSubmittedAnswers(prev => ({ ...prev, [currentQ._id || currentQ.question]: letter }));
    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      // Retrieve previous answer if any, else reset
      const nextQ = questions[nextIdx];
      const prevAns = submittedAnswers[nextQ._id || nextQ.question];
      if (prevAns) {
        setSelectedOption(prevAns);
        setIsSubmitted(true);
      } else {
        setSelectedOption('');
        setIsSubmitted(false);
      }
    } else {
      setTestState('finished');
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      const prevQ = questions[prevIdx];
      const prevAns = submittedAnswers[prevQ._id || prevQ.question];
      setSelectedOption(prevAns || '');
      setIsSubmitted(!!prevAns);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-textdark uppercase tracking-tight">PMP® Practice Sets</h2>
        <p className="text-sm text-textmuted font-semibold mt-1">
          Review standard mock sets with instant answer feedback and PMBOK explanations.
        </p>
      </div>

      {testState === 'start' && (
        <div className="space-y-6 animate-fade-in text-left">
          {/* Guidelines */}
          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3">
            <HelpCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-primary uppercase tracking-wide">📌 Practice Guidelines</h4>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed mt-1">
                Select a practice set. The questions will load one-by-one. Submit each question to see the immediate result, correct option, and detailed explanation.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <p className="text-xs font-bold text-textmuted uppercase tracking-wider">Loading practice sets...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-xs font-bold text-red-700 text-center">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
               {sets.map((setInfo) => {
                const requiresPayment = setInfo.name !== 'PRACTICE TEST (180 QUESTIONS)';
                const isUnlocked = !requiresPayment || safeGetItem(`practice_paid_${setInfo.name}`) === 'true' || safeGetItem('mock_paid_bulk_pack') === 'true';
                const testPrice = getTestPriceForSet(setInfo.name);
                
                const badgeText = !requiresPayment ? '🎁 Free Practice' : isUnlocked ? '🔓 Unlocked' : '🔒 Premium Access';
                const badgeStyle = !requiresPayment || isUnlocked 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                  : 'bg-amber-50 border-amber-100 text-amber-600';

                return (
                  <div 
                    key={setInfo.name} 
                    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 relative overflow-hidden"
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
                        {setInfo.name}
                      </h4>
                      <p className="text-[10px] text-textmuted font-semibold leading-relaxed">
                        {setInfo.name.toUpperCase().includes('BULK PACK')
                          ? 'Supercharge your prep! Get lifetime access to all 5 Premium Mock Exams and all 5 Premium Practice Tests (1800 Questions total).'
                          : setInfo.name === 'PRACTICE TEST (180 QUESTIONS)' 
                            ? 'Full-length 180-question mock exam loaded as a practice review set.' 
                            : 'Syllabus practice set review.'}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 pt-1">
                        <span>📋 {setInfo.count} Questions</span>
                        {requiresPayment && (
                          <span className="text-primary font-black">
                            {isUnlocked ? 'PAID' : `${testPrice.symbol}${testPrice.amount}`}
                          </span>
                        )}
                      </div>
                    </div>

                    {setInfo.name.toUpperCase().includes('BULK PACK') && isUnlocked ? (
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
                            <Lock className="w-3.5 h-3.5" /> Buy & Unlock ({testPrice.symbol}{testPrice.amount})
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" /> Start Test
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}

              {sets.length === 0 && (
                <div className="col-span-full bg-white border border-slate-100 rounded-2xl p-8 text-center text-xs font-semibold text-textmuted border-dashed">
                  No practice sets are currently loaded.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {testState === 'active' && questions.length > 0 && questions[currentIndex] && (
        <div className="space-y-6 text-left max-w-5xl mx-auto animate-fade-in">
          {/* Back link */}
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to end this practice set? Your progress will not be saved.')) {
                setTestState('start');
              }
            }}
            className="text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-wider flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Test
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Question Panel */}
            <div className="lg:col-span-3">
              {/* Question Box */}
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

                {/* Options list */}
                <div className="space-y-3 pt-2">
                  {Object.entries(questions[currentIndex].options).map(([letter, text]) => {
                    const isSelected = selectedOption === letter;
                    const isCorrectAnswer = letter === questions[currentIndex].correctAnswer;
                    
                    let optionStyle = 'bg-slate-50/50 hover:bg-slate-50 border-slate-100 text-slate-700';
                    
                    if (isSubmitted) {
                      if (isCorrectAnswer) {
                        optionStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                      } else if (isSelected) {
                        optionStyle = 'bg-rose-50 border-rose-300 text-rose-900';
                      } else {
                        optionStyle = 'bg-slate-50/30 border-slate-100 text-slate-400 opacity-60';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-primary/5 border-primary/50 text-primary font-bold';
                    }

                    return (
                      <button
                        key={letter}
                        disabled={isSubmitted}
                        onClick={() => handleOptionSelect(letter)}
                        className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-xs text-left transition-all ${optionStyle}`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                          isSubmitted
                            ? isCorrectAnswer ? 'bg-emerald-500 text-white' : isSelected ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-400'
                            : isSelected ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {letter}
                        </span>
                        <span className="pt-0.5 leading-relaxed">{text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback & Explanation Card */}
                {isSubmitted && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 animate-fade-in">
                    <div className="flex items-center gap-1.5">
                      {selectedOption === questions[currentIndex].correctAnswer ? (
                        <span className="text-xs font-black text-success flex items-center gap-1 uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4 text-success" /> ✓ Correct Answer
                        </span>
                      ) : (
                        <span className="text-xs font-black text-danger flex items-center gap-1 uppercase tracking-wider">
                          <XCircle className="w-4 h-4 text-danger" /> ✗ Wrong Answer (Correct: {questions[currentIndex].correctAnswer})
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5 border-t border-slate-200/50 pt-2.5">
                      <p className="text-[10px] font-black text-primary uppercase tracking-wider">📖 Explanation:</p>
                      <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                        {questions[currentIndex].explanation}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions Bar */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={currentIndex === 0}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wide transition-all disabled:opacity-40"
                  >
                    Prev
                  </button>

                  <button
                    onClick={handleNextQuestion}
                    className="bg-primary hover:bg-primary-dark text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm"
                  >
                    {currentIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Status Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Question Navigator */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 space-y-4">
                <p className="text-[10px] font-black text-textdark uppercase tracking-wide">Question Navigator</p>
                <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1">
                  {questions.map((q, idx) => {
                    const isCurrent = idx === currentIndex;
                    const isAnswered = submittedAnswers[q._id || q.question] !== undefined;

                    let gridStyle = 'bg-slate-50 text-slate-600 border-slate-200';
                    if (isAnswered) gridStyle = 'bg-emerald-50 text-emerald-600 border-emerald-300';
                    if (isCurrent) gridStyle = 'ring-2 ring-primary border-primary text-primary font-black';

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentIndex(idx);
                          const prevAns = submittedAnswers[q._id || q.question];
                          setSelectedOption(prevAns || '');
                          setIsSubmitted(!!prevAns);
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {testState === 'finished' && (() => {
        let correct = 0;
        let incorrect = 0;
        let unanswered = 0;
        questions.forEach(q => {
          const userAns = submittedAnswers[q._id || q.question];
          if (!userAns) {
            unanswered++;
          } else if (userAns === q.correctAnswer) {
            correct++;
          } else {
            incorrect++;
          }
        });

        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-8 text-center space-y-6 max-w-md mx-auto py-12 animate-fade-in text-left">
            <div className="bg-emerald-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto border border-emerald-100 shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-black text-textdark uppercase tracking-tight">Practice Set Finished!</h3>
              <p className="text-xs text-textmuted font-semibold max-w-xs mx-auto">
                You have completed all {questions.length} questions in this practice set. Great job reinforcing your PMP knowledge!
              </p>
            </div>

            {/* Scorecard stats */}
            <div className="grid grid-cols-3 gap-4 border-t border-b border-slate-100 py-4 text-xs font-semibold text-slate-600">
              <div className="text-center space-y-1">
                <p className="text-emerald-600 text-lg font-black">{correct}</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider">Correct</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-rose-600 text-lg font-black">{incorrect}</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider">Incorrect</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-slate-500 text-lg font-black">{unanswered}</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider">Unanswered</p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setTestState('review')}
                className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm"
              >
                View Detailed Solutions
              </button>
              <button
                onClick={() => setTestState('start')}
                className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Back to Tests
              </button>
            </div>
          </div>
        );
      })()}

      {testState === 'review' && questions.length > 0 && (
        <div className="space-y-6 text-left max-w-4xl mx-auto animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <button 
              onClick={() => setTestState('finished')} 
              className="text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-wider flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Summary
            </button>
            <span className="text-xs font-black text-textmuted uppercase tracking-wider">Review Mode: Full Test Paper</span>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => {
              const selectedAnswer = submittedAnswers[q._id || q.question];
              const isCorrect = selectedAnswer === q.correctAnswer;
              
              return (
                <div key={q._id || idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
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
                  <CheckCircle2 className="w-9 h-9 text-white font-black" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-textdark uppercase tracking-wide">Payment Successful!</h3>
                  <p className="text-xs text-textmuted font-semibold">
                    Practice Set has been unlocked for your account. Starting now...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <span className="bg-[#f6b40a]/10 border border-[#f6b40a]/20 text-[#e0a200] text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                    🔒 Premium Exam Checkout
                  </span>
                  <h3 className="text-lg font-black text-textdark uppercase tracking-wide">Unlock Practice Set</h3>
                  <p className="text-xs text-textmuted font-semibold leading-relaxed">
                    You are purchasing lifetime access to <strong className="text-textdark">{checkoutTargetTest}</strong>.
                  </p>
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
                        <Shield className="w-4 h-4" /> Pay & Unlock Practice Set
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Lead Details Registration Modal */}
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
              <h3 className="text-lg font-black text-textdark uppercase tracking-wide">Access Practice Test</h3>
              <p className="text-xs text-textmuted font-semibold leading-relaxed">
                Provide your details below to unlock the 180-Question PMP practice test review simulator for free.
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
                disabled={isProcessingPayment}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md mt-2 flex items-center justify-center gap-1.5"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Accessing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Access Free Test
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeTest;
