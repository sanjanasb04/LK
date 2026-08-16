import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import EligibilityCheck from './EligibilityCheck';
import ApplicationGuidance from './ApplicationGuidance';
import PDURenewalGuidance from './PDURenewalGuidance';
import ExamSuccessGuide from './ExamSuccessGuide';
import MockTest from './MockTest';
import PracticeTest from './PracticeTest';
import ResumeAssistance from './ResumeAssistance';
import { Award, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

const FreeResourcesPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();

  const tabs = [
    { id: 'eligibility', label: "🎯 PMP Eligibility Check" },
    { id: 'application', label: "📋 PMP Application Guidance" },
    { id: 'renewal', label: "🔄 PMP Renewal (PDUs) Guidance" },
    { id: 'success-guide', label: "📖 PMP Exam Success Guide" },
    { id: 'mock-test', label: "🧪 Free PMP Mock Test" },
    { id: 'practice-test', label: "✅ Free PMP Practice Test" },
    { id: 'resume-job', label: "💼 Resume & Job Assistance" }
  ];

  // Normalize incoming tab parameter (handling spaces, subpaths, and Navbar variations)
  let resolvedTab = tab ? tab.toLowerCase().trim().replace(/%20/g, ' ').replace(/\s+/g, '-') : 'eligibility';
  
  const tabMapping = {
    'application-guidance': 'application',
    'renewal-guidance': 'renewal',
    'resume-assistance': 'resume-job',
    'resume-update-&-job-assistance': 'resume-job',
    'mock-test': 'mock-test',
    'practice-test': 'practice-test',
    'success-guide': 'success-guide',
    'eligibility': 'eligibility'
  };

  if (tabMapping[resolvedTab]) {
    resolvedTab = tabMapping[resolvedTab];
  }

  // Default to eligibility if no tab matches or is specified
  const activeTab = tabs.some(t => t.id === resolvedTab) ? resolvedTab : 'eligibility';

  const handleTabChange = (tabId) => {
    if (tabId === 'mock-test' || tabId === 'practice-test') {
      const path = tabId === 'mock-test' ? '/lms/mock-test' : '/lms/practice-test';
      const targetUrl = `${window.location.hostname === 'localhost' ? 'http://localhost:5174' : window.location.origin}${path}`;
      if (window.parent && window.parent !== window) {
        window.parent.location.href = targetUrl;
      } else {
        window.location.href = targetUrl;
      }
      return;
    }
    navigate(`/free-resources/${tabId}`);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'eligibility':
        return <EligibilityCheck />;
      case 'application':
        return <ApplicationGuidance />;
      case 'renewal':
        return <PDURenewalGuidance />;
      case 'success-guide':
        return <ExamSuccessGuide setActiveTab={(tabId) => navigate(`/free-resources/${tabId}`)} />;
      case 'mock-test':
        return <MockTest />;
      case 'practice-test':
        return <PracticeTest />;
      case 'resume-job':
        return <ResumeAssistance />;
      default:
        return <EligibilityCheck />;
    }
  };

  const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const hideNav = queryParams.get('hideNav') === 'true';

  if (hideNav) {
    return (
      <div className="bg-slate-50/50 min-h-screen p-3 sm:p-6 text-left">
        <div className="max-w-5xl mx-auto">
          {renderActiveComponent()}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* Premium Blue Hero Banner */}
      <div className="bg-gradient-to-r from-primary to-[#052b66] text-white py-12 text-left shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2">
            {/* Breadcrumb */}
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-white">Free Resources</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mt-2">Free PMP® Resources</h1>
            <p className="text-sm font-semibold text-slate-200 mt-1 max-w-2xl leading-relaxed">
              Everything you need to start, prepare, and succeed in your project management journey — completely free.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT SIDEBAR (sticky, 280px) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-4 sticky top-[80px]">
              <p className="text-[10px] font-black text-textmuted uppercase tracking-wider px-3 pb-3 border-b border-slate-50 text-left">
                PMP Resources
              </p>
              <div className="space-y-1.5 pt-3">
                {tabs.map((t) => {
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleTabChange(t.id)}
                      className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-l-4 flex items-center justify-between ${
                        isActive
                          ? 'border-accent bg-primary/5 text-primary'
                          : 'border-transparent text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{t.label}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Want Live Training CTA */}
            <div className="bg-gradient-to-br from-primary to-[#063073] text-white rounded-2xl p-6 text-left shadow-md space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-accent uppercase tracking-wider">Pass Guaranteed</p>
                <h4 className="text-sm font-black uppercase leading-tight">Want Live Training?</h4>
                <p className="text-[11px] text-slate-200 leading-normal font-semibold">
                  Get certified on your first attempt with our 100% money-back pass guarantee program.
                </p>
              </div>
              <Link
                to="/courses"
                className="w-full bg-accent hover:bg-accent-dark text-white font-extrabold py-3 px-4 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all text-center shadow-sm"
              >
                Explore Courses <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

          {/* RIGHT CONTENT PANEL (flex-1) */}
          <div className="lg:col-span-3">
            <div className="bg-transparent">
              {renderActiveComponent()}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FreeResourcesPage;
