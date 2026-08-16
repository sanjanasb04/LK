import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Target, Award, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('learner');
  const [enrollCode, setEnrollCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please enter all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await register(name, email, phone, password, role, enrollCode);
    setLoading(false);

    if (res?.success) {
      navigate('/lms/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex bg-white select-none">
      
      {/* LEFT: Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-dark via-primary to-primary-light p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-white/5 rounded-full blur-2xl" />

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

        <div className="text-left my-auto space-y-6 max-w-md z-10">
          <div>
            <h1 className="text-4xl font-black leading-tight tracking-tight">Create an Account</h1>
            <p className="text-xs text-white/80 mt-2 font-medium">
              Start building professional milestones today. Complete assignments, coordinate live mentoring, and build verifiably shareable achievements.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10 shadow-sm backdrop-blur-sm">
              <div className="p-2 bg-accent/20 rounded-lg text-accent">
                <Target size={18} />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold block">🎯 Complete Curriculum</span>
                <span className="text-[10px] text-white/70">PMP, Prince2, and Agile frameworks structured in tracks.</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10 shadow-sm backdrop-blur-sm">
              <div className="p-2 bg-highlight/20 rounded-lg text-highlight">
                <Users size={18} />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold block">👨‍🏫 Group Cohorts</span>
                <span className="text-[10px] text-white/70">Coordinate with classrooms and schedule study circles.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-white/40">
          © {new Date().getFullYear()} LearnersKart Edutech Private Limited.
        </div>
      </div>

      {/* RIGHT: Register Input Fields */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-bglight">
        <div className="w-full max-w-md bg-white border border-slate-100 p-8 rounded-panel shadow-md text-slate-700 h-[580px] overflow-y-auto">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-slate-800">Get Started</h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Join the LearnersKart cohort today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Krishnamurthy"
                className="w-full border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            {/* Email & Phone grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Email
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
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 99999 99999"
                  className="w-full border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            </div>

            {/* Passwords grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Confirm
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            </div>

            {/* Role selection & Code */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Target Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="learner">Learner</option>
                  <option value="instructor">Instructor</option>
                  <option value="mentor">Mentor</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={enrollCode}
                  onChange={(e) => setEnrollCode(e.target.value)}
                  placeholder="Optional code"
                  className="w-full border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-accent hover:bg-accent-dark disabled:bg-slate-300 text-white font-bold rounded-xl text-xs transition-colors shadow-sm mt-4"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6 select-none">
            Already registered?{' '}
            <Link to="/lms/login" className="font-bold text-primary hover:underline">
              Login here
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}
