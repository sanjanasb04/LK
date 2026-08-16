import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, BookOpen, X, ChevronLeft, ChevronRight, Grid, List, Users, Clock, ArrowRight, ShoppingBag, Star } from 'lucide-react';
import api from '../utils/api';
import Breadcrumb from '../components/ui/Breadcrumb';
import CourseCard from '../components/ui/CourseCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const parseBatchStartDate = (dateStr) => {
  if (!dateStr) return new Date(0);
  try {
    const yearMatch = dateStr.match(/\b(202\d)\b/);
    const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
    
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const words = dateStr.toLowerCase().split(/[\s,\-\&]+/);
    let monthIndex = -1;
    let day = 1;
    
    for (let word of words) {
      const mIdx = monthNames.findIndex(m => word.startsWith(m));
      if (mIdx !== -1) {
        monthIndex = mIdx;
        break;
      }
    }
    
    if (monthIndex === -1) return new Date(0);
    
    const dayMatch = dateStr.match(/\b\d+\b/);
    if (dayMatch) {
      day = parseInt(dayMatch[0]);
    }
    
    return new Date(year, monthIndex, day);
  } catch (e) {
    console.error('Error parsing batch date:', e);
    return new Date(0);
  }
};

const CourseListRow = ({ course, formatPrice, addToCart, cartItems, schedules }) => {
  const { user } = useAuth();
  const [showAllBatches, setShowAllBatches] = useState(false);
  const isAlreadyInCart = cartItems.some(item => item._id === course._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const batchLabel = nextBatch ? `${nextBatch.date} (${nextBatch.weekday ? 'weekday batch' : 'weekend batch'})` : '';
    addToCart(course, 'Live Online', batchLabel);
    window.location.href = '/checkout';
  };

  const getCourseDurationDays = (course) => {
    if (!course) return 4;
    const s = course.slug || '';
    if (s.includes('capm')) return 3;
    if (s.includes('prince2-foundation')) return 2;
    if (s.includes('prince2-practitioner')) return 2;
    if (s.includes('prince2') || s.includes('f-p')) return 4;
    if (s.includes('pgmp')) return 3;
    if (s.includes('rmp')) return 3;
    if (s.includes('lssgb-lssbb') || s.includes('black-belt-combo')) return 4;
    if (s.includes('yellow-belt') || s.includes('lssyb')) return 1;
    if (s.includes('green-belt') || s.includes('lssgb')) return 3;
    if (s.includes('black-belt') || s.includes('lssbb')) return 3;
    if (s.includes('ccba')) return 3;
    if (s.includes('ecba')) return 3;
    if (s.includes('cbap')) return 4;
    if (s.includes('pmi-acp')) return 3;
    if (s.includes('digital-marketing')) return 10;
    return 4;
  };

  const daysCount = getCourseDurationDays(course);
  
  // Find next upcoming batch date (ignoring past dates)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureSchedules = (schedules || []).filter(batch => {
    const batchStart = parseBatchStartDate(batch.date);
    return batchStart >= today;
  });

  const sortedSchedules = [...futureSchedules].sort((a, b) => {
    if (a.month !== b.month) return a.month - b.month;
    if (a.weekday && !b.weekday) return -1;
    if (!a.weekday && b.weekday) return 1;
    return 0;
  });

  // Fallback: If all batches in DB are in the past, show all batches sorted
  const activeSchedules = sortedSchedules.length > 0 
    ? sortedSchedules 
    : [...(schedules || [])].sort((a, b) => {
        if (a.month !== b.month) return a.month - b.month;
        if (a.weekday && !b.weekday) return -1;
        if (!a.weekday && b.weekday) return 1;
        return 0;
      });

  const nextBatch = activeSchedules[0];

  const { getCalculatedPricing, selectedCountry } = useCart();
  const countryCode = selectedCountry?.code || 'IN';
  const customPriceVal = getCalculatedPricing(course._id, 'Live Online', countryCode, false);
  const customOriginalPriceVal = getCalculatedPricing(course._id, 'Live Online', countryCode, true);

  const displayedPrice = customPriceVal !== null 
    ? customPriceVal 
    : (nextBatch && nextBatch.weekday ? Math.round(course.price * 0.8) : course.price);

  const displayedOriginalPrice = customOriginalPriceVal !== null
    ? customOriginalPriceVal
    : (nextBatch && nextBatch.weekday ? course.price : course.originalPrice);

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col sm:flex-row gap-5 items-stretch shadow-sm hover:shadow-md hover:border-slate-200/60 transition-all duration-200 text-left relative group">
      {/* Thumbnail */}
      <Link to={`/${course.slug}`} className="w-full sm:w-56 h-36 flex-shrink-0 relative overflow-hidden rounded-lg bg-slate-100 border border-slate-100 block">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
          alt={course.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';
          }}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
          loading="lazy"
        />
      </Link>

      {/* Details */}
      <div className="flex-grow flex flex-col justify-between py-0.5">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(course.rating || 4.8)
                      ? 'fill-amber-400 stroke-amber-400'
                      : 'stroke-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-extrabold text-slate-600 pl-1">
              {course.rating || 4.8} ({course.reviewCount || 25} reviews)
            </span>
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-base sm:text-lg text-textdark leading-snug group-hover:text-primary transition-colors">
            <Link to={`/${course.slug}`}>{course.title}</Link>
          </h3>

          {/* Short description */}
          <p className="text-xs text-textmuted mt-2 line-clamp-2 leading-relaxed max-w-xl font-medium">
            {course.shortDescription || course.description}
          </p>

          {/* Next Batch & Days Count Box */}
          {nextBatch && (
            <div className="mt-3.5 max-w-xl">
              <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-3 flex flex-wrap gap-4 items-center justify-between text-xs text-slate-600 font-semibold shadow-inner">
                <div className="flex items-center gap-2">
                  <span className="text-primary text-sm">📅</span>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-black leading-none mb-1">Upcoming Date</span>
                    <span className="text-textdark font-extrabold">{nextBatch.date}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                    <span className="text-primary text-sm">⏳</span>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-black leading-none mb-1">Days Count</span>
                      <span className="text-textdark font-extrabold">{daysCount} Days ({nextBatch.weekday ? 'weekday' : 'weekend'})</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowAllBatches(!showAllBatches);
                    }}
                    className="text-[10px] font-black text-primary hover:text-primary-dark underline pl-3 border-l border-slate-200"
                  >
                    {showAllBatches ? 'Hide Dates' : 'Show All'}
                  </button>
                </div>
              </div>

              {/* Expanded schedules list */}
              {showAllBatches && activeSchedules.length > 0 && (
                <div className="mt-3 bg-white border border-slate-100 rounded-xl p-4 space-y-3 shadow-md max-w-xl transition-all duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none">
                      All Upcoming 2026 Batches
                    </p>
                    <span className="text-[9px] bg-primary/5 text-primary font-bold px-1.5 py-0.5 rounded">
                      {activeSchedules.length} Cohorts
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] max-h-48 overflow-y-auto no-scrollbar">
                    {activeSchedules.map((batch, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                        <div>
                          <span className="font-extrabold text-textdark block leading-snug">{batch.date}</span>
                          <span className={`text-[8px] font-black uppercase mt-0.5 inline-block ${
                            batch.weekday ? 'text-blue-500' : 'text-emerald-500'
                          }`}>
                            {batch.weekday ? 'weekday batch' : 'weekend batch'}
                          </span>
                        </div>
                        <Link
                          to={`/${course.slug}?tab=Schedule`}
                          className="text-[9px] font-black bg-primary text-white hover:bg-primary-dark px-2.5 py-1.5 rounded-md transition-all uppercase shadow-sm"
                        >
                          Enroll
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Meta Stats */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-semibold pt-3 border-t border-slate-100 mt-3 sm:mt-0">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>{course.students}+ Students</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span>{course.lessons?.length || 8} Lessons</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{course.duration || '16 Hrs'}</span>
          </div>
        </div>
      </div>

      {/* Pricing & Call-to-Action */}
      <div className="w-full sm:w-44 flex-shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 sm:border-l sm:border-slate-100 sm:pl-5">
        {/* Price */}
        <div className="text-left sm:text-right">
          {course.isFree || displayedPrice === 0 ? (
            <span className="text-xl font-black text-success uppercase tracking-wide">Free</span>
          ) : (
            <div className="flex flex-col items-start sm:items-end">
              <span className="text-xl font-black text-primary">
                {formatPrice(displayedPrice)}
              </span>
              {displayedOriginalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(displayedOriginalPrice)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {!course.isFree && displayedPrice > 0 && (
            <button
              onClick={handleAddToCart}
              disabled={isAlreadyInCart}
              className={`p-2.5 rounded-lg border transition-all ${
                isAlreadyInCart
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-slate-50 text-primary border-primary/20 hover:bg-primary hover:text-white hover:border-primary'
              }`}
              title={isAlreadyInCart ? 'Already in Cart' : 'Add to Cart'}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
          <Link
            to={`/${course.slug}`}
            className="flex-grow sm:flex-grow-0 bg-accent hover:bg-accent-dark text-white font-bold px-4 py-2.5 rounded-lg text-xs transition-all shadow-sm hover:shadow flex items-center justify-center gap-1"
          >
            Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');
  const initialSearch = searchParams.get('search');

  // Filter States
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? [initialCategory] : []
  );
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [priceFilter, setPriceFilter] = useState('All'); // 'All', 'Free', 'Paid'
  const [maxPrice, setMaxPrice] = useState(40000);
  const [sortBy, setSortBy] = useState('Option-Wise (Grouped)');
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const { formatPrice, addToCart, cartItems } = useCart();
  const [layoutMode, setLayoutMode] = useState('list'); // 'list' or 'grid'
  const [allSchedules, setAllSchedules] = useState([]);

  useEffect(() => {
    const fetchAllSchedules = async () => {
      try {
        const res = await api.get('/schedules');
        if (res.data.success) {
          setAllSchedules(res.data.schedules);
        }
      } catch (err) {
        console.error('Failed to fetch schedules:', err);
      }
    };
    fetchAllSchedules();
  }, []);

  // Categories list matching mega menu
  const categories = [
    'Project Management',
    'Quality Management',
    'Business Analysis',
    'Agile',
    'DevOps',
    'SAFe',
    'Digital Marketing',
    'Service Management',
  ];

  const levels = ['Beginner', 'Intermediate', 'Expert'];

  const sortOptions = [
    'Option-Wise (Grouped)',
    'Newly Published',
    'Title A-Z',
    'Title Z-A',
    'Price High→Low',
    'Price Low→High',
    'Popular',
    'Average Rating',
  ];

  // Fetch courses whenever filters or page changes
  useEffect(() => {
    const fetchFilteredCourses = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const params = new URLSearchParams();
        
        // Pagination (4 courses per page)
        params.append('page', currentPage);
        params.append('limit', 4);

        // Search
        if (searchQuery) params.append('search', searchQuery);

        // Category
        if (selectedCategories.length > 0) {
          params.append('category', selectedCategories.join(','));
        }

        // Level
        if (selectedLevels.length > 0) {
          params.append('level', selectedLevels.join(','));
        }

        // Price — only send if explicitly filtered
        if (priceFilter === 'Free') {
          params.append('price', 'Free');
        } else if (priceFilter === 'Paid') {
          params.append('price', `1-${maxPrice}`);
        }
        // 'All' = no price param sent (backend returns everything)

        // Sort
        params.append('sort', sortBy);

        const res = await api.get(`/courses?${params.toString()}`);
        if (res.data.success) {
          setCourses(res.data.courses);
          setTotalCourses(res.data.total);
          setTotalPages(res.data.pages);
        }
      } catch (error) {
        console.error('Error fetching filtered courses — falling back to static data:', error);
        // Fallback: use static seed data so page never shows 0 courses
        const { initialCourses } = await import('../data/courses.js');
        let fallback = [...initialCourses];
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          fallback = fallback.filter(c => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
        }
        if (selectedCategories.length > 0) {
          fallback = fallback.filter(c => selectedCategories.includes(c.category));
        }
        if (selectedLevels.length > 0) {
          fallback = fallback.filter(c => selectedLevels.includes(c.level));
        }
        const slicedFallback = fallback.slice((currentPage - 1) * 4, currentPage * 4);
        setCourses(slicedFallback);
        setTotalCourses(fallback.length);
        setTotalPages(Math.ceil(fallback.length / 4));

      } finally {
        setLoading(false);
      }
    };

    fetchFilteredCourses();
  }, [currentPage, searchQuery, selectedCategories, selectedLevels, priceFilter, maxPrice, sortBy]);

  // Sync category and search from URL params if they change externally
  useEffect(() => {
    const cat = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (cat) {
      setSelectedCategories([cat]);
    }
    if (search) {
      setSearchQuery(search);
    }
    setCurrentPage(1); // Reset page on filter change
  }, [searchParams]);

  // Toggle categories checkboxes
  const handleCategoryChange = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  };

  // Toggle levels checkboxes
  const handleLevelChange = (lvl) => {
    setSelectedLevels((prev) =>
      prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]
    );
    setCurrentPage(1);
  };

  // Clear all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedLevels([]);
    setPriceFilter('All');
    setMaxPrice(40000);
    setSortBy('Newly Published');
    setCurrentPage(1);
    setSearchParams({}); // Clear URL search parameters
  };

  // Remove a single filter chip
  const removeCategoryChip = (cat) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== cat));
    setCurrentPage(1);
  };

  const removeLevelChip = (lvl) => {
    setSelectedLevels((prev) => prev.filter((l) => l !== lvl));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left">
      {/* Page Hero Header */}
      <div className="bg-primary text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-light/40 via-transparent to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Explore Courses</h1>
            <p className="text-xs text-blue-200 mt-1.5 font-semibold">
              Find the perfect professional certification track to elevate your skill set.
            </p>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm self-start md:self-auto">
            <Breadcrumb items={[{ label: 'Courses' }]} light={true} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 1. Sidebar Filters (Desktop: 3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-slate-100 shadow-md rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-textdark flex items-center gap-2">
                <SlidersHorizontal className="w-4.5 h-4.5 text-primary" />
                Filters
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-accent hover:underline font-bold"
              >
                Clear All
              </button>
            </div>

            {/* Search */}
            <div>
              <label className="block text-xs font-bold text-textdark uppercase tracking-wider mb-2.5">
                Search Course
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search title, desc..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white text-xs px-3.5 py-2.5 pr-9 rounded-lg outline-none transition-all font-semibold"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-bold text-textdark uppercase tracking-wider mb-2.5">
                Category
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer hover:text-primary">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                      className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>


          </aside>

          {/* 2. Main Content Area (9 cols) */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Top Toolbar (Sort, Results Count, Mobile Filter button) */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-xl px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs sm:text-sm font-semibold text-slate-600 self-start sm:self-auto">
                Showing <strong className="text-textdark">{totalCourses}</strong> courses
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 border border-slate-200 rounded-lg px-4 py-2 text-xs font-bold text-textdark hover:bg-slate-50 shadow-sm active:scale-95 transition-all"
                >
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  Filters
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <label className="hidden md:inline text-xs font-bold text-slate-400 uppercase">Sort By:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2 rounded-lg outline-none cursor-pointer focus:bg-white focus:border-primary"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Layout Mode Switcher */}
                <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1 bg-slate-50 shadow-inner">
                  <button
                    onClick={() => setLayoutMode('list')}
                    className={`p-1.5 rounded-md transition-all ${
                      layoutMode === 'list'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLayoutMode('grid')}
                    className={`p-1.5 rounded-md transition-all ${
                      layoutMode === 'grid'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {(selectedCategories.length > 0 || selectedLevels.length > 0 || searchQuery || priceFilter !== 'All') && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Active Filters:</span>
                
                {searchQuery && (
                  <span className="bg-slate-100 border border-slate-200 text-textdark text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {priceFilter !== 'All' && (
                  <span className="bg-slate-100 border border-slate-200 text-textdark text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                    Price: {priceFilter}
                    <button onClick={() => setPriceFilter('All')} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedCategories.map((cat) => (
                  <span key={cat} className="bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                    {cat}
                    <button onClick={() => removeCategoryChip(cat)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {selectedLevels.map((lvl) => (
                  <span key={lvl} className="bg-accent/10 border border-accent/20 text-accent-dark text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                    {lvl}
                    <button onClick={() => removeLevelChip(lvl)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-extrabold text-accent hover:underline uppercase pl-1"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Courses Listing */}
            {loading ? (
              layoutMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4 animate-pulse">
                      <div className="bg-slate-200 rounded-lg aspect-video w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-10 bg-slate-200 rounded-lg w-full"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-5">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col sm:flex-row gap-5 items-center animate-pulse">
                      <div className="bg-slate-200 rounded-lg w-full sm:w-56 h-36 flex-shrink-0"></div>
                      <div className="flex-grow space-y-3 w-full">
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-6 bg-slate-200 rounded w-2/3"></div>
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      </div>
                      <div className="w-full sm:w-44 flex-shrink-0 flex sm:flex-col items-end gap-3 sm:border-l sm:border-slate-100 sm:pl-5">
                        <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                        <div className="h-10 bg-slate-200 rounded-lg w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : courses.length === 0 ? (
              <div className="bg-white border border-slate-100 shadow-md rounded-xl py-20 px-6 text-center">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="font-extrabold text-xl text-textdark">No Courses Found</h3>
                <p className="text-sm text-textmuted mt-2 max-w-md mx-auto">
                  Try widening your search terms, selecting different categories, or resetting the price ranges.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-6 py-3 rounded-lg mt-6 shadow"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {layoutMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <CourseCard key={course._id} course={course} schedules={allSchedules.filter(s => s.courseId === course._id)} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {courses.map((course) => (
                      <CourseListRow
                        key={course._id}
                        course={course}
                        formatPrice={formatPrice}
                        addToCart={addToCart}
                        cartItems={cartItems}
                        schedules={allSchedules.filter(s => s.courseId === course._id)}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-bold text-xs border transition-all ${
                          currentPage === pageNum
                            ? 'bg-primary text-white border-primary shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      aria-label="Next Page"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* 3. Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-end transition-all">
          <div className="bg-white w-4/5 max-w-sm h-full shadow-2xl p-6 overflow-y-auto flex flex-col text-left animate-slide-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h3 className="font-extrabold text-base text-textdark flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                Filter Options
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full"
                aria-label="Close filters"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="space-y-6 flex-grow">
              {/* Search */}
              <div>
                <label className="block text-xs font-bold text-textdark uppercase tracking-wider mb-2">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 pr-9 rounded-lg outline-none text-xs font-semibold"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-bold text-textdark uppercase tracking-wider mb-2">Category</label>
                <div className="space-y-2.5 max-h-44 overflow-y-auto">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                        className="rounded border-slate-300 text-primary w-4.5 h-4.5"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>


            </div>

            <div className="border-t border-slate-100 pt-4 mt-6 flex gap-4">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-xs text-textdark hover:bg-slate-50"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary-dark"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
