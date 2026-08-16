import React, { useState } from 'react';
import { Send, FileText, Briefcase, DollarSign, Award, ChevronRight } from 'lucide-react';
import api from '../../utils/api';

const ResumeAssistance = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    pmpStatus: 'Interested',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // In this clone, we submit the job inquiry to the existing contact/inquiry backend endpoint!
      await api.post('/inquiry', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: `PMP Job Assistance Request - ${form.pmpStatus}`,
        message: `PMP Status: ${form.pmpStatus}\nMessage: ${form.message}`
      });
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', pmpStatus: 'Interested', message: '' });
    } catch (err) {
      setError('Failed to submit request. Please contact support directly.');
    } finally {
      setLoading(false);
    }
  };

  const verbs = [
    "Led", "Directed", "Managed", "Delivered", "Coordinated", "Facilitated",
    "Executed", "Monitored", "Controlled", "Initiated", "Planned", "Budgeted",
    "Mitigated", "Escalated", "Implemented", "Optimized", "Streamlined", "Negotiated"
  ];

  return (
    <div className="space-y-10">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-textdark uppercase tracking-tight">Resume Update & Job Assistance</h2>
        <p className="text-sm text-textmuted font-semibold mt-1">
          Get your PMP® on paper — and in front of the right employers.
        </p>
      </div>

      {/* SECTION A — HOW PMP CHANGES YOUR RESUME */}
      <div className="space-y-4 text-left">
        <h3 className="text-lg font-black text-textdark uppercase tracking-tight">How PMP® Upgrades Your Resume</h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm bg-white text-xs font-semibold text-slate-600">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-textdark font-black uppercase border-b border-slate-100">
                <th className="p-4 w-1/2">Before PMP®</th>
                <th className="p-4 w-1/2">After PMP®</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4">"Project Coordinator"</td>
                <td className="p-4 text-primary font-bold">"PMP® Certified Project Manager"</td>
              </tr>
              <tr>
                <td className="p-4">"Helped manage project teams."</td>
                <td className="p-4 text-primary font-bold">"Led cross-functional teams of 10–15 professionals."</td>
              </tr>
              <tr>
                <td className="p-4">"Attended client updates."</td>
                <td className="p-4 text-primary font-bold">"Directed communications and expectations for key stakeholders."</td>
              </tr>
              <tr>
                <td className="p-4">"Assisted with financial budgets."</td>
                <td className="p-4 text-primary font-bold">"Managed project budget cycles totaling $2.5M."</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION B — WHERE TO ADD PMP ON YOUR RESUME */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 text-left space-y-4">
        <h3 className="text-sm font-black text-textdark uppercase tracking-wide">PMP® Placement Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-600 font-semibold">
          <div className="p-4 rounded-xl border border-slate-50 bg-slate-50/20">
            <p className="font-bold text-textdark uppercase tracking-wide text-[10px] text-primary">1. After Your Name</p>
            <p className="mt-1">Add the credentials directly to your header: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded font-black text-textdark">John Smith, PMP®</span>.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-50 bg-slate-50/20">
            <p className="font-bold text-textdark uppercase tracking-wide text-[10px] text-primary">2. Certifications Section</p>
            <p className="mt-1">List explicitly: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded font-black text-textdark">Project Management Professional (PMP®) — ID #123456 (2024)</span>.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-50 bg-slate-50/20">
            <p className="font-bold text-textdark uppercase tracking-wide text-[10px] text-primary">3. Summary Profile</p>
            <p className="mt-1">Incorporate in introductory hook: "PMP® certified leader with 6+ years delivering hybrid software projects..."</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-50 bg-slate-50/20">
            <p className="font-bold text-textdark uppercase tracking-wide text-[10px] text-primary">4. Core Competencies</p>
            <p className="mt-1">Include keywords matching PMI: WBS, CPM, EVM, Agile Ceremonies, Scope Management, Stakeholder Alignment.</p>
          </div>
        </div>
      </div>

      {/* SECTION C — ACTION WORDS */}
      <div className="space-y-3 text-left">
        <h3 className="text-xs font-black text-textmuted uppercase tracking-wider">PMI Action Verbs for Resume Bullets</h3>
        <div className="flex flex-wrap gap-2 pt-1">
          {verbs.map((verb, idx) => (
            <span key={idx} className="bg-slate-50 border border-slate-200/50 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg">
              {verb}
            </span>
          ))}
        </div>
      </div>

      {/* SECTION D — RESUME TIPS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="p-5 rounded-xl border border-slate-100 shadow-sm bg-white space-y-2">
          <h4 className="text-xs font-black text-primary uppercase tracking-wide">💡 Quantify Everything</h4>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Avoid simple phrases like "managed budgets." Always state metrics: "Managed 3 concurrent projects with $5M combined budget."
          </p>
        </div>
        <div className="p-5 rounded-xl border border-slate-100 shadow-sm bg-white space-y-2">
          <h4 className="text-xs font-black text-primary uppercase tracking-wide">💡 Highlight PM Methodologies</h4>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Specify lifecycle models: Waterfall, Agile, Scrum, Kanban, or Hybrid. Employers look for these keywords.
          </p>
        </div>
        <div className="p-5 rounded-xl border border-slate-100 shadow-sm bg-white space-y-2">
          <h4 className="text-xs font-black text-primary uppercase tracking-wide">💡 STAR Interview Method</h4>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Structure experience bullets: Situation &rarr; Task &rarr; Action &rarr; Result. Show the value you created.
          </p>
        </div>
      </div>

      {/* SECTION E — JOB SEARCH RESOURCES */}
      <div className="space-y-4 text-left">
        <h3 className="text-lg font-black text-textdark uppercase tracking-tight">Top Platforms for PMP® Job Hunts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://www.linkedin.com/jobs"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/50 transition-colors flex items-center justify-between text-xs font-bold text-slate-700"
          >
            <span className="flex items-center gap-2">🌐 LinkedIn Jobs</span>
            <ChevronRight className="w-4 h-4 text-primary" />
          </a>
          <a
            href="https://www.pmi.org/career-central"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/50 transition-colors flex items-center justify-between text-xs font-bold text-slate-700"
          >
            <span className="flex items-center gap-2">💼 PMI Career Central</span>
            <ChevronRight className="w-4 h-4 text-primary" />
          </a>
          <a
            href="https://www.naukri.com"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/50 transition-colors flex items-center justify-between text-xs font-bold text-slate-700"
          >
            <span className="flex items-center gap-2">🔍 Indeed / Naukri</span>
            <ChevronRight className="w-4 h-4 text-primary" />
          </a>
        </div>
      </div>

      {/* SECTION F — AVERAGE PMP SALARY */}
      <div className="space-y-4 text-left">
        <h3 className="text-lg font-black text-textdark uppercase tracking-tight font-black">Salary Benchmark (India)</h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm bg-white text-xs font-semibold text-slate-600">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-textdark font-black uppercase border-b border-slate-100">
                <th className="p-4">Experience Level</th>
                <th className="p-4">Without PMP®</th>
                <th className="p-4">With PMP®</th>
                <th className="p-4">Average Increase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4 font-bold text-textdark">0–3 years (Junior PM)</td>
                <td className="p-4">₹4,50,000</td>
                <td className="p-4 text-primary font-black">₹6,20,000</td>
                <td className="p-4 text-success font-black">~37%</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-textdark">4–7 years (Mid PM)</td>
                <td className="p-4">₹9,80,000</td>
                <td className="p-4 text-primary font-black">₹13,50,000</td>
                <td className="p-4 text-success font-black">~38%</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-textdark">8+ years (Senior PM)</td>
                <td className="p-4">₹16,50,000</td>
                <td className="p-4 text-primary font-black">₹22,00,000</td>
                <td className="p-4 text-success font-black">~33%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION G — JOB ASSISTANCE APPLICATION FORM */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 sm:p-8 text-left space-y-6">
        <div>
          <h3 className="text-sm font-black text-textdark uppercase tracking-wide">PMP® Placement & Job Assistance</h3>
          <p className="text-xs text-textmuted font-semibold leading-relaxed mt-1">
            Submit your profile details below. Our career advisors will evaluate your resume, suggest PMP keyword optimizations, and forward your profile to our corporate hiring partners.
          </p>
        </div>

        {success ? (
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50 text-xs font-bold text-emerald-700 text-center">
            🎉 Thank you! Your request has been submitted successfully. An advisor will reach out to you within 2 business days.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 rounded-xl border border-rose-100 bg-rose-50 text-xs font-bold text-rose-700">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-textmuted uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. John Smith"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs font-semibold text-slate-600 bg-slate-50/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-textmuted uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. john@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs font-semibold text-slate-600 bg-slate-50/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-textmuted uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs font-semibold text-slate-600 bg-slate-50/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-textmuted uppercase tracking-wider">Current PMP Status</label>
                <select
                  value={form.pmpStatus}
                  onChange={(e) => setForm({ ...form, pmpStatus: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs font-bold text-slate-600 bg-slate-50/20"
                >
                  <option value="Interested">Interested in PMP Training</option>
                  <option value="In Progress">Preparing for PMP Exam</option>
                  <option value="Certified">PMP Certified Professional</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-textmuted uppercase tracking-wider">Short Cover Note / Message</label>
              <textarea
                rows="4"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Mention any target roles or career interests..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs font-semibold text-slate-600 bg-slate-50/20"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-accent hover:bg-accent-dark text-white font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResumeAssistance;
