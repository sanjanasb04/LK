import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Play, 
  CheckCircle, 
  Sparkles, 
  Star, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  Award,
  Zap,
  Eye,
  X
} from 'lucide-react';

const freeResources = [
  {
    id: 'pmp-simulator',
    title: 'PMP® Exam Practice Simulator (180 Questions)',
    category: 'Mock Exam',
    badge: '🔥 Most Popular',
    badgeBg: 'bg-orange-50 text-orange-600 border-orange-200',
    description: 'Full-length PMP exam review set aligned with current PMBOK 7th Edition & Agile Practice Guide.',
    deliverables: ['180 Real Exam Style Questions', 'Instant Answer & PMBOK Reference', 'Domain Performance Analytics'],
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    actionText: 'Launch Free Test in LMS',
    actionUrl: 'http://localhost:5174/lms/practice-test',
    type: 'lms-test'
  },
  {
    id: 'pmp-formulas',
    title: 'PMP® Formula Sheet & EVM Cheat Guide',
    category: 'Study Guide',
    badge: '⚡ Quick Download',
    badgeBg: 'bg-blue-50 text-blue-600 border-blue-200',
    description: 'Master Earned Value Management (EVM), PERT estimates, Communication channels & Critical Path Method formulas.',
    deliverables: ['All 25 Essential PMP Formulas', 'Step-by-Step Sample Calculations', 'Printable 2-Page Reference PDF'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
    actionText: 'Download Formula Sheet PDF',
    actionUrl: '#download-pdf',
    type: 'pdf'
  },
  {
    id: 'agile-matrix',
    title: 'Agile & Scrum Quick Reference Matrix',
    category: 'Agile Guide',
    badge: '🌱 Free Resource',
    badgeBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    description: 'Comparative matrix covering Scrum, Kanban, XP, SAFe, and Hybrid project management frameworks.',
    deliverables: ['Agile Roles & Ceremony Breakdown', 'Sprint Backlog & Burndown Templates', 'Hybrid Practice Decision Tree'],
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop',
    actionText: 'Download Agile Matrix PDF',
    actionUrl: '#download-pdf',
    type: 'pdf'
  },
  {
    id: 'six-sigma-roadmap',
    title: 'Lean Six Sigma Green Belt DMAIC Roadmap',
    category: 'Quality Guide',
    badge: '🏆 Industry Standard',
    badgeBg: 'bg-purple-50 text-purple-600 border-purple-200',
    description: 'Define, Measure, Analyze, Improve, and Control (DMAIC) toolset guide with statistical chart references.',
    deliverables: ['DMAIC Phase-by-Phase Checklist', 'Fishbone & Pareto Analysis Guide', 'Sample Minitab Output Sheets'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    actionText: 'Launch Quality Quiz in LMS',
    actionUrl: 'http://localhost:5174/lms/mock-test',
    type: 'lms-test'
  }
];

export default function FreeResourcesSection() {
  const [activePreview, setActivePreview] = useState(null);

  const handleAction = (resource) => {
    if (resource.actionUrl && resource.actionUrl.startsWith('http://localhost:5174')) {
      window.location.href = resource.actionUrl;
    } else {
      window.location.href = 'http://localhost:5174/lms/free-resources';
    }
  };

  return (
    <section id="free-resources" className="relative w-full py-20 bg-gradient-to-b from-gray-50/70 via-white to-blue-50/40 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-orange-200/30 via-blue-200/30 to-purple-200/30 blur-3xl rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-orange-100/80 border border-orange-200 text-[#f97316] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xs">
            <Sparkles className="w-4 h-4 fill-current" />
            Free Exam Preparation Toolkit
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0a3d91] tracking-tight font-sans leading-tight">
            Boost Your Exam Readiness with <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#0a3d91] via-blue-600 to-[#f97316] bg-clip-text text-transparent">
              Free Premium Resources
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-500 font-semibold max-w-2xl mx-auto">
            Access complimentary practice test sets, formula cheat sheets, and study roadmaps designed by certified PMP® & Agile master instructors.
          </p>
        </div>

        {/* 4-Card Resource Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {freeResources.map((resource) => (
            <div 
              key={resource.id}
              className="group bg-white rounded-3xl border border-gray-100 hover:border-blue-200 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Media Image Banner Container */}
              <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-gray-100">
                <img 
                  src={resource.image} 
                  alt={resource.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
                
                {/* Category & Badge Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="bg-white/90 backdrop-blur-md text-[#0a3d91] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    {resource.category}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm ${resource.badgeBg}`}>
                    {resource.badge}
                  </span>
                </div>

                {/* Banner Overlay Title */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg sm:text-xl font-black leading-tight drop-shadow-md">
                    {resource.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 space-y-5 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                  {resource.description}
                </p>

                {/* Deliverables Checkmarks */}
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                    Included Deliverables:
                  </span>
                  {resource.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-gray-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Action Controls */}
                <div className="pt-4 flex items-center gap-3">
                  <button
                    onClick={() => handleAction(resource)}
                    className="flex-1 bg-gradient-to-r from-[#0a3d91] to-blue-700 hover:from-[#083072] hover:to-blue-800 text-white font-extrabold py-3.5 px-5 rounded-2xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                  >
                    {resource.type === 'lms-test' ? <Play className="w-4 h-4 text-[#f97316] fill-current" /> : <Download className="w-4 h-4" />}
                    <span>{resource.actionText}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setActivePreview(resource)}
                    className="bg-gray-50 hover:bg-gray-100 border border-gray-200 p-3.5 rounded-2xl text-gray-700 hover:text-[#0a3d91] transition-colors"
                    title="Quick Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Callout Banner linking to LMS Portal */}
        <div className="mt-16 bg-gradient-to-r from-[#0a3d91] via-blue-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#f97316]">
              🚀 Full LMS Access Included
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready for the Full 1,800+ Question Exam Bank?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl font-medium">
              Join thousands of PMP candidates practicing on our interactive LMS portal with real-time scorecards and performance metrics.
            </p>
          </div>

          <a
            href="http://localhost:5174/lms/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="z-10 shrink-0 bg-[#f97316] hover:bg-[#ea580c] text-white text-xs sm:text-sm font-black px-8 py-4 rounded-2xl shadow-xl hover:shadow-orange-500/30 transform hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wider flex items-center gap-2"
          >
            <span>Open LMS Student Portal</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>

      {/* Quick Preview Modal */}
      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-8 max-w-lg w-full relative space-y-6">
            <button
              onClick={() => setActivePreview(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-3 rounded-2xl bg-orange-50 text-[#f97316]">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                  {activePreview.category}
                </span>
                <h4 className="text-base font-black text-[#0a3d91]">
                  {activePreview.title}
                </h4>
              </div>
            </div>

            <div className="space-y-4 text-xs font-medium text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="font-bold text-gray-800">📋 Overview & Contents:</p>
              <p>{activePreview.description}</p>
              <ul className="space-y-2 pt-2 border-t border-gray-200/60">
                {activePreview.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700 font-bold">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex gap-3">
              <a
                href={activePreview.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActivePreview(null)}
                className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider text-center shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Access Now in LMS</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
