import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Trophy, Clock, Target, Flame, Activity, Award } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';

export default function ProgressPage() {
  
  // MOCK ANALYTICAL DATA FOR RECHARTS
  const weeklyData = [
    { day: 'Mon', completed: 2 },
    { day: 'Tue', completed: 4 },
    { day: 'Wed', completed: 1 },
    { day: 'Thu', completed: 5 },
    { day: 'Fri', completed: 3 },
    { day: 'Sat', completed: 0 },
    { day: 'Sun', completed: 2 }
  ];

  const domainScores = [
    { subject: 'People', A: 85, fullMark: 100 },
    { subject: 'Process', A: 78, fullMark: 100 },
    { subject: 'Business Env', A: 90, fullMark: 100 },
    { subject: 'Agile/Scrum', A: 82, fullMark: 100 },
    { subject: 'Risk Governance', A: 72, fullMark: 100 }
  ];

  const xpOverTime = [
    { date: 'Day 1', xp: 200 },
    { date: 'Day 5', xp: 500 },
    { date: 'Day 10', xp: 950 },
    { date: 'Day 15', xp: 1200 },
    { date: 'Day 20', xp: 1550 },
    { date: 'Day 25', xp: 2040 },
    { date: 'Day 30', xp: 2340 }
  ];

  const quizPerformance = [
    { module: 'Module 1', score: 92 },
    { module: 'Module 2', score: 85 },
    { module: 'Module 3', score: 0 },
    { module: 'Module 4', score: 0 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="text-left">
        <h1 className="text-2xl font-black text-slate-800">My Progress Analytics</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1 font-sans">
          Deep-dive analysis of your study metrics, quiz performances, and XP activities
        </p>
      </div>

      {/* OVERALL STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Lessons Completed" 
          value="47 / 120" 
          icon={<Activity size={20} />} 
          color="text-primary bg-primary/10"
        />
        <StatCard 
          title="Hours Learned" 
          value="18.5 hrs" 
          icon={<Clock size={20} />} 
          color="text-highlight bg-highlight/10"
        />
        <StatCard 
          title="Avg Quiz Score" 
          value="88.5%" 
          icon={<Target size={20} />} 
          color="text-success bg-success/10"
        />
        <StatCard 
          title="Courses Done" 
          value="0" 
          icon={<Award size={20} />} 
          color="text-accent bg-accent/10"
        />
      </div>

      {/* RECHARTS CHART PANEL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
        
        {/* CHART 1: WEEKLY ACTIVITY (Bar) */}
        <div className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm text-left">
          <h3 className="font-extrabold text-slate-800 text-xs mb-4">Lessons Completed (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="completed" fill="#0a3d91" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: DOMAIN COVERAGE (Radar) */}
        <div className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm text-left">
          <h3 className="font-extrabold text-slate-800 text-xs mb-4">Domain Strength Radar Chart</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={domainScores}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} fontWeight={600} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={9} />
                <Radar name="My Score" dataKey="A" stroke="#f97316" fill="#f97316" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: XP OVER TIME (Line) */}
        <div className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm text-left">
          <h3 className="font-extrabold text-slate-800 text-xs mb-4">XP Milestones Line Graph (Last 30 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={xpOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} />
                <Tooltip />
                <Line type="monotone" dataKey="xp" stroke="#8b5cf6" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: QUIZ MODULE PERFORMANCE (Horizontal Bar) */}
        <div className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm text-left">
          <h3 className="font-extrabold text-slate-800 text-xs mb-4">Quiz Grades by Module (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={quizPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} fontWeight={600} />
                <YAxis type="category" dataKey="module" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                <Tooltip />
                <Bar dataKey="score" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* STREAK HEATMAP */}
      <div className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm text-left select-none">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="text-accent" size={16} />
          <h3 className="font-extrabold text-slate-800 text-xs">Daily Activity Heatmap (Last 90 Days)</h3>
        </div>

        {/* Grid Heatmap */}
        <div className="flex flex-wrap gap-1 max-w-full">
          {Array.from({ length: 90 }).map((_, idx) => {
            // Random opacity based on index
            let heatColor = 'bg-slate-100'; // No activity
            const val = idx % 7;
            if (val === 1 || val === 3) heatColor = 'bg-primary/20'; // Low activity
            else if (val === 4 || val === 5) heatColor = 'bg-primary/55'; // Med activity
            else if (val === 2) heatColor = 'bg-primary'; // High activity

            return (
              <div 
                key={idx}
                className={`w-3.5 h-3.5 rounded-sm ${heatColor} transition-transform hover:scale-110`}
                title={`Day ${idx + 1}`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-4 font-bold border-t border-slate-50 pt-3">
          <span>🔥 Current Active Streak: 7 days</span>
          <span className="flex items-center gap-1.5">
            Less
            <div className="w-2.5 h-2.5 bg-slate-100 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-primary/20 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-primary/55 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-primary rounded-sm" />
            More
          </span>
        </div>
      </div>

    </div>
  );
}
