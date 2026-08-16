import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import AdminFileUpload from '../components/admin/AdminFileUpload';
import { BookOpen, Plus, Trash2, Edit2, X, Check, Save, ArrowLeft, PlusCircle } from 'lucide-react';


const AdminCoursesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // View state: 'list' | 'create' | 'edit'
  const [view, setView] = useState('list');
  const [editingCourseId, setEditingCourseId] = useState(null);

  // Form State
  const defaultFormState = {
    title: '',
    slug: '',
    category: 'Project Management',
    level: 'Intermediate',
    price: 0,
    originalPrice: '',
    students: 0,
    isFree: false,
    duration: '16 Hrs',
    shortDescription: '',
    description: '',
    thumbnail: '/courses/pmp-v6.jpg',
    isPublished: true,
    instructor: {
      name: 'Dr. Alok Kumar',
      avatar: 'https://learnerskart.com/wp-content/uploads/2024/10/co-instructor-06-60x60.jpg',
      designation: 'Senior Certification Lead',
      bio: 'Over 15+ years of experience in project management and professional corporate training.'
    },
    whatYoullLearn: [''],
    prerequisites: [''],
    targetAudience: [''],
    lessons: [{ title: '', contentType: 'video', duration: '15 mins' }],
    faqs: [{ question: '', answer: '' }]
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

  // Fetch all courses on mount
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/courses?limit=100');
      if (res.data.success) {
        setCourses(res.data.courses);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchCourses();
    }
  }, [user]);

  // Handlers for list inputs (whatYoullLearn, prerequisites, targetAudience)
  const handleListChange = (field, index, value) => {
    setForm(prev => {
      const updatedList = [...prev[field]];
      updatedList[index] = value;
      return { ...prev, [field]: updatedList };
    });
  };

  const addListItem = (field) => {
    setForm(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeListItem = (field, index) => {
    setForm(prev => {
      const updatedList = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: updatedList.length > 0 ? updatedList : [''] };
    });
  };

  // Handlers for dynamic lessons
  const handleLessonChange = (index, field, value) => {
    setForm(prev => {
      const updatedLessons = [...prev.lessons];
      updatedLessons[index] = { ...updatedLessons[index], [field]: value };
      return { ...prev, lessons: updatedLessons };
    });
  };

  const addLesson = () => {
    setForm(prev => ({
      ...prev,
      lessons: [...prev.lessons, { title: '', contentType: 'video', duration: '15 mins' }]
    }));
  };

  const removeLesson = (index) => {
    setForm(prev => {
      const updatedLessons = prev.lessons.filter((_, i) => i !== index);
      return { ...prev, lessons: updatedLessons.length > 0 ? updatedLessons : [{ title: '', contentType: 'video', duration: '15 mins' }] };
    });
  };

  // Handlers for dynamic FAQs
  const handleFaqChange = (index, field, value) => {
    setForm(prev => {
      const updatedFaqs = [...prev.faqs];
      updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
      return { ...prev, faqs: updatedFaqs };
    });
  };

  const addFaq = () => {
    setForm(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const removeFaq = (index) => {
    setForm(prev => {
      const updatedFaqs = prev.faqs.filter((_, i) => i !== index);
      return { ...prev, faqs: updatedFaqs.length > 0 ? updatedFaqs : [{ question: '', answer: '' }] };
    });
  };

  // Save new course
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      // Clean empty list strings
      const cleanedForm = {
        ...form,
        whatYoullLearn: form.whatYoullLearn.filter(item => item.trim() !== ''),
        prerequisites: form.prerequisites.filter(item => item.trim() !== ''),
        targetAudience: form.targetAudience.filter(item => item.trim() !== ''),
        lessons: form.lessons.filter(l => l.title.trim() !== ''),
        faqs: form.faqs.filter(f => f.question.trim() !== ''),
        originalPrice: form.originalPrice === '' ? null : Number(form.originalPrice)
      };

      const res = await api.post('/courses', cleanedForm);
      if (res.data.success) {
        alert('Course created successfully.');
        setView('list');
        fetchCourses();
      }
    } catch (err) {
      alert('Error creating course: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Course click handler
  const handleEditClick = (course) => {
    setEditingCourseId(course._id);
    setForm({
      title: course.title || '',
      slug: course.slug || '',
      category: course.category || 'Project Management',
      level: course.level || 'Intermediate',
      price: course.price || 0,
      originalPrice: course.originalPrice !== null && course.originalPrice !== undefined ? course.originalPrice : '',
      students: course.students || 0,
      isFree: course.isFree || false,
      duration: course.duration || '16 Hrs',
      shortDescription: course.shortDescription || '',
      description: course.description || '',
      thumbnail: course.thumbnail || '/courses/pmp-v6.jpg',
      isPublished: course.isPublished !== undefined ? course.isPublished : true,
      instructor: {
        name: course.instructor?.name || 'Dr. Alok Kumar',
        avatar: course.instructor?.avatar || 'https://learnerskart.com/wp-content/uploads/2024/10/co-instructor-06-60x60.jpg',
        designation: course.instructor?.designation || 'Senior Certification Lead',
        bio: course.instructor?.bio || 'Over 15+ years of experience in project management and professional corporate training.'
      },
      whatYoullLearn: course.whatYoullLearn && course.whatYoullLearn.length > 0 ? course.whatYoullLearn : [''],
      prerequisites: course.prerequisites && course.prerequisites.length > 0 ? course.prerequisites : [''],
      targetAudience: course.targetAudience && course.targetAudience.length > 0 ? course.targetAudience : [''],
      lessons: course.lessons && course.lessons.length > 0 ? course.lessons : [{ title: '', contentType: 'video', duration: '15 mins' }],
      faqs: course.faqs && course.faqs.length > 0 ? course.faqs : [{ question: '', answer: '' }]
    });
    setView('edit');
  };

  // Save updated course
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const cleanedForm = {
        ...form,
        whatYoullLearn: form.whatYoullLearn.filter(item => item.trim() !== ''),
        prerequisites: form.prerequisites.filter(item => item.trim() !== ''),
        targetAudience: form.targetAudience.filter(item => item.trim() !== ''),
        lessons: form.lessons.filter(l => l.title.trim() !== ''),
        faqs: form.faqs.filter(f => f.question.trim() !== ''),
        originalPrice: form.originalPrice === '' ? null : Number(form.originalPrice)
      };

      const res = await api.put(`/courses/${editingCourseId}`, cleanedForm);
      if (res.data.success) {
        alert('Course updated successfully.');
        setView('list');
        fetchCourses();
      }
    } catch (err) {
      alert('Error updating course: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  // Delete course
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course permanently? This will delete all course details.')) return;
    setActionLoading(true);
    try {
      const res = await api.delete(`/courses/${id}`);
      if (res.data.success) {
        alert('Course deleted successfully.');
        setCourses(prev => prev.filter(c => c._id !== id));
      }
    } catch (err) {
      alert('Error deleting course: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const categories = [
    'Project Management',
    'Quality Management',
    'Business Analysis',
    'Agile',
    'DevOps',
    'SAFe',
    'Digital Marketing',
    'Service Management'
  ];

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Navigation */}
          <DashboardSidebar />

          {/* Main Dashboard Panel */}
          <div className="flex-grow w-full lg:w-3/4 space-y-6">
            
            {/* Header section */}
            <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-textdark flex items-center gap-2">
                  <BookOpen className="w-6.5 h-6.5 text-primary" />
                  Manage Courses Catalog
                </h1>
                <p className="text-xs text-textmuted mt-1 font-semibold">
                  Add, update, or remove active courses, configure dynamic training format prices, syllabus, and FAQs.
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
                  Add New Course
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

            {/* View Switching */}
            {view === 'list' && (
              <div className="bg-white border border-slate-100 shadow-md rounded-2xl overflow-hidden">
                {loading ? (
                  <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
                    <span className="text-xs text-textmuted font-semibold">Loading courses...</span>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="py-20 text-center text-textmuted text-xs font-semibold">
                    No active courses found in database. Click "Add New Course" to get started.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider">
                          <th className="py-4 px-6">Course Title</th>
                          <th className="py-4 px-6">Category</th>
                          <th className="py-4 px-6">Price</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                        {courses.map((course) => (
                          <tr key={course._id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="py-4.5 px-6 font-bold text-textdark flex items-center gap-3">
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-10 h-6.5 rounded object-cover bg-slate-100 border flex-shrink-0"
                              />
                              <div className="truncate max-w-[240px]">
                                <span className="block truncate font-bold text-slate-800">{course.title}</span>
                                <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{course.slug}</span>
                              </div>
                            </td>
                            <td className="py-4.5 px-6">{course.category}</td>
                            <td className="py-4.5 px-6">
                              {course.isFree ? (
                                <span className="text-emerald-500 font-extrabold">Free</span>
                              ) : (
                                <span>₹{course.price?.toLocaleString('en-IN')}</span>
                              )}
                            </td>
                            <td className="py-4.5 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEditClick(course)}
                                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-primary transition-all active:scale-95"
                                  title="Edit Course Details"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(course._id)}
                                  disabled={actionLoading}
                                  className="p-2 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-500 transition-all active:scale-95 disabled:opacity-50"
                                  title="Delete Course permanently"
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
                
                {/* 1. Basic Info Card */}
                <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 space-y-4">
                  <h2 className="text-sm font-extrabold text-textdark uppercase tracking-wider pb-3 border-b">
                    Course Basic Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Course Title</label>
                      <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                        placeholder="e.g. Project Management Professional (PMP)"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Course Slug (Auto-generated if blank)</label>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                        placeholder="e.g. project-management-professional-pmp"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-lg outline-none cursor-pointer focus:bg-white focus:border-primary transition-all"
                      >
                        {categories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Course Level</label>
                      <select
                        value={form.level}
                        onChange={(e) => setForm(prev => ({ ...prev, level: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-lg outline-none cursor-pointer focus:bg-white focus:border-primary transition-all"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Course Duration</label>
                      <input
                        type="text"
                        value={form.duration}
                        onChange={(e) => setForm(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                        placeholder="e.g. 16 Hrs or 32 Hrs"
                      />
                    </div>

                    <div className="space-y-1">
                      <AdminFileUpload 
                        label="Thumbnail Image" 
                        currentUrl={form.thumbnail}
                        onUploadSuccess={(url) => setForm(prev => ({ ...prev, thumbnail: url }))}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Special/Discounted Price (INR)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={form.price}
                        onChange={(e) => setForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Original Standard Price (INR) (Optional)</label>
                      <input
                        type="number"
                        min="0"
                        value={form.originalPrice}
                        onChange={(e) => setForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                        placeholder="e.g. 14999"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Number of Students</label>
                      <input
                        type="number"
                        min="0"
                        value={form.students}
                        onChange={(e) => setForm(prev => ({ ...prev, students: Number(e.target.value) }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                        placeholder="e.g. 783"
                      />
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.isFree}
                          onChange={(e) => setForm(prev => ({ ...prev, isFree: e.target.checked }))}
                          className="rounded border-slate-300 text-primary w-4.5 h-4.5"
                        />
                        <span>Is Free Course</span>
                      </label>

                      <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.isPublished}
                          onChange={(e) => setForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                          className="rounded border-slate-300 text-primary w-4.5 h-4.5"
                        />
                        <span>Is Published</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 2. Course Description Card */}
                <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 space-y-4">
                  <h2 className="text-sm font-extrabold text-textdark uppercase tracking-wider pb-3 border-b">
                    Course Descriptions
                  </h2>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Short Description (Summary)</label>
                      <input
                        type="text"
                        required
                        value={form.shortDescription}
                        onChange={(e) => setForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                        placeholder="A brief sentence describing the course."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Full Course Description</label>
                      <textarea
                        required
                        rows="4"
                        value={form.description}
                        onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                        placeholder="Detailed course description."
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Comma-separated Lists / Multi-inputs Card */}
                <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 space-y-5">
                  <h2 className="text-sm font-extrabold text-textdark uppercase tracking-wider pb-3 border-b">
                    Key Highlights & Requirements
                  </h2>

                  {/* whatYoullLearn */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">What You'll Learn</label>
                      <button
                        type="button"
                        onClick={() => addListItem('whatYoullLearn')}
                        className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Item
                      </button>
                    </div>
                    <div className="space-y-2">
                      {form.whatYoullLearn.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleListChange('whatYoullLearn', idx, e.target.value)}
                            className="flex-grow bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                            placeholder="Key takeaway skill..."
                          />
                          <button
                            type="button"
                            onClick={() => removeListItem('whatYoullLearn', idx)}
                            className="p-2 border border-slate-200 rounded-lg hover:bg-red-50 text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* prerequisites */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Prerequisites</label>
                      <button
                        type="button"
                        onClick={() => addListItem('prerequisites')}
                        className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Item
                      </button>
                    </div>
                    <div className="space-y-2">
                      {form.prerequisites.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleListChange('prerequisites', idx, e.target.value)}
                            className="flex-grow bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                            placeholder="Prerequisite course or experience..."
                          />
                          <button
                            type="button"
                            onClick={() => removeListItem('prerequisites', idx)}
                            className="p-2 border border-slate-200 rounded-lg hover:bg-red-50 text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* targetAudience */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Target Audience</label>
                      <button
                        type="button"
                        onClick={() => addListItem('targetAudience')}
                        className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Item
                      </button>
                    </div>
                    <div className="space-y-2">
                      {form.targetAudience.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleListChange('targetAudience', idx, e.target.value)}
                            className="flex-grow bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                            placeholder="Target role or professionals..."
                          />
                          <button
                            type="button"
                            onClick={() => removeListItem('targetAudience', idx)}
                            className="p-2 border border-slate-200 rounded-lg hover:bg-red-50 text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Syllabus / Lessons Card */}
                <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b">
                    <h2 className="text-sm font-extrabold text-textdark uppercase tracking-wider">
                      Course Syllabus (Lessons)
                    </h2>
                    <button
                      type="button"
                      onClick={addLesson}
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Lesson
                    </button>
                  </div>

                  <div className="space-y-3">
                    {form.lessons.map((lesson, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Lesson #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeLesson(idx)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full p-1 border border-transparent hover:border-red-150 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Lesson Title</label>
                            <input
                              type="text"
                              required
                              value={lesson.title}
                              onChange={(e) => handleLessonChange(idx, 'title', e.target.value)}
                              className="w-full bg-white border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg outline-none focus:border-primary transition-all"
                              placeholder="e.g. Welcome and orientation"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Content Type</label>
                            <select
                              value={lesson.contentType}
                              onChange={(e) => handleLessonChange(idx, 'contentType', e.target.value)}
                              className="w-full bg-white border border-slate-200 text-xs font-bold px-3 py-2 rounded-lg outline-none cursor-pointer focus:border-primary transition-all"
                            >
                              <option value="video">Video</option>
                              <option value="doc">Document</option>
                              <option value="quiz">Quiz</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Duration Description</label>
                            <input
                              type="text"
                              value={lesson.duration}
                              onChange={(e) => handleLessonChange(idx, 'duration', e.target.value)}
                              className="w-full bg-white border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg outline-none focus:border-primary transition-all"
                              placeholder="e.g. 15 mins or 20 questions"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. FAQs Card */}
                <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b">
                    <h2 className="text-sm font-extrabold text-textdark uppercase tracking-wider">
                      Frequently Asked Questions (FAQs)
                    </h2>
                    <button
                      type="button"
                      onClick={addFaq}
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add FAQ
                    </button>
                  </div>

                  <div className="space-y-3">
                    {form.faqs.map((faq, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-400 uppercase font-black">FAQ #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeFaq(idx)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full p-1 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Question</label>
                            <input
                              type="text"
                              required
                              value={faq.question}
                              onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                              className="w-full bg-white border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg outline-none focus:border-primary transition-all"
                              placeholder="e.g. What is PMP?"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Answer</label>
                            <textarea
                              required
                              rows="3"
                              value={faq.answer}
                              onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                              className="w-full bg-white border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg outline-none focus:border-primary transition-all"
                              placeholder="Provide the answer..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Instructor Bio Card */}
                <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 space-y-4">
                  <h2 className="text-sm font-extrabold text-textdark uppercase tracking-wider pb-3 border-b">
                    Instructor Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Instructor Name</label>
                      <input
                        type="text"
                        required
                        value={form.instructor.name}
                        onChange={(e) => setForm(prev => ({
                          ...prev,
                          instructor: { ...prev.instructor, name: e.target.value }
                        }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                        placeholder="Dr. Alok Kumar"
                      />
                    </div>

                    <div className="space-y-1">
                      <AdminFileUpload 
                        label="Instructor Avatar" 
                        currentUrl={form.instructor.avatar}
                        onUploadSuccess={(url) => setForm(prev => ({
                          ...prev,
                          instructor: { ...prev.instructor, avatar: url }
                        }))}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Instructor Designation</label>
                      <input
                        type="text"
                        required
                        value={form.instructor.designation}
                        onChange={(e) => setForm(prev => ({
                          ...prev,
                          instructor: { ...prev.instructor, designation: e.target.value }
                        }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                        placeholder="e.g. Senior Certification Lead"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Instructor Bio</label>
                      <textarea
                        required
                        rows="3"
                        value={form.instructor.bio}
                        onChange={(e) => setForm(prev => ({
                          ...prev,
                          instructor: { ...prev.instructor, bio: e.target.value }
                        }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                        placeholder="Instructor biography..."
                      />
                    </div>
                  </div>
                </div>

                {/* Form Action Buttons */}
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
                    {view === 'create' ? 'Create Course' : 'Save Changes'}
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

export default AdminCoursesPage;
