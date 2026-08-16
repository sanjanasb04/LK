import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) {
  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
      />

      {/* Modal Card */}
      <div className={`relative w-full ${maxWidth} bg-white rounded-3xl shadow-2xl border border-gray-150 overflow-hidden z-10 animate-scaleUp`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#098ce9] to-[#f6b40a] p-5 text-white flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/15 rounded-full transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {children}
        </div>

      </div>
    </div>
  );
}
