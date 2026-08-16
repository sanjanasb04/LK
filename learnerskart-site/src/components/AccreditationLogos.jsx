import React from 'react';

const accreditationLogos = [
  { name: 'PeopleCert', img: 'https://learnerskart.com/wp-content/uploads/2025/04/accreditation_module_PeoplesCert_Logo_1637915287-300x104.png' },
  { name: 'Scrum Alliance', img: 'https://learnerskart.com/wp-content/uploads/2025/04/accreditation_module_ScrumAlliance_1730264966-300x300.png' },
  { name: 'PMI', img: 'https://learnerskart.com/wp-content/uploads/2025/04/accreditation_module_PMI-Nov_1669118571-300x158.png' },
  { name: 'ICAgile', img: 'https://learnerskart.com/wp-content/uploads/2025/04/accreditation_module_IC_agile_1726658228.png' },
  { name: 'Scrum Alliance 2', img: 'https://learnerskart.com/wp-content/uploads/2025/04/accreditation_module_ScrumAlliance_1730264966-300x300.png' }
];

export default function AccreditationLogos() {
  // Triple the array elements to ensure seamless loop in marquee
  const extendedLogos = [...accreditationLogos, ...accreditationLogos, ...accreditationLogos];

  return (
    <section className="w-full bg-white border-y border-gray-100 py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <span className="text-xs font-black uppercase tracking-wider text-[#f97316]">
          Accreditations & Trust
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0a3d91] tracking-tight mt-2 font-sans">
          Advance your Career with Professional Certification
        </h2>
      </div>

      {/* Scrolling Marquee */}
      <div className="relative w-full overflow-hidden flex py-4">
        {/* Gradients to fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-8 sm:gap-12">
          {extendedLogos.map((logo, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-center bg-white border border-gray-100 rounded-xl px-6 py-4 w-44 sm:w-56 h-20 sm:h-24 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 flex-shrink-0"
            >
              <img 
                src={logo.img} 
                alt={logo.name} 
                className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
