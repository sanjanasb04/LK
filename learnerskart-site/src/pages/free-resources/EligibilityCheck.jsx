import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, XCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const EligibilityCheck = () => {
  const { selectedCountry } = useCart();

  const formatUSD = (usdAmount) => {
    if (!selectedCountry) return `$${usdAmount}`;
    const usdRate = 0.012; // US rate relative to INR
    const converted = Math.round(usdAmount * (selectedCountry.rate / usdRate));
    return `${selectedCountry.symbol}${converted.toLocaleString()}`;
  };

  const [step, setStep] = useState(1);
  const [education, setEducation] = useState('');
  const [experienceMonths, setExperienceMonths] = useState('');
  const [isLeader, setIsLeader] = useState('');
  const [trainingHours, setTrainingHours] = useState('');
  const [result, setResult] = useState(null);

  const [activeFaq, setActiveFaq] = useState(null);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const checkEligibility = (e) => {
    e.preventDefault();
    const months = parseInt(experienceMonths, 10) || 0;
    const requiredMonths = education === 'bachelor' ? 36 : 60;
    
    let isEligible = true;
    let reasonsMissing = [];

    if (!education) {
      isEligible = false;
      reasonsMissing.push("Please select an education level.");
    }

    if (isLeader !== 'yes') {
      isEligible = false;
      reasonsMissing.push("PM experience must involve leading/directing projects (servant leadership counts, but purely participating is not sufficient).");
    }

    if (months < requiredMonths) {
      isEligible = false;
      reasonsMissing.push(`You need at least ${requiredMonths} months of experience. You are short by ${requiredMonths - months} month(s).`);
    }

    const hasTraining = trainingHours === 'yes' || trainingHours === 'capm';
    if (!hasTraining) {
      isEligible = false;
      reasonsMissing.push("You must complete 35 contact hours of project management education (or hold an active CAPM certification).");
    }

    if (isEligible) {
      setResult({
        status: 'eligible',
        title: "🎉 Great news! You meet the PMP® eligibility requirements.",
        summary: {
          education: "Education level qualifies",
          experience: `${months} months of project leadership experience (Required: ${requiredMonths} months)`,
          training: trainingHours === 'capm' ? "CAPM Holder (Exempt from 35 Contact Hours)" : "35 Contact Hours completed"
        }
      });
    } else {
      // Determine if partially eligible or not eligible
      const onlyTrainingMissing = isLeader === 'yes' && months >= requiredMonths && !hasTraining;
      const onlyExperienceMissing = isLeader === 'yes' && months < requiredMonths && hasTraining;
      
      if (onlyTrainingMissing || onlyExperienceMissing || (isLeader === 'yes' && (months < requiredMonths || !hasTraining))) {
        setResult({
          status: 'partial',
          title: "⚠️ Partially Eligible",
          reasons: reasonsMissing,
          advice: onlyTrainingMissing 
            ? "To become fully eligible, you simply need to complete your 35 contact hours of project management training."
            : "You need to accumulate more project leadership experience to meet the minimum months threshold."
        });
      } else {
        setResult({
          status: 'ineligible',
          title: "❌ Not Yet Eligible",
          reasons: reasonsMissing,
          advice: "PMI requires project management experience that specifically involves leading and directing project work. If you do not have this yet, we highly recommend starting with the CAPM® certification to build your foundation and jumpstart your career."
        });
      }
    }
  };

  const resetForm = () => {
    setStep(1);
    setEducation('');
    setExperienceMonths('');
    setIsLeader('');
    setTrainingHours('');
    setResult(null);
  };

  const faqData = [
    {
      q: "Can I use volunteer experience for PMP eligibility?",
      a: "Yes! PMI accepts volunteer experience as long as it involved leading and directing projects, and falls within the last 8 years. Document your role, responsibilities, and hours clearly."
    },
    {
      q: "Does my PMP experience need to be in a specific industry?",
      a: "No. PMI accepts project management experience from any industry — IT, construction, healthcare, finance, marketing, manufacturing, etc. The key is that you were leading and directing projects."
    },
    {
      q: "What if I have a CAPM certification?",
      a: "CAPM holders are exempt from the 35 contact-hour requirement. You still need to meet the education and experience requirements."
    },
    {
      q: "Can part-time project management experience count?",
      a: "Yes. Part-time experience is counted by hours spent leading projects, not months of employment. Ensure your documented hours reflect actual PM leadership time."
    },
    {
      q: "How do I verify my project management hours?",
      a: "PMI asks you to self-report your hours by project. If audited, your supervisor or project sponsor will need to verify them. Always be accurate."
    }
  ];

  return (
    <div className="space-y-10">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-textdark uppercase tracking-tight">Check Your PMP® Eligibility</h2>
        <p className="text-sm text-textmuted font-semibold mt-1">
          Find out if you qualify to apply for the PMP® exam in under 2 minutes.
        </p>
      </div>

      {/* SECTION A — INTERACTIVE ELIGIBILITY CHECKER */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 sm:p-8">
        {!result ? (
          <form onSubmit={checkEligibility} className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <span className="text-xs font-black text-primary uppercase tracking-wider">Step {step} of 3</span>
              <div className="flex gap-1">
                <span className={`w-6 h-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-slate-200'}`} />
                <span className={`w-6 h-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-slate-200'}`} />
                <span className={`w-6 h-1 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-slate-200'}`} />
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-4 text-left">
                <label className="block text-sm font-black text-textdark uppercase tracking-wide">
                  What is your highest level of completed education?
                </label>
                <div className="space-y-3 mt-3">
                  <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-primary/40 cursor-pointer transition-colors bg-slate-50/30">
                    <input
                      type="radio"
                      name="education"
                      value="bachelor"
                      checked={education === 'bachelor'}
                      onChange={(e) => setEducation(e.target.value)}
                      className="w-4 h-4 text-primary"
                    />
                    <div>
                      <p className="text-sm font-bold text-textdark">Bachelor's Degree (4-year)</p>
                      <p className="text-xs text-textmuted">Or global equivalent university degree</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-primary/40 cursor-pointer transition-colors bg-slate-50/30">
                    <input
                      type="radio"
                      name="education"
                      value="highschool"
                      checked={education === 'highschool'}
                      onChange={(e) => setEducation(e.target.value)}
                      className="w-4 h-4 text-primary"
                    />
                    <div>
                      <p className="text-sm font-bold text-textdark">High School / Associate's Degree</p>
                      <p className="text-xs text-textmuted">Secondary diploma, associate's degree, or global equivalent</p>
                    </div>
                  </label>
                </div>
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!education}
                    className="bg-primary hover:bg-primary-dark text-white font-extrabold px-6 py-3 rounded-xl text-xs flex items-center gap-1 transition-all disabled:opacity-50"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 text-left">
                <div className="space-y-2">
                  <label className="block text-sm font-black text-textdark uppercase tracking-wide">
                    How many months of project leadership experience do you have?
                  </label>
                  <p className="text-xs text-textmuted font-semibold">Note: PMI requires 36 months for degree holders, and 60 months for high school graduates.</p>
                  <input
                    type="number"
                    value={experienceMonths}
                    onChange={(e) => setExperienceMonths(e.target.value)}
                    placeholder="e.g. 36"
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-sm font-semibold"
                    min="0"
                    required
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-sm font-black text-textdark uppercase tracking-wide">
                    Does your experience specifically involve leading & directing projects?
                  </label>
                  <p className="text-xs text-textmuted font-semibold">You should have been responsible for managing timeline, deliverables, or team members, rather than just participating as a contributor.</p>
                  <div className="flex gap-4 mt-3">
                    <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 hover:border-primary/40 cursor-pointer transition-colors bg-slate-50/30">
                      <input
                        type="radio"
                        name="isLeader"
                        value="yes"
                        checked={isLeader === 'yes'}
                        onChange={(e) => setIsLeader(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-xs font-bold text-textdark uppercase">Yes</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 hover:border-primary/40 cursor-pointer transition-colors bg-slate-50/30">
                      <input
                        type="radio"
                        name="isLeader"
                        value="no"
                        checked={isLeader === 'no'}
                        onChange={(e) => setIsLeader(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-xs font-bold text-textdark uppercase">No</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold px-6 py-3 rounded-xl text-xs flex items-center gap-1 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!experienceMonths || !isLeader}
                    className="bg-primary hover:bg-primary-dark text-white font-extrabold px-6 py-3 rounded-xl text-xs flex items-center gap-1 transition-all disabled:opacity-50"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 text-left">
                <label className="block text-sm font-black text-textdark uppercase tracking-wide">
                  Have you completed 35 contact hours of project management education?
                </label>
                <div className="space-y-3 mt-3">
                  <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-primary/40 cursor-pointer transition-colors bg-slate-50/30">
                    <input
                      type="radio"
                      name="trainingHours"
                      value="yes"
                      checked={trainingHours === 'yes'}
                      onChange={(e) => setTrainingHours(e.target.value)}
                      className="w-4 h-4 text-primary"
                    />
                    <div>
                      <p className="text-sm font-bold text-textdark">Yes, I hold a certificate of completion</p>
                      <p className="text-xs text-textmuted">Fulfills the 35 hours requirement</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-primary/40 cursor-pointer transition-colors bg-slate-50/30">
                    <input
                      type="radio"
                      name="trainingHours"
                      value="no"
                      checked={trainingHours === 'no'}
                      onChange={(e) => setTrainingHours(e.target.value)}
                      className="w-4 h-4 text-primary"
                    />
                    <div>
                      <p className="text-sm font-bold text-textdark">Not yet / In progress</p>
                      <p className="text-xs text-textmuted">Need 35 hours to apply</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-primary/40 cursor-pointer transition-colors bg-slate-50/30">
                    <input
                      type="radio"
                      name="trainingHours"
                      value="capm"
                      checked={trainingHours === 'capm'}
                      onChange={(e) => setTrainingHours(e.target.value)}
                      className="w-4 h-4 text-primary"
                    />
                    <div>
                      <p className="text-sm font-bold text-textdark">I hold an active CAPM® certification</p>
                      <p className="text-xs text-textmuted">Exempts you from the 35 contact-hour requirement</p>
                    </div>
                  </label>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold px-6 py-3 rounded-xl text-xs flex items-center gap-1 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={!trainingHours}
                    className="bg-accent hover:bg-accent-dark text-white font-extrabold px-6 py-3 rounded-xl text-xs flex items-center gap-1 transition-all disabled:opacity-50"
                  >
                    Check Eligibility
                  </button>
                </div>
              </div>
            )}
          </form>
        ) : (
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              {result.status === 'eligible' && <CheckCircle2 className="w-8 h-8 text-success" />}
              {result.status === 'partial' && <AlertCircle className="w-8 h-8 text-warning" />}
              {result.status === 'ineligible' && <XCircle className="w-8 h-8 text-danger" />}
              <div>
                <h4 className="font-black text-lg text-textdark uppercase tracking-tight">{result.title}</h4>
              </div>
            </div>

            {result.status === 'eligible' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                  <p className="text-xs font-black text-emerald-800 uppercase tracking-wider">Your Summary:</p>
                  <ul className="list-disc list-inside text-xs font-semibold text-emerald-700 space-y-1">
                    <li>{result.summary.education}</li>
                    <li>{result.summary.experience}</li>
                    <li>{result.summary.training}</li>
                  </ul>
                </div>
                <p className="text-sm font-semibold text-textmuted leading-relaxed">
                  You are fully qualified to take the PMP® exam! You can proceed to fill in your application form on PMI.org.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="https://www.pmi.org"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-primary hover:bg-primary-dark text-white font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider"
                  >
                    Start PMP Application
                  </a>
                  <button
                    onClick={resetForm}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider"
                  >
                    Check Again
                  </button>
                </div>
              </div>
            )}

            {result.status === 'partial' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 space-y-3">
                  <p className="text-xs font-black text-amber-800 uppercase tracking-wider">Missing Requirements:</p>
                  <ul className="space-y-2 text-xs font-bold text-amber-700">
                    {result.reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span>•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm font-semibold text-textmuted leading-relaxed">
                  {result.advice}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    to="/pmp-certification-training"
                    className="bg-primary hover:bg-primary-dark text-white font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider"
                  >
                    Enroll in PMP Training
                  </Link>
                  <button
                    onClick={resetForm}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider"
                  >
                    Check Again
                  </button>
                </div>
              </div>
            )}

            {result.status === 'ineligible' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-3">
                  <p className="text-xs font-black text-rose-800 uppercase tracking-wider">Unfulfilled Thresholds:</p>
                  <ul className="space-y-2 text-xs font-bold text-rose-700">
                    {result.reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span>•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm font-semibold text-textmuted leading-relaxed">
                  {result.advice}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    to="/capm-certification-training"
                    className="bg-primary hover:bg-primary-dark text-white font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider"
                  >
                    Start with CAPM® Training
                  </Link>
                  <button
                    onClick={resetForm}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider"
                  >
                    Check Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION B — ELIGIBILITY REQUIREMENTS TABLE */}
      <div className="space-y-4 text-left">
        <h3 className="text-lg font-black text-textdark uppercase tracking-tight">PMP® Eligibility Requirements at a Glance</h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
          <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600 bg-white">
            <thead>
              <tr className="bg-slate-50 text-textdark font-black uppercase border-b border-slate-100">
                <th className="p-4">Requirement</th>
                <th className="p-4">With Bachelor's Degree</th>
                <th className="p-4">With High School Diploma</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4 font-bold text-textdark">Education</td>
                <td className="p-4">4-year degree (Bachelor's or equivalent)</td>
                <td className="p-4">High school diploma, associate's degree, or equivalent</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-textdark">PM Experience</td>
                <td className="p-4">36 months (3 years)</td>
                <td className="p-4">60 months (5 years)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-textdark">Experience Type</td>
                <td className="p-4">Leading and directing project tasks</td>
                <td className="p-4">Leading and directing project tasks</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-textdark">Experience Window</td>
                <td className="p-4">Within last 8 years before application</td>
                <td className="p-4">Within last 8 years before application</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-textdark">Contact Hours</td>
                <td className="p-4">35 hours (exempt with active CAPM®)</td>
                <td className="p-4">35 hours (exempt with active CAPM®)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-textdark">Ethics Agreement</td>
                <td className="p-4">Agree to PMI Code of Ethics</td>
                <td className="p-4">Agree to PMI Code of Ethics</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION C — WHAT COUNTS AS VALID EXPERIENCE */}
      <div className="space-y-4 text-left">
        <h3 className="text-lg font-black text-textdark uppercase tracking-tight font-black">What Qualifies as Project Management Experience?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-emerald-50/20 border border-emerald-100/50 space-y-3">
            <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              ✅ COUNTS:
            </h4>
            <ul className="space-y-2 text-xs text-emerald-700 font-bold">
              <li>• Leading cross-functional project teams</li>
              <li>• Managing project budgets, resources, & scope</li>
              <li>• Directing the project execution & task scheduling</li>
              <li>• Managing project stakeholders and identifying risks</li>
              <li>• Delivering end-to-end project outcomes</li>
            </ul>
          </div>
          <div className="p-5 rounded-2xl bg-rose-50/20 border border-rose-100/50 space-y-3">
            <h4 className="text-xs font-black text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
              ❌ DOES NOT COUNT:
            </h4>
            <ul className="space-y-2 text-xs text-rose-700 font-bold">
              <li>• Just participating in a project as an individual contributor</li>
              <li>• Purely administrative/support duties with no PM accountability</li>
              <li>• Pure technical/developer work with no project leadership</li>
              <li>• Project experience older than 8 years</li>
              <li>• Overlapping project timelines (cannot double-count months)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION D — KEY FACTS INFO CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        <div className="p-5 rounded-xl border border-slate-100 shadow-sm bg-white">
          <p className="text-[10px] font-black text-textmuted uppercase tracking-wider">💰 Exam Fee</p>
          <p className="text-base font-black text-primary mt-1">{formatUSD(425)} <span className="text-[10px] text-slate-500 font-bold">Members</span></p>
          <p className="text-[10px] text-slate-400 font-semibold">{formatUSD(675)} for Non-members</p>
        </div>
        <div className="p-5 rounded-xl border border-slate-100 shadow-sm bg-white">
          <p className="text-[10px] font-black text-textmuted uppercase tracking-wider">🕐 Exam Duration</p>
          <p className="text-base font-black text-primary mt-1">230 Mins</p>
          <p className="text-[10px] text-slate-400 font-semibold">180 questions with 2 breaks</p>
        </div>
        <div className="p-5 rounded-xl border border-slate-100 shadow-sm bg-white">
          <p className="text-[10px] font-black text-textmuted uppercase tracking-wider">📅 Validity</p>
          <p className="text-base font-black text-primary mt-1">3 Years</p>
          <p className="text-[10px] text-slate-400 font-semibold">Active from date of passing</p>
        </div>
        <div className="p-5 rounded-xl border border-slate-100 shadow-sm bg-white">
          <p className="text-[10px] font-black text-textmuted uppercase tracking-wider">🔁 Renewal</p>
          <p className="text-base font-black text-primary mt-1">60 PDUs</p>
          <p className="text-[10px] text-slate-400 font-semibold">Earned every 3 years to maintain</p>
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

export default EligibilityCheck;
