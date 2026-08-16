import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, Lock, Key, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';

const ForgotPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token'); // Check if resetting password

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Clear alerts on mode toggle
    setMessage('');
    setError('');
    setSuccess(false);
  }, [token]);

  // Handle Forgot Password Form Submission
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setSuccess(true);
        setMessage('A password reset link has been dispatched to your email.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password Form Submission
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { token, password });
      if (res.data.success) {
        setSuccess(true);
        setMessage('Password updated successfully. Redirecting to Login...');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Token is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-md w-full space-y-8 bg-white border border-slate-100 p-8 sm:p-10 rounded-2xl shadow-xl">
        
        {/* Header logo */}
        <div className="text-center">
          <Link to="/">
            <img
              src="https://learnerskart.com/wp-content/uploads/2023/05/4545c.png"
              alt="LearnersKart Logo"
              className="mx-auto h-12 w-auto object-contain"
            />
          </Link>
          <h2 className="mt-6 text-2xl font-extrabold text-textdark">
            {token ? 'Reset Password' : 'Forgot Password'}
          </h2>
          <p className="mt-1.5 text-xs text-textmuted font-semibold leading-none">
            {token 
              ? 'Enter a new password for your account' 
              : 'Enter your email to receive a password reset link'
            }
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 text-xs font-semibold text-left flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Success!</p>
              <p className="font-medium text-[11px] mt-0.5">{message}</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3.5 text-xs font-semibold text-left">
            {error}
          </div>
        )}

        {/* Forms */}
        {!success || token ? (
          token ? (
            /* RESET PASSWORD FORM */
            <form onSubmit={handleResetSubmit} className="space-y-4 text-left text-xs">
              {/* New Password */}
              <div>
                <label className="block font-bold text-slate-600 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-3 pl-10 rounded-xl outline-none text-xs sm:text-sm font-semibold transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-3 pl-10 rounded-xl outline-none text-xs sm:text-sm font-semibold transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                  'Update Password'
                )}
              </button>
            </form>
          ) : (
            /* FORGOT PASSWORD FORM */
            <form onSubmit={handleForgotSubmit} className="space-y-4 text-left text-xs">
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 text-sm flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4.5 w-4.5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )
        ) : null}

        {/* Back to Login link */}
        <div className="text-center pt-4 border-t border-slate-100 mt-6">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-1.5 font-bold text-slate-500 hover:text-primary transition-colors text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
