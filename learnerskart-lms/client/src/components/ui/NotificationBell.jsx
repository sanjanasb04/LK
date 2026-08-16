import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Award, Tv, MessageSquare, BookOpen, AlertCircle } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleNotificationClick = (notif) => {
    markRead(notif._id);
    setOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  // Map notification type to icon
  const getIcon = (type) => {
    switch (type) {
      case 'badge_unlock':
        return <Award className="text-gamify" size={16} />;
      case 'live_session':
        return <Tv className="text-accent" size={16} />;
      case 'doubt_reply':
      case 'doubt_post':
        return <MessageSquare className="text-highlight" size={16} />;
      case 'lesson_complete':
      case 'certificate_ready':
        return <BookOpen className="text-success" size={16} />;
      default:
        return <AlertCircle className="text-primary" size={16} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Bell Icon */}
      <button 
        onClick={() => setOpen(!open)}
        className="relative p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors select-none"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white font-extrabold text-[9px] flex items-center justify-center rounded-full ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[420px]">
          {/* Header */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <span className="font-bold text-slate-800 text-xs">Notifications</span>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5"
              >
                <Check size={12} />
                Mark all read
              </button>
            )}
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 select-none">
                <Bell size={32} className="mx-auto mb-2 opacity-35" />
                <p className="text-xs font-semibold">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer hover:bg-slate-50/70 transition-colors ${
                    !notif.isRead ? 'bg-primary/5 font-semibold' : ''
                  }`}
                >
                  <div className={`p-2 rounded-lg ${!notif.isRead ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-bold text-slate-800 leading-snug">{notif.title}</p>
                    <p className="text-[10px] text-slate-500 leading-normal mt-0.5 truncate">{notif.message}</p>
                    <span className="text-[9px] text-slate-400 block mt-1 font-medium">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
