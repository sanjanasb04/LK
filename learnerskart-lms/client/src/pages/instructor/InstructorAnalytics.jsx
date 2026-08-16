import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell
} from 'recharts';
import { Download, TrendingUp, Award, Users, Star, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InstructorAnalytics() {
  
  // MOCK INSTRUCTOR PERFORMANCE METRICS
  const enrollmentData = [
    { month: 'Jan', students: 12 },
    { month: 'Feb', students: 18 },
    { month: 'Mar', students: 24 },
    { month: 'Apr', students: 35 },
    { month: 'May', students: 48 },
    { month: 'Jun', students: 65 }
  ];

  const ratingDistribution = [
    { stars: '5 Star', count: 48 },
    { stars: '4 Star', count: 12 },
    { stars: '3 Star', count: 3 },
    { stars: '2 Star', count: 1 },
    { stars: '1 Star', count: 0 }
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 18000 },
    { month: 'Mar', revenue: 24000 },
    { month: 'Apr', revenue: 32000 },
    { month: 'May', revenue: 46000 },
    { month: 'Jun', revenue: 61000 }
  ];

  const moduleCompletions = [
    { module: 'Module 1', rate: 94 },
    { module: 'Module 2', rate: 78 },
    { module: 'Module 3', rate: 45 },
    { module: 'Module 4', rate: 12 }
  ];

  const handleExportCSV = () => {
    toast.success('Performance report downloaded as CSV!');
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left select-none">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Instructor Analytics</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">Review platforms enrollment growth, rating details, and revenue trends.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 py-2 px-4 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition-colors shadow-sm shrink-0"
        >
          <Download size={14} />
          Export Report (CSV)
        </button>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
        
        {/* CHART 1: ENROLLMENTS GROWTH (Area) */}
        <div className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm text-left">
          <h3 className="font-extrabold text-slate-800 text-xs mb-4">Enrollment Growth Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentData}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0a3d91" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0a3d91" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} />
                <Tooltip />
                <Area type="monotone" dataKey="students" stroke="#0a3d91" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: REVENUE CURVE (Bar) */}
        <div className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm text-left">
          <h3 className="font-extrabold text-slate-800 text-xs mb-4">Monthly Course Earnings (INR)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: MODULE COMPLETION RATIO (Bar) */}
        <div className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm text-left">
          <h3 className="font-extrabold text-slate-800 text-xs mb-4">Completion Rates by Syllabus Module (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={moduleCompletions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} fontWeight={600} />
                <YAxis type="category" dataKey="module" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                <Tooltip />
                <Bar dataKey="rate" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: RATING SPREAD (Horizontal Bar count) */}
        <div className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm text-left">
          <h3 className="font-extrabold text-slate-800 text-xs mb-4">Reviews & Rating Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                <YAxis type="category" dataKey="stars" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                <Tooltip />
                <Bar dataKey="count" fill="#eab308" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
