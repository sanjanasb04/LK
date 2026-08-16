import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import api from '../../utils/api';
import CourseCard from '../ui/CourseCard';

const CoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const tabs = [
    'All',
    'Project Management',
    'Quality Management',
    'Business Analysis',
    'Agile',
    'DevOps',
    'SAFe'
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const categoryParam = activeTab === 'All' ? 'All' : activeTab;
        const res = await api.get(`/courses?category=${encodeURIComponent(categoryParam)}&limit=6`);
        if (res.data.success) {
          setCourses(res.data.courses);
        }
      } catch (error) {
        console.error('Error fetching home courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [activeTab]);

  return (
    <section className="py-20 bg-slate-50 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 text-left md:text-center">
          <span className="text-accent text-xs font-extrabold uppercase tracking-widest leading-none">Our Courses</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-textdark mt-2.5 leading-tight">
            Explore Top Certification Programs
          </h2>
          <p className="text-sm text-textmuted mt-2 leading-relaxed">
            Gain industry-recognized credentials with expert-led training courses tailored to help you succeed in today's competitive job market.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white text-textdark border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Courses Grid (4 Top Featured Courses Only) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4 animate-pulse">
                <div className="bg-slate-200 rounded-lg aspect-video w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-10 bg-slate-200 rounded-lg w-full"></div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-xl shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-textdark">No courses found</h3>
            <p className="text-sm text-textmuted mt-1">We are adding new programs to this category soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.slice(0, 4).map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-7 py-3.5 rounded-lg shadow-md transition-all group text-sm"
          >
            View All Courses
            <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default CoursesSection;
