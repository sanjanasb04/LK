import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Clock, Eye, ThumbsUp } from 'lucide-react';

const BlogCard = ({ blog }) => {
  return (
    <article className="bg-white rounded-xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full group text-left select-none">
      {/* Blog Image */}
      <Link to={`/${blog.slug}`} className="relative block overflow-hidden rounded-t-xl aspect-video bg-slate-100 hover-zoom">
        <img
          src={blog.image || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8'}
          alt={blog.title}
          className="w-full h-full object-contain bg-slate-50 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Date Badge */}
        {blog.date && (
          <div className="absolute bottom-3 left-3 bg-accent text-white font-extrabold text-xs px-3 py-1.5 rounded-md shadow-md">
            {blog.date}
          </div>
        )}
      </Link>

      {/* Blog Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category & Read Time */}
        <div className="flex items-center justify-between mb-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          <span>{blog.category || 'Certification'}</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{blog.readTime || '5 mins'}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-textdark mb-2.5 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          <Link to={`/${blog.slug}`}>{blog.title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-textmuted mb-4.5 line-clamp-3 leading-relaxed">
          {blog.excerpt}
        </p>

        {/* Action link */}
        <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
          <Link
            to={`/${blog.slug}`}
            className="text-primary hover:text-accent font-bold text-xs inline-flex items-center gap-1.5 transition-colors group/link"
          >
            Read More
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
          </Link>

          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span className="flex items-center gap-1" title="Views">
              <Eye className="w-3.5 h-3.5" />
              <span>{blog.viewCount || 0}</span>
            </span>
            <span className="flex items-center gap-1" title="Likes">
              <ThumbsUp className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
              <span>{blog.likesCount || 0}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
