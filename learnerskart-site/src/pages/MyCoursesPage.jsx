import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';

const MyCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await api.get('/user/enrollments');
        if (res.data.success) {
          setEnrollments(res.data.enrollments);
        }
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const handleDownloadCertificate = (courseTitle) => {
    alert(`Downloading accredited certificate of completion for: ${courseTitle}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-success border border-emerald-200/50';
      case 'In Progress':
        return 'bg-blue-50 text-primary border border-blue-200/50';
      default:
        return 'bg-slate-100 text-slate-500 border border-slate-200/50';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Sidebar */}
          <DashboardSidebar />

          {/* Right Panel */}
          <main className="flex-grow space-y-6 w-full">
            <div className="border-b border-slate-200/60 pb-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-textdark">My Enrolled Courses</h2>
              <p className="text-xs text-textmuted mt-1.5 font-semibold">
                Access your course curriculum materials and download your certificates.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[1, 2].map((n) => (
                  <div key={n} className="bg-white border rounded-xl p-5 h-44"></div>
                ))}
              </div>
            ) : enrollments.length === 0 ? (
              <div className="bg-white border border-slate-100 shadow-md rounded-2xl py-20 px-6 text-center">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="font-extrabold text-xl text-textdark">No Courses Registered</h3>
                <p className="text-sm text-textmuted mt-2.5 max-w-sm mx-auto leading-relaxed">
                  You are not enrolled in any professional certification programs yet. Start learning and certify yourself today!
                </p>
                <Link
                  to="/courses"
                  className="inline-block bg-primary text-white font-bold text-xs px-6 py-3 rounded-lg mt-6 shadow"
                >
                  Explore Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollments.map((enr) => (
                  <div
                    key={enr._id}
                    className="bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden hover:shadow transition-shadow flex flex-col justify-between"
                  >
                    {/* Upper Card Grid */}
                    <div className="p-5 flex gap-4 text-xs font-semibold items-start">
                      <img
                        src={enr.course?.thumbnail}
                        alt={enr.course?.title}
                        className="w-16 h-16 rounded-lg object-cover bg-slate-100 border flex-shrink-0"
                      />
                      <div className="space-y-2 text-left flex-grow min-w-0">
                        <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider ${getStatusBadge(enr.status)}`}>
                          {enr.status}
                        </span>
                        <h4 className="font-bold text-sm sm:text-base text-textdark leading-tight line-clamp-1 pt-1">
                          {enr.course?.title}
                        </h4>
                        <p className="text-[10px] text-textmuted leading-tight">Category: {enr.course?.category}</p>
                      </div>
                    </div>

                    {/* Progress Bar Area */}
                    <div className="px-5 pb-5 space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                        <span>Course Progress</span>
                        <span>{enr.progress}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border">
                        <div className="h-full bg-primary" style={{ width: `${enr.progress}%` }}></div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                      <Link
                        to={`/${enr.course?.slug}`}
                        className="text-primary hover:text-accent flex items-center gap-1 transition-colors"
                      >
                        <BookOpen className="w-4 h-4" />
                        Enter Classroom
                      </Link>
                      
                      {enr.status === 'Completed' ? (
                        <button
                          onClick={() => handleDownloadCertificate(enr.course?.title)}
                          className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-success px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 transition-colors"
                        >
                          <Award className="w-4 h-4" />
                          Get Certificate
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-400 font-medium text-[10px]">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Complete syllabus to unlock</span>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </main>
        </div>

      </div>
    </div>
  );
};

export default MyCoursesPage;
