import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { Search, SlidersHorizontal, BookOpen, Clock, Calendar, CheckSquare, Award, Globe, X } from 'lucide-react';
import toast from 'react-hot-toast';

const countriesList = [
  { code: 'IN', currency: 'INR', symbol: '₹', name: 'India' },
  { code: 'US', currency: 'USD', symbol: '$', name: 'United States' },
  { code: 'AE', currency: 'AED', symbol: 'AED ', name: 'United Arab Emirates' },
  { code: 'SA', currency: 'SAR', symbol: 'SR ', name: 'Saudi Arabia' },
  { code: 'GB', currency: 'GBP', symbol: '£', name: 'United Kingdom' },
  { code: 'CA', currency: 'CAD', symbol: 'C$', name: 'Canada' },
  { code: 'AU', currency: 'AUD', symbol: 'A$', name: 'Australia' },
  { code: 'QA', currency: 'QAR', symbol: 'QR ', name: 'Qatar' }
];

const coursePricingData = {
  course_pmp: {
    'Self Study': { inr: { standard: 6999, special: 4999 }, usd: { standard: 299, special: 199 } },
    'Live Online': { inr: { standard: 14999, special: 11999 }, usd: { standard: 899, special: 699 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1499, special: 1199 } }
  },
  course_capm: {
    'Self Study': { inr: { standard: 6999, special: 4999 }, usd: { standard: 299, special: 199 } },
    'Live Online': { inr: { standard: 14999, special: 11999 }, usd: { standard: 799, special: 599 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1299, special: 999 } }
  },
  course_prince2_foundation: {
    'Self Study': { inr: { standard: 8999, special: 6999 }, usd: { standard: 499, special: 299 } },
    'Live Online': { inr: { standard: 16999, special: 13999 }, usd: { standard: 999, special: 799 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1599, special: 1299 } }
  },
  course_prince2_practitioner: {
    'Self Study': { inr: { standard: 8999, special: 6999 }, usd: { standard: 499, special: 299 } },
    'Live Online': { inr: { standard: 16999, special: 13999 }, usd: { standard: 999, special: 799 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1599, special: 1299 } }
  },
  course_prince2_combo: {
    'Self Study': { inr: { standard: 12999, special: 9999 }, usd: { standard: 699, special: 499 } },
    'Live Online': { inr: { standard: 24999, special: 21999 }, usd: { standard: 1799, special: 1499 } },
    'E-Learning': { inr: { standard: 89999, special: 85999 }, usd: { standard: 2899, special: 2499 } }
  },
  course_pgmp: {
    'Self Study': { inr: { standard: 9999, special: 7999 }, usd: { standard: 699, special: 499 } },
    'Live Online': { inr: { standard: 35999, special: 32999 }, usd: { standard: 1799, special: 1499 } },
    'E-Learning': { inr: { standard: 89999, special: 85999 }, usd: { standard: 2899, special: 2499 } }
  },
  course_rmp: {
    'Self Study': { inr: { standard: 8999, special: 6999 }, usd: { standard: 499, special: 299 } },
    'Live Online': { inr: { standard: 24999, special: 22999 }, usd: { standard: 999, special: 799 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1599, special: 1299 } }
  },
  course_lss_combo: {
    'Self Study': { inr: { standard: 9999, special: 7999 }, usd: { standard: 599, special: 399 } },
    'Live Online': { inr: { standard: 19999, special: 16999 }, usd: { standard: 1099, special: 899 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1599, special: 1299 } }
  },
  course_lssyb: {
    'Self Study': { inr: { standard: 4999, special: 2999 }, usd: { standard: 199, special: 99 } },
    'Live Online': { inr: { standard: 9999, special: 6999 }, usd: { standard: 399, special: 299 } },
    'E-Learning': { inr: { standard: 34999, special: 31999 }, usd: { standard: 799, special: 599 } }
  },
  course_lssgb: {
    'Self Study': { inr: { standard: 6999, special: 4999 }, usd: { standard: 299, special: 199 } },
    'Live Online': { inr: { standard: 14999, special: 11999 }, usd: { standard: 799, special: 599 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1299, special: 999 } }
  },
  course_lssbb: {
    'Self Study': { inr: { standard: 8999, special: 6999 }, usd: { standard: 499, special: 299 } },
    'Live Online': { inr: { standard: 16999, special: 13999 }, usd: { standard: 999, special: 799 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1599, special: 1299 } }
  },
  course_ccba: {
    'Self Study': { inr: { standard: 7999, special: 5999 }, usd: { standard: 399, special: 249 } },
    'Live Online': { inr: { standard: 15999, special: 12999 }, usd: { standard: 899, special: 699 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1399, special: 1099 } }
  },
  course_ecba: {
    'Self Study': { inr: { standard: 6999, special: 4999 }, usd: { standard: 299, special: 199 } },
    'Live Online': { inr: { standard: 14999, special: 11999 }, usd: { standard: 799, special: 599 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1299, special: 999 } }
  },
  course_cbap: {
    'Self Study': { inr: { standard: 9999, special: 7999 }, usd: { standard: 599, special: 399 } },
    'Live Online': { inr: { standard: 19999, special: 16999 }, usd: { standard: 1099, special: 899 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1599, special: 1299 } }
  },
  course_acp: {
    'Self Study': { inr: { standard: 7999, special: 5999 }, usd: { standard: 399, special: 249 } },
    'Live Online': { inr: { standard: 15999, special: 12999 }, usd: { standard: 899, special: 699 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1399, special: 1099 } }
  },
  course_dm: {
    'Self Study': { inr: { standard: 5999, special: 3999 }, usd: { standard: 249, special: 149 } },
    'Live Online': { inr: { standard: 12999, special: 9999 }, usd: { standard: 699, special: 499 } },
    'E-Learning': { inr: { standard: 34999, special: 31999 }, usd: { standard: 799, special: 599 } }
  }
};


const seededRecordings = [
  { _id: 'mock_rec_1', course: { title: 'Project Management Professional (PMP)' } },
  { _id: 'mock_rec_2', course: { title: 'Lean Six Sigma Green Belt (LSSGB)' } },
  { _id: 'mock_rec_3', course: { title: 'Agile & Scrum Practitioner' } },
  { _id: 'mock_rec_4', course: { title: 'Project Management Professional (PMP)' } }
];

const baseMaterials = [
  { id: 'mat_pmp', tag: 'PMP Study Resource' },
  { id: 'mat_lss', tag: 'Six Sigma Calculator' },
  { id: 'mat_scrum', tag: 'Agile Slide Deck' },
  { id: 'mat_evm', tag: 'Formula Cheat Sheet' } // usually maps to PMP
];

const getDynamicProgress = (course) => {
  if (!course || !course.isEnrolled) return 0;
  if (course.isCompleted) return 100;

  try {
    const customVideosStr = localStorage.getItem('lk_custom_videos');
    const customMaterialsStr = localStorage.getItem('lk_custom_materials');
    const customVideos = customVideosStr ? JSON.parse(customVideosStr) : [];
    const customMaterials = customMaterialsStr ? JSON.parse(customMaterialsStr) : [];
    
    const watchedStr = localStorage.getItem('lk_watched_videos');
    const readStr = localStorage.getItem('lk_read_materials');
    const watched = watchedStr ? JSON.parse(watchedStr) : [];
    const read = readStr ? JSON.parse(readStr) : [];

    const allRecordings = [...seededRecordings, ...customVideos];
    const allMaterials = [...baseMaterials, ...customMaterials];

    const courseTitle = course.title || '';
    const courseVideos = allRecordings.filter(rec => (rec.course?.title || '').toLowerCase() === courseTitle.toLowerCase());
    const courseMats = allMaterials.filter(mat => {
      const tag = mat.tag.toLowerCase();
      if (courseTitle.includes('PMP') && (tag.includes('pmp') || tag.includes('formula'))) return true;
      if (courseTitle.includes('Six Sigma') && tag.includes('six sigma')) return true;
      if (courseTitle.includes('Agile') && tag.includes('agile')) return true;
      return false;
    });

    const totalAssets = courseVideos.length + courseMats.length;
    if (totalAssets === 0) return 0;

    const watchedCount = courseVideos.filter(v => watched.includes(v._id)).length;
    const readCount = courseMats.filter(m => read.includes(m.id)).length;
    
    return Math.round(((watchedCount + readCount) / totalAssets) * 100);
  } catch (e) {
    return 0;
  }
};

const getPricingKey = (course) => {
  if (!course) return null;
  const slug = (course.slug || '').toLowerCase();
  
  if (slug.includes('pmp') || slug.includes('project-management-professional')) return 'course_pmp';
  if (slug.includes('capm')) return 'course_capm';
  if (slug.includes('prince2') && slug.includes('combo')) return 'course_prince2_combo';
  if (slug.includes('prince2') && slug.includes('foundation')) return 'course_prince2_foundation';
  if (slug.includes('prince2') && (slug.includes('practitioner') || slug.includes('prac'))) return 'course_prince2_practitioner';
  if (slug.includes('pgmp') || slug.includes('program-management-professional')) return 'course_pgmp';
  if (slug.includes('rmp') || slug.includes('risk-management')) return 'course_rmp';
  if (slug.includes('lss') && slug.includes('combo')) return 'course_lss_combo';
  if (slug.includes('yellow') || slug.includes('lssyb')) return 'course_lssyb';
  if (slug.includes('green') || slug.includes('lssgb')) return 'course_lssgb';
  if (slug.includes('black') || slug.includes('lssbb')) return 'course_lssbb';
  if (slug.includes('ccba')) return 'course_ccba';
  if (slug.includes('ecba')) return 'course_ecba';
  if (slug.includes('cbap')) return 'course_cbap';
  if (slug.includes('acp') || slug.includes('agile-certified')) return 'course_acp';
  if (slug.includes('digital-marketing') || slug.includes('dm')) return 'course_dm';
  return null;
};

const getCalculatedPricing = (course, mode, selectedCountryCode, isOriginal = false) => {
  if (!course) return null;
  const finalId = getPricingKey(course);
  const courseData = coursePricingData[finalId];
  if (!courseData) return null;

  const lookupMode = mode === 'Training + Exam Prep' ? 'E-Learning' : mode;
  const modeData = courseData[lookupMode] || courseData['Live Online'];
  if (!modeData) return null;

  const isINR = selectedCountryCode === 'IN';
  const currencyKey = isINR ? 'inr' : 'usd';
  const priceTypeKey = isOriginal ? 'standard' : 'special';

  const basePrice = modeData[currencyKey][priceTypeKey];
  if (basePrice === null) return null;

  if (isINR) {
    return basePrice;
  } else {
    const prices = {
      US: basePrice,
      AE: Math.round(basePrice * 3.67),
      SA: Math.round(basePrice * 3.75),
      GB: Math.round(basePrice * 0.8),
      CA: Math.round(basePrice * 1.35),
      AU: Math.round(basePrice * 1.5),
      QA: Math.round(basePrice * 3.64)
    };
    return prices[selectedCountryCode] || Math.round(basePrice / 0.012);
  }
};

export default function MyCoursesPage() {
  const [detailsModalSlug, setDetailsModalSlug] = useState(null);

  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('All'); // All, Active, Completed
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countriesList[0]);

  // Sync country selection from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem('lk_selected_country');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const found = countriesList.find(c => c.code === parsed.code);
        if (found) setSelectedCountry(found);
      } catch (e) {}
    }
  }, []);

  const handleCountryChange = (c) => {
    setSelectedCountry(c);
    localStorage.setItem('lk_selected_country', JSON.stringify(c));
    toast.success(`Country pricing updated to ${c.name}`);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Fetch all courses and user enrollments in parallel
        const [coursesRes, enrollRes] = await Promise.all([
          api.get('/courses?limit=1000'),
          api.get('/enrollments/me')
        ]);

        let allFetched = [];
        if (coursesRes.data.success) {
          allFetched = coursesRes.data.courses;
        }

        let enrolledList = [];
        if (enrollRes.data.success) {
          enrolledList = enrollRes.data.enrollments;
        }

        const enrolledMap = new Map();
        enrolledList.forEach(e => {
          if (e.course) {
            enrolledMap.set(e.course._id || e.course.id, e);
          }
        });

        const combined = allFetched.map(c => {
          const e = enrolledMap.get(c._id || c.id);
          return {
            ...c,
            isEnrolled: !!e,
            isCompleted: e ? e.isCompleted : false,
            completedAt: e ? e.completedAt : null,
            enrolledAt: e ? e.enrolledAt : null,
            progress: e ? (e.progress || 0) : 0
          };
        });

        setCourses(combined);
        setFilteredCourses(combined);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter and search courses list
  useEffect(() => {
    let result = [...courses];

    // Filter by Active Tab
    if (activeTab === 'Active') {
      result = result.filter(c => c.isEnrolled && !c.isCompleted);
    } else if (activeTab === 'Completed') {
      result = result.filter(c => c.isEnrolled && c.isCompleted);
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(result);
  }, [courses, activeTab, searchTerm]);

  // Circular progress ring helper
  const CircularProgress = ({ percentage, size = 42 }) => {
    const strokeWidth = 3.5;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center select-none">
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            className="text-slate-100"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="text-primary transition-all duration-500 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <span className="absolute text-[10px] font-black text-slate-800">{percentage}%</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 text-left">

      {/* Course Details Modal (IFrame) */}
      {detailsModalSlug && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 flex items-center justify-center p-2 sm:p-6 backdrop-blur-sm">
          <div className="bg-white w-full max-w-7xl h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn relative">
            <div className="flex justify-between items-center p-3 sm:p-4 border-b border-slate-100 shrink-0 bg-white">
              <h3 className="font-black text-sm sm:text-lg text-slate-800">Course Details Overview</h3>
              <button onClick={() => setDetailsModalSlug(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 w-full bg-slate-50 overflow-hidden relative">
              <iframe 
                src={`${window.location.hostname === 'localhost' ? 'http://localhost:5173' : 'https://learnerskart.com'}/${detailsModalSlug}?hideNav=true`} 
                className="w-full h-full border-none"
                title="Course Details"
              />
            </div>
          </div>
        </div>
      )}

      
      {/* Title with Country Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Program Programs Catalog</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Review and coordinate your LearnersKart professional learning tracks, assessments and progress stats.
          </p>
        </div>

        {/* Country Selector */}
        <div className="relative shrink-0 select-none">
          <label className="text-[9px] font-black text-slate-400 block uppercase tracking-wider mb-1 text-left">
            Select Country pricing
          </label>
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/60 p-2 rounded-xl shadow-sm">
            <Globe size={14} className="text-slate-400" />
            <select
              value={JSON.stringify(selectedCountry)}
              onChange={(e) => handleCountryChange(JSON.parse(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-700 border-none outline-none pr-6 cursor-pointer"
            >
              {countriesList.map((c) => (
                <option key={c.code} value={JSON.stringify(c)}>
                  {c.name} ({c.currency})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter and Search Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white border border-slate-200/60 p-4 rounded-2xl shadow-sm select-none">
        
        {/* Navigation tabs */}
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
          {['All', 'Active', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-1.5 px-4 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab
                  ? 'bg-white text-primary shadow-sm border border-slate-200/20'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search tool */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl w-full md:w-72">
          <Search size={13} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs w-full outline-none text-slate-700"
          />
        </div>
      </div>

      {/* Grid of Program Card list */}
      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 bg-white border border-slate-200/60 rounded-2xl text-center text-slate-400 shadow-sm">
          <BookOpen size={48} className="mx-auto mb-2 text-slate-300" />
          <p className="text-xs font-semibold">No programs found matching the filter criteria.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredCourses.map((course, idx) => {
            // Simulated progress and metrics dynamically
            const completionPercent = getDynamicProgress(course);
            const modulesCount = course.modules?.length || 2;
            const lessonsCount = course.totalLessons || 6;
            const testsCount = course.slug.includes('six') || course.slug.includes('black') ? 3 : 2;

            // Get country-based course price standard Standard Mode 'Live Online'
            const calculatedPrice = getCalculatedPricing(course, 'Live Online', selectedCountry.code, false);
            const currencySymbol = selectedCountry.symbol;

            return (
              <div 
                key={course._id}
                className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-6 items-stretch"
              >
                {/* Left side: Panel Image */}
                <div className="w-full md:w-80 lg:w-96 shrink-0 relative overflow-hidden rounded-xl bg-slate-50 border border-slate-100 aspect-[3/2] flex items-center justify-center">
                  <img 
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'} 
                    alt={course.title}
                    className="w-full h-full object-cover shadow-sm hover:scale-102 transition-transform duration-300"
                  />
                </div>

                {/* Right side: Course Details */}
                <div className="flex-1 flex flex-col justify-between py-1 text-left space-y-4">
                  {/* Top: Category & Title */}
                  <div className="space-y-1.5">
                    <span className="inline-block text-[9px] font-black text-primary bg-primary/5 border border-primary/20 px-2.5 py-0.5 rounded uppercase tracking-wide">
                      {course.category}
                    </span>
                    <h3 className="font-extrabold text-slate-800 text-sm sm:text-base lg:text-lg tracking-tight leading-snug">
                      {course.title}
                    </h3>
                  </div>

                  {/* Middle: Stats Row & Circular Progress */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y border-slate-100 py-3.5 select-none">
                    {/* Stats List */}
                    <div className="flex items-center gap-6 text-slate-400">
                      <div className="text-left">
                        <span className="text-[9px] font-bold block uppercase tracking-wider text-slate-400">Modules</span>
                        <span className="text-xs font-black text-slate-700 mt-0.5 block">{modulesCount} Units</span>
                      </div>
                      <div className="text-left border-l border-slate-100 pl-6">
                        <span className="text-[9px] font-bold block uppercase tracking-wider text-slate-400">Lessons</span>
                        <span className="text-xs font-black text-slate-700 mt-0.5 block">{lessonsCount} Lectures</span>
                      </div>

                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-3 self-start sm:self-center">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Progress</span>
                      <CircularProgress percentage={completionPercent} size={48} />
                    </div>
                  </div>

                  {/* Bottom: Badges and Action buttons */}
                  <div className="flex items-center justify-between gap-4 pt-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block text-[9px] font-bold px-2.5 py-0.5 rounded-full ${
                        !course.isEnrolled
                          ? 'bg-slate-100 text-slate-500 border border-slate-200'
                          : completionPercent === 100 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-primary/5 text-primary border border-primary/20'
                      }`}>
                        {!course.isEnrolled 
                          ? '🛒 Available'
                          : completionPercent === 100 ? '✅ Certified Program' : '⏳ Active Program'}
                      </span>

                      {!course.isEnrolled && calculatedPrice && (
                        <span className="text-[10px] font-extrabold text-slate-800 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full">
                          {currencySymbol}{calculatedPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDetailsModalSlug(course.slug)}
                        className="py-2 px-4 bg-accent hover:bg-accent-dark text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        View Details
                      </button>
                      
                      {course.isEnrolled && (
                        <button 
                          onClick={() => navigate(`/lms/course/${course.slug}/lesson/l101`)}
                          className="py-2 px-5 bg-primary hover:bg-primary-dark text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                          Launch Course Player
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
