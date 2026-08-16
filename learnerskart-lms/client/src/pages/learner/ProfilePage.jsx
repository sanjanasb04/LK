import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Shield, Bell, Lock, Mail, Phone, MapPin, Linkedin, Briefcase, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile, uploadAvatar } = useAuth();
  const [activeTab, setActiveTab] = useState('personal'); // personal, security, notifications

  // Personal Info Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [linkedIn, setLinkedIn] = useState(user?.linkedIn || '');
  const [company, setCompany] = useState(user?.company || '');
  const [designation, setDesignation] = useState(user?.designation || '');
  const [loading, setLoading] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notifications State
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await updateProfile({
      name, phone, bio, location, linkedIn, company, designation
    });
    setLoading(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    toast.loading('Uploading avatar image...');
    const res = await uploadAvatar(file);
    toast.dismiss();
    
    if (res?.success) {
      toast.success('Avatar updated successfully!');
    }
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    toast.success('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <User size={14} /> },
    { id: 'security', label: 'Security & Password', icon: <Lock size={14} /> },
    { id: 'notifications', label: 'Notifications Preferences', icon: <Bell size={14} /> }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="text-left">
        <h1 className="text-2xl font-black text-slate-800">Account Settings</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Manage credentials, avatar uploads, and notification systems.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Profile summary Card */}
        <div className="bg-white border border-slate-100 p-6 rounded-panel shadow-sm text-center h-fit">
          <div className="relative w-24 h-24 mx-auto group">
            <img 
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
              alt={user?.name} 
              className="w-24 h-24 rounded-full object-cover border-4 border-primary/10 shadow-sm"
            />
            {/* Upload trigger */}
            <label className="absolute bottom-0 right-0 p-2 bg-primary hover:bg-primary-dark text-white rounded-full shadow-md cursor-pointer transition-all duration-200">
              <Camera size={14} />
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          <h2 className="font-extrabold text-slate-800 text-sm mt-4">{user?.name}</h2>
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mt-1">
            🥇 {user?.level || 'Gold'} LEVEL — {user?.xp || 2340} XP
          </span>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{user?.email}</p>

          <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-slate-50 text-center select-none">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase leading-none mb-1">Streak</span>
              <span className="text-sm font-black text-slate-800">🔥 {user?.streak || 7}d</span>
            </div>
            <div className="border-x border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase leading-none mb-1">Badges</span>
              <span className="text-sm font-black text-slate-800">🎖️ {user?.badges?.length || 14}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase leading-none mb-1">Courses</span>
              <span className="text-sm font-black text-slate-800">📚 3</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Settings Form panels */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tabs header */}
          <div className="flex border-b border-slate-100 bg-white p-1 rounded-xl shadow-sm select-none justify-start w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 py-2 px-4 text-xs font-bold rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: PERSONAL INFO */}
          {activeTab === 'personal' && (
            <form onSubmit={handlePersonalSubmit} className="bg-white border border-slate-100 p-6 rounded-panel shadow-sm space-y-4 text-left">
              <h3 className="font-extrabold text-slate-800 text-xs border-b border-slate-50 pb-2 mb-4">Edit Profile details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bangalore, India"
                    className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={linkedIn}
                    onChange={(e) => setLinkedIn(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. TechCorp"
                    className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Professional Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Project Associate"
                    className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Profile Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about your learning goals and certifications strategy..."
                  className="w-full border border-slate-200 px-3 py-2.5 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="py-2.5 px-6 bg-accent hover:bg-accent-dark text-white font-bold text-xs rounded-xl transition-colors shadow-sm self-start"
              >
                {loading ? 'Saving details...' : 'Save Settings'}
              </button>
            </form>
          )}

          {/* TAB 2: SECURITY PASSWORD */}
          {activeTab === 'security' && (
            <form onSubmit={handleSecuritySubmit} className="bg-white border border-slate-100 p-6 rounded-panel shadow-sm space-y-4 text-left">
              <h3 className="font-extrabold text-slate-800 text-xs border-b border-slate-50 pb-2 mb-4">Reset Account Password</h3>
              
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                Update Password
              </button>
            </form>
          )}

          {/* TAB 3: NOTIFICATIONS SYSTEM */}
          {activeTab === 'notifications' && (
            <div className="bg-white border border-slate-100 p-6 rounded-panel shadow-sm text-left space-y-6">
              <h3 className="font-extrabold text-slate-800 text-xs border-b border-slate-50 pb-2 mb-4">Mailing & Push Preferences</h3>
              
              <div className="space-y-4">
                {/* Email toggle */}
                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50/50">
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-700 block">✉️ Email Notifications</span>
                    <span className="text-[10px] text-slate-400">Receive live webinar alerts and mentor calendar schedule reminders.</span>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={emailNotifs}
                      onChange={() => setEmailNotifs(!emailNotifs)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>

                {/* In App notifications toggle */}
                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50/50">
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-700 block">🔔 In-App Broadcast Alerts</span>
                    <span className="text-[10px] text-slate-400">Get popups on streak rewards, quiz scores and comment answers.</span>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={inAppNotifs}
                      onChange={() => setInAppNotifs(!inAppNotifs)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              </div>

              <button 
                onClick={() => toast.success('Notification preferences updated!')}
                className="py-2.5 px-6 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                Save Preferences
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
