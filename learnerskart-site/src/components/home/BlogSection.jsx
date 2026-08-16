import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import api from '../../utils/api';
import BlogCard from '../ui/BlogCard';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs?limit=3');
        if (res.data.success) {
          setBlogs(res.data.blogs);
        }
      } catch (error) {
        console.error('Error fetching home blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="py-20 bg-slate-50 select-none text-left md:text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-left">
            <span className="text-accent text-xs font-extrabold uppercase tracking-widest leading-none">Industry Insights</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-textdark mt-2.5 leading-tight">
              Our Latest Blogs & Articles
            </h2>
            <p className="text-sm text-textmuted mt-2 leading-relaxed max-w-xl">
              Stay ahead of the curve with expert tips, industry trends, and deep-dive guides on project and process management.
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-primary hover:text-accent font-bold text-sm transition-colors self-start md:self-auto group"
          >
            View All Articles
            <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4 animate-pulse">
                <div className="bg-slate-200 rounded-lg aspect-video w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-xl shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-textdark">No articles found</h3>
            <p className="text-sm text-textmuted mt-1">Check back later for new publications.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default BlogSection;
