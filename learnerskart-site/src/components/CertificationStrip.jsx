import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, Award, BookOpen } from 'lucide-react';

const pmpImage = "https://learnerskart.com/wp-content/uploads/2023/11/WhatsApp-Image-2025-05-04-at-6.33.51-PM-666x450.jpeg";

const certData = {
  "Project Management": [
    { title: "Project Management Professional (PMP®)", duration: "35 Hrs", price: "Start from ₹14,999" },
    { title: "Certified Associate in Project Management (CAPM®)", duration: "23 Hrs", price: "Start from ₹7,999" },
    { title: "PRINCE2® Foundation Certification", duration: "16 Hrs", price: "Start from ₹12,999" },
    { title: "PRINCE2® Practitioner Certification", duration: "16 Hrs", price: "Start from ₹15,999" },
    { title: "Program Management Professional (PgMP®)", duration: "30 Hrs", price: "Start from ₹24,999" },
    { title: "Risk Management Professional (PMI-RMP®)", duration: "21 Hrs", price: "Start from ₹13,999" }
  ],
  "Quality Management": [
    { title: "Lean Six Sigma Green Belt (LSSGB)", duration: "24 Hrs", price: "Start from ₹14,999" },
    { title: "Lean Six Sigma Black Belt (LSSBB)", duration: "32 Hrs", price: "Start from ₹21,999" },
    { title: "LSSGB + LSSBB Combo Program", duration: "56 Hrs", price: "Start from ₹32,999" },
    { title: "Lean Six Sigma Yellow Belt (LSSYB)", duration: "8 Hrs", price: "Start from ₹4,999" }
  ],
  "Business Analysis": [
    { title: "Certified Business Analysis Professional (CBAP®)", duration: "35 Hrs", price: "Start from ₹18,999" },
    { title: "Capability in Business Analysis (CCBA®)", duration: "21 Hrs", price: "Start from ₹14,999" },
    { title: "Entry Certificate in Business Analysis (ECBA™)", duration: "21 Hrs", price: "Start from ₹8,499" }
  ],
  "Agile": [
    { title: "PMI-ACP® Agile Certified Practitioner", duration: "21 Hrs", price: "Start from ₹9,999" },
    { title: "SAFe® 6.0 Leading SAFe Certification", duration: "16 Hrs", price: "Start from ₹19,999" },
    { title: "Certified ScrumMaster (CSM®) Training", duration: "16 Hrs", price: "Start from ₹14,999" },
    { title: "Certified Scrum Product Owner (CSPO®)", duration: "16 Hrs", price: "Start from ₹14,999" }
  ]
};

export default function CertificationStrip() {
  const [activeTab, setActiveTab] = useState("Project Management");
  const scrollContainerRef = useRef(null);

  const tabs = Object.keys(certData);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-white py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-[#f97316] bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-100 shadow-sm">
            Certification Tracks
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0a3d91] tracking-tight mt-3 font-sans leading-tight">
            Top Certification Programs
          </h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            Explore industry-leading certification blueprints designed to accelerate your professional validation
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-gray-50 border border-gray-100 rounded-2xl max-w-fit">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 focus:outline-none ${
                  activeTab === tab
                    ? 'bg-[#0a3d91] text-white shadow-md shadow-blue-900/15'
                    : 'text-gray-500 hover:text-[#0a3d91] hover:bg-gray-100/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Container Wrapper with Chevron Controls */}
        <div className="relative group">
          
          {/* Scroll Left Button */}
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-50 border border-gray-200 text-[#0a3d91] p-3 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Scroll Right Button */}
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-50 border border-gray-200 text-[#0a3d91] p-3 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Horizontal Scrollable Strip */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: 'thin' }}
          >
            {certData[activeTab].map((cert, idx) => (
              <div 
                key={idx}
                className="w-[280px] sm:w-[320px] bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col justify-between flex-shrink-0 snap-start snap-always group"
              >
                {/* Course Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 flex-shrink-0">
                  <img 
                    src={pmpImage} 
                    alt={cert.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#f97316] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                    {activeTab}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm sm:text-base font-extrabold text-[#0a3d91] leading-snug group-hover:text-[#f97316] transition-colors line-clamp-2 min-h-[2.5rem]">
                      {cert.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#f97316]" />
                        {cert.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-[#0a3d91]" />
                        Professional
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-4 mt-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Course Tuition
                      </span>
                      <span className="text-base font-black text-[#0a3d91]">
                        {cert.price}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <a 
                        href="#contact"
                        className="text-center bg-[#0a3d91] hover:bg-[#083072] text-white text-xxs sm:text-xs font-bold py-3.5 rounded-xl shadow-sm transition-colors duration-200"
                      >
                        View Certification
                      </a>
                      <a 
                        href="#contact"
                        className="text-center bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xxs sm:text-xs font-bold py-3.5 rounded-xl transition-colors duration-200"
                      >
                        View Curriculum
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
