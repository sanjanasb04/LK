import React from 'react';

export default function ProgressBar({ percentage = 0, height = 'h-2', color = 'bg-primary' }) {
  const cleanPercent = Math.min(100, Math.max(0, percentage));
  
  return (
    <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
      <div 
        className={`h-full rounded-full transition-all duration-500 ease-out ${color}`} 
        style={{ width: `${cleanPercent}%` }}
      />
    </div>
  );
}
