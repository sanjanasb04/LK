import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import AdminFileUpload from '../components/admin/AdminFileUpload';
import { FileText, Plus, Trash2, Edit2, X, Check, Save, ArrowLeft } from 'lucide-react';


const AdminBlogsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // View state: 'list' | 'create' | 'edit'
  const [view, setView] = useState('list');
  const [editingBlogId, setEditingBlogId] = useState(null);

  // Form State
  const defaultFormState = {
    title: '',
    slug: '',
    category: 'General',
    image: '/blogs/banner.jpg',
    excerpt: '',
    content: '',
    readTime: '5 mins',
    tags: '',
    author: {
      name: 'LearnersKart Team',
      avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    }
  };

  const [form, setForm] = useState(defaultFormState);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'admin') {
        navigate('/dashboard');
      }
    }
  }, [user, authLoading, navigate]);

  // Fetch all blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/blogs?limit=100');
      if (res.data.success) {
        setBlogs(res.data.blogs);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchBlogs();
    }
  }, [user]);

  // Create Blog Submission
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const tagsArray = form.tags.split(',').map(t => t.trim()).filter(t => t !== '');
      const cleanedForm = {
        ...form,
        tags: tagsArray
      };

      const res = await api.post('/blogs', cleanedForm);
      if (res.data.success) {
        alert('Blog post created successfully.');
        setView('list');
        fetchBlogs();
      }
    } catch (err) {
      alert('Error creating blog: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  // Edit click
  const handleEditClick = (blog) => {
    setEditingBlogId(blog._id);
    setForm({
      title: blog.title || '',
      slug: blog.slug || '',
      category: blog.category || 'General',
      image: blog.image || '/blogs/banner.jpg',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      readTime: blog.readTime || '5 mins',
      tags: blog.tags ? blog.tags.join(', ') : '',
      author: {
        name: blog.author?.name || 'LearnersKart Team',
        avatar: blog.author?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
      }
    });
    setView('edit');
  };

  // Update Blog Submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const tagsArray = form.tags.split(',').map(t => t.trim()).filter(t => t !== '');
      const cleanedForm = {
        ...form,
        tags: tagsArray
      };

      const res = await api.put(`/blogs/${editingBlogId}`, cleanedForm);
      if (res.data.success) {
        alert('Blog post updated successfully.');
        setView('list');
        fetchBlogs();
      }
    } catch (err) {
      alert('Error updating blog: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Blog
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post permanently?')) return;
    setActionLoading(true);
    try {
      const res = await api.delete(`/blogs/${id}`);
      if (res.data.success) {
        alert('Blog post deleted successfully.');
        setBlogs(prev => prev.filter(b => b._id !== id));
      }
    } catch (err) {
      alert('Error deleting blog: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <DashboardSidebar />

          {/* Main Content Area */}
          <div className="flex-grow w-full lg:w-3/4 space-y-6">
            
            {/* Header section */}
            <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-textdark flex items-center gap-2">
                  <FileText className="w-6.5 h-6.5 text-primary" />
                  Manage Blogs Catalog
                </h1>
                <p className="text-xs text-textmuted mt-1 font-semibold">
                  Publish, update or remove articles and resources from the LearnersKart blog section.
                </p>
              </div>

              {view === 'list' ? (
                <button
                  onClick={() => {
                    setForm(defaultFormState);
                    setView('create');
                  }}
                  className="bg-accent hover:bg-accent-dark text-white font-extrabold text-xs px-5 py-3 rounded-lg shadow transition-all active:scale-95 flex items-center gap-1.5 self-start sm:self-center"
                >
                  <Plus className="w-4 h-4" />
                  Add New Blog
                </button>
              ) : (
                <button
                  onClick={() => setView('list')}
                  className="border border-slate-200 bg-white hover:bg-slate-50 text-textdark font-extrabold text-xs px-4 py-3 rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1.5 self-start sm:self-center"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to List
                </button>
              )}
            </div>

            {/* View switching logic */}
            {view === 'list' && (
              <div className="bg-white border border-slate-100 shadow-md rounded-2xl overflow-hidden">
                {loading ? (
                  <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
                    <span className="text-xs text-textmuted font-semibold">Loading blogs...</span>
                  </div>
                ) : blogs.length === 0 ? (
                  <div className="py-20 text-center text-textmuted text-xs font-semibold">
                    No articles found in the database. Click "Add New Blog" to publish one.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider">
                          <th className="py-4 px-6">Article</th>
                          <th className="py-4 px-6">Category</th>
                          <th className="py-4 px-6">Stats</th>
                          <th className="py-4 px-6">Date</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                        {blogs.map((blog) => (
                          <tr key={blog._id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="py-4.5 px-6 font-bold text-textdark flex items-center gap-3">
                              <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-10 h-6.5 rounded object-cover bg-slate-100 border flex-shrink-0"
                              />
                              <div className="truncate max-w-[240px]">
                                <span className="block truncate font-bold text-slate-800">{blog.title}</span>
                                <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{blog.slug}</span>
                              </div>
                            </td>
                            <td className="py-4.5 px-6">{blog.category}</td>
                            <td className="py-4.5 px-6">
                              <div className="text-[10px] text-slate-500 font-bold">
                                <span>Views: <strong>{blog.viewCount || 0}</strong></span>
                                <span className="block mt-0.5">Likes: <strong>{blog.likesCount || 0}</strong></span>
                              </div>
                            </td>
                            <td className="py-4.5 px-6 text-slate-500">
                              {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Draft'}
                            </td>
                            <td className="py-4.5 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEditClick(blog)}
                                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-primary transition-all active:scale-95"
                                  title="Edit Blog"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(blog._id)}
                                  disabled={actionLoading}
                                  className="p-2 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-500 transition-all active:scale-95 disabled:opacity-50"
                                  title="Delete Blog"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {(view === 'create' || view === 'edit') && (
              <form onSubmit={view === 'create' ? handleCreateSubmit : handleEditSubmit} className="space-y-6">
                
                {/* 1. Details Card */}
                <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 space-y-4">
                  <h2 className="text-sm font-extrabold text-textdark uppercase tracking-wider pb-3 border-b">
                    Article details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Blog Title</label>
                      <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                        placeholder="e.g. Navigating your first PMP exam preparation"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Blog Slug (Auto-generated if blank)</label>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                        placeholder="e.g. navigating-pmp-exam-prep"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Category</label>
                      <input
                        type="text"
                        required
                        value={form.category}
                        onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                        placeholder="e.g. Project Management or Agile"
                      />
                    </div>

                    <div className="space-y-1">
                      <AdminFileUpload 
                        label="Banner Image" 
                        currentUrl={form.image}
                        onUploadSuccess={(url) => setForm(prev => ({ ...prev, image: url }))}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Read Time Description</label>
                      <input
                        type="text"
                        value={form.readTime}
                        onChange={(e) => setForm(prev => ({ ...prev, readTime: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                        placeholder="e.g. 5 mins"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={form.tags}
                        onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                        placeholder="e.g. PMP, Certification, Exam prep"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Content Card */}
                <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 space-y-4">
                  <h2 className="text-sm font-extrabold text-textdark uppercase tracking-wider pb-3 border-b">
                    Content & Excerpt
                  </h2>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Excerpt (Brief preview summary)</label>
                      <input
                        type="text"
                        required
                        value={form.excerpt}
                        onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                        placeholder="Provide a one-sentence summary for previews."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Article Content</label>
                      <textarea
                        required
                        rows="12"
                        value={form.content}
                        onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary transition-all font-mono"
                        placeholder="Detailed article body text..."
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Author Card */}
                <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 space-y-4">
                  <h2 className="text-sm font-extrabold text-textdark uppercase tracking-wider pb-3 border-b">
                    Author Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Author Name</label>
                      <input
                        type="text"
                        required
                        value={form.author.name}
                        onChange={(e) => setForm(prev => ({
                          ...prev,
                          author: { ...prev.author, name: e.target.value }
                        }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                        placeholder="LearnersKart Team"
                      />
                    </div>

                    <div className="space-y-1">
                      <AdminFileUpload 
                        label="Author Avatar" 
                        currentUrl={form.author.avatar}
                        onUploadSuccess={(url) => setForm(prev => ({
                          ...prev,
                          author: { ...prev.author, avatar: url }
                        }))}
                      />
                    </div>
                  </div>

                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setView('list')}
                    className="border border-slate-200 bg-white hover:bg-slate-50 text-textdark font-extrabold text-xs px-6 py-3 rounded-lg shadow-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-accent hover:bg-accent-dark text-white font-extrabold text-xs px-6 py-3 rounded-lg shadow transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {view === 'create' ? 'Publish Article' : 'Save Changes'}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogsPage;
