import React, { useState } from 'react';
import { Target, Clock, ArrowRight, BookOpen, User, CheckCircle2, ShieldCheck, FileText, Upload, X, Maximize2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ActivityPage() {
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState(null); // { title: string, slug: string }

  const resources = [
    { title: 'Eligibility Check', icon: '📝', desc: 'Check if you are eligible for PMP & CAPM certifications', slug: 'eligibility' },
    { title: 'Application Guidance', icon: '📋', desc: 'Step-by-step help & templates for your exam application', slug: 'application-guidance' },
    { title: 'Renewal Guidance', icon: '🔄', desc: 'Learn how to earn PDUs and renew credentials', slug: 'renewal-guidance' },
    { title: 'Exam Success Guide', icon: '🏆', desc: 'Tips, pacing and strategy to pass on your first try', slug: 'success-guide' },
    { title: 'Case Studies', icon: '📊', desc: 'Real-world project management scenarios & analyses', slug: 'case-studies' },
    { title: 'Resume Assistance', icon: '📄', desc: 'Get expert feedback & placement assistance', slug: 'resume-assistance' }
  ];

  const getHost = () => typeof window !== 'undefined' ? window.location.hostname : 'localhost';

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Modal Iframe Overlay for Live Main Site Content */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 animate-fadeIn">
          <div className="bg-white w-full max-w-5xl h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative border border-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeModal.icon}</span>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-800 leading-tight">
                    {activeModal.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Fetched live from LearnersKart Main Site
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`http://${getHost()}:5173/free-resources/${activeModal.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-full transition-colors hidden sm:block"
                  title="Open in new tab"
                >
                  <Maximize2 className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Iframe Body loading main site with hideNav=true */}
            <div className="flex-1 w-full bg-slate-50 relative overflow-hidden">
              <iframe
                src={`http://${getHost()}:5173/free-resources/${activeModal.slug}?hideNav=true`}
                className="w-full h-full border-none"
                title={activeModal.title}
              />
            </div>
          </div>
        </div>
      )}

      {/* Free Resources & Activities Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Free Resources & Activities</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Select any activity module to load interactive calculators, templates and guides directly from LearnersKart.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((res, idx) => (
            <div
              key={idx}
              onClick={() => setActiveModal(res)}
              className="bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/30 rounded-2xl p-5 transition-all duration-300 group flex items-start gap-4 cursor-pointer"
            >
              <div className="bg-slate-50 group-hover:bg-primary/10 text-3xl p-3 rounded-2xl transition-colors shrink-0">
                {res.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-primary transition-colors">
                  {res.title}
                </h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {res.desc}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-black text-primary pt-2 uppercase tracking-wider group-hover:underline">
                  Launch Activity &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
