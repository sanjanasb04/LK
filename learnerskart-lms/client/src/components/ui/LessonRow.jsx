import React from 'react';
import { Play, FileText, HelpCircle, Tv, BookOpen, Check, Lock } from 'lucide-react';

export default function LessonRow({ lesson, isCurrent = false, isCompleted = false, isLocked = false, onClick }) {
  // Select icon based on type
  const getIcon = () => {
    switch (lesson.type) {
      case 'video':
        return <Play size={16} className={isCurrent ? 'text-white' : 'text-primary'} />;
      case 'pdf':
        return <FileText size={16} className={isCurrent ? 'text-white' : 'text-highlight'} />;
      case 'quiz':
        return <HelpCircle size={16} className={isCurrent ? 'text-white' : 'text-gamify'} />;
      case 'live':
        return <Tv size={16} className={isCurrent ? 'text-white' : 'text-accent'} />;
      default:
        return <BookOpen size={16} className={isCurrent ? 'text-white' : 'text-slate-500'} />;
    }
  };

  return (
    <div 
      onClick={!isLocked ? onClick : undefined}
      className={`flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 cursor-pointer ${
        isLocked 
          ? 'bg-slate-50/50 opacity-50 cursor-not-allowed border border-dashed border-slate-200' 
          : isCurrent 
          ? 'bg-primary text-white shadow-sm font-semibold' 
          : 'bg-white hover:bg-slate-50 border border-slate-100 text-slate-700'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Lesson Type Icon */}
        <div className={`p-2 rounded-lg flex items-center justify-center ${
          isCurrent ? 'bg-primary-dark/30' : 'bg-slate-100'
        }`}>
          {getIcon()}
        </div>
        
        {/* Title and duration */}
        <div className="text-left min-w-0">
          <p className="text-xs font-semibold truncate leading-snug">{lesson.title}</p>
          <span className={`text-[10px] block mt-0.5 ${isCurrent ? 'text-primary-light' : 'text-slate-400'}`}>
            {lesson.duration ? `${lesson.duration} min` : 'Reading'}
          </span>
        </div>
      </div>

      {/* Completion or Locked Status Icon */}
      <div className="flex items-center justify-center pl-2">
        {isLocked ? (
          <Lock size={14} className="text-slate-400" />
        ) : isCompleted ? (
          <div className="w-5 h-5 bg-success text-white rounded-full flex items-center justify-center shadow-sm">
            <Check size={12} strokeWidth={3} />
          </div>
        ) : (
          <div className={`w-4.5 h-4.5 rounded-full border ${
            isCurrent ? 'border-primary-light' : 'border-slate-300'
          }`} />
        )}
      </div>
    </div>
  );
}
