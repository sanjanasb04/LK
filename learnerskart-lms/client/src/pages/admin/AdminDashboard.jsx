import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/ui/StatCard';
import { 
  Users, BookOpen, CreditCard, Award, Bell, ShieldCheck, 
  ChevronRight, Calendar, AlertTriangle, ArrowRight 
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="text-left select-none">
        <h1 className="text-2xl font-black text-slate-800">Administrator Console</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Monitor platform registrations, course reviews, and generate metrics reports.</p>
      </div>

      {/* QUICK ALERTS BAND */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-left flex items-start gap-3 shadow-sm select-none">
        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
          <AlertTriangle size={18} />
        </div>
        <div>
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wide">Action Required</span>
          <p className="text-xs font-bold text-slate-800 mt-1">Platform Alert Queue Checkpoint:</p>
          <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-[11px] font-semibold text-slate-600">
            <span>• 3 Courses Pending Instructor Review audits</span>
            <span>• 5 doubt tickets unanswered &gt;48 hrs</span>
          </div>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Platform Users" 
          value={stats?.users?.totalUsers?.toString() || '120'} 
          icon={<Users size={20} />} 
          color="text-primary bg-primary/10"
          subtext="8 new this week"
        />
        <StatCard 
          title="Published Courses" 
          value={stats?.courses?.published?.toString() || '8'} 
          icon={<BookOpen size={20} />} 
          color="text-highlight bg-highlight/10"
          subtext="2 pending review"
        />
        <StatCard 
          title="Completions Issued" 
          value={stats?.enrollments?.completions?.toString() || '45'} 
          icon={<Award size={20} />} 
          color="text-success bg-success/10"
        />
        <StatCard 
          title="Total Earnings" 
          value={'₹' + (stats?.revenue?.toLocaleString() || '91,000')} 
          icon={<CreditCard size={20} />} 
          color="text-accent bg-accent/10"
        />
      </div>

      {/* ADMIN CONTROL LINKS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        
        {/* User control card */}
        <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="font-extrabold text-slate-800 text-xs mb-1">Manage Directories</h3>
          <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-normal">Assign user roles (mentor, instructor) and manage account suspensions.</p>
          <button 
            onClick={() => navigate('/lms/admin/users')}
            className="flex items-center gap-1.5 py-2 px-4 bg-primary hover:bg-primary-dark text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm"
          >
            Manage Users Directory
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Course control card */}
        <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="font-extrabold text-slate-800 text-xs mb-1">Manage Syllabus Curriculums</h3>
          <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-normal">Audit submitted training outlines, publish drafts, or archive materials.</p>
          <button 
            onClick={() => navigate('/lms/admin/courses')}
            className="flex items-center gap-1.5 py-2 px-4 bg-primary hover:bg-primary-dark text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm"
          >
            Audit Courses Drafts
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Reports card */}
        <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="font-extrabold text-slate-800 text-xs mb-1">Reports & Financial logs</h3>
          <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-normal">Compile and export CSV spreadsheet datasets detailing earnings and completions.</p>
          <button 
            onClick={() => navigate('/lms/admin/reports')}
            className="flex items-center gap-1.5 py-2 px-4 bg-primary hover:bg-primary-dark text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm"
          >
            Compile Reports
            <ArrowRight size={12} />
          </button>
        </div>

      </div>

    </div>
  );
}
