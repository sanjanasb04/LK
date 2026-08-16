import React from 'react';

export default function Marquee({ speed = 'normal', direction = 'left', children }) {
  const marqueeClass = speed === 'fast' ? 'animate-marquee-fast' : 'animate-marquee';

  return (
    <div className="relative w-full overflow-hidden flex py-2">
      {/* Fade Overlays on Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Track */}
      <div 
        className={`${marqueeClass} flex items-center gap-6 sm:gap-10`}
        style={{ animationDirection: direction === 'right' ? 'reverse' : 'normal' }}
      >
        {/* Double children to guarantee seamless circular loop */}
        {children}
        {children}
      </div>
    </div>
  );
}
