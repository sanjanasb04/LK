import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Globe, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('India');
  const [inquiryFor, setInquiryFor] = useState('Myself');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (!agreeTerms) {
      return setError('You must agree to the Terms of Service and Privacy Policy.');
    }

    setLoading(true);
    const res = await register({
      name,
      email,
      phone,
      password,
      country,
      inquiryFor,
    });
    setLoading(false);

    if (!res.success) {
      setError(res.message);
    }
  };

  const countries = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'United Arab Emirates', 'Singapore'];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-xl w-full space-y-8 bg-white border border-slate-100 p-8 sm:p-10 rounded-2xl shadow-xl">
        
        {/* Header */}
        <div className="text-center">
          <Link to="/">
            <img
              src="https://learnerskart.com/wp-content/uploads/2023/05/4545c.png"
              alt="LearnersKart Logo"
              className="mx-auto h-12 w-auto object-contain"
            />
          </Link>
          <h2 className="mt-6 text-2xl font-extrabold text-textdark">Create Your Account</h2>
          <p className="mt-1.5 text-xs text-textmuted font-semibold leading-none">
            Get started today and unlock premium certification training
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3.5 text-xs font-semibold text-left">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs">
          
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-3 pl-10 rounded-xl outline-none text-xs sm:text-sm font-semibold transition-all"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="jane@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-3 pl-10 rounded-xl outline-none text-xs sm:text-sm font-semibold transition-all"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="+91 98459 15890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-3 pl-10 rounded-xl outline-none text-xs sm:text-sm font-semibold transition-all"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-2">
              Password
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
              Confirm Password
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

          {/* Country Dropdown */}
          <div>
            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-2">
              Country
            </label>
            <div className="relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-3 pl-10 rounded-xl outline-none text-xs sm:text-sm font-semibold transition-all cursor-pointer appearance-none"
              >
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Inquiry For */}
          <div>
            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-2">
              Registering for:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Myself', 'My Company'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setInquiryFor(opt)}
                  className={`text-center py-2.5 border rounded-xl font-bold transition-all ${
                    inquiryFor === opt
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="sm:col-span-2 flex items-start gap-2.5 py-2">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded border-slate-300 text-primary w-4.5 h-4.5 cursor-pointer mt-0.5"
            />
            <label htmlFor="agreeTerms" className="text-[11px] font-semibold text-slate-600 cursor-pointer select-none leading-tight">
              I agree to LearnersKart's{' '}
              <Link to="/term-conditions" className="text-accent underline hover:text-accent-dark">Terms of Service</Link>{' '}
              and{' '}
              <Link to="/privacy-policy" className="text-accent underline hover:text-accent-dark">Privacy Policy</Link>.
            </label>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4.5 w-4.5 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

        </form>

        {/* Bottom helper */}
        <p className="text-center text-xs text-textmuted font-semibold pt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-extrabold text-accent hover:underline pl-0.5">
            Log In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;
