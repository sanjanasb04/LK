import React from 'react';
import { Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BadgeCard({ badge, isLocked = false, progressText = '' }) {
  const handleShare = () => {
    const text = `I unlocked the "${badge.name}" badge on LearnersKart LMS! 🏆 Join me on my learning journey! #LearnersKart #LMS #Gamification`;
    navigator.clipboard.writeText(text);
    toast.success('LinkedIn share text copied to clipboard!');
  };

  return (
    <div className={`relative p-5 bg-white border border-slate-100 rounded-xl shadow-sm transition-all duration-300 ${
      isLocked ? 'opacity-60 grayscale' : 'hover:shadow-md hover:-translate-y-1'
    }`}>
      {/* XP Reward Badge */}
      {!isLocked && (
        <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold bg-gamify-light text-gamify rounded-full">
          +{badge.xpReward || 50} XP
        </span>
      )}

      {/* Badge Visual Icon */}
      <div className="flex flex-col items-center text-center">
        <div className={`text-4xl p-3 rounded-full mb-3 ${
          isLocked ? 'bg-slate-100 text-slate-400' : 'bg-orange-50 text-orange-500'
        }`}>
          {badge.icon || '🎖️'}
        </div>
        <h3 className="font-bold text-slate-800 text-sm mb-1">{badge.name}</h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">{badge.description}</p>
        
        {isLocked ? (
          <div className="w-full">
            <span className="text-[10px] font-semibold text-slate-400 block mb-1">
              Requirement: {badge.description}
            </span>
            {progressText && (
              <span className="text-[11px] font-bold text-primary block">
                {progressText}
              </span>
            )}
          </div>
        ) : (
          <button 
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Share2 size={12} />
            Share
          </button>
        )}
      </div>
    </div>
  );
}
