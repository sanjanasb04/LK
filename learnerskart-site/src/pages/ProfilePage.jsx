import React, { useState, useRef } from 'react';
import { User, Mail, Phone, Globe, Building2, ShieldAlert, Camera, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import api from '../utils/api';

const ProfilePage = () => {
  const { user, updateProfile, updateAvatar } = useAuth();

  const fileInputRef = useRef(null);

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState(user?.country || 'India');
  const [company, setCompany] = useState(user?.company || '');
  const [designation, setDesignation] = useState(user?.designation || '');

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Alerts
  const [profileMsg, setProfileMsg] = useState({ text: '', isError: false });
  const [passwordMsg, setPasswordMsg] = useState({ text: '', isError: false });
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Handle Forgot Password Request
  const handleForgotRequest = async () => {
    setProfileMsg({ text: '', isError: false });
    setPasswordMsg({ text: '', isError: false });
    setForgotLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email: user?.email });
      if (res.data.success) {
        setPasswordMsg({ text: 'A password reset link has been sent to your registered email address.', isError: false });
      }
    } catch (err) {
      setPasswordMsg({ text: err.response?.data?.message || 'Failed to send password reset link.', isError: true });
    } finally {
      setForgotLoading(false);
    }
  };

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ text: '', isError: false });
    setProfileLoading(true);

    const res = await updateProfile({
      name,
      email,
      phone,
      country,
      company,
      designation,
    });

    setProfileLoading(false);
    if (res.success) {
      setProfileMsg({ text: 'Profile details updated successfully.', isError: false });
    } else {
      setProfileMsg({ text: res.message, isError: true });
    }
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ text: '', isError: false });

    if (newPassword !== confirmPassword) {
      return setPasswordMsg({ text: 'New passwords do not match.', isError: true });
    }
    if (newPassword.length < 6) {
      return setPasswordMsg({ text: 'New password must be at least 6 characters.', isError: true });
    }

    setPasswordLoading(true);
    const res = await updateProfile({
      password: newPassword,
    });
    setPasswordLoading(false);

    if (res.success) {
      setPasswordMsg({ text: 'Account security password updated successfully.', isError: false });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMsg({ text: res.message, isError: true });
    }
  };

  // Trigger File Input Click
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  // Handle Avatar File Upload (No limit in size)
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setAvatarLoading(true);
    const res = await updateAvatar(formData);
    setAvatarLoading(false);

    if (!res.success) {
      alert(res.message);
    }
  };

  // Handle Avatar Removal
  const handleRemoveAvatar = async () => {
    if (!window.confirm('Are you sure you want to remove your profile photo?')) return;
    
    setAvatarLoading(true);
    const res = await updateProfile({ avatar: '' });
    setAvatarLoading(false);

    if (!res.success) {
      alert(res.message);
    }
  };

  const countries = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'United Arab Emirates', 'Singapore'];

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <DashboardSidebar />

          {/* Main Content Form Panels */}
          <main className="flex-grow space-y-8 w-full">
            
            {/* 1. Edit Profile Form */}
            <div className="bg-white border border-slate-100 shadow-md rounded-xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-textdark uppercase tracking-wider">
                    Profile Information
                  </h3>
                  <p className="text-[11px] text-textmuted font-semibold mt-0.5 leading-none">
                    Update your account details and professional bio settings.
                  </p>
                </div>
                
                {/* Avatar Uploader Wrapper */}
                <div className="flex items-center gap-4 select-none">
                  <div
                    onClick={handleAvatarClick}
                    className="w-20 h-20 rounded-2xl overflow-hidden cursor-pointer bg-slate-150 border-2 border-dashed border-[#098ce9]/30 hover:border-[#098ce9] shadow-inner group relative flex items-center justify-center transition-colors"
                    title="Change Avatar Image"
                  >
                    <img
                      src={user?.avatar ? (user.avatar.startsWith('/uploads') ? `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:5000${user.avatar}` : user.avatar) : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                      alt={user?.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 text-[10px] font-bold">
                      <Camera className="w-5 h-5" />
                      <span>Change</span>
                    </div>
                    {avatarLoading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-white"></div>
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAvatarClick}
                        className="bg-white hover:bg-slate-50 border border-slate-200 text-textdark font-bold px-3 py-1.5 rounded-lg text-[10px] shadow-sm transition-all"
                      >
                        Choose Photo
                      </button>
                      {user?.avatar && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold px-3 py-1.5 rounded-lg text-[10px] shadow-sm transition-all"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-textmuted mt-1.5 font-medium">JPG, PNG or GIF. No limit in size.</p>
                  </div>
                  {/* Hidden Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Profile Alert */}
              {profileMsg.text && (
                <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                  profileMsg.isError ? 'bg-red-50 border border-red-200 text-red-600' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                }`}>
                  {profileMsg.isError ? <ShieldAlert className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" /> : <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />}
                  <span>{profileMsg.text}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                {/* Name */}
                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 pl-10 rounded-lg outline-none focus:bg-white focus:border-primary text-textdark"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 pl-10 rounded-lg outline-none focus:bg-white focus:border-primary text-textdark"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 pl-10 rounded-lg outline-none focus:bg-white focus:border-primary text-textdark"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-2">Country</label>
                  <div className="relative">
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 pl-10 rounded-lg outline-none focus:bg-white focus:border-primary text-textdark cursor-pointer appearance-none"
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

                {/* Company */}
                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-2">Organization/Company</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 pl-10 rounded-lg outline-none focus:bg-white focus:border-primary text-textdark"
                    />
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-2">Professional Designation</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 pl-10 rounded-lg outline-none focus:bg-white focus:border-primary text-textdark"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="sm:col-span-2 pt-2 text-right">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2.5 rounded-lg shadow transition-all active:scale-95 text-xs inline-flex items-center justify-center min-w-[140px]"
                  >
                    {profileLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white"></div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* 2. Change Password Form */}
            <div className="bg-white border border-slate-100 shadow-md rounded-xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-extrabold text-base text-textdark uppercase tracking-wider">
                  Update Account Security
                </h3>
                <p className="text-[11px] text-textmuted font-semibold mt-0.5 leading-none">
                  Change your password to ensure secure authorization credentials.
                </p>
              </div>

              {/* Password Alert */}
              {passwordMsg.text && (
                <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                  passwordMsg.isError ? 'bg-red-50 border border-red-200 text-red-600' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                }`}>
                  {passwordMsg.isError ? <ShieldAlert className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" /> : <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs font-semibold text-slate-600 max-w-md">
                {/* Current Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-slate-500 uppercase tracking-wider">Current Password</label>
                    <button
                      type="button"
                      onClick={handleForgotRequest}
                      disabled={forgotLoading}
                      className="text-primary hover:underline text-[10px] font-bold"
                    >
                      {forgotLoading ? 'Sending Reset Link...' : 'Forgot password? Send reset link to email'}
                    </button>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary text-textdark"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary text-textdark"
                  />
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary text-textdark"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="bg-accent hover:bg-accent-dark text-white font-bold px-6 py-2.5 rounded-lg shadow transition-all active:scale-95 text-xs inline-flex items-center justify-center min-w-[140px]"
                  >
                    {passwordLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white"></div>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </form>
            </div>

          </main>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
