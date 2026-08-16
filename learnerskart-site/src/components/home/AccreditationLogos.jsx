import React from 'react';

const AccreditationLogos = () => {
  return (
    <section className="py-10 bg-slate-50 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Accreditation Card */}
        <div className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left: Heading block */}
          <div className="text-center lg:text-left lg:max-w-xs shrink-0 select-none">
            <h2 className="text-xl sm:text-2xl font-black text-textdark leading-tight">
              Advance your Career<br />
              with <span className="text-[#007BFF]">Professional</span><br />
              <span className="text-[#007BFF]">Certification</span>
            </h2>
          </div>

          {/* Right: Partner Logos scrolling marquee */}
          <div className="flex-1 overflow-hidden relative w-full flex items-center">
            {/* Fade effect on left & right edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            
            <div className="flex gap-16 items-center animate-marquee whitespace-nowrap py-1">
              
              {/* Partner Logos */}
              <div className="flex gap-16 items-center shrink-0">
                {/* Logo 1: PeopleCert */}
                <div className="flex flex-col items-center justify-center grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-350 transform hover:scale-105">
                  <span className="text-[#cc0000] font-black text-base tracking-tighter">PeopleCert<sup>®</sup></span>
                  <span className="text-[6.5px] text-slate-400 font-bold uppercase tracking-wider -mt-1.5">All talents, certified.</span>
                </div>

                {/* Logo 2: Scrum Alliance */}
                <div className="flex flex-col items-center justify-center grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-350 transform hover:scale-105">
                  <span className="text-[#f15a24] font-black text-base tracking-tight flex items-center gap-1">
                    <span className="text-xs">🌀</span> Scrum Alliance<sup>®</sup>
                  </span>
                </div>

                {/* Logo 3: Scrum.org */}
                <div className="flex items-center gap-1.5 justify-center grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-350 transform hover:scale-105">
                  <span className="text-lg">🌀</span>
                  <span className="text-slate-800 font-black text-base tracking-tighter font-sans">Scrum.org</span>
                </div>

                {/* Logo 4: ICAgile */}
                <div className="flex items-center gap-1 justify-center grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-350 transform hover:scale-105">
                  <span className="text-[#00aeef] font-black text-base italic">ICAgile</span>
                  <span className="text-[8px] bg-[#00aeef]/10 text-[#00aeef] font-black px-1 rounded-sm uppercase tracking-wider scale-75">Member</span>
                </div>

                {/* Logo 5: PeopleCert (again) */}
                <div className="flex flex-col items-center justify-center grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-350 transform hover:scale-105">
                  <span className="text-[#cc0000] font-black text-base tracking-tighter">PeopleCert<sup>®</sup></span>
                  <span className="text-[6.5px] text-slate-400 font-bold uppercase tracking-wider -mt-1.5">All talents, certified.</span>
                </div>

                {/* Logo 6: PMI */}
                <div className="flex items-center gap-1.5 justify-center grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-350 transform hover:scale-105">
                  <div className="w-5.5 h-5.5 bg-[#ff6b00] rounded-sm flex items-center justify-center text-white text-[9px] font-black">PM</div>
                  <div className="text-left leading-none">
                    <p className="text-[9px] font-black text-slate-800 tracking-tighter leading-none">Project</p>
                    <p className="text-[9px] font-bold text-slate-500 tracking-tighter leading-none mt-0.5">Management</p>
                    <p className="text-[7px] text-slate-400 font-bold tracking-tighter leading-none mt-0.5">Institute</p>
                  </div>
                </div>

                {/* Logo 7: Scrum Alliance (again) */}
                <div className="flex flex-col items-center justify-center grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-350 transform hover:scale-105">
                  <span className="text-[#f15a24] font-black text-base tracking-tight flex items-center gap-1">
                    <span className="text-xs">🌀</span> Scrum Alliance<sup>®</sup>
                  </span>
                </div>
              </div>

              {/* Duplicate List for seamless infinite scrolling loop */}
              <div className="flex gap-16 items-center shrink-0" aria-hidden="true">
                {/* Logo 1: PeopleCert */}
                <div className="flex flex-col items-center justify-center grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-350 transform hover:scale-105">
                  <span className="text-[#cc0000] font-black text-base tracking-tighter">PeopleCert<sup>®</sup></span>
                  <span className="text-[6.5px] text-slate-400 font-bold uppercase tracking-wider -mt-1.5">All talents, certified.</span>
                </div>

                {/* Logo 2: Scrum Alliance */}
                <div className="flex flex-col items-center justify-center grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-350 transform hover:scale-105">
                  <span className="text-[#f15a24] font-black text-base tracking-tight flex items-center gap-1">
                    <span className="text-xs">🌀</span> Scrum Alliance<sup>®</sup>
                  </span>
                </div>

                {/* Logo 3: Scrum.org */}
                <div className="flex items-center gap-1.5 justify-center grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-350 transform hover:scale-105">
                  <span className="text-lg">🌀</span>
                  <span className="text-slate-800 font-black text-base tracking-tighter font-sans">Scrum.org</span>
                </div>

                {/* Logo 4: ICAgile */}
                <div className="flex items-center gap-1 justify-center grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-350 transform hover:scale-105">
                  <span className="text-[#00aeef] font-black text-base italic">ICAgile</span>
                  <span className="text-[8px] bg-[#00aeef]/10 text-[#00aeef] font-black px-1 rounded-sm uppercase tracking-wider scale-75">Member</span>
                </div>

                {/* Logo 5: PeopleCert (again) */}
                <div className="flex flex-col items-center justify-center grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-350 transform hover:scale-105">
                  <span className="text-[#cc0000] font-black text-base tracking-tighter">PeopleCert<sup>®</sup></span>
                  <span className="text-[6.5px] text-slate-400 font-bold uppercase tracking-wider -mt-1.5">All talents, certified.</span>
                </div>

                {/* Logo 6: PMI */}
                <div className="flex items-center gap-1.5 justify-center grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-350 transform hover:scale-105">
                  <div className="w-5.5 h-5.5 bg-[#ff6b00] rounded-sm flex items-center justify-center text-white text-[9px] font-black">PM</div>
                  <div className="text-left leading-none">
                    <p className="text-[9px] font-black text-slate-800 tracking-tighter leading-none">Project</p>
                    <p className="text-[9px] font-bold text-slate-500 tracking-tighter leading-none mt-0.5">Management</p>
                    <p className="text-[7px] text-slate-400 font-bold tracking-tighter leading-none mt-0.5">Institute</p>
                  </div>
                </div>

                {/* Logo 7: Scrum Alliance (again) */}
                <div className="flex flex-col items-center justify-center grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-350 transform hover:scale-105">
                  <span className="text-[#f15a24] font-black text-base tracking-tight flex items-center gap-1">
                    <span className="text-xs">🌀</span> Scrum Alliance<sup>®</sup>
                  </span>
                </div>
              </div>

            </div>
          </div>
          
        </div>
        
      </div>
    </section>
  );
};

export default AccreditationLogos;
