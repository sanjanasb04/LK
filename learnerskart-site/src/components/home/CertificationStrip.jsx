import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Clock, ArrowRight, FileText } from 'lucide-react';
import api from '../../utils/api';

const CertificationStrip = () => {
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('Project Management');
  const [loading, setLoading] = useState(true);

  const tabs = ['Project Management', 'Quality Management', 'Business Analysis', 'Agile'];

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/courses?category=${encodeURIComponent(activeTab)}&limit=10`);
        if (res.data.success) {
          setCourses(res.data.courses);
        }
      } catch (error) {
        console.error('Error fetching certification strip:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [activeTab]);

  return (
    <section className="py-16 bg-white select-none border-b border-slate-100 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8">
          <span className="text-accent text-xs font-extrabold uppercase tracking-widest leading-none">Global Certifications</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-textdark mt-1.5 leading-tight">
            Accredited Certification Tracks
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-slate-100 mb-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-textmuted hover:text-textdark'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Horizontal Scroll Cards Container */}
        {loading ? (
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-50 rounded-xl border border-slate-100 p-4 w-72 min-w-[288px] h-40 animate-pulse space-y-3">
                <div className="flex gap-3">
                  <div className="bg-slate-200 rounded w-14 h-14"></div>
                  <div className="flex-grow space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="h-8 bg-slate-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 border border-slate-100 rounded-xl">
            <p className="text-xs text-textmuted font-semibold">No certification programs found in this category.</p>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar snap-x">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 w-80 min-w-[320px] hover:shadow-md transition-shadow flex flex-col justify-between snap-start"
              >
                {/* Upper row: Thumbnail & Title */}
                <div className="flex gap-3 items-start">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-14 h-14 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-textdark line-clamp-2 leading-tight">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-textmuted font-semibold">
                      <div className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration || '16 Hrs'}</span>
                      </div>
                      <span>•</span>
                      <span className="text-success font-bold">
                        {course.isFree ? 'Free' : 'Start from ₹' + (course.price * 0.2).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Actions */}
                <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-4 text-[11px] font-bold">
                  <Link
                    to={`/${course.slug}`}
                    className="text-primary hover:text-accent flex items-center gap-1 transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" />
                    View Certification
                  </Link>
                  <Link
                    to={`/${course.slug}#curriculum`}
                    className="text-textmuted hover:text-accent flex items-center gap-1 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View Curriculum
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default CertificationStrip;
