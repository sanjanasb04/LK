import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, Calendar, Users, ShieldCheck, Video, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    certificates: 0,
    upcomingBatches: 0
  });
  const [enrollments, setEnrollments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/user/dashboard');
        if (res.data.success) {
          setStats(res.data.stats);
          setEnrollments(res.data.enrollments);
          setSchedules(res.data.schedules);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleDownloadCertificate = (courseTitle) => {
    alert(`Downloading accredited certificate for: ${courseTitle}`);
  };

  const handleProgressChange = async (courseId, newProgress) => {
    try {
      const res = await api.put('/user/progress', {
        courseId,
        progress: newProgress
      });
      if (res.data.success) {
        // Update local enrollments state
        setEnrollments(prev => prev.map(enr => {
          if (enr.course?._id === courseId) {
            const updated = res.data.enrollment;
            return {
              ...enr,
              progress: updated.progress,
              status: updated.status,
              completedAt: updated.completedAt
            };
          }
          return enr;
        }));
        
        // Recalculate stats completedCount reactively
        setEnrollments(currentEnrollments => {
          const updatedEnrollments = currentEnrollments.map(enr => {
            if (enr.course?._id === courseId) {
              return { ...enr, status: parseInt(newProgress, 10) === 100 ? 'Completed' : 'In Progress' };
            }
            return enr;
          });
          const completedCount = updatedEnrollments.filter(e => e.status === 'Completed').length;
          setStats(prev => ({
            ...prev,
            completedCourses: completedCount,
            certificates: completedCount
          }));
          return currentEnrollments;
        });
      }
    } catch (err) {
      console.error('Failed to update mock progress:', err);
    }
  };

  const handleJoinClass = async (slug) => {
    // Find matching course enrollment
    const match = enrollments.find(e => e.course?.slug === slug);
    if (match && match.progress === 0) {
      // Automatically advance progress to 25% (simulating starting the class)
      await handleProgressChange(match.course?._id, 25);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT: Sidebar navigation */}
          <DashboardSidebar />

          {/* RIGHT: Main Dashboard Content Area */}
          <main className="flex-grow space-y-8 w-full">
            
            {/* Welcome Banner */}
            <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-light/40 via-transparent to-transparent -z-10"></div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-extrabold">Welcome Back, {user?.name}!</h2>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-tight">
                  Track your learning progress, join upcoming live cohorts, and manage your professional certifications.
                </p>
              </div>
              <Link
                to="/courses"
                className="bg-accent hover:bg-accent-dark text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition-all active:scale-95 whitespace-nowrap self-start sm:self-auto"
              >
                Browse New Courses
              </Link>
            </div>

            {/* Stats Row */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-white border border-slate-100 rounded-xl p-5 h-24"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stat 1 */}
                <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-primary rounded-lg hidden sm:block">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-primary">{stats.enrolledCourses}</p>
                    <p className="text-[10px] text-textmuted font-bold uppercase tracking-wider mt-0.5">Enrolled</p>
                  </div>
                </div>
                {/* Stat 2 */}
                <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-success rounded-lg hidden sm:block">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-success">{stats.completedCourses}</p>
                    <p className="text-[10px] text-textmuted font-bold uppercase tracking-wider mt-0.5">Completed</p>
                  </div>
                </div>
                {/* Stat 3 */}
                <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-violet-50 text-violet-600 rounded-lg hidden sm:block">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-violet-600">{stats.certificates}</p>
                    <p className="text-[10px] text-textmuted font-bold uppercase tracking-wider mt-0.5">Certificates</p>
                  </div>
                </div>
                {/* Stat 4 */}
                <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-accent-dark rounded-lg hidden sm:block">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-accent-dark">{stats.upcomingBatches}</p>
                    <p className="text-[10px] text-textmuted font-bold uppercase tracking-wider mt-0.5">Live Batches</p>
                  </div>
                </div>
              </div>
            )}

            {/* Enrolled Courses Progress Grid */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-textdark uppercase tracking-wider">
                My Course Progress
              </h3>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                  <div className="bg-white rounded-xl border p-5 h-32"></div>
                  <div className="bg-white rounded-xl border p-5 h-32"></div>
                </div>
              ) : enrollments.length === 0 ? (
                <div className="bg-white border border-slate-100 shadow-sm rounded-xl py-12 px-6 text-center">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-lg text-textdark">No enrollments found</h4>
                  <p className="text-xs text-textmuted mt-1 max-w-sm mx-auto">
                    You haven't enrolled in any courses yet. Explore our top certifications and get started today!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrollments.map((enr) => (
                    <div
                      key={enr._id}
                      className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow transition-shadow flex gap-4 text-xs font-semibold"
                    >
                      <img
                        src={enr.course?.thumbnail}
                        alt={enr.course?.title}
                        className="w-16 h-16 rounded-lg object-cover bg-slate-100 border flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-grow space-y-2 text-left min-w-0">
                        <h4 className="font-bold text-sm text-textdark leading-tight line-clamp-1">
                          {enr.course?.title}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                          <span>Status: <strong className="text-primary">{enr.status}</strong></span>
                          <span>{enr.progress}%</span>
                        </div>
                        {/* Progress bar */}
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden border">
                          <div className="h-full bg-primary" style={{ width: `${enr.progress}%` }}></div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 flex items-center justify-between">
                          <Link
                            to={`/${enr.course?.slug}`}
                            className="text-primary hover:underline text-[10px] font-extrabold flex items-center gap-0.5"
                          >
                            Course Syllabus &rarr;
                          </Link>
                          {enr.status === 'Completed' && (
                            <button
                              onClick={() => handleDownloadCertificate(enr.course?.title)}
                              className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-success text-[10px] font-extrabold px-2.5 py-1 rounded shadow-sm transition-all"
                            >
                              Get Certificate
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>



          </main>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
