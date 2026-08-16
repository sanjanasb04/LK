import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGooglePopup, setShowGooglePopup] = useState(false);
  const [showNewAccountForm, setShowNewAccountForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');


  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.message);
    }
  };

  // Simulated Google OAuth Login
  const handleGoogleLogin = (e) => {
    e.preventDefault();
    setError('');
    setShowGooglePopup(true);
    setShowNewAccountForm(false);
  };

  const handleSelectGoogleAccount = async (selectedName, selectedEmail) => {
    setShowGooglePopup(false);
    setLoading(true);
    setError('');
    const mockGooglePassword = 'googlepassword123';

    try {
      // 1. Try to login
      let res = await login(selectedEmail, mockGooglePassword);

      // 2. If user doesn't exist yet, register them
      if (!res.success) {
        const regRes = await register({
          name: selectedName,
          email: selectedEmail,
          password: mockGooglePassword,
          phone: '9876543210',
          country: 'India',
          company: 'Google SSO Inc',
          designation: 'Professional Learner'
        });

        if (!regRes.success) {
          setError(regRes.message || 'Google SSO Sandbox registration failed.');
          setLoading(false);
          return;
        }
      }

      // Explicitly navigate to the dashboard upon successful login or registration
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Google Login Error:', err);
      setError('Google SSO Simulator encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;
    handleSelectGoogleAccount(customName.trim(), customEmail.trim());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-md w-full space-y-8 bg-white border border-slate-100 p-8 sm:p-10 rounded-2xl shadow-xl">
        
        {/* Header Logo */}
        <div className="text-center">
          <Link to="/">
            <img
              src="https://learnerskart.com/wp-content/uploads/2023/05/4545c.png"
              alt="LearnersKart Logo"
              className="mx-auto h-12 w-auto object-contain"
            />
          </Link>
          <h2 className="mt-6 text-2xl font-extrabold text-textdark">Welcome Back</h2>
          <p className="mt-1.5 text-xs text-textmuted font-semibold leading-none">
            Log in to continue your professional certification journey
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs font-semibold text-left">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
          {/* Email */}
          <div>
            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-3 pl-10 rounded-xl outline-none text-xs sm:text-sm font-semibold transition-all"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block font-bold text-slate-600 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="font-bold text-accent hover:underline text-[11px]"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-3 pl-10 pr-10 rounded-xl outline-none text-xs sm:text-sm font-semibold transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 text-sm flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4.5 w-4.5 border-t-2 border-b-2 border-white"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider OR */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="absolute bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
            OR
          </span>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white hover:bg-slate-50 text-textdark border border-slate-200 font-bold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-xs"
        >
          {/* Custom Google logo SVG */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Bottom sign up helper */}
        <p className="text-center text-xs text-textmuted font-semibold pt-4">
          Don't have an account?{' '}
          <Link to="/register" className="font-extrabold text-accent hover:underline pl-0.5">
            Create Account
          </Link>
        </p>


      </div>

      {/* Simulated Google Account Chooser Popup */}
      {showGooglePopup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white w-full max-w-[380px] p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-100 text-center relative select-none animate-scale-up">
            
            {/* Close */}
            <button 
              type="button"
              onClick={() => setShowGooglePopup(false)}
              className="absolute right-4.5 top-4.5 text-slate-400 hover:text-slate-600 text-2xl font-semibold leading-none"
            >
              &times;
            </button>

            {/* Google Logo */}
            <svg className="w-8 h-8 mx-auto mb-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>

            <h3 className="text-lg font-bold text-slate-800 leading-snug">Sign in with Google</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">to continue to LearnersKart</p>

            {/* Account List */}
            {!showNewAccountForm ? (
              <div className="space-y-2.5 text-left">
                {/* Profile Option 1 */}
                <button
                  type="button"
                  onClick={() => handleSelectGoogleAccount('Sanjana S B', 'sanjubanakarmlr45@gmail.com')}
                  className="w-full flex items-center gap-3 p-3 border border-slate-100 hover:border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                    S
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">Sanjana S B</p>
                    <p className="text-[10px] text-slate-400 truncate">sanjubanakarmlr45@gmail.com</p>
                  </div>
                </button>

                {/* Profile Option 2 */}
                <button
                  type="button"
                  onClick={() => handleSelectGoogleAccount('SSB', 'sanjubanakarmlr17@gmail.com')}
                  className="w-full flex items-center gap-3 p-3 border border-slate-100 hover:border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                    S
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">SSB</p>
                    <p className="text-[10px] text-slate-400 truncate">sanjubanakarmlr17@gmail.com</p>
                  </div>
                </button>

                {/* Use another account option */}
                <button
                  type="button"
                  onClick={() => setShowNewAccountForm(true)}
                  className="w-full flex items-center gap-3 p-3 border border-dashed border-slate-200 hover:border-slate-300 rounded-xl hover:bg-slate-50 transition-all text-left text-accent"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-500 text-base leading-none">
                    +
                  </div>
                  <span className="text-xs font-bold">Use another account</span>
                </button>
              </div>
            ) : (
              /* Custom Account Form */
              <form onSubmit={handleCustomGoogleSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sanjana S B"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none text-xs font-semibold focus:bg-white focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none text-xs font-semibold focus:bg-white focus:border-primary transition-all"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewAccountForm(false)}
                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2.5 rounded-xl text-xs transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition-all"
                  >
                    Continue
                  </button>
                </div>
              </form>
            )}

            <p className="text-[10px] text-slate-400 mt-6 leading-relaxed text-left">
              To continue, Google will share your name, email address, language preference, and profile picture with LearnersKart.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
