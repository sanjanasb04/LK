import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Accordion = ({ title, children, defaultOpen = false, className = '', headerClassName = '' }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-200 ${className}`}>
      {/* Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4.5 text-left font-bold text-sm sm:text-base text-textdark hover:bg-slate-50 transition-colors select-none ${headerClassName}`}
        aria-expanded={isOpen}
      >
        <span className="pr-4">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'transform rotate-180 text-primary' : ''
          }`}
        />
      </button>

      {/* Content Area */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-[1000px] border-t border-slate-50' : 'max-h-0'
        }`}
      >
        <div className="p-5 text-sm leading-relaxed text-slate-600 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
