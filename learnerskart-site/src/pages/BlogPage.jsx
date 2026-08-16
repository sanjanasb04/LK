import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, BookOpen, Clock, Tag, ChevronLeft, ChevronRight, Eye, ThumbsUp } from 'lucide-react';
import api from '../utils/api';

const BlogPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'All');

  const categories = ['All', 'Project Management', 'Quality Management', 'General'];

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('page', currentPage);
        params.append('limit', 3);
        
        if (activeCategory !== 'All') {
          params.append('category', activeCategory);
        }
        
        const res = await api.get(`/blogs?${params.toString()}`);
        if (res.data.success) {
          let loadedBlogs = res.data.blogs;
          
          if (searchQuery.trim()) {
            loadedBlogs = loadedBlogs.filter(
              (b) =>
                b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }

          setBlogs(loadedBlogs);
          setTotalBlogs(searchQuery ? loadedBlogs.length : res.data.total);
          setTotalPages(searchQuery ? 1 : res.data.pages);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage, activeCategory, searchQuery]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, activeCategory, searchQuery]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return dateStr;
    return dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left">
      
      {/* Page Hero Header */}
      <div className="bg-white border-b border-slate-100 py-10 text-center select-none">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">Blog</h1>
          <div className="flex justify-center items-center gap-1.5 text-xs text-slate-400 font-semibold mt-2.5">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-500">Blog</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Main Blogs List (8 cols) */}
          <main className="lg:col-span-8 space-y-8 text-left">
            {loading ? (
              <div className="space-y-6">
                {[1, 2].map((n) => (
                  <div key={n} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 animate-pulse h-52"></div>
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-2xl py-20 px-6 text-center shadow-sm">
                <BookOpen className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                <h3 className="font-extrabold text-xl text-textdark">No Articles Found</h3>
                <p className="text-sm text-textmuted mt-2 max-w-sm mx-auto">
                  We couldn't find any articles matching your filters. Try resetting your search terms.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-5 py-2.5 rounded-lg mt-5 shadow transition-all"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {blogs.map((blog) => (
                    <div 
                      key={blog._id} 
                      className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start"
                    >
                      {/* Left: Image */}
                      <Link 
                        to={`/blog/${blog.slug}`} 
                        className="w-full md:w-[340px] aspect-[4/3] md:aspect-auto md:h-[230px] rounded-xl overflow-hidden flex-shrink-0 bg-slate-50 relative group"
                      >
                        <img 
                          src={blog.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400"} 
                          alt={blog.title} 
                          className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      </Link>

                      {/* Right: Info */}
                      <div className="flex-1 flex flex-col justify-between h-full py-0.5 text-left">
                        <div className="space-y-2">
                          <Link 
                            to={`/blog/${blog.slug}`}
                            className="text-base sm:text-lg font-extrabold text-slate-800 hover:text-primary transition-colors leading-snug line-clamp-2"
                          >
                            {blog.title}
                          </Link>
                          
                          <p className="text-[10px] sm:text-xs text-slate-400 font-bold tracking-wide flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                            <span className="text-slate-200">|</span>
                            <span className="text-primary">{blog.category}</span>
                            <span className="text-slate-200">|</span>
                            <span className="text-slate-500 font-medium flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-slate-400" /> {blog.viewCount || 0}</span>
                            <span className="text-slate-200">|</span>
                            <span className="text-slate-500 font-medium flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" /> {blog.likesCount || 0}</span>
                          </p>
                          
                          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">
                            {blog.excerpt}
                          </p>
                        </div>

                        <Link 
                          to={`/blog/${blog.slug}`}
                          className="text-xs font-bold text-slate-800 hover:text-primary transition-colors inline-flex items-center gap-1.5 mt-4 group"
                        >
                          <span>Read More</span>
                          <span className="text-primary group-hover:translate-x-0.5 transition-transform">&raquo;</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        onClick={() => setCurrentPage(n)}
                        className={`w-10 h-10 rounded-lg font-bold text-xs border transition-all ${
                          currentPage === n
                            ? 'bg-primary text-white border-primary shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {n}
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

          {/* RIGHT COLUMN: Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-8 text-left lg:sticky lg:top-4">
            
            {/* Search Box */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-5">
              <label className="block text-xs font-bold text-textdark uppercase tracking-wider mb-2.5">
                Search Articles
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type to search..."
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

            {/* Popular Posts */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6">
              <h3 className="font-extrabold text-base text-slate-800 uppercase tracking-wide mb-5">
                Popular posts
              </h3>
              
              <div className="space-y-4">
                {blogs.slice(0, 5).map((blog) => (
                  <div key={blog._id} className="flex gap-3.5 items-start border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                    <Link 
                      to={`/blog/${blog.slug}`}
                      className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 relative group"
                    >
                      <img 
                        src={blog.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=150"} 
                        alt={blog.title} 
                        className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform"
                      />
                    </Link>
                    <div className="flex-1 min-w-0 space-y-1">
                      <Link 
                        to={`/blog/${blog.slug}`}
                        className="block font-bold text-xs text-slate-800 hover:text-primary transition-colors leading-snug line-clamp-2 font-semibold"
                      >
                        {blog.title}
                      </Link>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        {formatDate(blog.publishedAt || blog.createdAt)} &nbsp;&bull;&nbsp; {blog.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories list */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-5">
              <label className="block text-xs font-bold text-textdark uppercase tracking-wider mb-3">
                Categories
              </label>
              <nav className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md transition-all ${
                      activeCategory === cat
                        ? 'bg-primary/5 text-primary font-bold border-l-2 border-primary'
                        : 'hover:bg-slate-50 hover:text-textdark'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </nav>
            </div>

          </aside>
          
        </div>
      </div>

    </div>
  );
};

export default BlogPage;
