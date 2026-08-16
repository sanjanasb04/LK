import React from 'react';
import { Target, CheckCircle2, Lock, ArrowRight, Award, Compass } from 'lucide-react';
import ProgressBar from '../../components/ui/ProgressBar';

export default function LearningPathPage() {
  const steps = [
    {
      title: 'STEP 1 — Eligibility & Application',
      status: 'Done',
      substeps: [
        { label: 'Check PMI eligibility requirements', done: true },
        { label: 'Draft and submit PMP Application', done: true },
        { label: 'Receive application approval status', done: true }
      ]
    },
    {
      title: 'STEP 2 — Foundation Modules',
      status: 'Done',
      substeps: [
        { label: 'PMP Module 1: Project Environment Fundamentals', done: true },
        { label: 'PMP Module 2: Initiating Processes', done: true }
      ]
    },
    {
      title: 'STEP 3 — Core Training',
      status: 'In Progress',
      substeps: [
        { label: 'Module 3: Project Planning & Schedulings', done: false, active: true },
        { label: 'Module 4: Executing Processes', done: false },
        { label: 'Module 5: Monitoring & Controlling Processes', done: false },
        { label: 'Module 6: Closing Processes', done: false }
      ]
    },
    {
      title: 'STEP 4 — Exam Preparation',
      status: 'Locked',
      substeps: [
        { label: 'Score 80%+ on Mock Test 1', done: false },
        { label: 'Score 80%+ on Mock Test 2', done: false },
        { label: 'Practice Test Questions Checklist', done: false }
      ]
    },
    {
      title: 'STEP 5 — Final Exam Simulation',
      status: 'Locked',
      substeps: [
        { label: 'Complete full-length 180-question practice simulator', done: false },
        { label: 'Review weak knowledge domains', done: false }
      ]
    },
    {
      title: 'STEP 6 — Certification',
      status: 'Goal',
      substeps: [
        { label: 'Schedule real PMI exam center', done: false },
        { label: 'Pass PMP® Examination', done: false },
        { label: 'Download verifiable badge & certificate', done: false }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="text-left">
        <h1 className="text-2xl font-black text-slate-800">Your Learning Journey</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1 font-sans">
          Structured paths to complete your professional PMP® goals in 90 days.
        </p>
      </div>

      {/* ACTIVE PATH CARD */}
      <div className="bg-gradient-to-br from-primary via-primary-light to-highlight text-white p-6 rounded-panel shadow-sm text-left relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-black bg-white/10 px-2 py-0.5 rounded tracking-widest uppercase border border-white/10">
              Active Roadmap
            </span>
            <h2 className="text-2xl font-black">PMP® Certification Track</h2>
            <p className="text-xs text-white/80 max-w-xl font-medium">
              Complete this structured path to get PMP® certified. Includes modules checklist, simulator exams, and instructor audits.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center gap-1.5 bg-white/15 px-4 py-2 border border-white/10 rounded-xl">
            <Target size={16} />
            <span className="text-xs font-bold font-sans">52 Days Remaining</span>
          </div>
        </div>

        {/* Milestone Timeline Mini visual */}
        <div className="my-8 border-t border-white/15 pt-6 relative select-none">
          <div className="absolute left-6 right-6 top-10 h-0.5 bg-white/20 -z-0" />
          <div className="absolute left-6 w-[45%] top-10 h-0.5 bg-accent -z-0" />
          
          <div className="flex justify-between items-center relative z-10">
            {['Enrolled', 'M1 Done', 'M2 Done', 'M3 Active', 'Exam Prep', 'Certified'].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-sm ${
                  idx < 3 
                    ? 'bg-success border-success text-white' 
                    : idx === 3 
                    ? 'bg-accent border-accent text-white ring-4 ring-accent/25' 
                    : 'bg-slate-800/80 border-slate-700 text-white/50'
                }`}>
                  {idx < 3 ? '✓' : idx + 1}
                </div>
                <span className="text-[9px] font-bold text-white/70 mt-2 block">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress statistics */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold pt-4 border-t border-white/10">
          <span>Track Progress: 38% complete</span>
          <span>Estimated completion: Sept 28, 2026</span>
        </div>

      </div>

      {/* STEPS LIST ACCORDION */}
      <div className="bg-white border border-slate-100 rounded-panel shadow-sm p-6 space-y-6 text-left">
        <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-50 pb-3">Path Stage Breakdown</h3>
        
        <div className="space-y-4">
          {steps.map((step, stepIdx) => (
            <div key={stepIdx} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
              {/* Header */}
              <div className={`p-4 flex items-center justify-between ${
                step.status === 'Done' 
                  ? 'bg-slate-50/50' 
                  : step.status === 'In Progress' 
                  ? 'bg-primary/5 border-l-4 border-primary' 
                  : 'bg-slate-50/20 opacity-70'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg flex items-center justify-center shrink-0 ${
                    step.status === 'Done' 
                      ? 'bg-success/10 text-success' 
                      : step.status === 'In Progress' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {step.status === 'Done' ? <CheckCircle2 size={16} /> : step.status === 'In Progress' ? <Target size={16} /> : <Lock size={16} />}
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-xs">{step.title}</h4>
                </div>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-lg uppercase tracking-wider ${
                  step.status === 'Done' 
                    ? 'bg-success/15 text-success' 
                    : step.status === 'In Progress' 
                    ? 'bg-primary/10 text-primary animate-pulse' 
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {step.status}
                </span>
              </div>

              {/* Substeps */}
              <div className="p-4 bg-white border-t border-slate-50 space-y-2.5">
                {step.substeps.map((sub, subIdx) => (
                  <div key={subIdx} className="flex items-center gap-3 text-xs">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      sub.done 
                        ? 'bg-success/15 border-success text-success' 
                        : sub.active
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-300'
                    }`}>
                      {sub.done && <span className="text-[10px] font-bold">✓</span>}
                    </div>
                    <span className={`font-semibold ${
                      sub.done 
                        ? 'text-slate-400 line-through' 
                        : sub.active 
                        ? 'text-primary font-bold'
                        : 'text-slate-600'
                    }`}>
                      {sub.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECOMMENDED PATHS */}
      <div className="space-y-4 text-left">
        <h3 className="font-extrabold text-slate-800 text-sm">Explore Other Pathways</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: '⚡ Fast Track PMP® (60 Days)', desc: 'Accelerated prep path for experienced project leads.' },
            { title: '🏢 Corporate Leadership Path', desc: 'Enterprise team building, governance, and business cases.' },
            { title: '📚 CAPM to PMP Combo Path', desc: 'Entry-level pathway scaling up to professional certification.' }
          ].map((path, idx) => (
            <div key={idx} className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
              <div>
                <Compass className="text-primary mb-3" size={24} />
                <h4 className="font-extrabold text-slate-800 text-xs">{path.title}</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-medium">
                  {path.desc}
                </p>
              </div>
              <button className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline mt-4">
                Explore Pathway
                <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
