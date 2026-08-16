const fs = require('fs');
const filePath = 'client/src/pages/learner/MockTestPage.jsx';
let c = fs.readFileSync(filePath, 'utf8');

// 1. Add Gate States
c = c.replace(/const \[timeRemaining, setTimeRemaining\] = useState\(0\);/, `const [timeRemaining, setTimeRemaining] = useState(0);\n  const [hasProvidedDetails, setHasProvidedDetails] = useState(false);\n  const [hasPaid, setHasPaid] = useState(false);\n  const [showLeadGenModal, setShowLeadGenModal] = useState(false);\n  const [showPaymentModal, setShowPaymentModal] = useState(false);\n  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '' });`);

// 2. Add handleNavigate logic
const navLogic = `
  const handleNavigateQuestion = (targetIndex) => {
    // GATE 1: After 60 questions, require Lead Gen details
    if (targetIndex >= 60 && !hasProvidedDetails) {
      setShowLeadGenModal(true);
      return;
    }
    // GATE 2: After 240 questions (or submitting if a premium test), require payment
    if (targetIndex >= 240 && !hasPaid) {
      setShowPaymentModal(true);
      return;
    }
    setCurrentIndex(targetIndex);
  };
`;
if (!c.includes('handleNavigateQuestion')) {
  c = c.replace(/const finishTest = \(\) => \{/, navLogic + '\n  const finishTest = () => {');
}

// 3. Replace Next/Previous clicks
c = c.replace(/onClick=\{\(\) => setCurrentIndex\(prev => Math.max\(0, prev - 1\)\)\}/g, `onClick={() => handleNavigateQuestion(Math.max(0, currentIndex - 1))}`);
c = c.replace(/onClick=\{\(\) => setCurrentIndex\(prev => Math.min\(questions.length - 1, prev \+ 1\)\)\}/g, `onClick={() => handleNavigateQuestion(Math.min(questions.length - 1, currentIndex + 1))}`);

// 4. Also replace navigator clicks if any (search for setCurrentIndex in the right panel)
c = c.replace(/onClick=\{\(\) => setCurrentIndex\(i\)\}/g, `onClick={() => handleNavigateQuestion(i)}`);

// 5. Add Modals to the render (before the main return wrapper closes, or inside the active state)
const modalsJSX = `
      {/* LEAD GEN MODAL */}
      {showLeadGenModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 relative">
            <h3 className="text-lg font-black text-slate-800 mb-2">Unlock Next 180 Questions</h3>
            <p className="text-xs text-slate-500 mb-6 font-semibold">You've completed the free 60-question trial! Enter your details to continue practicing the next set of questions.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                <input type="text" value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
                <input type="email" value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Number</label>
                <input type="tel" value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-primary" />
              </div>
              <button 
                onClick={() => {
                  if(!leadForm.name || !leadForm.email) return toast.error('Please fill required fields');
                  setHasProvidedDetails(true);
                  setShowLeadGenModal(false);
                  toast.success('Details verified! 180 questions unlocked.');
                  setCurrentIndex(60);
                }}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl text-sm transition-all"
              >
                Continue Mock Test
              </button>
              <button onClick={() => setShowLeadGenModal(false)} className="w-full text-slate-400 text-xs font-bold py-2 hover:text-slate-600">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 relative text-center">
            <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔒</div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Premium Content Reached</h3>
            <p className="text-xs text-slate-500 mb-6 font-semibold">You have exhausted the free and registered question banks. To access the final questions and view your complete results, please upgrade.</p>
            <button 
              onClick={() => {
                // Simulate payment gateway
                toast.loading('Redirecting to payment gateway...', { duration: 2000 });
                setTimeout(() => {
                  setHasPaid(true);
                  setShowPaymentModal(false);
                  toast.success('Payment successful! All questions unlocked.');
                  setCurrentIndex(240);
                }, 2000);
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md"
            >
              Pay Now (Mock $99)
            </button>
            <button onClick={() => setShowPaymentModal(false)} className="w-full text-slate-400 text-xs font-bold py-3 mt-2 hover:text-slate-600">Cancel</button>
          </div>
        </div>
      )}
`;

// Insert the modals right before the closing div of the 'active' test layout
c = c.replace(/<\/div>\s*<\/div>\s*\)\;\s*\}\s*\/\/\s*RESULTS SCREEN/, modalsJSX + '\n      </div>\n    );\n  }\n\n  // RESULTS SCREEN');

fs.writeFileSync(filePath, c);
console.log('MockTestPage successfully patched with gating logic.');
