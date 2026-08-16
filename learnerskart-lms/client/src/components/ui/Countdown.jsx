import React from 'react';
import useTimer from '../../hooks/useTimer';
import { Calendar, PlayCircle } from 'lucide-react';

export default function Countdown({ targetDate }) {
  const { timeLeft, isExpired } = useTimer(targetDate);

  if (isExpired) {
    return (
      <span className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white font-extrabold text-xs rounded-full animate-pulse shadow-sm">
        <span className="w-1.5 h-1.5 bg-white rounded-full" />
        Live Now 🔴
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full border border-primary/20 select-none">
      <Calendar size={13} />
      Live in {timeLeft}
    </span>
  );
}
