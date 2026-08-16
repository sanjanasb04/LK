import React, { useEffect, useState } from 'react';
import useXP from '../../hooks/useXP';
import LeaderboardRow from '../../components/ui/LeaderboardRow';
import { Trophy, Award, Flame, Zap, ArrowRight, AwardIcon } from 'lucide-react';

export default function LeaderboardPage() {
  const { leaderboard, fetchLeaderboard, loading } = useXP();
  const [activeTab, setActiveTab] = useState('This Month');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const tabs = ['This Week', 'This Month', 'All Time'];

  // visual podium items mock (safely extracting top 3 or fallbacks)
  const rank1 = leaderboard[0] || { name: 'Priya Sharma', xp: 5820, level: 'Platinum', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' };
  const rank2 = leaderboard[1] || { name: 'Rahul Krishnamurthy', xp: 4890, level: 'Gold', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' };
  const rank3 = leaderboard[2] || { name: 'Animesh Roy', xp: 4210, level: 'Gold', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150' };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="text-left">
        <h1 className="text-2xl font-black text-slate-800">Platform Leaderboard</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Challenge your peers, complete curriculum goals, and level up!</p>
      </div>

      {/* FILTER TABS */}
      <div className="flex bg-white border border-slate-100 p-2 rounded-xl shadow-sm select-none justify-start w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-1.5 px-4 text-xs font-bold rounded-lg transition-all ${
              activeTab === tab
                ? 'bg-primary text-white shadow-sm font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: PODIUM AND RANKINGS TABLE (Flex-2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TOP 3 VISUAL PODIUM */}
          <div className="bg-gradient-to-br from-primary to-primary-dark p-6 rounded-panel shadow-md text-white flex items-end justify-around h-64 relative select-none">
            
            {/* Background elements */}
            <div className="absolute top-4 left-4 text-primary-light font-black text-xs tracking-widest uppercase">
              Top Learners {activeTab}
            </div>

            {/* Rank 2 (left, silver) */}
            <div className="flex flex-col items-center z-10">
              <div className="relative">
                <img 
                  src={rank2.avatar} 
                  alt="Silver" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-300 shadow-sm"
                />
                <span className="absolute -top-2 -right-1 text-sm">🥈</span>
              </div>
              <span className="text-[10px] font-bold mt-2 truncate w-20 text-center">{rank2.name.split(' ')[0]}</span>
              <span className="text-[9px] text-slate-300 font-semibold">{rank2.xp} XP</span>
              <div className="w-16 bg-slate-400/30 h-16 rounded-t-lg mt-3 flex items-center justify-center font-black text-lg">
                #2
              </div>
            </div>

            {/* Rank 1 (center, gold, crown) */}
            <div className="flex flex-col items-center z-10 -translate-y-4">
              <div className="relative">
                {/* Crown Icon */}
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xl animate-bounce">👑</span>
                <img 
                  src={rank1.avatar} 
                  alt="Gold" 
                  className="w-16 h-16 rounded-full object-cover border-4 border-amber-400 shadow-md"
                />
                <span className="absolute -top-2 -right-1 text-base">🥇</span>
              </div>
              <span className="text-xs font-black mt-2 truncate w-24 text-center">{rank1.name.split(' ')[0]}</span>
              <span className="text-[10px] text-amber-300 font-extrabold">{rank1.xp} XP</span>
              <div className="w-20 bg-amber-400/30 h-24 rounded-t-lg mt-3 flex items-center justify-center font-black text-2xl border-t border-amber-400">
                #1
              </div>
            </div>

            {/* Rank 3 (right, bronze) */}
            <div className="flex flex-col items-center z-10">
              <div className="relative">
                <img 
                  src={rank3.avatar} 
                  alt="Bronze" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-orange-400 shadow-sm"
                />
                <span className="absolute -top-2 -right-1 text-sm">🥉</span>
              </div>
              <span className="text-[10px] font-bold mt-2 truncate w-20 text-center">{rank3.name.split(' ')[0]}</span>
              <span className="text-[9px] text-slate-300 font-semibold">{rank3.xp} XP</span>
              <div className="w-16 bg-orange-400/30 h-12 rounded-t-lg mt-3 flex items-center justify-center font-black text-lg">
                #3
              </div>
            </div>

          </div>

          {/* TABLE RANKINGS */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-800 text-xs text-left mb-3">Overall Rankings</h3>
            
            {loading ? (
              <div className="p-10 bg-white border border-slate-100 rounded-panel text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {leaderboard.map((u, idx) => (
                  <LeaderboardRow 
                    key={u._id} 
                    rank={idx + 1} 
                    userData={u} 
                    isCurrentUser={u._id === 'mock_rahul_krishnamurthy'} // highlighted check
                  />
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: HOW TO EARN XP (Flex-1) */}
        <div className="space-y-6 text-left select-none shrink-0">
          
          {/* Rules and multipliers */}
          <div className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm">
            <h3 className="font-extrabold text-slate-800 text-xs mb-4 border-b border-slate-50 pb-2.5">
              XP Scoring Rules
            </h3>
            
            <div className="space-y-3.5">
              {[
                { title: 'Complete a lesson', xp: '+30 XP', desc: 'Awarded immediately upon final video tick or reading completed.' },
                { title: 'Pass a quiz', xp: '+50 XP', desc: 'Score 60% or higher to qualify.' },
                { title: 'Excel in quiz (80%+)', xp: '+75 XP', desc: 'Show high comprehension multipliers.' },
                { title: 'Perfect Score (100%)', xp: '+100 XP', desc: 'Answer all quiz questions correctly.' },
                { title: 'Post in community', xp: '+25 XP', desc: 'Create doubts, tips or success stories in forums.' },
                { title: 'Help peers with replies', xp: '+15 XP', desc: 'Resolve outstanding questions.' },
                { title: 'Maintain streak bonus', xp: 'Up to +100 XP', desc: 'Consecutive logins multiply rewards.' }
              ].map((rule, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="p-1.5 bg-primary/10 text-primary rounded-lg shrink-0 mt-0.5">
                    <Zap size={14} className="fill-primary/10" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                      <span>{rule.title}</span>
                      <span className="text-success font-black">{rule.xp}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-normal">
                      {rule.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User's position sticky block */}
          <div className="bg-gradient-to-r from-primary-light to-primary text-white p-4 rounded-xl shadow-sm">
            <h4 className="font-black text-xs">My Ranking summary</h4>
            <p className="text-[10px] text-white/80 mt-1 leading-normal">
              You are currently ranked <strong className="text-amber-300">#23</strong> out of all learners this month. You need 120 XP to overtake #22.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
