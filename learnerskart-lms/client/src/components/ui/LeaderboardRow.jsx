import React from 'react';
import { Flame, Award } from 'lucide-react';

export default function LeaderboardRow({ rank, userData, isCurrentUser = false }) {
  const { name, avatar, level, xp, streak, badges } = userData;

  // Render rank medal or text
  const renderRankBadge = () => {
    if (rank === 1) return <span className="text-xl">🥇</span>;
    if (rank === 2) return <span className="text-xl">🥈</span>;
    if (rank === 3) return <span className="text-xl">🥉</span>;
    return <span className="text-xs font-bold text-slate-400">{rank}</span>;
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
      isCurrentUser 
        ? 'border-primary bg-primary/5 shadow-sm font-semibold' 
        : 'border-slate-100 bg-white hover:bg-slate-50/50'
    }`}>
      {/* Rank and User profile */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-6 flex items-center justify-center shrink-0">
          {renderRankBadge()}
        </div>

        <img 
          src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
          alt={name} 
          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
        />

        <div className="min-w-0 text-left">
          <p className="text-xs font-bold text-slate-800 leading-snug truncate flex items-center gap-1.5">
            {name}
            {isCurrentUser && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-primary text-white rounded">
                You
              </span>
            )}
          </p>
          <span className="text-[10px] font-semibold text-slate-400 uppercase">
            {level || 'Bronze'} Level
          </span>
        </div>
      </div>

      {/* Metrics columns */}
      <div className="flex items-center gap-6 select-none">
        {/* Login Streak */}
        {streak > 0 && (
          <div className="flex items-center gap-0.5 text-xs font-bold text-accent" title="Login Streak">
            <Flame size={14} className="fill-accent/15" />
            <span>{streak}d</span>
          </div>
        )}

        {/* Badges count */}
        {badges?.length > 0 && (
          <div className="flex items-center gap-0.5 text-xs font-bold text-gamify" title="Badges Earned">
            <Award size={14} className="fill-gamify/15" />
            <span>{badges.length}</span>
          </div>
        )}

        {/* XP */}
        <div className="text-right min-w-[70px]">
          <span className="text-xs font-black text-slate-800">{xp.toLocaleString()}</span>
          <span className="text-[9px] font-bold text-slate-400 block uppercase leading-none">XP Points</span>
        </div>
      </div>

    </div>
  );
}
