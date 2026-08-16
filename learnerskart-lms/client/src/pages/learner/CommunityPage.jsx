import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { 
  MessageSquare, ThumbsUp, Eye, Tag, Calendar, Plus, 
  ChevronRight, Bookmark, Pin, CheckCircle2, Award 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CommunityPage() {
  const { user, setUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  
  // Expand detail view states
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  
  // New Post Modal state
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('💬 General Discussion');
  const [newPostBody, setNewPostBody] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchForumPosts = async () => {
    try {
      setLoading(true);
      let query = '';
      if (activeCategory !== 'All') {
        query = `?category=${encodeURIComponent(activeCategory)}`;
      }
      const res = await api.get(`/posts${query}`);
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load forum feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForumPosts();
  }, [activeCategory]);

  const handleLikePost = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/posts/${id}/like`);
      if (res.data.success) {
        setPosts(prev => 
          prev.map(p => p._id === id 
            ? { ...p, likes: res.data.liked ? [...p.likes, user.id] : p.likes.filter(uid => uid !== user.id) } 
            : p
          )
        );
        toast.success(res.data.liked ? 'Liked post 👍' : 'Unliked post');
        
        // Award XP if hit likes milestone (+30 XP)
        if (res.data.xpResults) {
          toast.success(`🔥 Milestone! +${res.data.xpResults.xp} XP awarded!`);
          setUser(prev => ({ ...prev, xp: prev.xp + res.data.xpResults.xp }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId, e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await api.post(`/posts/${postId}/comments`, { body: commentText });
      if (res.data.success) {
        // Update local comments
        setPosts(prev => 
          prev.map(p => p._id === postId ? { ...p, comments: res.data.comments } : p)
        );
        setCommentText('');
        toast.success('Comment published! Earned +15 XP 💬');
        
        // Award XP update
        if (res.data.xpResults) {
          setUser(prev => ({ ...prev, xp: prev.xp + res.data.xpResults.xp }));
        }
      }
    } catch (err) {
      toast.error('Failed to post reply.');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostBody.trim()) {
      toast.error('Please enter post title and details.');
      return;
    }

    try {
      const tagsArray = newPostTags.split(',').map(t => t.trim().replace('#', '')).filter(t => t);
      const res = await api.post('/posts', {
        category: newPostCategory,
        title: newPostTitle,
        body: newPostBody,
        tags: tagsArray
      });

      if (res.data.success) {
        toast.success('Post published successfully! Earned +25 XP 📝');
        setPostModalOpen(false);
        setNewPostTitle('');
        setNewPostBody('');
        setNewPostTags('');
        
        // Award XP update
        if (res.data.xpResults) {
          setUser(prev => ({ ...prev, xp: prev.xp + res.data.xpResults.xp }));
        }

        fetchForumPosts();
      }
    } catch (err) {
      toast.error('Failed to create post.');
    }
  };

  const categories = [
    'All',
    '📌 Announcements',
    '💬 General Discussion',
    '📚 PMP Study Group',
    '🧩 Agile & Scrum',
    '✅ Success Stories',
    '🆘 Doubt Corner'
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* LEFT SIDEBAR: Forum Categories (240px) */}
      <div className="w-full lg:w-60 bg-white border border-slate-100 p-4 rounded-panel shadow-sm h-fit shrink-0 select-none text-left">
        <h3 className="font-extrabold text-slate-800 text-xs mb-3 border-b border-slate-50 pb-2">Forum Channels</h3>
        <div className="space-y-0.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeCategory === cat
                  ? 'bg-primary/5 text-primary font-bold border-l-2 border-primary'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{cat}</span>
              <ChevronRight size={12} className="opacity-50" />
            </button>
          ))}
        </div>
      </div>

      {/* CENTER FEED: Posts List (Flex-1) */}
      <div className="flex-1 space-y-4">
        
        {/* Feed Header and New Post trigger */}
        <div className="flex justify-between items-center select-none text-left">
          <div>
            <h1 className="text-xl font-black text-slate-800">Community Discussion Forum</h1>
            <p className="text-[10px] text-slate-400 font-semibold">Post doubts, check success strategies, and share tips.</p>
          </div>

          <button
            onClick={() => setPostModalOpen(true)}
            className="flex items-center gap-1 py-2 px-4 bg-accent hover:bg-accent-dark text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            <Plus size={14} />
            New Post
          </button>
        </div>

        {/* PINNED ANNOUNCEMENT */}
        {activeCategory === 'All' && (
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-primary/5 border border-primary/20 rounded-panel text-left flex items-start gap-3 shadow-sm select-none">
            <div className="p-2 bg-indigo-500 text-white rounded-lg shadow-sm">
              <Pin size={16} className="rotate-45" />
            </div>
            <div>
              <span className="text-[9px] font-black text-indigo-500 block uppercase tracking-wider">Announcement Milestone</span>
              <h4 className="font-extrabold text-slate-800 text-xs mt-1">🎉 Congratulations to Priya S. for passing PMP on her first attempt!</h4>
              <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                "Passed PMP training today with Above Target in all 3 domains. Huge thanks to LearnersKart mock simulator tests!"
              </p>
            </div>
          </div>
        )}

        {/* POST LIST */}
        {loading ? (
          <div className="p-16 flex justify-center bg-white border border-slate-100 rounded-panel shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-16 bg-white border border-slate-100 rounded-panel text-slate-400 text-center select-none">
            <MessageSquare size={42} className="mx-auto text-slate-200 mb-2" />
            <h3 className="font-extrabold text-slate-700 text-sm">No forum posts here yet</h3>
            <p className="text-xs text-slate-400 mt-1">Be the first to publish a post and earn +25 XP!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const isExpanded = expandedPostId === post._id;
              const hasLiked = post.likes.includes(user?.id);

              return (
                <div 
                  key={post._id}
                  onClick={() => setExpandedPostId(isExpanded ? null : post._id)}
                  className={`bg-white border border-slate-100 rounded-panel shadow-sm hover:shadow-md transition-shadow duration-300 p-5 text-left cursor-pointer ${
                    isExpanded ? 'ring-1 ring-primary/25' : ''
                  }`}
                >
                  {/* Category Pill and author info */}
                  <div className="flex items-center justify-between select-none">
                    <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">
                      {post.category}
                    </span>

                    <div className="flex items-center gap-2">
                      <img 
                        src={post.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                        alt="Author" 
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div className="text-left leading-none">
                        <span className="text-[10px] font-bold text-slate-700 block">{post.author?.name}</span>
                        <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest mt-0.5 block">
                          🥇 {post.author?.level || 'Gold'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Title and details body */}
                  <h3 className="font-extrabold text-slate-800 text-sm mt-3 leading-snug">{post.title}</h3>
                  <p className={`text-xs text-slate-600 mt-2 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                    {post.body}
                  </p>

                  {/* Tags list */}
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 select-none">
                      {post.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="flex items-center gap-0.5 px-2 py-0.5 text-[9px] font-bold bg-slate-50 text-slate-500 rounded border border-slate-150">
                          <Tag size={8} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions buttons */}
                  <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-4 text-[10px] font-bold text-slate-500 select-none">
                    <div className="flex items-center gap-5">
                      <button 
                        onClick={(e) => handleLikePost(post._id, e)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          hasLiked ? 'text-primary' : 'hover:text-primary'
                        }`}
                      >
                        <ThumbsUp size={13} fill={hasLiked ? 'currentColor' : 'transparent'} />
                        {post.likes?.length || 0} Likes
                      </button>

                      <span className="flex items-center gap-1.5">
                        <MessageSquare size={13} />
                        {post.comments?.length || 0} Comments
                      </span>

                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Eye size={13} />
                        {post.views || 0} Views
                      </span>
                    </div>

                    <button className="text-slate-400 hover:text-slate-600">
                      <Bookmark size={14} />
                    </button>
                  </div>

                  {/* EXPANDED COMMENTS ACCORDION AREA */}
                  {isExpanded && (
                    <div 
                      onClick={(e) => e.stopPropagation()} // Stop accordion toggling when typing comment
                      className="border-t border-slate-100 pt-4 mt-4 space-y-4 cursor-default"
                    >
                      {/* Comments Feed List */}
                      {post.comments?.length > 0 && (
                        <div className="space-y-3.5 pl-4 border-l-2 border-slate-100">
                          {post.comments.map((comment) => (
                            <div key={comment._id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 select-none mb-1.5">
                                <div className="flex items-center gap-1.5">
                                  <img 
                                    src={comment.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                                    alt="Author" 
                                    className="w-5.5 h-5.5 rounded-full object-cover"
                                  />
                                  <span className="text-slate-600 font-bold">{comment.author?.name}</span>
                                  {comment.author?.role === 'instructor' && (
                                    <span className="px-1.5 py-0.5 text-[8px] bg-success text-white rounded">
                                      Expert Answer
                                    </span>
                                  )}
                                </div>
                                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs text-slate-600 leading-normal pl-7">{comment.body}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply form */}
                      <form onSubmit={(e) => handleAddComment(post._id, e)} className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Type your comment / solution here..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="flex-1 border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                        >
                          Reply
                        </button>
                      </form>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* RIGHT SIDEBAR: Hot Topics / Tags (260px) */}
      <div className="w-full lg:w-64 space-y-6 text-left select-none shrink-0">
        
        {/* Trending posts */}
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
          <h3 className="font-extrabold text-slate-800 text-xs mb-3 border-b border-slate-50 pb-2">Trending Discussions</h3>
          <div className="space-y-3 font-semibold text-slate-600">
            <div className="text-xs hover:text-primary transition-colors cursor-pointer leading-snug">
              🔥 Formula sheet for Earned Value Management (EVM)
              <span className="text-[10px] text-slate-400 block font-bold mt-0.5">24 replies • General Discussion</span>
            </div>
            <div className="text-xs hover:text-primary transition-colors cursor-pointer leading-snug">
              🔥 Is PMBOK 7th Edition enough to clear Exam?
              <span className="text-[10px] text-slate-400 block font-bold mt-0.5">18 replies • PMP Study Group</span>
            </div>
            <div className="text-xs hover:text-primary transition-colors cursor-pointer leading-snug">
              🔥 Best practice questions to simulate Agile scenarios
              <span className="text-[10px] text-slate-400 block font-bold mt-0.5">12 replies • Agile & Scrum</span>
            </div>
          </div>
        </div>

        {/* Popular Tags cloud */}
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
          <h3 className="font-extrabold text-slate-800 text-xs mb-3 border-b border-slate-50 pb-2">Popular Tags</h3>
          <div className="flex flex-wrap gap-1.5">
            {['#PMP', '#EarnedValue', '#RiskResponse', '#AgileManifesto', '#SprintReview', '#PMIApplication', '#Stakeholders'].map((tag) => (
              <span key={tag} className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* NEW POST DIALOG MODAL */}
      {postModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-panel w-full max-w-lg shadow-modal overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-5 py-4 bg-primary text-white flex justify-between items-center">
              <span className="font-bold text-sm">Publish New Forum Post (+25 XP)</span>
              <button onClick={() => setPostModalOpen(false)} className="text-white hover:text-slate-200">✕</button>
            </div>
            
            <form onSubmit={handleCreatePost} className="p-6 space-y-4">
              
              {/* Category dropdown */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Channel Category</label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option>💬 General Discussion</option>
                  <option>📚 PMP Study Group</option>
                  <option>🧩 Agile & Scrum</option>
                  <option>✅ Success Stories</option>
                  <option>🆘 Doubt Corner</option>
                </select>
              </div>

              {/* Title input */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Post Title</label>
                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g. Critical Path calculation float doubt"
                  className="w-full border border-slate-200 px-3 py-2.5 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Body Details rich text area */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Description Details</label>
                <textarea
                  rows={4}
                  required
                  value={newPostBody}
                  onChange={(e) => setNewPostBody(e.target.value)}
                  placeholder="Elaborate your doubt or share resource links..."
                  className="w-full border border-slate-200 px-3 py-2.5 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Tags split */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newPostTags}
                  onChange={(e) => setNewPostTags(e.target.value)}
                  placeholder="e.g. PMP, EVM, calculations"
                  className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex gap-2.5 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setPostModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                >
                  Publish Post
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
