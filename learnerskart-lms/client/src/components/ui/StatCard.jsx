import React from 'react';

export default function StatCard({ title, value, icon, subtext = '', color = 'text-primary bg-primary/10' }) {
  return (
    <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          {title}
        </span>
        <span className="text-2xl font-extrabold text-slate-800 tracking-tight block">
          {value}
        </span>
        {subtext && (
          <span className="text-[10px] font-semibold text-slate-500 block mt-1">
            {subtext}
          </span>
        )}
      </div>

      {/* Styled Icon Wrapper */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${color}`}>
        {icon}
      </div>
    </div>
  );
}
