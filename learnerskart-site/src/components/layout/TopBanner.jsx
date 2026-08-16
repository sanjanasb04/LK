import React, { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

const TopBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('lk_banner_dismissed');
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('lk_banner_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-accent to-primary text-white py-2.5 px-4 relative flex items-center justify-between z-50 text-sm font-medium shadow-sm transition-all duration-300">
      <div className="flex items-center justify-center w-full gap-2 text-center select-none flex-wrap">
        <Gift className="w-4 h-4 animate-bounce hidden sm:inline" />
        <span>
          Special Offer! Enjoy <strong>10% OFF</strong>. Use code{' '}
          <span className="bg-white/20 px-2 py-0.5 rounded font-bold border border-white/30 tracking-wider text-xs uppercase">
            LEARN2026
          </span>
          .
        </span>
        <Link
          to="/courses"
          className="underline hover:text-orange-200 ml-1.5 font-semibold inline-flex items-center transition-colors animate-pulse"
        >
          Find out more &rarr;
        </Link>
        <span className="text-white/40 mx-2 hidden sm:inline">|</span>
        <button
          onClick={() => window.dispatchEvent(new Event('lk-open-wheel'))}
          className="underline text-amber-300 hover:text-amber-200 font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors"
        >
          🎡 Spin & Win Offers!
        </button>
      </div>
      <button
        onClick={handleDismiss}
        className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full absolute right-2 top-1/2 -translate-y-1/2 transition-all"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TopBanner;
