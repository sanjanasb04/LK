import React from 'react';
import { Star, MessageCircle, Calendar, ShieldCheck } from 'lucide-react';

export default function MentorCard({ mentor, onBookClick, onMessageClick }) {
  const { user, bio, specializations, hourlyRate, avgRating, sessionsCompleted } = mentor;
  const name = user?.name || 'Mentor Profile';
  const designation = user?.designation || 'PMP Trainer';
  const company = user?.company || 'LearnersKart';
  const avatar = user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150';

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-[360px]">
      
      <div>
        {/* Mentor Basic Info Header */}
        <div className="flex items-start gap-4">
          <img 
            src={avatar} 
            alt={name} 
            className="w-14 h-14 rounded-full object-cover border-2 border-primary/10 shadow-sm"
          />
          <div className="min-w-0 text-left">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1 leading-snug">
              {name}
              <ShieldCheck size={14} className="text-primary fill-primary/10 shrink-0" />
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5 leading-none">
              {designation} at {company}
            </p>
            
            {/* Rating summary */}
            <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-slate-600">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span>{avgRating || 4.9}</span>
              <span className="text-slate-400 font-medium">({sessionsCompleted || 10} sessions)</span>
            </div>
          </div>
        </div>

        {/* Bio description */}
        <p className="text-[11px] text-slate-500 leading-relaxed font-medium my-4 line-clamp-3 text-left">
          {bio}
        </p>

        {/* Specializations Tags list */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {specializations.map((spec, idx) => (
            <span 
              key={idx} 
              className="px-2 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-600 rounded-full"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Pricing and booking actions */}
      <div className="border-t border-slate-50 pt-4 flex items-center justify-between">
        <div className="text-left select-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase block leading-none mb-0.5">Rate</span>
          <span className="text-base font-extrabold text-slate-800">
            {hourlyRate > 0 ? `₹${hourlyRate}/hr` : 'Free'}
          </span>
        </div>

        <div className="flex gap-2">
          {onMessageClick && (
            <button 
              onClick={onMessageClick}
              className="p-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-colors"
              title="Send Message"
            >
              <MessageCircle size={15} />
            </button>
          )}
          <button
            onClick={onBookClick}
            className="flex items-center gap-1 px-3.5 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            <Calendar size={13} />
            Book
          </button>
        </div>
      </div>

    </div>
  );
}
