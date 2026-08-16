import React, { useState, useEffect } from 'react';
import { ShieldCheck, MessageSquare, Check, Trash2, Calendar, Star, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import AdminFileUpload from '../components/admin/AdminFileUpload';

const AdminTestimonialsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Lists
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // stores active testimonial ID being processed

  // Form / Creation states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newAvatar, setNewAvatar] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newQuote, setNewQuote] = useState('');

  // Redirect if not logged in or if user is not admin/editor
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'admin' && user.role !== 'editor') {
        navigate('/dashboard');
      }
    }
  }, [user, authLoading, navigate]);

  const fetchAllTestimonials = async () => {
    try {
      const res = await api.get('/testimonials/admin');
      if (res.data.success) {
        setTestimonials(res.data.testimonials);
      }
    } catch (error) {
      console.error('Error fetching testimonials for admin/editor:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'editor')) {
      fetchAllTestimonials();
    }
  }, [user]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const res = await api.put(`/testimonials/admin/${id}/approve`);
      if (res.data.success) {
        // Update local list
        setTestimonials((prev) =>
          prev.map((item) => (item._id === id ? { ...item, isApproved: true } : item))
        );
      }
    } catch (error) {
      alert('Approval request failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to reject and delete this review?')) return;
    setActionLoading(id);
    try {
      const res = await api.delete(`/testimonials/admin/${id}`);
      if (res.data.success) {
        // Remove from local list
        setTestimonials((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      alert('Delete request failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newName || !newQuote) return;
    setCreateLoading(true);
    try {
      const res = await api.post('/testimonials/admin', {
        name: newName,
        role: newRole || 'Learner',
        avatar: newAvatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        rating: newRating,
        quote: newQuote,
      });

      if (res.data.success) {
        // Add to testimonials list locally
        setTestimonials((prev) => [res.data.testimonial, ...prev]);
        // Reset form
        setNewName('');
        setNewRole('');
        setNewAvatar('');
        setNewRating(5);
        setNewQuote('');
        setShowCreateModal(false);
      }
    } catch (error) {
      alert('Failed to add testimonial: ' + (error.response?.data?.message || error.message));
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT: Sidebar navigation */}
          <DashboardSidebar />

          {/* RIGHT: Admin Moderation Panel */}
          <main className="flex-grow space-y-6 w-full">
            
            {/* Header Title */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-textdark">Feedback Review Manager</h2>
                <p className="text-xs text-textmuted font-semibold leading-tight uppercase tracking-wider">
                  Admin Control Panel • Client Testimonials Moderation
                </p>
              </div>
              <div className="bg-primary/10 p-3 rounded-2xl hidden sm:block">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
            </div>

            {/* List Table */}
            <div className="bg-white border border-slate-100 shadow-md rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
                <h3 className="font-extrabold text-sm text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Client Reviews Submission List
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-primary hover:bg-primary-dark text-white font-extrabold text-xs px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all active:scale-95"
                  >
                    + Add Testimonial
                  </button>
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-1.5 rounded">
                    Total: {testimonials.length}
                  </span>
                </div>
              </div>

              {loading ? (
                /* Loading State */
                <div className="p-12 text-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                  <p className="text-xs text-textmuted font-semibold">Loading submissions...</p>
                </div>
              ) : testimonials.length === 0 ? (
                /* Empty state */
                <div className="p-12 text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-sm text-textdark">No feedback reviews found</h4>
                  <p className="text-xs text-textmuted max-w-xs mx-auto">
                    There are currently no reviews in the system database log. Click "+ Add Testimonial" to upload one.
                  </p>
                </div>
              ) : (
                /* Testimonials List Grid / Table */
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                        <th className="px-6 py-4">Client User</th>
                        <th className="px-6 py-4">Comment Quote</th>
                        <th className="px-6 py-4">Rating</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {testimonials.map((t) => (
                        <tr key={t._id} className="hover:bg-slate-50/50 transition-colors">
                          
                          {/* Client Info */}
                          <td className="px-6 py-4.5 min-w-[200px]">
                            <div className="flex items-center gap-3">
                              <img
                                src={t.avatar}
                                alt={t.name}
                                className="w-9 h-9 rounded-lg object-cover border"
                              />
                              <div>
                                <p className="font-extrabold text-textdark">{t.name}</p>
                                <p className="text-[10px] text-textmuted">{t.role}</p>
                              </div>
                            </div>
                          </td>

                          {/* Quote */}
                          <td className="px-6 py-4.5 max-w-sm">
                            <p className="line-clamp-2 text-slate-600 font-medium italic leading-relaxed">
                              "{t.quote}"
                            </p>
                          </td>

                          {/* Stars Rating */}
                          <td className="px-6 py-4.5 whitespace-nowrap">
                            <div className="flex items-center gap-0.5 text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </td>

                          {/* Approval Status */}
                          <td className="px-6 py-4.5 whitespace-nowrap">
                            {t.isApproved ? (
                              <span className="bg-emerald-50 text-success border border-emerald-100 text-[10px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
                                Approved
                              </span>
                            ) : (
                              <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
                                Pending
                              </span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="px-6 py-4.5 text-right whitespace-nowrap">
                            <div className="flex justify-end gap-2">
                              {!t.isApproved && (
                                <button
                                  onClick={() => handleApprove(t._id)}
                                  disabled={actionLoading === t._id}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-success p-2 rounded-lg border border-emerald-100 transition-colors disabled:opacity-50"
                                  title="Approve and Publish Review"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(t._id)}
                                disabled={actionLoading === t._id}
                                className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg border border-red-100 transition-colors disabled:opacity-50"
                                title="Reject and Delete Review"
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

          </main>

        </div>
      </div>

      {/* CREATE TESTIMONIAL MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in text-left">
          <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative transform scale-100 transition-all duration-300">
            
            {/* Close button */}
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-extrabold text-sm"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2.5 rounded-xl">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-textdark uppercase tracking-wider">Add Testimonial</h4>
                <p className="text-[10px] text-textmuted font-semibold uppercase mt-0.5">Upload a client review in background</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              
              {/* Client Name */}
              <div className="space-y-1.5">
                <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-wider">Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brian C. Kim"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs outline-none focus:bg-white focus:border-primary font-semibold text-slate-700"
                />
              </div>

              {/* Job Title / Role */}
              <div className="space-y-1.5">
                <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-wider">Job Designation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sales Manager"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs outline-none focus:bg-white focus:border-primary font-semibold text-slate-700"
                />
              </div>

              {/* Rating Star Selector */}
              <div className="space-y-1.5">
                <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-wider">Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="text-amber-400 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star className={`w-6 h-6 ${newRating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Avatar URL */}
              <div className="space-y-1.5">
                <AdminFileUpload 
                  label="Avatar Image (Optional)" 
                  currentUrl={newAvatar}
                  onUploadSuccess={(url) => setNewAvatar(url)}
                />
              </div>

              {/* Quote Comments */}
              <div className="space-y-1.5">
                <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-wider">Review Quote / Message</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Type the review quote content..."
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs outline-none focus:bg-white focus:border-primary font-semibold text-slate-700 leading-relaxed"
                ></textarea>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={createLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75"
              >
                {createLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Adding Testimonial...</span>
                  </>
                ) : (
                  <span>Publish Testimonial</span>
                )}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminTestimonialsPage;
