import React, { useState, useEffect } from 'react';
import { Gift, X, Sparkles, User, Mail, Phone, Check, ArrowRight } from 'lucide-react';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';

const SpinTheWheelPopup = () => {
  const { applyCoupon } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null); // won index
  const [phase, setPhase] = useState('initial'); // 'initial' | 'spinning' | 'claimForm' | 'claimed'
  const [wheelRotation, setWheelRotation] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const offers = [
    { title: '10% OFF PMP Exam Voucher', code: 'LKPMP10' },
    { title: '25% OFF Self-Paced/LVC Training', code: 'LKTRAINING25' },
    { title: '10% OFF All Trainings', code: 'LKALL10' },
    { title: 'Free PMP Eligibility Check & Application Guidance', code: 'LKPMPAPP' },
    { title: 'Refer a Friend & Earn 10% Cashback', code: 'LKREFER10' },
    { title: '2 Full-Length PMP Mock Exams', code: 'LKMOCK2' }
  ];

  // Poppy, bright primary colors (Red, Yellow, Blue, Green, Orange, Purple)
  const segmentColors = [
    '#ef4444', // vibrant red
    '#facc15', // poppy yellow
    '#3b82f6', // bright blue
    '#22c55e', // fresh green
    '#f97316', // orange
    '#a855f7'  // purple
  ];

  useEffect(() => {
    // Helper to check if already claimed
    const isClaimed = () => localStorage.getItem('lk_wheel_claimed') === 'true';

    // Trigger popup after 10 seconds if not already claimed
    const timer10s = setTimeout(() => {
      if (!isClaimed()) {
        setIsOpen(true);
      }
    }, 10000);

    // Trigger popup again after 1 minute (60 seconds) if not already claimed
    const timer1m = setTimeout(() => {
      if (!isClaimed()) {
        setIsOpen(true);
      }
    }, 60000);

    // Exit intent trigger: when user moves mouse to top tab bar/close button
    const handleMouseLeave = (e) => {
      if (e.clientY < 20) {
        const exitTriggered = sessionStorage.getItem('lk_exit_triggered') === 'true';
        if (!exitTriggered && !isClaimed()) {
          sessionStorage.setItem('lk_exit_triggered', 'true');
          setIsOpen(true);
        }
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);

    // Allow manual open via custom events (e.g. from header/top banner)
    const handleOpenEvent = () => {
      setIsOpen(true);
    };
    window.addEventListener('lk-open-wheel', handleOpenEvent);

    return () => {
      clearTimeout(timer10s);
      clearTimeout(timer1m);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('lk-open-wheel', handleOpenEvent);
    };
  }, []);

  const handleClose = () => {
    if (isSpinning || isSubmitting) return;
    setIsOpen(false);
    // Reset states on close so user can test spin again next time it opens
    setPhase('initial');
    setSpinResult(null);
    setWheelRotation(0);
    setCouponCode('');
  };

  const handleSpinSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!name || !email || !phone) {
      alert('Please fill out all contact fields to spin the wheel!');
      return;
    }

    if (isSpinning || phase !== 'initial') return;

    setIsSpinning(true);
    setPhase('spinning');

    // Randomly select a winning index (0 to 5)
    const winIdx = Math.floor(Math.random() * offers.length);
    setSpinResult(winIdx);
    setCouponCode(offers[winIdx].code);

    // Calculate rotation: 6 full rotations (2160 deg) + offset to align winning slice to top pointer
    const offset = 270 - (winIdx * 60 + 30);
    const targetDeg = 2160 + offset;
    setWheelRotation(targetDeg);

    // Send lead details to server immediately
    setIsSubmitting(true);
    try {
      await api.post('/mock-test/register-wheel-lead', {
        name,
        email,
        phone,
        offerWon: offers[winIdx].title
      });
      localStorage.setItem('lk_wheel_claimed', 'true');
      
      // Auto-apply won coupon to checkout cart
      applyCoupon(offers[winIdx].code);
    } catch (err) {
      console.error('Failed to submit wheel lead:', err);
    } finally {
      setIsSubmitting(false);
    }

    // 4 seconds spinning animation delay
    setTimeout(() => {
      setIsSpinning(false);
      setPhase('claimed');
    }, 4000);
  };

  const handleWheelClick = () => {
    if (isSpinning || phase !== 'initial') return;
    if (!name || !email || !phone) {
      alert('Please enter your contact details on the right first to spin the wheel!');
      const input = document.getElementById('wheel-name-input');
      if (input) input.focus();
      return;
    }
    handleSpinSubmit();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes blinkOdd {
          0%, 100% { opacity: 0.3; filter: drop-shadow(0 0 1px #ffd700); }
          50% { opacity: 1; filter: drop-shadow(0 0 5px #f6b40a) drop-shadow(0 0 8px #f6b40a); }
        }
        @keyframes blinkEven {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 5px #f6b40a) drop-shadow(0 0 8px #f6b40a); }
          50% { opacity: 0.3; filter: drop-shadow(0 0 1px #ffd700); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-bulb-odd {
          animation: blinkOdd 0.8s infinite;
        }
        .animate-bulb-even {
          animation: blinkEven 0.8s infinite;
        }
      `}} />
      <div className="bg-gradient-to-br from-[#0e1227] via-[#080a13] to-[#030407] border border-indigo-900/40 shadow-[0_0_60px_rgba(99,102,241,0.22),0_0_30px_rgba(246,180,10,0.08)] text-white rounded-3xl p-8 max-w-4xl w-full flex flex-col md:flex-row items-stretch gap-8 relative overflow-hidden animate-scale-up">
        {/* Glowing Background Halos behind the spinner */}
        <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/15 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-amber-500/8 blur-[100px] pointer-events-none -z-10" />

        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-slate-800/40 font-bold text-lg p-1.5 rounded-full transition-all z-30"
          disabled={isSpinning || isSubmitting}
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: The Premium Spinning Wheel */}
        <div className="flex-1 flex flex-col items-center justify-center relative min-h-[320px] select-none">
          {/* Wheel Pointer - Gold Arrow */}
          <div className="absolute top-[6px] z-30 filter drop-shadow-md">
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
              <path d="M12 28L0 4C0 1.79086 1.79086 0 4 0H20C22.2091 0 24 1.79086 24 4L12 28Z" fill="url(#goldGradient)" />
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="28" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffd700" />
                  <stop offset="50%" stopColor="#f6b40a" />
                  <stop offset="100%" stopColor="#d88b00" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* SVG Wheel Graphic Container with custom neon styling */}
          <div 
            onClick={handleWheelClick}
            title="Click Anywhere on Wheel to Spin!"
            className="relative w-80 h-80 rounded-full border-[10px] border-slate-900 shadow-[0_0_30px_rgba(246,180,10,0.15)] overflow-hidden flex items-center justify-center p-[2px] bg-slate-950 cursor-pointer hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(246,180,10,0.25)] active:scale-[0.97] transition-all duration-300 z-10"
          >
            {/* Inner Border Glow */}
            <div className="absolute inset-0 rounded-full border border-amber-400/20 animate-pulse pointer-events-none -z-10" />

            {/* Glowing Segment Rotator */}
            <div 
              className="w-full h-full rounded-full relative"
              style={{ 
                transform: `rotate(${wheelRotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.85, 0.35, 1)' : 'none'
              }}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  {/* Slices premium gradients */}
                  <linearGradient id="slice-grad-0" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#be123c" />
                  </linearGradient>
                  <linearGradient id="slice-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <linearGradient id="slice-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                  <linearGradient id="slice-grad-3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#ca8a04" />
                  </linearGradient>
                  <linearGradient id="slice-grad-4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6d28d9" />
                  </linearGradient>
                  <linearGradient id="slice-grad-5" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#c2410c" />
                  </linearGradient>
                  
                  {/* Metallic Gold rim gradient */}
                  <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffe875" />
                    <stop offset="25%" stopColor="#f7b500" />
                    <stop offset="50%" stopColor="#ffd700" />
                    <stop offset="75%" stopColor="#d88b00" />
                    <stop offset="100%" stopColor="#9a6200" />
                  </linearGradient>
                </defs>

                {offers.map((offer, idx) => {
                  const angle = 60;
                  const startAngle = idx * angle;
                  const endAngle = (idx + 1) * angle;
                  
                  const rad = Math.PI / 180;
                  const x1 = 100 + 100 * Math.cos(startAngle * rad);
                  const y1 = 100 + 100 * Math.sin(startAngle * rad);
                  const x2 = 100 + 100 * Math.cos(endAngle * rad);
                  const y2 = 100 + 100 * Math.sin(endAngle * rad);

                  const textAngle = startAngle + angle / 2;

                  return (
                    <g key={idx}>
                      <path
                        d={`M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
                        fill={`url(#slice-grad-${idx})`}
                        stroke="#ffffff"
                        strokeWidth="1.2"
                      />
                      {/* Rotate slice bisector horizontally for clean radial text placement */}
                      <g transform={`rotate(${textAngle} 100 100)`}>
                        <text
                          x="148"
                          y="100"
                          fill="#ffffff"
                          fontWeight="900"
                          textAnchor="middle"
                          stroke="#000000"
                          strokeWidth="0.15"
                          className="uppercase tracking-wider select-none font-sans font-black"
                        >
                          {idx === 0 && (
                            <>
                              <tspan x="148" dy="-3" fontSize="7px">10% OFF</tspan>
                              <tspan x="148" dy="7.5" fontSize="5.5px">PMP EXAM VOUCHER</tspan>
                            </>
                          )}
                          {idx === 1 && (
                            <>
                              <tspan x="148" dy="-7" fontSize="7px">25% OFF</tspan>
                              <tspan x="148" dy="7.5" fontSize="5px">SELF-PACED/LVC</tspan>
                              <tspan x="148" dy="7.5" fontSize="5.5px">TRAINING</tspan>
                            </>
                          )}
                          {idx === 2 && (
                            <>
                              <tspan x="148" dy="-3" fontSize="7px">10% OFF</tspan>
                              <tspan x="148" dy="7.5" fontSize="5.5px">ALL TRAININGS</tspan>
                            </>
                          )}
                          {idx === 3 && (
                            <>
                              <tspan x="148" dy="-11" fontSize="6px">FREE PMP</tspan>
                              <tspan x="148" dy="7.5" fontSize="5px">ELIGIBILITY CHECK</tspan>
                              <tspan x="148" dy="7.5" fontSize="5px">&amp; APPLICATION</tspan>
                              <tspan x="148" dy="7.5" fontSize="5.5px">GUIDANCE</tspan>
                            </>
                          )}
                          {idx === 4 && (
                            <>
                              <tspan x="148" dy="-7" fontSize="5.5px">REFER A FRIEND</tspan>
                              <tspan x="148" dy="7.5" fontSize="6px">&amp; EARN 10%</tspan>
                              <tspan x="148" dy="7.5" fontSize="6px">CASHBACK</tspan>
                            </>
                          )}
                          {idx === 5 && (
                            <>
                              <tspan x="148" dy="-3" fontSize="6px">2 FULL-LENGTH</tspan>
                              <tspan x="148" dy="7.5" fontSize="5.5px">PMP MOCK EXAMS</tspan>
                            </>
                          )}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Decorative Metallic Gold rim circle */}
                <circle cx="100" cy="100" r="96" fill="none" stroke="url(#goldRim)" strokeWidth="4.5" />

                {/* Casino flashing bulbs around outer rim */}
                {[...Array(12)].map((_, i) => {
                  const angle = i * 30;
                  const rad = Math.PI / 180;
                  const cx = 100 + 91.5 * Math.cos(angle * rad);
                  const cy = 100 + 91.5 * Math.sin(angle * rad);
                  return (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r="2.2"
                      fill="#ffffff"
                      className={i % 2 === 0 ? 'animate-bulb-even' : 'animate-bulb-odd'}
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Exterior Ring Glow Animation */}
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-amber-400/15 animate-spin -z-10 pointer-events-none" style={{ animationDuration: '45s' }} />
        </div>

        {/* RIGHT COLUMN: Interactive Panel Flow */}
        <div className="flex-grow flex flex-col justify-center text-left space-y-4 pr-2 max-w-sm w-full mx-auto md:mx-0 z-10">
          
          {/* Phase 1: Initial Signup Form before spinning */}
          {phase === 'initial' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <span className="bg-[#f6b40a]/15 border border-[#f6b40a]/30 text-[#facc15] text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Free Promotion
                </span>
                <h3 className="text-2xl font-black text-white uppercase tracking-wide">
                  Spin to Win!
                </h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  Enter your details below to activate the wheel and win exclusive certification training vouchers or discount codes!
                </p>
              </div>

              {/* Lead Capture Form */}
              <form onSubmit={handleSpinSubmit} className="space-y-3.5">
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      id="wheel-name-input"
                      type="text" 
                      required
                      placeholder="Enter your full name" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-slate-900 text-white placeholder-slate-600 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      placeholder="student@example.com" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-slate-900 text-white placeholder-slate-600 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 or Area Code Number" 
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-slate-900 text-white placeholder-slate-600 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-3 text-center">
                  <p className="text-[10px] font-extrabold text-[#facc15] uppercase tracking-wider animate-pulse flex items-center justify-center gap-1.5">
                    👈 Fill in details, then click the wheel to spin!
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* Phase 2: Spinning Loading Loop */}
          {phase === 'spinning' && (
            <div className="py-12 flex flex-col items-center justify-center gap-4 text-center animate-fade-in">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-400 border-t-transparent" />
              <div className="space-y-1">
                <h4 className="text-base font-black text-white uppercase tracking-wide">Spinning the Wheel...</h4>
                <p className="text-xs text-slate-400 font-semibold">
                  Good luck! Selecting your exclusive LearnersKart reward...
                </p>
              </div>
            </div>
          )}

          {/* Phase 4: Successfully Claimed Result Panel */}
          {phase === 'claimed' && (
            <div className="py-2 flex flex-col justify-center space-y-4 animate-scale-up text-left">
              <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-4 border-[#0c1020]">
                <Check className="w-8 h-8 text-white font-black" />
              </div>
              
              <div className="space-y-1">
                <span className="bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                  ✅ Reward Active
                </span>
                <h3 className="text-xl font-black text-white uppercase tracking-wide mt-1">
                  Congratulations!
                </h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  Your details were captured. You have won:
                </p>
                <div className="bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-2xl my-2 text-center">
                  <span className="text-sm font-black text-emerald-400 block uppercase tracking-wide">
                    {offers[spinResult].title}
                  </span>
                </div>
              </div>

              {/* Promo Code display */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide font-sans">Use Promo Code at Checkout:</label>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                  <code className="text-sm font-extrabold text-indigo-400 font-mono tracking-wider">
                    {couponCode}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(couponCode);
                      alert('Coupon code copied to clipboard!');
                    }}
                    className="text-[10px] font-black bg-indigo-600 text-white hover:bg-indigo-755 px-3 py-1.5 rounded-lg transition-all uppercase shadow-sm cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-[9px] text-slate-500 font-semibold pt-1">
                  *A confirmation email has been dispatched. Our team will contact you shortly to coordinate your reward.
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md mt-2 cursor-pointer"
              >
                Close & Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpinTheWheelPopup;
