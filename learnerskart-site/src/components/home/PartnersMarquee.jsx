import React from 'react';

const PartnersMarquee = () => {
  const row1 = [
    { name: 'Google', color: 'text-blue-500' },
    { name: 'Microsoft', color: 'text-slate-700' },
    { name: 'IBM', color: 'text-blue-700' },
    { name: 'JPMorgan', color: 'text-amber-700' },
    { name: 'Bank of America', color: 'text-blue-800' },
    { name: 'Deloitte', color: 'text-emerald-700' }
  ];

  const row2 = [
    { name: 'Amazon', color: 'text-amber-500' },
    { name: 'Accenture', color: 'text-purple-700' },
    { name: 'Infosys', color: 'text-blue-600' },
    { name: 'Home Depot', color: 'text-orange-600' },
    { name: 'Kroger', color: 'text-blue-900' },
    { name: 'Coca-Cola', color: 'text-red-600' }
  ];

  const renderLogoBadge = (logo, index) => (
    <div
      key={index}
      className="flex items-center justify-center px-8 py-4 bg-white border border-slate-100 rounded-xl shadow-sm min-w-[160px] select-none"
    >
      <span className={`font-black text-lg tracking-tight ${logo.color}`}>{logo.name}</span>
    </div>
  );

  return (
    <section className="py-16 bg-white border-b border-slate-100 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <h2 className="text-xl sm:text-2xl font-extrabold text-textdark">
          Our Alumni Work at Leading Global Brands
        </h2>
        <p className="text-xs text-textmuted mt-1.5 font-semibold">
          LearnersKart certifications empower professionals in the world's most innovative organizations
        </p>
      </div>

      {/* Dual Direction Marquees */}
      <div className="space-y-5">
        
        {/* Row 1: Scrolls Left */}
        <div className="relative flex items-center overflow-x-hidden w-full py-1">
          <div className="flex gap-6 items-center justify-around min-w-full shrink-0 animate-marquee whitespace-nowrap">
            {row1.map((logo, idx) => renderLogoBadge(logo, `r1-a-${idx}`))}
          </div>
          {/* Duplicate */}
          <div className="flex gap-6 items-center justify-around min-w-full shrink-0 animate-marquee whitespace-nowrap" aria-hidden="true">
            {row1.map((logo, idx) => renderLogoBadge(logo, `r1-b-${idx}`))}
          </div>
        </div>

        {/* Row 2: Scrolls Right */}
        <div className="relative flex items-center overflow-x-hidden w-full py-1">
          <div className="flex gap-6 items-center justify-around min-w-full shrink-0 animate-marquee-reverse whitespace-nowrap">
            {row2.map((logo, idx) => renderLogoBadge(logo, `r2-a-${idx}`))}
          </div>
          {/* Duplicate */}
          <div className="flex gap-6 items-center justify-around min-w-full shrink-0 animate-marquee-reverse whitespace-nowrap" aria-hidden="true">
            {row2.map((logo, idx) => renderLogoBadge(logo, `r2-b-${idx}`))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default PartnersMarquee;
