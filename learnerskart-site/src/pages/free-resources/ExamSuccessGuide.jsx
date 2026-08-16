import React from 'react';
import { Calendar, CheckSquare, BookOpen, Clock, Info } from 'lucide-react';

const ExamSuccessGuide = ({ setActiveTab }) => {
  const formulas = [
    { name: "EV (Earned Value)", math: "EV = % Complete × BAC", use: "Measures project value delivered at a specific point." },
    { name: "CV (Cost Variance)", math: "CV = EV − AC", use: "Tells you if you are over budget (negative) or under (positive)." },
    { name: "SV (Schedule Variance)", math: "SV = EV − PV", use: "Tells you if you are behind schedule (negative) or ahead (positive)." },
    { name: "CPI (Cost Performance)", math: "CPI = EV / AC", use: "Cost efficiency ratio. CPI < 1.0 means over budget." },
    { name: "SPI (Schedule Performance)", math: "SPI = EV / PV", use: "Schedule efficiency ratio. SPI < 1.0 means behind schedule." },
    { name: "EAC (Estimate at Completion)", math: "EAC = BAC / CPI", use: "Projected total cost if current spending efficiency continues." },
    { name: "ETC (Estimate to Complete)", math: "ETC = EAC − AC", use: "Remaining budget needed to complete project." },
    { name: "TCPI (To-Complete Index)", math: "TCPI = (BAC − EV) / (BAC − AC)", use: "Target cost efficiency needed to finish within budget." },
    { name: "PERT Beta Estimate", math: "(O + 4M + P) / 6", use: "Three-point weighted average estimate (Optimistic, Most Likely, Pessimistic)." },
    { name: "PERT Standard Deviation", math: "(P − O) / 6", use: "Measures range of uncertainty on a task duration." },
    { name: "Communication Channels", math: "n(n − 1) / 2", use: "Number of feedback paths between 'n' stakeholders." }
  ];

  const weeks = [
    { title: "Weeks 1–2: Project Management Foundations", desc: "Read PMBOK Chapter 1-3. Understand project lifecycles. Learn 5 process groups (Initiating, Planning, Executing, Monitoring, Closing) and the WBS." },
    { title: "Weeks 3–4: People Domain (42%)", desc: "Focus on servant leadership, conflict styles (Collaborating vs. Forcing), team stages (Tuckman), stakeholder management, and team motivation." },
    { title: "Weeks 5–6: Agile & Scrum Frameworks", desc: "Study the Agile Practice Guide. Master Scrum roles, ceremonies (Daily, Sprint planning, Review, Retro), Kanban boards, and Agile backlog prioritization." },
    { title: "Weeks 7–8: Process Domain (50%)", desc: "Deep dive into resource management, cost estimating, schedule calculation (CPM), quality control tools, and risk responses (Transfer, Mitigate, Avoid)." },
    { title: "Weeks 9–10: Integration & Hybrid Models", desc: "Understand hybrid roadmaps, change control processes (CCB), business case value, and practice doing 100 situational questions per day." },
    { title: "Weeks 11–12: Mock Exams & Fine-Tuning", desc: "Take 3-5 full 180-question mock tests. Target consistent 75%+ scores. Review every wrong answer in detail to fix knowledge gaps." }
  ];

  return (
    <div className="space-y-10">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-textdark uppercase tracking-tight">PMP® Exam Success Guide</h2>
        <p className="text-sm text-textmuted font-semibold mt-1">
          Your complete roadmap to passing the PMP® exam on the first attempt.
        </p>
      </div>

      {/* SECTION A — EXAM FORMAT AT A GLANCE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        <div className="p-5 rounded-xl border border-slate-100 shadow-sm bg-white">
          <p className="text-[10px] font-black text-textmuted uppercase tracking-wider">📝 Total Questions</p>
          <p className="text-base font-black text-primary mt-1">180 Questions</p>
          <p className="text-[10px] text-slate-400 font-semibold">Multiple choice/response</p>
        </div>
        <div className="p-5 rounded-xl border border-slate-100 shadow-sm bg-white">
          <p className="text-[10px] font-black text-textmuted uppercase tracking-wider">⏱️ Exam Duration</p>
          <p className="text-base font-black text-primary mt-1">230 Minutes</p>
          <p className="text-[10px] text-slate-400 font-semibold">3 hrs 50 min total</p>
        </div>
        <div className="p-5 rounded-xl border border-slate-100 shadow-sm bg-white">
          <p className="text-[10px] font-black text-textmuted uppercase tracking-wider">🔄 Scheduled Breaks</p>
          <p className="text-base font-black text-primary mt-1">2 Breaks</p>
          <p className="text-[10px] text-slate-400 font-semibold">Optional 10-min breaks</p>
        </div>
        <div className="p-5 rounded-xl border border-slate-100 shadow-sm bg-white">
          <p className="text-[10px] font-black text-textmuted uppercase tracking-wider">🎯 Question Split</p>
          <p className="text-base font-black text-primary mt-1">50% Agile</p>
          <p className="text-[10px] text-slate-400 font-semibold">50% Predictive/Hybrid</p>
        </div>
      </div>

      {/* SECTION B — EXAM DOMAIN BREAKDOWN */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 text-left space-y-6">
        <h3 className="text-lg font-black text-textdark uppercase tracking-tight">What the PMP® Exam Tests</h3>
        <p className="text-xs font-semibold text-textmuted leading-relaxed">
          Questions are drawn from three primary domains, testing situational judgment and leadership methodologies:
        </p>
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-textdark uppercase tracking-wide">🧑🤝🧑 People Domain</span>
              <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-md">33% of Exam</span>
            </div>
            <p className="text-xs text-slate-600 font-semibold mt-1.5 leading-relaxed">
              Covers conflict management, servant leadership, team motivation, virtual collaboration, mentoring, and negotiating.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-textdark uppercase tracking-wide">⚙️ Process Domain</span>
              <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-md">41% of Exam</span>
            </div>
            <p className="text-xs text-slate-600 font-semibold mt-1.5 leading-relaxed">
              Covers resource planning, schedule estimating, risk response, budget controls, change tracking, and release loops.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-textdark uppercase tracking-wide">🏢 Business Environment Domain</span>
              <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-md">26% of Exam</span>
            </div>
            <p className="text-xs text-slate-600 font-semibold mt-1.5 leading-relaxed">
              Covers strategic alignment, business cases, benefits realization, external environments, compliance, and governance.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION C — STUDY PLAN (12-WEEK ROADMAP) */}
      <div className="space-y-4 text-left">
        <h3 className="text-lg font-black text-textdark uppercase tracking-tight">Recommended 12-Week Study Plan</h3>
        <div className="space-y-4">
          {weeks.map((wk, idx) => (
            <div key={idx} className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
              <Calendar className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-textdark uppercase tracking-wide">{wk.title}</h4>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">{wk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION D — KEY FORMULAS CHEAT SHEET */}
      <div className="space-y-4 text-left">
        <h3 className="text-lg font-black text-textdark uppercase tracking-tight">Essential PMP® Formulas to Memorize</h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm bg-white">
          <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
            <thead>
              <tr className="bg-slate-50 text-textdark font-black uppercase border-b border-slate-100">
                <th className="p-4">Formula Name</th>
                <th className="p-4">Mathematical Formula</th>
                <th className="p-4">Primary Application</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {formulas.map((f, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30">
                  <td className="p-4 font-bold text-textdark">{f.name}</td>
                  <td className="p-4 font-mono text-primary font-black">{f.math}</td>
                  <td className="p-4">{f.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION E — EXAM DAY CHECKLIST */}
      <div className="space-y-4 text-left">
        <h3 className="text-lg font-black text-textdark uppercase tracking-tight">Exam Day Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <h4 className="text-xs font-black text-textdark uppercase tracking-wider flex items-center gap-1.5">
              📅 BEFORE THE EXAM:
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-semibold">
              <li className="flex items-center gap-2">☐ Sleep at least 7-8 hours the night before</li>
              <li className="flex items-center gap-2">☐ Eat a healthy, protein-rich meal</li>
              <li className="flex items-center gap-2">☐ Review formulas and PMI terms sheet briefly</li>
              <li className="flex items-center gap-2">☐ Set multiple alarms with buffer time</li>
              <li className="flex items-center gap-2">☐ Double-check your testing center location or online setup</li>
            </ul>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <h4 className="text-xs font-black text-textdark uppercase tracking-wider flex items-center gap-1.5">
              🖥️ ON EXAM DAY:
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-semibold">
              <li className="flex items-center gap-2">☐ Arrive at least 30 minutes early (or log in early)</li>
              <li className="flex items-center gap-2">☐ Bring 2 valid forms of government-issued photo ID</li>
              <li className="flex items-center gap-2">☐ No notes, papers, calculators, or phones are allowed</li>
              <li className="flex items-center gap-2">☐ Take both scheduled 10-minute breaks to rest and stretch</li>
              <li className="flex items-center gap-2">☐ Flag difficult questions, skip immediately, and return later</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION F — TIPS FROM PMP PROFESSIONALS */}
      <div className="space-y-4 text-left">
        <h3 className="text-lg font-black text-textdark uppercase tracking-tight">Tips from Certified PMP® Professionals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm italic text-xs font-semibold text-slate-600">
            "PMI Study Hall was a game-changer for my PMP® exam preparation. Its realistic practice questions helped me build confidence and prepare for the actual exam."
            <span className="block mt-2 font-bold text-textdark not-italic">— Rohan D., PMP®</span>
          </div>
          <div className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm italic text-xs font-semibold text-slate-600">
            "I highly recommend taking at least 3–5 full-length mock exams. Once I started consistently scoring 70% or higher, I knew I was ready for the actual PMP® exam. It made a huge difference in my confidence and performance."
            <span className="block mt-2 font-bold text-textdark not-italic">— Sarah M., PMP®</span>
          </div>
          <div className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm italic text-xs font-semibold text-slate-600">
            "Understanding the PMI mindset was just as important as knowing the concepts. Most questions tested judgment rather than memorization."
            <span className="block mt-2 font-bold text-textdark not-italic">— Priya K., PMP®</span>
          </div>
          <div className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm italic text-xs font-semibold text-slate-600">
            "Don't memorize answers. Spend time understanding why each answer is correct or incorrect. That made the biggest difference in tackling situational questions."
            <span className="block mt-2 font-bold text-textdark not-italic">— David L., PMP®</span>
          </div>
          <div className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm italic text-xs font-semibold text-slate-600">
            "Focus heavily on Agile. Around 50% of the exam is Agile/Hybrid now. Make sure you fully understand Servant Leadership and backlog planning."
            <span className="block mt-2 font-bold text-textdark not-italic">— James A., PMP®</span>
          </div>
          <div className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm italic text-xs font-semibold text-slate-600">
            "Do at least 1,000 practice questions. The more situational items you tackle, the more comfortable you'll be on exam day."
            <span className="block mt-2 font-bold text-textdark not-italic">— Maria S., PMP®</span>
          </div>
        </div>
      </div>

      {/* SECTION G — RESOURCES LINKS */}
      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 text-left space-y-4">
        <h3 className="text-xs font-black text-primary uppercase tracking-wider flex items-center gap-1.5">
          🧪 Ready to Test Your Knowledge?
        </h3>
        <p className="text-xs text-slate-600 font-semibold leading-relaxed">
          Tackle our free study aids to simulate the PMP exam environment and benchmark your readiness score:
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => {
              const targetUrl = `${window.location.hostname === 'localhost' ? 'http://localhost:5174' : window.location.origin}/lms/mock-test`;
              if (window.parent && window.parent !== window) {
                window.parent.location.href = targetUrl;
              } else {
                window.location.href = targetUrl;
              }
            }}
            className="bg-primary hover:bg-primary-dark text-white font-extrabold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Take Free Mock Test
          </button>
          <button
            onClick={() => {
              const targetUrl = `${window.location.hostname === 'localhost' ? 'http://localhost:5174' : window.location.origin}/lms/practice-test`;
              if (window.parent && window.parent !== window) {
                window.parent.location.href = targetUrl;
              } else {
                window.location.href = targetUrl;
              }
            }}
            className="bg-accent hover:bg-accent-dark text-white font-extrabold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Start Practice Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamSuccessGuide;
