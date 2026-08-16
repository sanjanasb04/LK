import React from 'react';
import { X } from 'lucide-react';
import Sidebar from './Sidebar';

export default function MobileSidebar({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300"
      />
      
      {/* Drawer */}
      <div className="relative flex-1 flex flex-col max-w-[260px] bg-darksidebar w-full h-full shadow-2xl animate-in slide-in-from-left duration-200">
        <div className="absolute top-4 right-4 z-50">
          <button 
            onClick={onClose}
            className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nested sidebar content */}
        <Sidebar collapsed={false} setCollapsed={() => {}} />
      </div>
    </div>
  );
}
