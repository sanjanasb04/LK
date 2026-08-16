import React, { useRef } from 'react';
import useIntersection from '../../hooks/useIntersection';
import useCountUp from '../../hooks/useCountUp';

export default function CounterBox({ icon: Icon, target, suffix = "", label, desc }) {
  const boxRef = useRef(null);
  
  // Connect Intersection Observer internally
  const inView = useIntersection(boxRef, { threshold: 0.2, triggerOnce: true });
  
  // Count up value based on view entry
  const count = useCountUp(target, 1500, inView);

  return (
    <div 
      ref={boxRef}
      className="flex flex-col items-center text-center p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300 group"
    >
      {/* Icon */}
      <div className="bg-white/10 text-[#f6b40a] p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
        <Icon className="w-6 h-6 md:w-7 md:h-7" />
      </div>
      
      {/* Dynamic Count Value */}
      <div className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight flex items-baseline justify-center font-sans text-white">
        <span>{count}</span>
        <span className="text-[#f6b40a] font-extrabold">{suffix}</span>
      </div>
      
      {/* Labels */}
      <h3 className="text-sm sm:text-base font-extrabold mt-3 tracking-wide text-white">
        {label}
      </h3>
      
      <p className="text-[11px] text-blue-200 mt-1.5 font-medium max-w-[165px] opacity-80 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
