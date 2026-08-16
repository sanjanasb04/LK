import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative w-full bg-gradient-to-r from-[#f97316] via-[#ea580c] to-[#0a3d91] text-white py-2.5 px-4 text-center transition-all duration-300 ease-in-out z-50">
      <div className="container mx-auto flex items-center justify-center gap-2 text-xs md:text-sm font-medium pr-8">
        <Sparkles className="w-4 h-4 text-amber-200 animate-pulse hidden sm:inline" />
        <span>
          New Year Offer 2026! Enjoy <strong className="text-amber-200 font-bold underline">10% OFF</strong> on all our training courses. Use code{" "}
          <span className="bg-white/20 px-2 py-0.5 rounded border border-white/30 font-mono font-bold tracking-wider">
            LEARN2026
          </span>
          .{" "}
        </span>
        <a
          href="#courses"
          className="underline hover:text-amber-200 transition-colors duration-200 font-semibold inline-flex items-center gap-1 group"
        >
          Find out more!
          <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-200">
            &rarr;
          </span>
        </a>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
