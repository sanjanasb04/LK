import React from 'react';
import useXP from '../../hooks/useXP';
import ProgressBar from './ProgressBar';

export default function XPBar({ xp = 0 }) {
  const { getLevelDetails } = useXP();
  const details = getLevelDetails(xp);

  // Set color styling based on current level
  let levelColor = 'bg-slate-400';
  let badgeIcon = '🥉';
  if (details.name === 'Silver') {
    levelColor = 'bg-slate-300';
    badgeIcon = '🥈';
  } else if (details.name === 'Gold') {
    levelColor = 'bg-amber-400';
    badgeIcon = '🥇';
  } else if (details.name === 'Platinum') {
    levelColor = 'bg-indigo-400';
    badgeIcon = '💎';
  } else if (details.name === 'Diamond') {
    levelColor = 'bg-sky-400';
    badgeIcon = '💠';
  }

  return (
    <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xl">{badgeIcon}</span>
          <span className="font-bold text-slate-800 text-sm">
            {details.name} Level
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          {xp} XP Total
        </span>
      </div>
      
      <ProgressBar 
        percentage={details.percentage} 
        color="bg-gradient-to-r from-gamify to-primary" 
        height="h-3"
      />
      
      <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400 font-medium">
        <span>Current: {details.name}</span>
        <span>
          {details.nextName === 'Max Level' 
            ? 'Level Maxed Out!' 
            : `${details.nextThreshold - xp} XP to ${details.nextName}`
          }
        </span>
      </div>
    </div>
  );
}
