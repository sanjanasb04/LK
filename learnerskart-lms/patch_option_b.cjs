const fs = require('fs');

let lmsCode = fs.readFileSync('client/src/pages/learner/MockTestPage.jsx', 'utf8');

// 1. Remove in-player gates
lmsCode = lmsCode.replace(/const handleNavigateQuestion = \[\s\S\]*?setCurrentIndex\(targetIndex\);\n  \};\n/, '');
lmsCode = lmsCode.replace(/handleNavigateQuestion\(/g, 'setCurrentIndex(');

// Remove the inline modals in the player
lmsCode = lmsCode.replace(/\{\/\* LEAD GEN MODAL \*\/\}\s*\{showLeadGenModal[\s\S]*?\{\/\* PAYMENT MODAL \*\/\}\s*\{showPaymentModal[\s\S]*?\}\s*\)\}\s*<\/div>/, '</div>');

// 2. Add checkout target states
const statesToAdd = `
  const [checkoutTargetTest, setCheckoutTargetTest] = useState(null);
  const [detailsTargetTest, setDetailsTargetTest] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
`;
lmsCode = lmsCode.replace(/const \[leadForm, setLeadForm\] = useState\(\{ name: '', email: '', phone: '' \}\);/, `const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '' });\n${statesToAdd}`);

// 3. Add Razorpay Logic
const razorpayLogic = `
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
    setIsProcessingPayment(true);
    try {
      const orderRes = await api.post('http://localhost:5000/api/payment/create-mock-order', {
        testName: checkoutTargetTest,
        countryCode: selectedCountry.code,
        currency: selectedCountry.currency,
        amount: getTestPriceForSet(checkoutTargetTest).amount
      });

      if (!orderRes.data.success) throw new Error('Failed to create mock order');

      const { keyId, orderId, amount, currency } = orderRes.data;

      const isSDKLoaded = await loadRazorpaySDK();
      if (!isSDKLoaded) {
        toast.error('Failed to load Razorpay SDK. Please check your internet connection.');
        setIsProcessingPayment(false);
        return;
      }

      const options = {
        key: keyId,
        amount: Math.round(amount * 100),
        currency: currency === 'INR' ? 'INR' : currency,
        name: 'LearnersKart LMS',
        description: \`Mock Test: \${checkoutTargetTest}\`,
        order_id: orderId,
        handler: async function (response) {
          setIsProcessingPayment(true);
          try {
            const verifyRes = await api.post('http://localhost:5000/api/payment/verify-mock', {
              razorpay_order_id: response.razorpay_order_id || orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature || 'direct_payment_bypass',
              testName: checkoutTargetTest
            });

            if (verifyRes.data.success) {
              toast.success('Payment successful! Simulator unlocked.');
              localStorage.setItem(\`lk_paid_\${checkoutTargetTest}\`, 'true');
              setShowPaymentModal(false);
              handleLaunchTest(checkoutTargetTest);
            }
          } catch (err) {
            toast.error('Payment verification failed.');
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: leadForm.name || 'Student',
          email: leadForm.email || 'student@example.com',
          contact: leadForm.phone || '9999999999'
        },
        theme: { color: '#f59e0b' }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error('Payment cancelled or failed.');
        setIsProcessingPayment(false);
      });
      rzp.open();
    } catch (err) {
      toast.error('Could not initialize payment gateway.');
      setIsProcessingPayment(false);
    }
  };

  const handleStartClick = (setName) => {
    if (setName === 'DEMO MOCK TEST (60 QUESTIONS)') {
      handleLaunchTest(setName);
    } else if (setName === 'MOCK TEST (180 QUESTIONS)') {
      setDetailsTargetTest(setName);
      setShowLeadGenModal(true);
    } else {
      const paid = localStorage.getItem(\`lk_paid_\${setName}\`) === 'true' || isPmpEnrolled;
      if (paid) {
        handleLaunchTest(setName);
      } else {
        setCheckoutTargetTest(setName);
        setShowPaymentModal(true);
      }
    }
  };

  const handleLeadGenSubmit = async (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email) return toast.error('Please fill required fields');
    
    // Auto start the test
    setShowLeadGenModal(false);
    toast.success('Details verified! 180 questions unlocked.');
    if (detailsTargetTest) {
      handleLaunchTest(detailsTargetTest);
    }
  };
`;
lmsCode = lmsCode.replace(/const getTestPriceForSet = \(setName\) => \{/, razorpayLogic + '\n  const getTestPriceForSet = (setName) => {');

// 4. Update the Table Render Buttons
lmsCode = lmsCode.replace(
  /const requiresPayment = !isDemo && !isFreeMock;[\s\S]*?const isUnlocked = !requiresPayment \|\| isPmpEnrolled;/g,
  `const isDemo = setInfo.name === 'DEMO MOCK TEST (60 QUESTIONS)';
                const isFreeMock = setInfo.name === 'MOCK TEST (180 QUESTIONS)';
                const hasPaidLocal = localStorage.getItem(\`lk_paid_\${setInfo.name}\`) === 'true';
                const requiresPayment = !isDemo && !isFreeMock;
                const isUnlocked = !requiresPayment || isPmpEnrolled || hasPaidLocal;`
);

lmsCode = lmsCode.replace(
  /onClick=\{\(\) => handleLaunchTest\(setInfo.name\)\}/,
  'onClick={() => handleStartClick(setInfo.name)}'
);

lmsCode = lmsCode.replace(
  /onClick=\{\(\) => window.location.href = `http:\/\/localhost:5173\/free-resources\/mock-test`\}/,
  'onClick={() => handleStartClick(setInfo.name)}'
);

// 5. Add Selection Modals at the end (outside the player, inside the main list view)
const selectionModals = `
      {/* LEAD GEN MODAL (Before starting 180 questions) */}
      {showLeadGenModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 relative">
            <h3 className="text-lg font-black text-slate-800 mb-2">Unlock 180 Questions Set</h3>
            <p className="text-xs text-slate-500 mb-6 font-semibold">Enter your details to gain full free access to this premium mock set.</p>
            <form onSubmit={handleLeadGenSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                <input type="text" required value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
                <input type="email" required value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Number</label>
                <input type="tel" value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-primary" />
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl text-sm transition-all">
                Submit & Start Test
              </button>
              <button type="button" onClick={() => setShowLeadGenModal(false)} className="w-full text-slate-400 text-xs font-bold py-2 hover:text-slate-600">Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* RAZORPAY PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 relative text-center">
            <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔒</div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Unlock Premium Simulator</h3>
            <p className="text-xs text-slate-500 mb-6 font-semibold">Get complete access to {checkoutTargetTest} via secure Razorpay checkout.</p>
            <button 
              onClick={startRazorpayFlow}
              disabled={isProcessingPayment}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md disabled:opacity-50"
            >
              {isProcessingPayment ? 'Connecting to Razorpay...' : 'Pay Securely via Razorpay'}
            </button>
            <button onClick={() => setShowPaymentModal(false)} disabled={isProcessingPayment} className="w-full text-slate-400 text-xs font-bold py-3 mt-2 hover:text-slate-600">Cancel</button>
          </div>
        </div>
      )}
`;
lmsCode = lmsCode.replace(/<\/div>\s*\);\s*\}\s*$/m, '\n' + selectionModals + '\n    </div>\n  );\n}\n');

fs.writeFileSync('client/src/pages/learner/MockTestPage.jsx', lmsCode);
console.log('LMS MockTestPage rebuilt for Option B gating (Set-level).');
