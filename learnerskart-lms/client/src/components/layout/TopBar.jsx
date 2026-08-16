import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, User, LogOut, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationBell from '../ui/NotificationBell';
import Countdown from '../ui/Countdown';

import { Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';

export default function TopBar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { selectedCountry, setSelectedCountry, countriesList } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const dropdownRef = useRef(null);
  const countryRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (countryRef.current && !countryRef.current.contains(e.target)) {
        setCountryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // IP Geolocation auto-detection
  useEffect(() => {
    const saved = localStorage.getItem('lk_selected_country');
    if (saved) return;

    const autoDetect = async () => {
      try {
        let countryCode = null;
        try {
          const res = await fetch('https://ipapi.co/json/');
          if (res.ok) {
            const data = await res.json();
            countryCode = data?.country_code || data?.country;
          }
        } catch (e) {}

        if (!countryCode) {
          try {
            const res = await fetch('https://ipinfo.io/json');
            if (res.ok) {
              const data = await res.json();
              countryCode = data?.country;
            }
          } catch (e) {}
        }

        if (countryCode && countriesList && Array.isArray(countriesList)) {
          const matched = countriesList.find(c => c.code === countryCode.toUpperCase());
          if (matched) {
            setSelectedCountry(matched);
            localStorage.setItem('lk_selected_country', JSON.stringify(matched));
          }
        }
      } catch (err) {}
    };
    autoDetect();
  }, [countriesList]);

  // Compute breadcrumbs
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(p => p && p !== 'lms');
    if (paths.length === 0) return 'Dashboard';
    return paths.map(p => p.charAt(0).toUpperCase() + p.slice(1).replace('-', ' ')).join(' / ');
  };

  const handleLogout = () => {
    logout();
    navigate('/lms/login');
  };

  const handleSwitchRole = (role) => {
    setProfileOpen(false);
    if (role === 'instructor') {
      navigate('/lms/instructor/dashboard');
    } else if (role === 'admin') {
      navigate('/lms/admin/dashboard');
    } else {
      navigate('/lms/dashboard');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 px-5 flex items-center justify-between shadow-sm select-none z-40 relative">
      
      {/* Left items: Mobile Hamburger and Path */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        
        {/* Breadcrumb Path */}
        <span className="hidden sm:block text-xs font-bold text-slate-500 uppercase tracking-wide">
          {getBreadcrumbs()}
        </span>
      </div>

      {/* Center Search Input */}
      <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl w-80">
        <Search size={14} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Search courses, lessons, resources..." 
          className="bg-transparent border-none outline-none text-xs text-slate-700 w-full placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Right Action Widgets */}
      <div className="flex items-center gap-4">
        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 py-1.5 px-3 border border-red-100 text-red-500 hover:bg-red-50 text-xs font-bold rounded-xl transition-all shadow-sm active:scale-97 cursor-pointer"
        >
          <LogOut size={13} />
          Logout
        </button>

        <div className="w-px h-6 bg-slate-100" />

        {/* Country / Currency Manual Selector Dropdown */}
        <div className="relative" ref={countryRef}>
          <button
            onClick={() => setCountryOpen(!countryOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200/80 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title="Change Country & Currency"
          >
            <Globe size={13} className="text-slate-400" />
            <span>{selectedCountry?.flag || '🌐'}</span>
            <span>{selectedCountry?.currency || 'USD'}</span>
            <ChevronDown size={12} className="text-slate-400" />
          </button>

          {countryOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-150 rounded-xl shadow-xl z-50 overflow-hidden py-1.5 flex flex-col text-slate-700 animate-fade-in text-left">
              <div className="px-3 py-1 border-b border-slate-100 mb-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Manual Currency Selector</span>
              </div>
              {(countriesList || []).map((country) => (
                <button
                  key={country.code}
                  onClick={() => {
                    setSelectedCountry(country);
                    localStorage.setItem('lk_selected_country', JSON.stringify(country));
                    toast.success(`Currency changed to ${country.name} (${country.symbol}${country.currency})`);
                    setCountryOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs font-bold transition-colors ${
                    selectedCountry?.code === country.code
                      ? 'bg-primary/10 text-primary font-black'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{country.symbol} {country.currency}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile Avatar Trigger */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-xl transition-colors select-none"
            >
              <img 
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                alt={user.name} 
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {/* Profile Dropdown Panel */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden py-1.5 flex flex-col text-slate-700">
                <div className="px-4 py-2 border-b border-slate-50 text-left">
                  <p className="text-xs font-bold text-slate-800">{user.name}</p>
                  <span className="text-[10px] text-slate-400 font-semibold">{user.email}</span>
                </div>

                <button 
                  onClick={() => { setProfileOpen(false); navigate('/lms/profile'); }}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 text-left"
                >
                  <User size={14} />
                  My Profile
                </button>

                {/* Role switching */}
                {(user.role === 'admin' || user.role === 'instructor') && (
                  <div className="border-t border-slate-50 py-1.5">
                    <span className="text-[9px] font-black text-slate-400 block px-4 uppercase tracking-wider mb-1">
                      Switch Role
                    </span>
                    <button 
                      onClick={() => handleSwitchRole('learner')}
                      className="w-full flex items-center gap-2 px-4 py-1.5 text-xs font-semibold hover:bg-slate-50 text-left"
                    >
                      <Shield size={14} className="text-slate-400" />
                      Learner Portal
                    </button>
                    <button 
                      onClick={() => handleSwitchRole('instructor')}
                      className="w-full flex items-center gap-2 px-4 py-1.5 text-xs font-semibold hover:bg-slate-50 text-left"
                    >
                      <Shield size={14} className="text-slate-400" />
                      Instructor Portal
                    </button>
                    {user.role === 'admin' && (
                      <button 
                        onClick={() => handleSwitchRole('admin')}
                        className="w-full flex items-center gap-2 px-4 py-1.5 text-xs font-semibold hover:bg-slate-50 text-left"
                      >
                        <Shield size={14} className="text-slate-400" />
                        Admin Portal
                      </button>
                    )}
                  </div>
                )}

                <button 
                  onClick={handleLogout}
                  className="border-t border-slate-50 flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 text-left"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </header>
  );
}
