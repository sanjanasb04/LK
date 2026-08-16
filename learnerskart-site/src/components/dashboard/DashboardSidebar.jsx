import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, BookOpen, CreditCard, Bell, Settings, LogOut, LayoutDashboard, MessageSquare, HelpCircle, Globe, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard Home',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    ...(user?.role === 'user'
      ? [
          {
            path: '/dashboard/courses',
            name: 'My Courses',
            icon: <BookOpen className="w-5 h-5" />,
          },
          {
            path: '/dashboard/orders',
            name: 'My Orders',
            icon: <CreditCard className="w-5 h-5" />,
          },
        ]
      : []),
    {
      path: '/dashboard/profile',
      name: 'Profile & Settings',
      icon: <User className="w-5 h-5" />,
    },
    ...(user?.role === 'editor'
      ? [
          {
            path: '/dashboard/testimonials',
            name: 'Manage Reviews',
            icon: <MessageSquare className="w-5 h-5" />,
          },
        ]
      : []),
    ...(user?.role === 'admin'
      ? [
          {
            path: '/dashboard/testimonials',
            name: 'Manage Reviews',
            icon: <MessageSquare className="w-5 h-5" />,
          },
          {
            path: '/dashboard/pmp-questions',
            name: 'Manage Questions',
            icon: <HelpCircle className="w-5 h-5" />,
          },
          {
            path: '/dashboard/admin/upload-test',
            name: 'Upload Question Paper',
            icon: <HelpCircle className="w-5 h-5" />,
          },
          {
            path: '/dashboard/admin/currencies',
            name: 'Manage Currencies',
            icon: <Globe className="w-5 h-5" />,
          },
          {
            path: '/dashboard/admin/schedules',
            name: 'Manage Schedule Dates',
            icon: <Calendar className="w-5 h-5" />,
          },
          {
            path: '/dashboard/admin/courses',
            name: 'Manage Courses',
            icon: <BookOpen className="w-5 h-5" />,
          },
          {
            path: '/dashboard/admin/blogs',
            name: 'Manage Blogs',
            icon: <FileText className="w-5 h-5" />,
          },
        ]
      : []),
  ];

  return (
    <aside className="bg-white border border-slate-100 shadow-md rounded-xl p-5 w-full lg:w-64 flex-shrink-0 text-left select-none space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
        <img
          src={user?.avatar ? (user.avatar.startsWith('/uploads') ? `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:5000${user.avatar}` : user.avatar) : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
          alt={user?.name}
          className="w-12 h-12 rounded-xl object-cover border border-primary/10 shadow-sm"
        />
        <div className="min-w-0">
          <p className="font-bold text-sm text-textdark truncate leading-tight">{user?.name}</p>
          <span className="text-[10px] bg-primary/5 text-primary font-bold px-2 py-0.5 rounded-md uppercase tracking-wider mt-1.5 inline-block leading-none">
            {user?.role || 'Learner'}
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1 lg:gap-1.5 pb-2 lg:pb-0 scroll-smooth no-scrollbar font-bold text-xs sm:text-sm text-textmuted">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'hover:bg-slate-50 hover:text-textdark'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Dummy / Mock Items for look-and-feel */}
        <div className="hidden lg:block border-t border-slate-50 my-2 pt-2">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider px-4">Transactions</span>
        </div>


        {/* Logout Button */}
        <div className="lg:border-t lg:border-slate-50 lg:pt-2 lg:mt-2 w-full">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 w-full whitespace-nowrap transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
