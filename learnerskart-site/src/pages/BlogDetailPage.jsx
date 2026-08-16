import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar, Clock, User, ArrowLeft, Share2, Linkedin, Twitter, Facebook, Instagram,
  ShieldAlert, CheckCircle2, MessageSquare, Send, Eye, Heart, ThumbsUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Breadcrumb from '../components/ui/Breadcrumb';
import BlogCard from '../components/ui/BlogCard';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Comments State
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');

  const getFingerprint = () => {
    let fp = localStorage.getItem('visitor_fingerprint');
    if (!fp) {
      fp = 'fp-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('visitor_fingerprint', fp);
    }
    return fp;
  };

  useEffect(() => {
    const fetchBlogDetail = async () => {
      setLoading(true);
      try {
        const fp = getFingerprint();
        const userId = user?._id || user?.id || '';
        const res = await api.get(`/blogs/${slug}?fingerprint=${fp}&userId=${userId}`);
        if (res.data.success) {
          setBlog(res.data.blog);
          setRelatedBlogs(res.data.relatedBlogs || []);
          setIsLiked(res.data.isLiked || false);
          setLikesCount(res.data.blog?.likesCount || 0);
          
          // Seed mock comments
          setComments([
            { name: 'John Doe', date: '28 Aug 2026', text: 'This was an incredibly insightful read! The comparison of Redmine workflows to Jira boards really clarified the open-source cost benefits.' },
            { name: 'Sanjna Sharma', date: '29 Aug 2026', text: 'Very detailed breakdown. I would love to see a tutorial on setting up Redmine plugins for team Gantt charts.' }
          ]);

          // Handle view count increment once per session
          const blogId = res.data.blog?._id;
          const hasViewed = sessionStorage.getItem(`viewed_blog_${slug}`);
          if (blogId && !hasViewed) {
            api.post(`/blogs/${blogId}/view`)
              .then((viewRes) => {
                if (viewRes.data.success) {
                  sessionStorage.setItem(`viewed_blog_${slug}`, 'true');
                  setBlog(prev => prev ? { ...prev, viewCount: viewRes.data.viewCount } : null);
                }
              })
              .catch(err => console.error('Error incrementing view count:', err));
          }
        }
      } catch (error) {
        console.error('Error fetching blog detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [slug, user]);

  const handleLikeToggle = async () => {
    if (!blog) return;

    const previousIsLiked = isLiked;
    const previousLikesCount = likesCount;

    setIsLiked(!previousIsLiked);
    setLikesCount(prev => previousIsLiked ? prev - 1 : prev + 1);

    try {
      const fp = getFingerprint();
      const userId = user?._id || user?.id || '';
      const res = await api.post(`/blogs/${blog._id}/like`, {
        fingerprint: fp,
        userId
      });

      if (res.data.success) {
        setIsLiked(res.data.isLiked);
        setLikesCount(res.data.likesCount);
      } else {
        setIsLiked(previousIsLiked);
        setLikesCount(previousLikesCount);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setIsLiked(previousIsLiked);
      setLikesCount(previousLikesCount);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center py-20 px-6">
        <ShieldAlert className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="font-extrabold text-2xl text-textdark">Article Not Found</h2>
        <p className="text-sm text-textmuted mt-2">The article you are looking for does not exist or has been moved.</p>
        <Link to="/blog" className="bg-primary text-white font-bold px-6 py-3 rounded-lg mt-6 shadow">
          Back to Blog List
        </Link>
      </div>
    );
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment = {
      name: user?.name || 'Anonymous Reader',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      text: commentInput,
    };

    setComments((prev) => [...prev, newComment]);
    setCommentInput('');
  };

  const shareText = encodeURIComponent(`Read this article on LearnersKart: ${blog.title}`);
  const shareUrl = encodeURIComponent(window.location.href);

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb */}
        <div className="bg-white/70 border border-slate-100 px-4 py-2 rounded-lg backdrop-blur-sm self-start inline-block text-xs font-semibold">
          <Breadcrumb items={[
            { label: 'Blogs', url: '/blog' },
            { label: blog.title }
          ]} />
        </div>

        {/* Blog Article */}
        <article className="bg-white border border-slate-100 shadow-lg rounded-2xl overflow-hidden">
          {/* Banner Image */}
          <div className="aspect-video w-full overflow-hidden bg-slate-100">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-contain bg-slate-50"
            />
          </div>

          <div className="p-6 sm:p-10 space-y-6">
            {/* Header info */}
            <div className="space-y-4">
              <span className="bg-primary/5 border border-primary/10 text-primary font-extrabold text-[10px] px-2.5 py-1 rounded uppercase tracking-wider">
                {blog.category}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-textdark leading-tight">
                {blog.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-500 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-primary" />
                  <span>By {blog.author?.name || 'LearnersKart Team'}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{blog.date || 'Aug 2026'}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{blog.readTime || '5 mins'} read</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-primary" />
                  <span>{blog.viewCount || 0} views</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4 text-blue-500 fill-blue-500/10" />
                  <span>{likesCount} likes</span>
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div
              className="text-slate-700 text-xs sm:text-sm leading-relaxed space-y-4 prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>

            {/* Author Bio Card */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
              <img
                src={blog.author?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                alt={blog.author?.name}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-textdark">Written by {blog.author?.name || 'LearnersKart Team'}</h4>
                <p className="text-[11px] text-textmuted leading-relaxed">
                  Academic advisors and industry researchers sharing curriculum assessments, professional career roadmaps, and certification frameworks to help aspirants upskill.
                </p>
              </div>
            </div>

            {/* Bottom Row: Share Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between border-t border-slate-100 pt-5 mt-8 text-xs font-bold text-slate-600">
              <Link to="/blog" className="text-slate-400 hover:text-primary flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Back to Blogs
              </Link>
              
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                {/* Thumbs Up Like Button */}
                <button
                  onClick={handleLikeToggle}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all ${
                    isLiked
                      ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-blue-500 hover:bg-blue-50/30'
                  }`}
                  title={isLiked ? 'Unlike this post' : 'Like this post'}
                >
                  <ThumbsUp className={`w-4 h-4 transition-transform active:scale-125 ${isLiked ? 'fill-blue-500 text-blue-500' : ''}`} />
                  <span>{likesCount}</span>
                </button>

                <div className="flex items-center gap-3">
                  <Share2 className="w-4 h-4 text-slate-400" />
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary">
                    <Linkedin className="w-4.5 h-4.5" />
                  </a>
                  <a href={`https://x.com/intent/tweet?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-black" title="Share on X">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600" title="Share on Facebook">
                    <Facebook className="w-4.5 h-4.5" />
                  </a>
                  <a href="https://www.instagram.com/learnerskart/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-600" title="Visit Instagram">
                    <Instagram className="w-4.5 h-4.5" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </article>

        {/* COMMENTS SECTION */}
        <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 sm:p-10 text-left space-y-6">
          <h3 className="font-extrabold text-base sm:text-lg text-textdark flex items-center gap-2 border-b border-slate-100 pb-3">
            <MessageSquare className="w-5 h-5 text-primary" />
            Comments ({comments.length})
          </h3>

          {/* Comments List */}
          <div className="space-y-5 divide-y divide-slate-50">
            {comments.map((cmt, idx) => (
              <div key={idx} className={`pt-5 first:pt-0 border-0 flex gap-3.5 items-start`}>
                <div className="w-9 h-9 rounded-full bg-slate-100 text-primary font-black text-xs flex items-center justify-center border uppercase flex-shrink-0 mt-0.5">
                  {cmt.name[0]}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-textdark">{cmt.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{cmt.date}</span>
                  </div>
                  <p className="text-slate-600 font-semibold leading-relaxed leading-normal">{cmt.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Write a comment form */}
          <div className="border-t border-slate-100 pt-6 mt-6">
            <h4 className="font-bold text-sm text-textdark mb-4">Post a Comment</h4>
            {user ? (
              <form onSubmit={handleCommentSubmit} className="space-y-4 text-xs">
                <div className="relative">
                  <textarea
                    rows="3"
                    placeholder="Share your thoughts on this article..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none text-xs sm:text-sm font-medium focus:bg-white focus:border-primary transition-all pr-10"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2.5 rounded-lg shadow transition-all flex items-center justify-center gap-1.5 text-xs inline-flex active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post Comment
                </button>
              </form>
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-center">
                <p className="text-xs sm:text-sm text-textmuted font-semibold">
                  Please log in to participate in the article discussions.
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-lg mt-3 shadow"
                >
                  Log In to Comment
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* RELATED ARTICLES */}
        {relatedBlogs.length > 0 && (
          <div className="space-y-5">
            <h3 className="font-extrabold text-base sm:text-lg text-textdark uppercase tracking-wider">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((b) => (
                <BlogCard key={b._id} blog={b} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogDetailPage;
