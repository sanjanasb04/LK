import React, { useState } from 'react';
import { HelpCircle, CheckSquare, Square, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ApplicationGuidance = () => {
  const { selectedCountry } = useCart();

  const formatUSD = (usdAmount) => {
    if (!selectedCountry) return `$${usdAmount}`;
    const usdRate = 0.012; // US rate relative to INR
    const converted = Math.round(usdAmount * (selectedCountry.rate / usdRate));
    return `${selectedCountry.symbol}${converted.toLocaleString()}`;
  };

  const [checklist, setChecklist] = useState({
    degree: false,
    experience: false,
    hours: false,
    pmi: false,
    auditContact: false
  });
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const steps = [
    {
      title: "Create a PMI Account",
      desc: `Go to PMI.org and create a free account. Tip: Joining PMI as a member costs ${formatUSD(164)}/year but immediately saves you ${formatUSD(250)} on the PMP exam registration fee—paying for itself and yielding a net saving!`
    },
    {
      title: "Gather Your Documentation",
      desc: "Gather certificates of your educational qualifications, your contact information, and details of the projects you will document (client, your specific role, budget, timeline, team size, and contact details of someone who can verify your work if audited)."
    },
    {
      title: "Fill in the Application Form",
      desc: "Log in to PMI.org and start the PMP application. Enter your academic background, your 35 contact hours training details, and your project history. Ensure project descriptions focus heavily on your direct leadership and coordinating duties using action verbs."
    },
    {
      title: "Submit & Await Review",
      desc: "Review all entered information. Once submitted, PMI's validation team reviews the application within 5 business days. You will be notified via email of approval or if your application is selected for audit."
    },
    {
      title: "Handle the Audit (If Selected)",
      desc: "Approximately 5% of all applications are randomly selected for audit. If selected, you have 90 days to mail sealed educational transcripts, verify your training certificate, and secure physical/digital signatures from the project sponsors or managers you listed."
    },
    {
      title: "Schedule Your Exam",
      desc: "Upon approval, you receive a PMP Eligibility ID valid for 1 year. Log in to your PMI portal to schedule your exam date through Pearson VUE. You can opt to take it in-person at a certified test center or online via proctored mode."
    },
    {
      title: "Pay the Registration Fee",
      desc: `Complete payment to lock in your exam slot. PMI Members pay ${formatUSD(425)}, while Non-members pay ${formatUSD(675)}. You are allowed 3 attempts to pass within the 1-year eligibility period.`
    }
  ];

  const faqData = [
    {
      q: "How long does the PMP application take to complete?",
      a: "Most applicants take 1–2 weeks to gather information and fill the form. The more projects you document, the longer it takes. Plan 4–6 hours for the actual application form."
    },
    {
      q: "How many projects do I need to list?",
      a: "There's no minimum number. What matters is that your total documented PM hours reach 4,500 (bachelor's) or 7,500 (secondary). Most applicants list 4–10 projects."
    },
    {
      q: "What happens if I'm audited?",
      a: "About 5% of applicants are randomly selected. You get 90 days to submit sealed transcripts and supervisor signature forms. It's not a red flag — just PMI's verification process."
    },
    {
      q: "Can I edit my application after submitting?",
      a: "No. PMI does not allow edits after submission. Double-check all information before clicking Submit."
    },
    {
      q: "How long is my exam eligibility valid?",
      a: "Once approved, you have 1 year and 3 attempts to pass the exam."
    }
  ];

  return (
    <div className="space-y-10">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-textdark uppercase tracking-tight">How to Apply for the PMP® Exam</h2>
        <p className="text-sm text-textmuted font-semibold mt-1">
          A step-by-step guide to completing your PMI application with zero confusion.
        </p>
      </div>

      {/* SECTION A — Timeline Steps */}
      <div className="space-y-6 text-left">
        <h3 className="text-lg font-black text-textdark uppercase tracking-tight">Application Lifecycle</h3>
        <div className="relative border-l-2 border-slate-100 pl-6 ml-4 space-y-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <span className="absolute -left-[35px] top-0 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">
                {idx + 1}
              </span>
              <h4 className="text-sm font-black text-textdark uppercase tracking-wide">{step.title}</h4>
              <p className="text-xs text-textmuted leading-relaxed font-semibold mt-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 text-left space-y-4">
        <h3 className="text-xs font-black text-primary uppercase tracking-wider flex items-center gap-2">
          📋 Application Readiness Checklist
        </h3>
        <p className="text-xs text-textmuted font-semibold leading-relaxed">
          Ensure you have all items completed before launching the application page on PMI:
        </p>
        <div className="space-y-3 pt-2">
          {[
            { key: 'degree', label: "Copy of degree certificate / educational credentials" },
            { key: 'experience', label: "Summarized project details (roles, timeline, outcomes)" },
            { key: 'hours', label: "35 contact hours training certificate from an ATP provider" },
            { key: 'pmi', label: "PMI account registration and login details" },
            { key: 'auditContact', label: "Sponsor/Manager contact information (in case of audit)" }
          ].map(item => (
            <button
              key={item.key}
              onClick={() => toggleCheck(item.key)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors text-left text-xs font-bold text-slate-700"
            >
              {checklist[item.key] ? (
                <CheckSquare className="w-5 h-5 text-primary shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-300 shrink-0" />
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION B — EXPERIENCE WRITING TIPS */}
      <div className="space-y-4 text-left">
        <h3 className="text-lg font-black text-textdark uppercase tracking-tight">Writing Your Project Experience</h3>
        <div className="p-5 rounded-2xl bg-blue-50/20 border border-blue-100/50 space-y-3">
          <div className="flex gap-2.5">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black text-primary uppercase tracking-wider">PMI Style Requirement</p>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed mt-1">
                Your descriptions must show that you led and directed tasks, mapped directly to standard PM phases (Initiating, Planning, Executing, Monitoring & Controlling, Closing). Use active verbs and clearly state your responsibilities.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/10 space-y-2">
            <p className="text-xs font-black text-emerald-800 uppercase tracking-wider">✅ GOOD EXAMPLE (APPROVED STYLE):</p>
            <p className="text-xs text-emerald-700 font-semibold leading-relaxed">
              "Led a cross-functional team of 12 members to migrate legacy ERP system to SAP. Managed $2.3M budget, identified & mitigated 15 project risks, coordinated with 4 external vendors, and delivered project 2 weeks ahead of schedule."
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-rose-100 bg-rose-50/10 space-y-2">
            <p className="text-xs font-black text-rose-800 uppercase tracking-wider">❌ WEAK EXAMPLE (REJECTED/AUDITED):</p>
            <p className="text-xs text-rose-700 font-semibold leading-relaxed">
              "Worked on an ERP migration project. Attended meetings, wrote status reports, helped team members, and supported testing activities."
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 text-xs font-semibold text-textmuted">
            💡 Mention your specific role and responsibilities
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 text-xs font-semibold text-textmuted">
            💡 Include team size, budget, timeline where possible
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 text-xs font-semibold text-textmuted">
            💡 Use action verbs: Led, Managed, Directed, Coordinated, Delivered
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 text-xs font-semibold text-textmuted">
            💡 Map your work to PM process groups (Initiating → Planning → Executing → Monitoring → Closing)
          </div>
        </div>
      </div>

      {/* SECTION D — PMI MEMBERSHIP — IS IT WORTH IT? */}
      <div className="space-y-4 text-left">
        <h3 className="text-lg font-black text-textdark uppercase tracking-tight">PMI Membership — Is it Worth it?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="space-y-3">
            <h4 className="text-xs font-black text-primary uppercase tracking-wider">🌐 PMI Member ({formatUSD(164)}/yr)</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-700">
              <li className="flex items-center gap-2">✓ Exam Fee: <span className="text-primary font-black">{formatUSD(425)}</span></li>
              <li className="flex items-center gap-2">✓ Renewal Fee: <span className="text-primary font-black">{formatUSD(60)}</span></li>
              <li className="flex items-center gap-2">✓ PMBOK® Guide (7th & 6th Ed): <span className="text-success font-black">FREE PDF</span></li>
              <li className="flex items-center gap-2">✓ PDU Resources & Webinars: <span className="text-success font-black">FREE</span></li>
            </ul>
          </div>
          <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">👤 Non-Member</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-600">
              <li className="flex items-center gap-2">✗ Exam Fee: <span className="font-black">{formatUSD(675)}</span></li>
              <li className="flex items-center gap-2">✗ Renewal Fee: <span className="font-black">{formatUSD(150)}</span></li>
              <li className="flex items-center gap-2">✗ PMBOK® Guide: <span className="text-danger font-black">Must Buy Separately</span></li>
              <li className="flex items-center gap-2">✗ PDU Resources: <span className="text-danger font-black">Pay Per Webinar/Course</span></li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-2 text-center pt-3 border-t border-slate-100">
            <p className="text-xs font-black text-success uppercase tracking-wider">🎉 NET SAVINGS WITH MEMBERSHIP: {formatUSD(316)}+ (Includes PMP book PDF & free resources!)</p>
          </div>
        </div>
      </div>

      {/* SECTION E — FAQ ACCORDION */}
      <div className="space-y-4 text-left">
        <h3 className="text-lg font-black text-textdark uppercase tracking-tight">Frequently Asked Questions</h3>
        <div className="space-y-2.5">
          {faqData.map((faq, idx) => (
            <div key={idx} className="border border-slate-100 rounded-xl bg-white overflow-hidden shadow-sm">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 flex items-center justify-between text-left transition-colors hover:bg-slate-50/50"
              >
                <span className="text-xs font-black text-textdark uppercase tracking-wide flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                  {faq.q}
                </span>
                <span className="text-primary font-black text-base">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              {activeFaq === idx && (
                <div className="p-4 pt-0 border-t border-slate-50 text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50/10">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationGuidance;
