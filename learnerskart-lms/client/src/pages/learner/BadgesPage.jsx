import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import useXP from '../../hooks/useXP';
import BadgeCard from '../../components/ui/BadgeCard';
import ProgressBar from '../../components/ui/ProgressBar';
import { Award, Lock, ShieldAlert, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BadgesPage() {
  const { user } = useAuth();
  const { getLevelDetails } = useXP();
  const [allBadges, setAllBadges] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        const res = await api.get('/badges');
        if (res.data.success) {
          setAllBadges(res.data.badges);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  const earnedSlugs = user?.badges || [];
  const levelDetails = getLevelDetails(user?.xp || 2340);

  // Group badges by earned vs locked
  const earnedBadges = allBadges.filter(b => earnedSlugs.includes(b.slug));
  const lockedBadges = allBadges.filter(b => !earnedSlugs.includes(b.slug));

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Achievement Badges</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1 font-sans">
            Unlock achievements by passing quizzes, maintaining daily streaks, and helping other students.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl text-primary font-bold text-xs">
          <Award size={16} />
          <span>{earnedBadges.length} / {allBadges.length || 12} Unlocked</span>
        </div>
      </div>

      {/* LEVEL SYSTEM PROGRESSION CHART */}
      <div className="bg-gradient-to-br from-primary to-primary-light p-6 rounded-panel text-white text-left relative overflow-hidden shadow-sm select-none">
        
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-amber-300 animate-spin" size={18} style={{ animationDuration: '6s' }} />
          <h2 className="font-extrabold text-sm uppercase tracking-wider">Level Threshold Progression</h2>
        </div>

        {/* Milestone Steps visual */}
        <div className="grid grid-cols-5 gap-2 relative z-10 pt-4 pb-6">
          <div className="absolute left-[10%] right-[10%] top-[46px] h-0.5 bg-white/20 -z-0" />
          
          {[
            { label: '🥉 Bronze', range: '0–499 XP', min: 0 },
            { label: '🥈 Silver', range: '500–1,499 XP', min: 500 },
            { label: '🥇 Gold', range: '1,500–2,999 XP', min: 1500 },
            { label: '💎 Platinum', range: '3,000–5,999 XP', min: 3000 },
            { label: '💠 Diamond', range: '6,000+ XP', min: 6000 }
          ].map((level, idx) => {
            const isCompleted = user?.xp >= level.min;
            const isCurrent = levelDetails.name === level.label.split(' ')[1];

            return (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border-2 flex flex-col items-center justify-center shadow-sm z-10 ${
                  isCompleted 
                    ? 'bg-white text-primary border-amber-400 font-extrabold text-[9px]' 
                    : 'bg-slate-800 border-slate-700 text-slate-500 font-bold text-[9px]'
                } ${isCurrent ? 'ring-4 ring-amber-400/35' : ''}`}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span className="text-[10px] font-black text-white mt-3 block">{level.label}</span>
                <span className="text-[8px] text-white/50 block font-semibold mt-0.5">{level.range}</span>
              </div>
            );
          })}
        </div>

        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between items-center text-xs font-bold gap-3">
          <span>Current XP: {user?.xp || 2340}</span>
          <span className="text-amber-300">Active status: {levelDetails.name.toUpperCase()} LEVEL</span>
        </div>

      </div>

      {/* UNLOCKED BADGES GRID */}
      <div className="space-y-4 text-left">
        <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
          <span>🎖️ Unlocked Achievements ({earnedBadges.length})</span>
        </h3>
        
        {loading ? (
          <div className="p-10 flex justify-center bg-white border border-slate-100 rounded-xl shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : earnedBadges.length === 0 ? (
          <div className="p-10 bg-white border border-slate-100 rounded-xl text-center text-slate-400">
            No badges unlocked yet. Keep studying to earn achievements!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => (
              <BadgeCard key={badge._id} badge={badge} isLocked={false} />
            ))}
          </div>
        )}
      </div>

      {/* LOCKED BADGES GRID */}
      {lockedBadges.length > 0 && (
        <div className="space-y-4 text-left pt-2">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 text-slate-400">
            <Lock size={15} />
            Locked Milestones ({lockedBadges.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {lockedBadges.map((badge) => (
              <BadgeCard key={badge._id} badge={badge} isLocked={true} progressText="In Progress" />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
