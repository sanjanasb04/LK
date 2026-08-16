import React, { useState } from 'react';
import { HelpCircle, ShieldAlert, Award, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const PDURenewalGuidance = () => {
  const { selectedCountry } = useCart();

  const formatUSD = (usdAmount) => {
    if (!selectedCountry) return `$${usdAmount}`;
    const usdRate = 0.012; // US rate relative to INR
    const converted = Math.round(usdAmount * (selectedCountry.rate / usdRate));
    return `${selectedCountry.symbol}${converted.toLocaleString()}`;
  };

  const [activeFaq, setActiveFaq] = useState(null);

  const faqData = [
    {
      q: "Can I earn all 60 PDUs from Education alone?",
      a: "Yes! You can earn all 60 PDUs from Education activities. Giving Back PDUs are optional and capped at 25. Education PDUs have no upper limit."
    },
    {
      q: "Do PDUs from LearnersKart courses count?",
      a: "Yes. Courses from PMI Authorized Training Partners (ATPs) are pre-approved in CCRS and automatically assigned to the correct Talent Triangle categories."
    },
    {
      q: "What happens if I miss the renewal deadline?",
      a: "Your certification goes into a 1-year suspension period. If you don't renew during that time, your PMP expires permanently and you must retake the exam."
    },
    {
      q: "Can I use the same PDUs for multiple PMI certifications?",
      a: "Yes! PMI allows PDU credits to count toward multiple certifications simultaneously (e.g., PMP + PMI-ACP), as long as the activity is relevant to both."
    },
    {
      q: "How many PDUs does one LearnersKart training course give me?",
      a: "Our core PMP Certification Training provides 35 contact hours / PDUs, covering all three Talent Triangle areas, pre-approved by PMI."
    }
  ];

  return (
    <div className="space-y-10">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-textdark uppercase tracking-tight">PMP® Certification Renewal — PDU Guide</h2>
        <p className="text-sm text-textmuted font-semibold mt-1">
          Keep your PMP® active. Learn exactly how to earn and report your 60 PDUs.
        </p>
      </div>

      {/* SECTION A — RENEWAL OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        <div className="p-5 rounded-xl border border-slate-100 shadow-sm bg-white">
          <p className="text-[10px] font-black text-textmuted uppercase tracking-wider">📅 Cycle Duration</p>
          <p className="text-base font-black text-primary mt-1">3 Years</p>
          <p className="text-[10px] text-slate-400 font-semibold">Starts date of passing</p>
        </div>
        <div className="p-5 rounded-xl border border-slate-100 shadow-sm bg-white">
          <p className="text-[10px] font-black text-textmuted uppercase tracking-wider">📊 Total PDUs</p>
          <p className="text-base font-black text-primary mt-1">60 PDUs</p>
          <p className="text-[10px] text-slate-400 font-semibold">Must report within cycle</p>
        </div>
        <div className="p-5 rounded-xl border border-slate-100 shadow-sm bg-white">
          <p className="text-[10px] font-black text-textmuted uppercase tracking-wider">💰 Renewal Fee</p>
          <p className="text-base font-black text-primary mt-1">$100 to $150 <span className="text-[10px] text-slate-500 font-bold font-sans">Members</span></p>
          <p className="text-[10px] text-slate-400 font-semibold">$200 for Non-members</p>
        </div>
        <div className="p-5 rounded-xl border border-slate-100 shadow-sm bg-white">
          <p className="text-[10px] font-black text-textmuted uppercase tracking-wider">⚠️ Suspension</p>
          <p className="text-base font-black text-primary mt-1">1 Year</p>
          <p className="text-[10px] text-slate-400 font-semibold">Lapse buffer period</p>
        </div>
      </div>

      {/* SECTION B — PDU BREAKDOWN VISUAL */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 text-left space-y-6">
        <h3 className="text-lg font-black text-textdark uppercase tracking-tight">Understanding Your 60 PDU Requirement</h3>
        
        <div className="p-5 rounded-xl bg-slate-50/50 border border-slate-100 space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <p className="text-sm font-black text-primary uppercase tracking-wide">💼 Total Required: 60 PDUs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Education category */}
            <div className="space-y-3">
              <h4 className="font-black text-textdark uppercase tracking-wide text-[10px] flex items-center gap-1 text-primary">
                🎓 EDUCATION (Min. 35 PDUs)
              </h4>
              <ul className="space-y-2 text-slate-600 font-bold">
                <li className="flex justify-between border-b border-slate-100 pb-1">
                  <span>🔧 Ways of Working</span>
                  <span className="text-primary font-black">Min. 8 PDUs</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-1">
                  <span>💬 Power Skills</span>
                  <span className="text-primary font-black">Min. 8 PDUs</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-1">
                  <span>📈 Business Acumen</span>
                  <span className="text-primary font-black">Min. 8 PDUs</span>
                </li>
                <li className="flex justify-between font-semibold text-slate-400">
                  <span>Remaining 11 PDUs</span>
                  <span>Any Education Subcategory</span>
                </li>
              </ul>
            </div>

            {/* Giving Back category */}
            <div className="space-y-3 md:border-l md:border-slate-200 md:pl-6">
              <h4 className="font-black text-textdark uppercase tracking-wide text-[10px] flex items-center gap-1 text-accent">
                🤝 GIVING BACK (Max. 25 PDUs)
              </h4>
              <ul className="space-y-2 text-slate-600 font-bold">
                <li className="flex justify-between border-b border-slate-100 pb-1">
                  <span>💼 Working as PM Practitioner</span>
                  <span className="text-accent font-black">Max. 8 PDUs</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-1">
                  <span>volunteering / Pro-bono</span>
                  <span className="text-accent font-black">Max. 25 PDUs</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-1">
                  <span>📚 Creating Content / Talks</span>
                  <span className="text-accent font-black">Max. 25 PDUs</span>
                </li>
                <li className="flex justify-between font-semibold text-slate-400">
                  <span>Mentoring / Coaching</span>
                  <span>Max. 25 PDUs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION C — PMI TALENT TRIANGLE EXPLAINED */}
      <div className="space-y-4 text-left">
        <h3 className="text-lg font-black text-textdark uppercase tracking-tight">The PMI Talent Triangle®</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-2">
            <h4 className="text-xs font-black text-primary uppercase tracking-wider">🔧 Ways of Working</h4>
            <p className="text-[10px] text-textmuted font-semibold uppercase tracking-wider">Previously "Technical Project Management"</p>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed mt-2">
              Covers Agile, Waterfall, Hybrid, Scrum, Kanban, risk management, scheduling tools, estimation, governance, and delivery frameworks.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-2">
            <h4 className="text-xs font-black text-accent uppercase tracking-wider">💬 Power Skills</h4>
            <p className="text-[10px] text-textmuted font-semibold uppercase tracking-wider">Previously "Leadership"</p>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed mt-2">
              Covers conflict resolution, team leadership, negotiation, communication, servant leadership, emotional intelligence, and stakeholder facilitation.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-2">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">📈 Business Acumen</h4>
            <p className="text-[10px] text-textmuted font-semibold uppercase tracking-wider">Previously "Strategic & Business"</p>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed mt-2">
              Covers business models, benefits realization, market analysis, strategic alignment, contract management, legal, and operational strategy.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION D — HOW TO EARN PDUs */}
      <div className="space-y-4 text-left">
        <h3 className="text-lg font-black text-textdark uppercase tracking-tight">Ways to Earn PDUs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
            <h4 className="text-xs font-black text-textdark uppercase tracking-wide">📚 Online Courses & E-Learning</h4>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
              Earn 1 PDU per hour of structured study. Easiest way to earn bulk credits aligned to the Talent Triangle.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
            <h4 className="text-xs font-black text-textdark uppercase tracking-wide">🎙️ Webinars & Chapter Events</h4>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
              Earn 1–1.5 PDUs by attending virtual events, local PMI chapter meetings, or reading articles on ProjectManagement.com.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
            <h4 className="text-xs font-black text-textdark uppercase tracking-wide">🤝 Volunteering & Pro-bono</h4>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
              Earn 1 PDU per hour of volunteering for your local chapter or helping non-profits with PM duties (Capped at 25 PDUs).
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
            <h4 className="text-xs font-black text-textdark uppercase tracking-wide">💼 Working as a Practitioner</h4>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
              Earn up to 8 PDUs per 3-year cycle simply by doing your day job as a project manager (Self-report in CCRS).
            </p>
          </div>
        </div>
      </div>

      {/* SECTION E — HOW TO REPORT PDUs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 text-left space-y-6">
        <h3 className="text-lg font-black text-textdark uppercase tracking-tight">How to Report Your PDUs in CCRS</h3>
        <div className="space-y-4">
          {[
            "Log in to PMI.org and navigate to the CCRS (Continuing Certification Requirements System) page.",
            "Click the blue 'Report PDUs' button in your central dashboard.",
            "Select the activity type: 'Course or Training' (for LearnersKart courses) or 'Work as a Practitioner'.",
            "Fill in the activity details: provider name, course title, start & end date, and hours spent.",
            "Enter PDU distribution: specify how many hours fall under Ways of Working, Power Skills, and Business Acumen.",
            "Accept the accuracy agreement and click Submit. PMI usually approves within 24–48 hours.",
            "Once you hit 60 approved PDUs, click the 'Renew' banner, pay the fee, and download your renewed certificate!"
          ].map((step, idx) => (
            <div key={idx} className="flex gap-3 items-start text-xs font-semibold text-slate-600">
              <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center font-black shrink-0">
                {idx + 1}
              </span>
              <p className="pt-0.5 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-blue-50/20 border border-blue-100 text-xs font-bold text-primary flex gap-2">
          <Award className="w-5 h-5 shrink-0" />
          <div>
            <p className="uppercase tracking-wider">💡 Pro-Tip: Report As You Go</p>
            <p className="text-slate-600 font-semibold mt-1">
              Do not wait until the last month of your 3-year cycle. Report PDUs as soon as you complete courses. Keep certificates and logs stored for 3 years in case of random CCR audits.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION F — PDU CARRYOVER RULE */}
      <div className="p-5 rounded-2xl bg-amber-50/20 border border-amber-100 text-left flex gap-3">
        <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-black text-amber-800 uppercase tracking-wide">📦 PDU Carryover Rule</h4>
          <p className="text-xs text-amber-700 font-semibold leading-relaxed mt-1">
            If you earn more than 60 PDUs in a cycle, you can carry forward up to 20 PDUs earned in the final 12 months of your cycle to the next 3-year period!
          </p>
        </div>
      </div>

      {/* SECTION G — FAQ ACCORDION */}
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

export default PDURenewalGuidance;
