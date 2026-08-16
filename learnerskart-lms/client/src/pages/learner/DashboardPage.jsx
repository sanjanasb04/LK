import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useXP from '../../hooks/useXP';
import StatCard from '../../components/ui/StatCard';
import ProgressBar from '../../components/ui/ProgressBar';
import { 
  Trophy, BookOpen, Clock, Calendar, ChevronRight, CheckCircle2, 
  ArrowRight, Award, Flame, Play, CheckSquare, Target, Lock, Printer, X, FileText 
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Certificate Modal States
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [certificateName, setCertificateName] = useState('');
  const certificateRef = useRef(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Load enrolled courses
        const coursesRes = await api.get('/enrollments/me');
        if (coursesRes.data.success) {
          const enrolledCourses = coursesRes.data.enrollments.map(e => ({
            ...e.course,
            isCompleted: e.isCompleted,
            completedAt: e.completedAt,
            enrolledAt: e.enrolledAt
          }));
          setCourses(enrolledCourses);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const handleContinueLearning = () => {
    if (courses.length > 0) {
      navigate(`/lms/course/${courses[0].slug}/lesson/l101`);
    } else {
      navigate('/lms/my-courses');
    }
  };

  const getTodayDateString = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  // STRICT 50% VIDEO + 50% MATERIAL PROGRESS FORMULA
  const customVideos = JSON.parse(localStorage.getItem('lk_custom_videos') || '[]');
  const customMaterials = JSON.parse(localStorage.getItem('lk_custom_materials') || '[]');
  const watchedVideos = JSON.parse(localStorage.getItem('lk_watched_videos') || '[]');
  const readMaterials = JSON.parse(localStorage.getItem('lk_read_materials') || '[]');

  const totalVideos = customVideos.length;
  const totalMaterials = customMaterials.length;

  const watchedCount = watchedVideos.length;
  const readCount = readMaterials.length;

  // 1. Video Progress (50% max weight)
  const videoProgress = totalVideos > 0 
    ? Math.min(50, Math.round((watchedCount / totalVideos) * 50)) 
    : (watchedCount > 0 ? 50 : 25);

  // 2. Study Material Progress (50% max weight)
  const materialProgress = totalMaterials > 0 
    ? Math.min(50, Math.round((readCount / totalMaterials) * 50)) 
    : (readCount > 0 ? 50 : 25);

  // Total 100% Course Progress = 50% Videos + 50% Materials
  const overallCourseProgress = videoProgress + materialProgress;
  const isCompleted100Percent = overallCourseProgress === 100;

  const activeCourseTitle = courses[0]?.title || "Project Management Professional (PMP)";

  return (
    <div className="space-y-6 text-left">
      
      {/* Sleek Greeting Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-slate-800">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary/70 bg-primary/50/10 border border-primary/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {getTodayDateString()}
          </span>
          <h1 className="text-2xl font-black tracking-tight mt-1">
            Welcome back, {user?.name || 'Learner'}! 👋
          </h1>
          <p className="text-xs text-slate-300 font-medium max-w-xl">
            Track your course progress (50% Recorded Videos + 50% Study Materials) to automatically unlock your official certificate.
          </p>
        </div>
        
        <button 
          onClick={handleContinueLearning}
          className="shrink-0 flex items-center gap-1.5 py-3 px-6 bg-primary hover:bg-primary/50 text-white text-xs font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 self-start md:self-auto cursor-pointer"
        >
          Continue Learning
          <ArrowRight size={14} />
        </button>
      </div>

      {/* FULL-WIDTH PROGRAM DASHBOARD OVERVIEW (Live Coordinator Timetable Removed) */}
      <div className="w-full bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-6">
        
        {/* Header Title & Overall Progress Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <span className="text-[9px] font-black text-primary uppercase tracking-widest block">
              Active Enrolled Program Track
            </span>
            <h2 className="text-lg font-black text-slate-800 mt-0.5">
              {activeCourseTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-black px-3.5 py-1 rounded-xl uppercase border shadow-2xs ${
              isCompleted100Percent 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                : 'bg-indigo-50 text-indigo-600 border-indigo-200'
            }`}>
              {isCompleted100Percent ? '🏆 100% Completed' : `Course Progress: ${overallCourseProgress}%`}
            </span>
          </div>
        </div>

        {/* 50% VIDEO + 50% MATERIAL PROGRESS BREAKDOWN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50/70 border border-slate-100 p-5 rounded-2xl">
          
          {/* 1. Overall Combined Course Progress */}
          <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200/60 shadow-2xs">
            <div className="flex justify-between text-xs font-extrabold text-slate-800 select-none">
              <span className="flex items-center gap-1.5">
                <BookOpen size={14} className="text-primary" />
                Overall Course Progress
              </span>
              <span className="text-primary font-black">{overallCourseProgress}%</span>
            </div>
            <ProgressBar percentage={overallCourseProgress} color={isCompleted100Percent ? "bg-emerald-500" : "bg-primary"} height="h-2.5" />
            <span className="text-[9px] font-bold text-slate-400 block pt-0.5">
              50% Videos + 50% Materials = 100% Total
            </span>
          </div>

          {/* 2. Recorded Video Lectures (50% Max Weight) */}
          <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200/60 shadow-2xs">
            <div className="flex justify-between text-xs font-extrabold text-slate-800 select-none">
              <span className="flex items-center gap-1.5">
                <Play size={14} className="text-indigo-600" />
                1. Recorded Videos (50% Weight)
              </span>
              <span className="text-indigo-600 font-black">{videoProgress} / 50%</span>
            </div>
            <ProgressBar percentage={(videoProgress / 50) * 100} color="bg-indigo-600" height="h-2.5" />
            <span className="text-[9px] font-bold text-slate-400 block pt-0.5">
              Watched {watchedCount} of {totalVideos} Admin Videos
            </span>
          </div>

          {/* 3. Study Materials (50% Max Weight) */}
          <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200/60 shadow-2xs">
            <div className="flex justify-between text-xs font-extrabold text-slate-800 select-none">
              <span className="flex items-center gap-1.5">
                <FileText size={14} className="text-emerald-600" />
                2. Study Materials (50% Weight)
              </span>
              <span className="text-emerald-600 font-black">{materialProgress} / 50%</span>
            </div>
            <ProgressBar percentage={(materialProgress / 50) * 100} color="bg-emerald-500" height="h-2.5" />
            <span className="text-[9px] font-bold text-slate-400 block pt-0.5">
              Read {readCount} of {totalMaterials} Admin Materials
            </span>
          </div>

        </div>

        {/* Interactive 3-Milestone Track */}
        <div className="flex justify-between items-center relative select-none pt-2 max-w-2xl mx-auto w-full">
          <div className="absolute left-10 right-10 top-5 h-0.5 bg-slate-100 -z-0" />
          <div 
            className="absolute left-10 top-5 h-0.5 bg-primary -z-0 transition-all duration-500" 
            style={{ width: `${isCompleted100Percent ? '82%' : '41%'}` }}
          />
          
          {[
            { label: '1. Enrolled', done: true },
            { label: '2. Course Completion', done: isCompleted100Percent },
            { label: '3. Get Certificate', done: isCompleted100Percent, badge: true }
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center z-10 relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs border-2 shadow-xs transition-all ${
                step.done 
                  ? 'bg-primary border-indigo-600 text-white ring-4 ring-indigo-50' 
                  : 'bg-white border-slate-300 text-slate-400'
              }`}>
                {step.done ? '✓' : step.badge ? '🏆' : idx + 1}
              </div>
              <span className={`text-[11px] font-black mt-2 block ${step.done ? 'text-slate-800' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* AUTOMATIC CERTIFICATE UNLOCK CARD (UNLOCKED WHEN 50% VIDEOS + 50% MATERIALS = 100%) */}
      <div className={`p-6 rounded-2xl border transition-all duration-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 ${
        isCompleted100Percent 
          ? 'bg-gradient-to-r from-amber-500/10 via-amber-50 to-emerald-50 border-amber-300' 
          : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-3.5 rounded-2xl shrink-0 ${
            isCompleted100Percent ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-200 text-slate-400'
          }`}>
            {isCompleted100Percent ? <Award size={32} /> : <Lock size={32} />}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                isCompleted100Percent ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {isCompleted100Percent ? '✓ UNLOCKED & READY' : `🔒 LOCKED (${overallCourseProgress}% / 100%)`}
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                Course: {activeCourseTitle}
              </span>
            </div>

            <h3 className="text-base font-black text-slate-800">
              {isCompleted100Percent 
                ? 'Official Course Completion Certificate Unlocked!' 
                : 'Complete 50% Videos + 50% Materials to Unlock Certificate'}
            </h3>
            
            <p className="text-xs text-slate-500 font-medium max-w-xl leading-relaxed">
              {isCompleted100Percent
                ? `You have completed 100% of ${activeCourseTitle} (50% videos + 50% study materials). Enter your name to download your official accredited credential.`
                : `Complete all video lectures (50%) and study guides (50%) in ${activeCourseTitle} to reach 100% progress and automatically unlock your certificate.`}
            </p>
          </div>
        </div>

        {/* Certificate Claim Action */}
        <div className="shrink-0 w-full md:w-auto">
          {isCompleted100Percent ? (
            <button
              onClick={() => navigate('/lms/live-sessions?tab=certificate', { state: { activeTab: 'Get Certificate' } })}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer active:scale-95 animate-bounce"
            >
              <Award size={16} />
              Claim & Download Certificate
            </button>
          ) : (
            <button
              onClick={() => navigate('/lms/live-sessions')}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Complete Videos & Materials →
            </button>
          )}
        </div>
      </div>

      {/* Enrolled Courses Grid list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-800 text-sm">Enrolled Learning Modules</h3>
          <button 
            onClick={() => navigate('/lms/my-courses')} 
            className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            Manage Courses
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.slice(0, 4).map(course => (
            <div 
              key={course._id} 
              className="p-4 bg-white border border-slate-200/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0 text-left">
                <img 
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150'} 
                  alt={course.title}
                  className="w-14 h-11 rounded-lg object-cover border border-slate-100 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 text-xs truncate leading-snug">{course.title}</h4>
                  <span className="text-[9px] font-bold text-slate-400 block mt-1 uppercase tracking-wider">
                    {course.category} • Beginners to Expert
                  </span>
                </div>
              </div>

              <button 
                onClick={() => navigate(`/lms/course/${course.slug}/lesson/l101`)}
                className="py-1.5 px-3 bg-slate-100 hover:bg-primary hover:text-white border border-slate-200 text-slate-700 text-[10px] font-extrabold rounded-xl transition-all shrink-0 cursor-pointer"
              >
                Launch
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mock & Practice Test Quick Launcher Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 select-none">
        
        <div 
          onClick={() => navigate('/lms/mock-test')}
          className="p-5 bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex items-center gap-4 text-left"
        >
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl shrink-0">
            <CheckSquare size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs">Official Mock Exam Simulator</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Attempt full-length verified exam simulation papers.</p>
          </div>
        </div>

        <div 
          onClick={() => navigate('/lms/practice-test')}
          className="p-5 bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex items-center gap-4 text-left"
        >
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl shrink-0">
            <Target size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs">Topic-wise Practice Tests</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Focus on specific syllabus sections with interactive workbooks.</p>
          </div>
        </div>

      </div>

      {/* CERTIFICATE CLAIM & DOWNLOAD MODAL */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:absolute print:inset-0">
          <div className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl p-6 relative flex flex-col gap-6 text-left print:p-0 print:shadow-none print:w-full print:max-w-none print:rounded-none">
            
            {/* Modal Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4 print:hidden">
              <div className="space-y-1">
                <h3 className="font-black text-slate-800 text-sm">Download Official Completion Certificate</h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Course Name (Auto-fetched): <span className="text-primary font-bold">{selectedCertificate.courseTitle}</span>
                </p>
              </div>

              {/* Learner Name Input & Print Control */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="w-full sm:w-60">
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Learner Full Name</label>
                  <input
                    type="text"
                    value={certificateName}
                    onChange={(e) => setCertificateName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-primary font-bold text-slate-800"
                  />
                </div>

                <div className="flex gap-2 w-full sm:w-auto pt-4 sm:pt-0">
                  <button
                    onClick={handlePrintCertificate}
                    disabled={!certificateName.trim()}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <Printer size={14} />
                    Download / Print PDF
                  </button>
                  <button 
                    onClick={() => setSelectedCertificate(null)}
                    className="text-slate-400 hover:text-slate-700 p-2.5 rounded-full cursor-pointer hover:bg-slate-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* PRINTABLE DIPLOMA TEMPLATE */}
            <div 
              ref={certificateRef}
              id="print-area-wrapper" 
              className="border-[14px] border-slate-800 p-8 rounded-xl bg-slate-50 relative flex flex-col justify-between items-center min-h-[500px] text-center select-none print:border-[16px] print:m-0 print:p-10 print:h-screen print:w-screen"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <div className="absolute inset-2 border border-amber-600/35 pointer-events-none" />
              <div className="absolute inset-3 border border-amber-600/35 pointer-events-none" />

              <div className="space-y-3 pt-4">
                <span className="text-[10px] font-sans tracking-[0.3em] font-extrabold text-amber-700 uppercase">
                  LEARNERSKART EDUCATION ACCREDITATION
                </span>
                <h2 className="text-3xl font-bold tracking-wide text-slate-800">
                  CERTIFICATE OF COMPLETION
                </h2>
                <div className="w-16 h-0.5 bg-amber-600 mx-auto mt-2" />
              </div>

              <div className="space-y-4 my-6">
                <p className="text-xs italic text-slate-500 font-sans">
                  This credentials diploma hereby certifies that
                </p>
                <h3 className="text-2xl font-bold text-slate-900 border-b border-amber-600/40 pb-1 px-8 inline-block">
                  {certificateName || 'Learner Name'}
                </h3>
                <p className="text-xs italic text-slate-500 font-sans">
                  has successfully completed 100% of the accredited curriculum for
                </p>
                <h4 className="text-lg font-bold text-primary font-sans max-w-xl mx-auto">
                  {selectedCertificate.courseTitle}
                </h4>
              </div>

              <div className="w-full flex items-end justify-between px-8 pb-4 font-sans text-left">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">CREDENTIAL ID</span>
                  <span className="text-xs font-mono font-bold text-slate-700">{selectedCertificate.certificateId}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pt-1">DATE OF ISSUE</span>
                  <span className="text-xs font-bold text-slate-700">{selectedCertificate.completionDate}</span>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-14 h-14 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-300 shadow-sm">
                    <Award size={32} />
                  </div>
                  <span className="text-[8px] font-extrabold text-amber-700 tracking-widest uppercase block">OFFICIAL SEAL</span>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-serif italic text-sm font-bold text-slate-800 border-b border-slate-300 pb-1">
                    Dr. Alok Kumar
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">CHIEF ACADEMIC OFFICER</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
