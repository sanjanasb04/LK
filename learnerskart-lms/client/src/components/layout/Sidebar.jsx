import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useXP from '../../hooks/useXP';
import { 
  Home, BookOpen, Route, Tv, FileText, FileQuestion, CheckSquare, 
  MessageSquare, Users, Award, Trophy, Settings, LogOut, ChevronLeft, ChevronRight 
} from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const { getLevelDetails } = useXP();
  const navigate = useNavigate();

  const xp = user?.xp || 0;
  const levelDetails = getLevelDetails(xp);

  // Grouped Navigation items
  const sections = [
    {
      title: '📊 LEARN',
      items: [
        { name: 'Dashboard', path: '/lms/dashboard', icon: <Home size={18} /> },
        { name: 'My Courses', path: '/lms/my-courses', icon: <BookOpen size={18} /> },
        { name: 'Live Sessions', path: '/lms/live-sessions', icon: <Tv size={18} /> },
        { name: 'Mock Tests', path: '/lms/mock-test', icon: <FileQuestion size={18} /> },
        { name: 'Practice Tests', path: '/lms/practice-test', icon: <CheckSquare size={18} /> },
        { name: 'Activity', path: '/lms/activity', icon: <Award size={18} /> },
      ]
    }
  ];

  if (user?.role === 'admin') {
    sections.unshift({
      title: '🛡️ ADMIN CONSOLE',
      items: [
        { name: 'Admin Dashboard', path: '/lms/admin/dashboard', icon: <Home size={18} /> },
        { name: 'Manage Users', path: '/lms/admin/users', icon: <Users size={18} /> },
        { name: 'Manage Courses', path: '/lms/admin/courses', icon: <BookOpen size={18} /> },
        { name: 'Manage Batches', path: '/lms/admin/batches', icon: <Route size={18} /> },
        { name: 'Upload Tests', path: '/lms/admin/upload-test', icon: <FileText size={18} /> },
        { name: 'Reports', path: '/lms/admin/reports', icon: <FileText size={18} /> }
      ]
    });
  } else if (user?.role === 'instructor') {
    sections.unshift({
      title: '👨‍🏫 INSTRUCTOR CONSOLE',
      items: [
        { name: 'Teacher Dashboard', path: '/lms/instructor/dashboard', icon: <Home size={18} /> },
        { name: 'New Course Builder', path: '/lms/instructor/courses/new', icon: <BookOpen size={18} /> },
        { name: 'Students Directory', path: '/lms/instructor/students', icon: <Users size={18} /> },
        { name: 'Analytics Board', path: '/lms/instructor/analytics', icon: <Trophy size={18} /> }
      ]
    });
  }

  const handleLogout = () => {
    logout();
    navigate('/lms/login');
  };

  return (
    <aside className={`bg-darksidebar text-slate-300 h-full flex flex-col transition-all duration-300 select-none border-r border-slate-800 ${
      collapsed ? 'w-[72px]' : 'w-[260px]'
    }`}>
      
      {/* Sidebar Header Logo */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img 
              src="https://learnerskart.com/wp-content/uploads/2023/05/4545c.png" 
              alt="Logo" 
              className="h-6 object-contain bg-white rounded p-0.5"
            />
            <span className="text-[10px] font-black bg-primary px-1.5 py-0.5 rounded text-white tracking-widest leading-none">
              LMS
            </span>
          </div>
        )}
        {collapsed && (
          <img 
            src="https://learnerskart.com/wp-content/uploads/2023/05/4545c.png" 
            alt="LK" 
            className="h-5 mx-auto bg-white rounded p-0.5"
          />
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* User details card (No XP/level) */}
      {user && (
        <div className={`p-4 border-b border-slate-800 bg-slate-900/40 ${collapsed ? 'text-center' : 'text-left'}`}>
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
              alt={user.name} 
              className="w-9 h-9 rounded-full object-cover border border-slate-700 mx-auto"
            />
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <span className="text-[9px] font-bold text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full mt-1 inline-block uppercase tracking-wider">
                  Role: {user.role}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <span className="text-[9px] font-extrabold text-slate-500 block px-3 tracking-wider mb-2">
                {sec.title}
              </span>
            )}
            <div className="space-y-0.5">
              {sec.items.map((item, itemIdx) => (
                <NavLink
                  key={itemIdx}
                  to={item.path}
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                    isActive 
                      ? 'bg-primary text-white font-bold shadow-sm' 
                      : 'hover:bg-slate-800 hover:text-white text-slate-400'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && <span>{item.name}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Settings, Main Site Link & Logout */}
      <div className="p-3 border-t border-slate-800 space-y-0.5">
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-amber-400 hover:bg-slate-800 hover:text-amber-300 rounded-lg transition-colors"
          title={collapsed ? 'Main Site' : undefined}
        >
          <Home size={18} />
          {!collapsed && <span>🌐 Main Site</span>}
        </a>
        <NavLink
          to="/lms/profile"
          className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings size={18} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

    </aside>
  );
}
