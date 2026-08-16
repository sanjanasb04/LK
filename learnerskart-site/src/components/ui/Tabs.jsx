import React from 'react';

export default function Tabs({ tabs = [], activeTab, onChange, variant = "pills", className = "" }) {
  const isPills = variant === "pills";

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <div className={`flex flex-wrap p-1.5 rounded-2xl ${isPills ? 'bg-slate-100/80 border border-slate-200' : 'border-b border-gray-200 w-full gap-4'}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 focus:outline-none ${
                isPills
                  ? isActive
                    ? 'bg-[#098ce9] text-white shadow-md shadow-blue-900/15 scale-105'
                    : 'text-slate-500 hover:text-[#098ce9] hover:bg-slate-50'
                  : isActive
                    ? 'border-b-2 border-[#f6b40a] text-[#098ce9] rounded-none px-2 py-3'
                    : 'text-slate-500 hover:text-[#098ce9] rounded-none px-2 py-3'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
