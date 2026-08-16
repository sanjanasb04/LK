import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Target, Award, Users, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, googleAuth } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res?.success) {
      if (res.user.role === 'admin') {
        navigate('/lms/admin/dashboard');
      } else if (res.user.role === 'instructor') {
        navigate('/lms/instructor/dashboard');
      } else {
        navigate('/lms/dashboard');
      }
    }
  };

  const handleGoogleLogin = async () => {
    // Simulated Google OAuth login callback
    setLoading(true);
    const res = await googleAuth('rahul.pmp@gmail.com', 'Rahul Krishnamurthy', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150');
    setLoading(false);
    
    if (res?.success) {
      navigate('/lms/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex bg-white select-none">
      
      {/* LEFT: Branding Panel (blue gradient) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-dark via-primary to-primary-light p-12 flex-col justify-between text-white relative overflow-hidden">
        
        {/* Decorative Watermark circles */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-white/5 rounded-full blur-2xl" />

        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <img 
            src="https://learnerskart.com/wp-content/uploads/2023/05/4545c.png" 
            alt="Logo" 
            className="h-10 object-contain bg-white rounded-lg p-1.5 shadow-md"
          />
          <div>
            <span className="font-extrabold text-base tracking-wider block">LearnersKart</span>
            <span className="text-[10px] text-white/60 font-black tracking-widest uppercase">LMS Gateway</span>
          </div>
        </div>

        {/* Brand Pitch Text */}
        <div className="text-left my-auto space-y-6 max-w-md z-10">
          <div>
            <h1 className="text-4xl font-black leading-tight tracking-tight">Learn. Certify. Lead.</h1>
            <p className="text-xs text-white/80 mt-2 font-medium">
              Accelerate your professional certification track with personalized mentors, interactive mock prep engines, and a gamified cohort framework.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10 shadow-sm backdrop-blur-sm">
              <div className="p-2 bg-accent/20 rounded-lg text-accent">
                <Target size={18} />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold block">🎯 Gamified Progress</span>
                <span className="text-[10px] text-white/70">Earn badges, level multipliers and login streaks.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10 shadow-sm backdrop-blur-sm">
              <div className="p-2 bg-highlight/20 rounded-lg text-highlight">
                <Users size={18} />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold block">👨‍🏫 Live Mentorship</span>
                <span className="text-[10px] text-white/70">Book 1-on-1 calls with authorized certification veterans.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10 shadow-sm backdrop-blur-sm">
              <div className="p-2 bg-success/20 rounded-lg text-success">
                <Award size={18} />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold block">🏆 Certificates</span>
                <span className="text-[10px] text-white/70">Share verifiable credentials on LinkedIn instantly.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-white/40">
          © {new Date().getFullYear()} LearnersKart Edutech Private Limited. Version 2.4.0.
        </div>

      </div>

      {/* RIGHT: Credentials Input Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-bglight">
        <div className="w-full max-w-md bg-white border border-slate-100 p-8 rounded-panel shadow-md text-slate-700">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-slate-800">Welcome Back</h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Sign in to your learning dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[10px] font-bold text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 px-3.5 py-2.5 pr-10 text-xs rounded-xl focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* CTA button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-accent hover:bg-accent-dark disabled:bg-slate-300 text-white font-bold rounded-xl text-xs transition-colors shadow-sm mt-2"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Social login */}
          <div className="relative my-6 select-none">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Or Continue With
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {/* Google Vector Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.147 4.114-3.487 0-6.314-2.827-6.314-6.314s2.827-6.314 6.314-6.314c1.556 0 2.973.562 4.07 1.493l3.056-3.056C19.23 2.505 15.935 1.5 12.24 1.5a10.5 10.5 0 000 21c5.805 0 10.74-4.17 10.74-10.5 0-.71-.082-1.397-.24-2.015H12.24z"
              />
            </svg>
            Login with Google
          </button>

          {/* Registration link */}
          <p className="text-center text-xs text-slate-400 mt-6 select-none">
            New learner?{' '}
            <Link to="/lms/register" className="font-bold text-primary hover:underline">
              Register here
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}
