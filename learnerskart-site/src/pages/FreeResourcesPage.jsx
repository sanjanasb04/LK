import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, AlertCircle, HelpCircle, ArrowRight, Award, FileText, 
  RefreshCw, ClipboardCheck, GraduationCap, ChevronDown, ChevronUp, UserCheck
} from 'lucide-react';
import api from '../utils/api';

const FreeResourcesPage = () => {
  const { section } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Eligibility Calculator States
  const [degreeType, setDegreeType] = useState('bachelors'); // 'bachelors' or 'highschool'
  const [monthsExp, setMonthsExp] = useState('');
  const [hoursEdu, setHoursEdu] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState(null);

  // Mock Test States
  const [mockIndex, setMockIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [checkedAnswer, setCheckedAnswer] = useState(false);

  // Practice Test States
  const [practiceAnswers, setPracticeAnswers] = useState({}); // { questionId: selectedIndex }
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);

  // Resume Assistance State
  const [resumeSubmitted, setResumeSubmitted] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeForm, setResumeForm] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '1-3 years',
    message: ''
  });

  // Redirect mock-test or practice-test sections to full LMS test simulators
  useEffect(() => {
    if (section === 'mock-test' || section === 'practice-test') {
      const path = section === 'mock-test' ? '/lms/mock-test' : '/lms/practice-test';
      const targetUrl = `${window.location.hostname === 'localhost' ? 'http://localhost:5174' : window.location.origin}${path}`;
      if (window.parent && window.parent !== window) {
        window.parent.location.href = targetUrl;
      } else {
        window.location.href = targetUrl;
      }
    }
  }, [section]);

  // Eligibility Check Handler
  const handleCalculateEligibility = (e) => {
    e.preventDefault();
    const months = parseInt(monthsExp) || 0;
    const hours = parseInt(hoursEdu) || 0;
    
    const requiredMonths = degreeType === 'bachelors' ? 36 : 60;
    const requiredHours = 35; // 35 Contact Hours required for PMP

    const hasMonths = months >= requiredMonths;
    const hasHours = hours >= requiredHours;
    const isEligible = hasMonths && hasHours;

    setEligibilityResult({
      isEligible,
      hasMonths,
      hasHours,
      monthsDiff: Math.max(0, requiredMonths - months),
      hoursDiff: Math.max(0, requiredHours - hours),
      requiredMonths,
      requiredHours
    });
  };

  // Mock Check Answer Handler
  const handleMockCheck = () => {
    if (selectedOption === null) return;
    setCheckedAnswer(true);
  };

  const handleMockNext = () => {
    if (mockIndex < questions.length - 1) {
      setMockIndex(mockIndex + 1);
      setSelectedOption(null);
      setCheckedAnswer(false);
    }
  };

  // Practice Test Answer Handler
  const handlePracticeSelect = (questionId, index) => {
    if (practiceSubmitted) return;
    setPracticeAnswers(prev => ({
      ...prev,
      [questionId]: index
    }));
  };

  const handlePracticeSubmit = () => {
    let score = 0;
    questions.forEach(q => {
      if (practiceAnswers[q._id] === q.correctOption) {
        score += 1;
      }
    });
    setPracticeScore(score);
    setPracticeSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Resume Assistance Handler
  const handleResumeSubmit = (e) => {
    e.preventDefault();
    setResumeLoading(true);
    setTimeout(() => {
      setResumeSubmitted(true);
      setResumeLoading(false);
      setResumeForm({ name: '', email: '', phone: '', experience: '1-3 years', message: '' });
    }, 1500);
  };

  const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const hideNav = queryParams.get('hideNav') === 'true';

  return (
    <div className={`min-h-screen bg-slate-50 ${hideNav ? 'py-2 px-2' : 'py-12'} text-left select-none`}>
      <div className="max-w-4xl mx-auto px-2 sm:px-6">
        
        {/* Banner Section */}
        {!hideNav && (
          <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 sm:p-8 mb-10 flex items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="bg-primary/10 text-primary text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider">
                Free Learning Corner
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-textdark capitalize">
                {section?.replace('-', ' ')}
              </h1>
              <p className="text-xs sm:text-sm text-textmuted max-w-xl font-medium">
                Access premium preparation utilities, eligibility criteria check guides, and curated study guides.
              </p>
            </div>
            <div className="bg-primary/10 p-3.5 rounded-2xl hidden md:block">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
          </div>
        )}

        {/* Dynamic Section Contents */}

        {/* 1. ELIGIBILITY CHECK */}
        {section === 'eligibility' && (
          <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 sm:p-8 space-y-8 animate-fade-in">
            <h3 className="font-extrabold text-lg text-textdark uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              PMP® Exam Eligibility Calculator
            </h3>

            <form onSubmit={handleCalculateEligibility} className="space-y-6 text-xs font-semibold text-slate-500">
              {/* Education Type */}
              <div className="space-y-3">
                <label className="block text-slate-500 uppercase tracking-wider">Highest Level of Education Completed</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => { setDegreeType('bachelors'); setEligibilityResult(null); }}
                    className={`p-4 border rounded-xl flex flex-col items-start gap-1 transition-all ${
                      degreeType === 'bachelors' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="font-bold text-sm">Four-Year College / University Degree</span>
                    <span className="text-[10px] opacity-80 font-medium">Requires 36 months of project management experience</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDegreeType('highschool'); setEligibilityResult(null); }}
                    className={`p-4 border rounded-xl flex flex-col items-start gap-1 transition-all ${
                      degreeType === 'highschool' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="font-bold text-sm">High School Diploma / Associate's Degree</span>
                    <span className="text-[10px] opacity-80 font-medium">Requires 60 months of project management experience</span>
                  </button>
                </div>
              </div>

              {/* Experience Months & Training Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-500 uppercase tracking-wider">Months of Project Leadership Experience</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 36"
                    value={monthsExp}
                    onChange={(e) => { setMonthsExp(e.target.value); setEligibilityResult(null); }}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs outline-none focus:bg-white focus:border-primary font-semibold text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-slate-500 uppercase tracking-wider">Project Management Contact Hours Earned</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 35"
                    value={hoursEdu}
                    onChange={(e) => { setHoursEdu(e.target.value); setEligibilityResult(null); }}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs outline-none focus:bg-white focus:border-primary font-semibold text-slate-700"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 rounded-xl text-xs transition-all shadow-md active:scale-[0.99]"
              >
                Evaluate PMP® Eligibility
              </button>
            </form>

            {/* Results Panel */}
            {eligibilityResult && (
              <div className="border-t border-slate-100 pt-6 animate-fade-in space-y-4">
                {eligibilityResult.isEligible ? (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 text-emerald-800 space-y-2">
                    <p className="font-bold flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      Congratulations! You are eligible for the PMP® Certification Exam.
                    </p>
                    <p className="text-xs leading-relaxed font-medium">
                      You meet both the educational/professional hours experience requirement and the 35 contact hours of study guideline. You can proceed to submit your application on PMI.org.
                    </p>
                  </div>
                ) : (
                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-5 text-rose-800 space-y-3">
                    <p className="font-bold flex items-center gap-1.5 text-sm">
                      <AlertCircle className="w-5 h-5 text-rose-600" />
                      You do not currently meet the PMP® Eligibility Requirements.
                    </p>
                    <div className="text-xs font-semibold space-y-1.5 text-rose-700 pl-6.5">
                      {!eligibilityResult.hasMonths && (
                        <p>• You need at least <strong>{eligibilityResult.requiredMonths} months</strong> of experience. You currently lack <strong>{eligibilityResult.monthsDiff} months</strong>.</p>
                      )}
                      {!eligibilityResult.hasHours && (
                        <p>• You need at least <strong>{eligibilityResult.requiredHours} contact hours</strong> of PM education. You lack <strong>{eligibilityResult.hoursDiff} hours</strong>. (Our PMP training grants this certification automatically!).</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 2. APPLICATION GUIDANCE */}
        {section === 'application-guidance' && (
          <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 sm:p-8 space-y-6 animate-fade-in text-xs font-semibold text-slate-600">
            <h3 className="font-extrabold text-lg text-textdark uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-5 h-5 text-primary" />
              PMP® Application Description Guidance
            </h3>
            
            <p className="leading-relaxed font-medium text-slate-500">
              When applying for the PMP® exam on PMI.org, you must document your projects. PMI has strict requirements on describing projects. Follow these guidelines:
            </p>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                <h4 className="font-bold text-slate-700 text-sm">1. Focus on the Process Groups</h4>
                <p className="text-slate-500 leading-relaxed font-medium">
                  Structure your descriptions using standard PMBOK process group terminologies: **Initiating (IN), Planning (PL), Executing (EX), Monitoring & Controlling (MC), and Closing (CL)**.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                <h4 className="font-bold text-slate-700 text-sm">2. Use the Correct Description Template</h4>
                <p className="text-slate-500 leading-relaxed font-medium">
                  <strong>Example Structure:</strong><br />
                  * **Project Objective**: To design and deploy a secure retail payment interface.<br />
                  * **My Role**: Project Manager / Lead Facilitator.<br />
                  * **Initiating (IN)**: Identified stakeholders, draft project charter and define initial cost limits.<br />
                  * **Planning (PL)**: Defined scope baseline, created WBS, mapped communication models.<br />
                  * **Executing (EX)**: Coordinated with development cohort, managed resource conflicts.<br />
                  * **Monitoring & Controlling (MC)**: Tracked schedule performance index, managed scope changes.<br />
                  * **Closing (CL)**: Handed over release to operations, documented lessons learned.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                <h4 className="font-bold text-slate-700 text-sm">3. Keep it Professional</h4>
                <p className="text-slate-500 leading-relaxed font-medium">
                  Limit project descriptions to 200–500 words. Focus on *what you did as a project manager*, not just what the team accomplished.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. PDUs RENEWAL GUIDANCE */}
        {section === 'renewal-guidance' && (
          <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 sm:p-8 space-y-6 animate-fade-in text-xs font-semibold text-slate-600">
            <h3 className="font-extrabold text-lg text-textdark uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <RefreshCw className="w-5 h-5 text-primary" />
              PMP® Renewal & PDUs Guidance
            </h3>
            
            <p className="leading-relaxed font-medium text-slate-500">
              After earning your PMP® credential, you must claim **60 Professional Development Units (PDUs)** every 3 years to maintain your active status. These are mapped across the PMI Talent Triangle®:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-slate-100 p-4.5 rounded-xl text-center space-y-2 bg-white shadow-sm">
                <span className="text-2xl">🛠️</span>
                <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wide">Ways of Working</h4>
                <p className="text-[10px] text-textmuted font-medium leading-relaxed">
                  Focuses on traditional, agile, or hybrid project tracking techniques.
                </p>
              </div>
              <div className="border border-slate-100 p-4.5 rounded-xl text-center space-y-2 bg-white shadow-sm">
                <span className="text-2xl">🤝</span>
                <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wide">Power Skills</h4>
                <p className="text-[10px] text-textmuted font-medium leading-relaxed">
                  Focuses on leadership, negotiation, communication, and emotional intelligence.
                </p>
              </div>
              <div className="border border-slate-100 p-4.5 rounded-xl text-center space-y-2 bg-white shadow-sm">
                <span className="text-2xl">📈</span>
                <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wide">Business Acumen</h4>
                <p className="text-[10px] text-textmuted font-medium leading-relaxed">
                  Focuses on strategic alignment, compliance, and corporate business models.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-3 border">
              <h4 className="font-bold text-slate-700 text-sm">How to Earn PDUs for Free:</h4>
              <ul className="space-y-2 pl-4 list-disc text-slate-500 font-medium">
                <li>Watch webinars on ProjectManagement.com (automatically synced to PMI.org).</li>
                <li>Working as a professional: claim up to 8 PDUs for performing daily PM responsibilities.</li>
                <li>Read books, write blog articles, or create study guides.</li>
              </ul>
            </div>
          </div>
        )}

        {/* 4. SUCCESS GUIDE */}
        {section === 'success-guide' && (
          <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 sm:p-8 space-y-6 animate-fade-in text-xs font-semibold text-slate-600">
            <h3 className="font-extrabold text-lg text-textdark uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-5 h-5 text-primary" />
              PMP® Exam Success & Prep Strategy
            </h3>
            
            <p className="leading-relaxed font-medium text-slate-500">
              Prepare effectively and pass the PMP® certification exam on your first attempt with this structured strategy guide:
            </p>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <span className="bg-primary text-white font-extrabold w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">Master the ECO (Exam Content Outline)</h4>
                  <p className="text-slate-500 font-medium text-[11px] leading-relaxed mt-1">
                    The exam is split into three domains: **People (42%)**, **Process (50%)**, and **Business Environment (8%)**. Ensure you study both Predictive and Agile/Hybrid lifecycles.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="bg-primary text-white font-extrabold w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">Understand the Agile Practice Guide</h4>
                  <p className="text-slate-500 font-medium text-[11px] leading-relaxed mt-1">
                    Almost 50% of the PMP exam features agile and hybrid situational questions. Make sure you are familiar with Scrum meetings, Sprint boards, and velocity tracking.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="bg-primary text-white font-extrabold w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">Complete Practice & Mock Tests</h4>
                  <p className="text-slate-500 font-medium text-[11px] leading-relaxed mt-1">
                    Completing mock exams helps you build stamina for the 180-question, 230-minute exam. Use our free Mock Test and Practice Test links below to get started!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. MOCK TEST (Q&A with Elaborated Answers) */}
        {section === 'mock-test' && (
          <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 sm:p-8 space-y-6 animate-fade-in text-left">
            <h3 className="font-extrabold text-lg text-textdark uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Free PMP® Mock Test
              </span>
              {questions.length > 0 && (
                <span className="text-[10px] text-textmuted font-bold">
                  Question {mockIndex + 1} of {questions.length}
                </span>
              )}
            </h3>

            {loading ? (
              <div className="py-12 text-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="text-xs text-textmuted font-semibold">Loading questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="py-12 text-center text-textmuted font-bold text-sm">
                No mock questions found in the database.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Question */}
                <h4 className="font-extrabold text-sm text-textdark leading-relaxed">
                  {questions[mockIndex].question}
                </h4>

                {/* Options List */}
                <div className="space-y-3">
                  {questions[mockIndex].options.map((option, idx) => (
                    <button
                      type="button"
                      key={idx}
                      disabled={checkedAnswer}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full p-4 border rounded-xl text-xs font-semibold text-left transition-all ${
                        checkedAnswer
                          ? idx === questions[mockIndex].correctOption
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : selectedOption === idx
                            ? 'bg-rose-50 border-rose-300 text-rose-800'
                            : 'bg-white border-slate-100 text-slate-400'
                          : selectedOption === idx
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {/* Actions & Explanations */}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  {!checkedAnswer ? (
                    <button
                      onClick={handleMockCheck}
                      disabled={selectedOption === null}
                      className="bg-primary hover:bg-primary-dark text-white font-extrabold text-xs px-6 py-3 rounded-lg shadow-sm disabled:opacity-50"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleMockNext}
                      disabled={mockIndex === questions.length - 1}
                      className="bg-accent hover:bg-accent-dark text-white font-extrabold text-xs px-6 py-3 rounded-lg shadow-sm disabled:opacity-50"
                    >
                      {mockIndex === questions.length - 1 ? 'End of Test' : 'Next Question'}
                    </button>
                  )}
                </div>

                {/* Elaborated Answer */}
                {checkedAnswer && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs leading-relaxed font-semibold text-slate-700 animate-fade-in space-y-1.5">
                    <p className="font-bold text-primary uppercase tracking-wide">Elaborated Answer Explanation:</p>
                    <p className="font-medium text-slate-600">
                      {questions[mockIndex].explanation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 6. PRACTICE TEST (Score card at end with all explanations) */}
        {section === 'practice-test' && (
          <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 sm:p-8 space-y-6 animate-fade-in text-left">
            <h3 className="font-extrabold text-lg text-textdark uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <HelpCircle className="w-5 h-5 text-primary" />
              Free PMP® Practice Test
            </h3>

            {loading ? (
              <div className="py-12 text-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="text-xs text-textmuted font-semibold">Loading questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="py-12 text-center text-textmuted font-bold text-sm">
                No practice questions found in the database.
              </div>
            ) : (
              <div className="space-y-8">
                {/* Score Header */}
                {practiceSubmitted && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 text-emerald-800 text-center space-y-2 animate-fade-in">
                    <h4 className="font-black text-xl">Practice Test Finished!</h4>
                    <p className="text-sm font-extrabold text-emerald-700">
                      Your Score: {practiceScore} / {questions.length} ({Math.round((practiceScore / questions.length) * 100)}%)
                    </p>
                    <p className="text-xs text-emerald-600 font-medium">
                      Review all elaborated answers below to help consolidate your learning.
                    </p>
                  </div>
                )}

                {/* Question List */}
                {questions.map((q, idx) => (
                  <div key={q._id} className="space-y-4 border-b border-slate-100 pb-6 last:border-b-0">
                    <h4 className="font-extrabold text-sm text-textdark leading-relaxed">
                      {idx + 1}. {q.question}
                    </h4>

                    {/* Options */}
                    <div className="grid grid-cols-1 gap-2.5">
                      {q.options.map((option, oIdx) => (
                        <button
                          type="button"
                          key={oIdx}
                          disabled={practiceSubmitted}
                          onClick={() => handlePracticeSelect(q._id, oIdx)}
                          className={`w-full p-3.5 border rounded-xl text-xs font-semibold text-left transition-all ${
                            practiceSubmitted
                              ? oIdx === q.correctOption
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : practiceAnswers[q._id] === oIdx
                                ? 'bg-rose-50 border-rose-300 text-rose-800'
                                : 'bg-white border-slate-100 text-slate-400'
                              : practiceAnswers[q._id] === oIdx
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>

                    {/* Explanations shown only after submission */}
                    {practiceSubmitted && (
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs leading-relaxed font-semibold text-slate-600 space-y-1">
                        <p className="font-bold text-primary">Elaborated Answer:</p>
                        <p className="font-medium text-slate-500">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Submit button */}
                {!practiceSubmitted && (
                  <div className="pt-4 text-right">
                    <button
                      onClick={handlePracticeSubmit}
                      disabled={Object.keys(practiceAnswers).length === 0}
                      className="bg-primary hover:bg-primary-dark text-white font-extrabold text-xs px-8 py-3.5 rounded-lg shadow-md disabled:opacity-50"
                    >
                      Submit Practice Test & Show Score
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 7. RESUME ASSISTANCE */}
        {section === 'resume-assistance' && (
          <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 sm:p-8 space-y-6 animate-fade-in text-left">
            <h3 className="font-extrabold text-lg text-textdark uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <UserCheck className="w-5 h-5 text-primary" />
              Resume Update & Job Assistance Request
            </h3>

            {resumeSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 text-emerald-800 text-center space-y-2 animate-fade-in py-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-base">Request Submitted Successfully!</h4>
                <p className="text-xs text-emerald-600 font-medium max-w-sm mx-auto leading-relaxed">
                  Our career placement consultants have received your details. We will contact you within 24 hours to schedule your resume review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleResumeSubmit} className="space-y-4 text-xs font-semibold text-slate-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      value={resumeForm.name}
                      onChange={(e) => setResumeForm({ ...resumeForm, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs outline-none focus:bg-white focus:border-primary font-semibold text-slate-700"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      value={resumeForm.email}
                      onChange={(e) => setResumeForm({ ...resumeForm, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs outline-none focus:bg-white focus:border-primary font-semibold text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wider">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={resumeForm.phone}
                      onChange={(e) => setResumeForm({ ...resumeForm, phone: e.target.value })}
                      placeholder="e.g. +91 99999 99999"
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs outline-none focus:bg-white focus:border-primary font-semibold text-slate-700"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wider">Professional Experience</label>
                    <select
                      value={resumeForm.experience}
                      onChange={(e) => setResumeForm({ ...resumeForm, experience: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs outline-none focus:bg-white focus:border-primary font-semibold text-slate-700"
                    >
                      <option value="1-3 years">1 - 3 Years</option>
                      <option value="3-5 years">3 - 5 Years</option>
                      <option value="5+ years">5+ Years</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-500 uppercase tracking-wider">Brief Profile Overview or Resume Details</label>
                  <textarea
                    rows="4"
                    required
                    value={resumeForm.message}
                    onChange={(e) => setResumeForm({ ...resumeForm, message: e.target.value })}
                    placeholder="Describe your current industry and the certification/job goals you are targeting..."
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs outline-none focus:bg-white focus:border-primary font-semibold text-slate-700 leading-relaxed"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={resumeLoading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {resumeLoading ? 'Submitting Details...' : 'Submit Placement Assistance Request'}
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default FreeResourcesPage;
