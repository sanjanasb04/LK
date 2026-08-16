import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import AdminFileUpload from '../../components/admin/AdminFileUpload';
import { Search, ShieldAlert, CheckCircle, Trash2, Edit2, Plus, ArrowLeft, PlusCircle, PlayCircle, FileText, HelpCircle, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // View state: 'list' | 'create' | 'edit'
  const [view, setView] = useState('list');
  const [editingCourseId, setEditingCourseId] = useState(null);

  // Wizard state: 1 (Specs), 2 (Syllabus)
  const [wizardStep, setWizardStep] = useState(1);

  // Specs state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('PMP Exam Prep');
  const [level, setLevel] = useState('Beginner');
  const [price, setPrice] = useState('0');
  const [isFree, setIsFree] = useState(true);
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150');

  // Modules & lessons state
  const [modules, setModules] = useState([
    { title: 'Module 1: Foundations', lessons: [{ title: 'Overview', type: 'video', duration: 10, content: 'https://www.w3schools.com/html/mov_bbb.mp4' }] }
  ]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/courses');
      if (res.data.success) {
        setCourses(res.data.courses);
        setFiltered(res.data.courses);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load course list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    let result = [...courses];
    if (search.trim() !== '') {
      result = result.filter(c => 
        c.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter !== 'All') {
      const isPub = statusFilter === 'Published';
      result = result.filter(c => c.isPublished === isPub);
    }
    setFiltered(result);
  }, [search, statusFilter, courses]);

  const handlePublishToggle = async (id, isPublished) => {
    try {
      const res = await api.put(`/courses/${id}`, { isPublished: !isPublished });
      if (res.data.success) {
        toast.success(!isPublished ? 'Course published!' : 'Course un-published.');
        setCourses(prev => 
          prev.map(c => c._id === id ? { ...c, isPublished: !isPublished } : c)
        );
      }
    } catch (err) {
      toast.error('Failed to update publication status.');
    }
  };

  const handleAddModule = () => {
    setModules(prev => [
      ...prev,
      { title: `Module ${prev.length + 1}: Syllabus Chapter`, lessons: [] }
    ]);
  };

  const handleRemoveModule = (modIdx) => {
    setModules(prev => prev.filter((_, idx) => idx !== modIdx));
  };

  const handleModuleTitleChange = (modIdx, val) => {
    setModules(prev => 
      prev.map((mod, idx) => idx === modIdx ? { ...mod, title: val } : mod)
    );
  };

  const handleAddLesson = (modIdx, type) => {
    setModules(prev => 
      prev.map((mod, idx) => {
        if (idx !== modIdx) return mod;
        return {
          ...mod,
          lessons: [
            ...mod.lessons,
            { title: 'New Lesson Detail', type: type, duration: 15, content: type === 'quiz' ? 'q101' : 'https://www.w3schools.com/html/mov_bbb.mp4' }
          ]
        };
      })
    );
  };

  const handleRemoveLesson = (modIdx, lesIdx) => {
    setModules(prev => 
      prev.map((mod, idx) => {
        if (idx !== modIdx) return mod;
        return {
          ...mod,
          lessons: mod.lessons.filter((_, lIdx) => lIdx !== lesIdx)
        };
      })
    );
  };

  const handleLessonChange = (modIdx, lesIdx, field, val) => {
    setModules(prev => 
      prev.map((mod, idx) => {
        if (idx !== modIdx) return mod;
        const updatedLessons = mod.lessons.map((les, lIdx) => 
          lIdx === lesIdx ? { ...les, [field]: val } : les
        );
        return { ...mod, lessons: updatedLessons };
      })
    );
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter course title.');
      return;
    }

    setActionLoading(true);
    try {
      // First save general specs
      const res = await api.post('/courses', {
        title,
        subtitle,
        description,
        category,
        level,
        price: isFree ? 0 : Number(price),
        isFree,
        thumbnail
      });

      if (res.data.success) {
        const courseId = res.data.course._id;
        // Then update curriculum modules
        await api.put(`/courses/${courseId}`, {
          modules,
          isPublished: true
        });

        toast.success('Course created and published successfully!');
        setView('list');
        resetForm();
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create course.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (course) => {
    setEditingCourseId(course._id);
    setTitle(course.title || '');
    setSubtitle(course.subtitle || '');
    setDescription(course.description || '');
    setCategory(course.category || 'PMP Exam Prep');
    setLevel(course.level || 'Beginner');
    setPrice(String(course.price || 0));
    setIsFree(course.isFree || false);
    setThumbnail(course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150');
    setModules(course.modules || []);
    setWizardStep(1);
    setView('edit');
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await api.put(`/courses/${editingCourseId}`, {
        title,
        subtitle,
        description,
        category,
        level,
        price: isFree ? 0 : Number(price),
        isFree,
        thumbnail,
        modules
      });

      if (res.data.success) {
        toast.success('Course updated successfully!');
        setView('list');
        resetForm();
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update course.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course permanently? This will erase the syllabus modules.')) return;
    setActionLoading(true);
    try {
      const res = await api.delete(`/courses/${id}`);
      if (res.data.success) {
        toast.success('Course deleted.');
        setCourses(prev => prev.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete course.');
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setDescription('');
    setCategory('PMP Exam Prep');
    setLevel('Beginner');
    setPrice('0');
    setIsFree(true);
    setThumbnail('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150');
    setModules([
      { title: 'Module 1: Foundations', lessons: [{ title: 'Overview', type: 'video', duration: 10, content: 'https://www.w3schools.com/html/mov_bbb.mp4' }] }
    ]);
    setEditingCourseId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none text-left">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Course Administration</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">Audit training programs, construct syllabuses, and publish catalogs.</p>
        </div>

        {view === 'list' ? (
          <button
            onClick={() => {
              resetForm();
              setView('create');
              setWizardStep(1);
            }}
            className="px-5 py-3 bg-accent hover:bg-accent-dark text-white text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
          >
            <PlusCircle size={15} />
            Create Course
          </button>
        ) : (
          <button
            onClick={() => setView('list')}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl active:scale-95 transition-all flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            Back to List
          </button>
        )}
      </div>

      {view === 'list' ? (
        <div className="space-y-6">
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white border border-slate-100 p-4 rounded-panel shadow-sm select-none">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl w-full md:w-85">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search courses by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-slate-700 w-full placeholder:text-slate-400 font-semibold"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 px-3 py-2 text-xs font-bold rounded-xl bg-white text-slate-600 w-full md:w-fit outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Drafts</option>
            </select>
          </div>

          {/* Courses Directory Table */}
          {loading ? (
            <div className="p-16 flex justify-center bg-white border border-slate-100 rounded-panel">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 bg-white border border-slate-100 rounded-panel text-slate-400 text-center select-none">
              <ShieldAlert size={42} className="mx-auto text-slate-200 mb-2" />
              <h3 className="font-extrabold text-slate-700 text-sm">No courses matching filters</h3>
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-panel shadow-sm overflow-hidden text-left">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-500">
                  <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-100 select-none">
                    <tr>
                      <th className="px-6 py-3">Course Title</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                    {filtered.map(c => (
                      <tr key={c._id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-bold text-slate-700 flex items-center gap-3">
                          <img
                            src={c.thumbnail}
                            alt="thumb"
                            className="w-11 h-7 object-cover bg-slate-100 rounded border shrink-0"
                          />
                          <div>
                            <span className="block truncate max-w-[300px]">{c.title}</span>
                            <span className="text-[9px] text-slate-400 mt-0.5 block font-bold">Level: {c.level}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{c.category}</td>
                        <td className="px-6 py-4">
                          {c.isFree ? (
                            <span className="text-success font-bold">Free</span>
                          ) : (
                            <span>₹{c.price?.toLocaleString('en-IN')}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 select-none">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-lg uppercase tracking-wider ${
                            c.isPublished 
                              ? 'bg-success/15 text-success' 
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                            {c.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right select-none" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handlePublishToggle(c._id, c.isPublished)}
                              className={`px-3 py-1.5 text-[10px] border font-extrabold rounded-lg transition-colors ${
                                c.isPublished 
                                  ? 'border-red-200 text-red-500 hover:bg-red-50' 
                                  : 'border-success-light text-success hover:bg-success/5'
                              }`}
                            >
                              {c.isPublished ? 'Unpublish' : 'Publish'}
                            </button>
                            <button
                              onClick={() => handleEditClick(c)}
                              className="p-1.5 border border-slate-200 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-50 active:scale-95 transition-all"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(c._id)}
                              disabled={actionLoading}
                              className="p-1.5 border border-slate-200 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 active:scale-95 transition-all disabled:opacity-50"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* WIZARD COURSE CREATION / EDITING FORM */
        <form onSubmit={view === 'create' ? handleCreateCourse : handleUpdateCourse} className="space-y-6 text-left">
          
          {/* Steps tracker */}
          <div className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm flex items-center justify-center gap-12 select-none">
            <button
              type="button"
              onClick={() => setWizardStep(1)}
              className={`flex items-center gap-2 text-xs font-extrabold pb-1.5 border-b-2 transition-colors ${
                wizardStep === 1 ? 'border-primary text-primary' : 'border-transparent text-slate-400'
              }`}
            >
              <span className="p-1 px-2.5 rounded-full bg-slate-100 text-[10px]">1</span>
              General Specifications
            </button>
            <button
              type="button"
              onClick={() => setWizardStep(2)}
              className={`flex items-center gap-2 text-xs font-extrabold pb-1.5 border-b-2 transition-colors ${
                wizardStep === 2 ? 'border-primary text-primary' : 'border-transparent text-slate-400'
              }`}
            >
              <span className="p-1 px-2.5 rounded-full bg-slate-100 text-[10px]">2</span>
              Curriculum & Syllabus
            </button>
          </div>

          {/* STEP 1: SPECS */}
          {wizardStep === 1 && (
            <div className="bg-white border border-slate-100 p-6 rounded-panel shadow-sm space-y-4">
              <h2 className="font-extrabold text-slate-800 text-xs border-b border-slate-50 pb-2 mb-2 select-none uppercase tracking-wide">
                Course Specifications
              </h2>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Course Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CAPM® Certified Associate in Project Management Mastery"
                  className="w-full border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Course Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Aligned with PMI standards. Pass on your first attempt."
                  className="w-full border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-slate-200 px-3 py-2.5 text-xs rounded-xl bg-white outline-none focus:ring-1 focus:ring-primary font-bold"
                  >
                    <option>PMP Exam Prep</option>
                    <option>Agile & Scrum</option>
                    <option>Prince2 Frameworks</option>
                    <option>Business Analysis</option>
                    <option>Quality Management</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full border border-slate-200 px-3 py-2.5 text-xs rounded-xl bg-white outline-none focus:ring-1 focus:ring-primary font-bold"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <AdminFileUpload 
                    label="Thumbnail Image URL" 
                    currentUrl={thumbnail}
                    onUploadSuccess={(url) => setThumbnail(url)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Price (INR)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      disabled={isFree}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50 font-bold"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6 select-none">
                    <input
                      type="checkbox"
                      id="isFree"
                      checked={isFree}
                      onChange={() => setIsFree(!isFree)}
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="isFree" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer">Free Course</label>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Course Long Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide an overview of the curriculum coverage, benefits, and target outcomes..."
                  className="w-full border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary font-semibold"
                />
              </div>

              <div className="pt-4 select-none">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-5 py-3 bg-primary hover:bg-primary-dark text-white text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center gap-1 mx-auto active:scale-95"
                >
                  Continue to Syllabus
                  <ChevronRight size={14} />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: SYLLABUS BUILDER */}
          {wizardStep === 2 && (
            <div className="space-y-5 text-left">
              
              {/* Modules Header */}
              <div className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm flex items-center justify-between gap-4 select-none">
                <div>
                  <h2 className="text-xs font-black text-slate-700 uppercase tracking-wider">Curriculum Builder Outline</h2>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Define structured learning units, modules, videos, PDFs, and checkpoint quizzes.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddModule}
                  className="px-4 py-2 border border-primary text-primary hover:bg-primary/5 text-[10px] font-bold rounded-lg active:scale-95 transition-all"
                >
                  + Add Module
                </button>
              </div>

              {/* Modules List */}
              <div className="space-y-5">
                {modules.map((mod, modIdx) => (
                  <div key={modIdx} className="bg-white border border-slate-100 p-6 rounded-panel shadow-sm space-y-4">
                    
                    {/* Module Title bar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-3 border-b select-none">
                      <div className="flex items-center gap-2 w-full max-w-md">
                        <span className="p-1 px-2.5 bg-slate-100 rounded text-[9px] font-bold text-slate-500 uppercase">Mod {modIdx + 1}</span>
                        <input
                          type="text"
                          required
                          value={mod.title}
                          onChange={(e) => handleModuleTitleChange(modIdx, e.target.value)}
                          className="w-full border-none p-1 text-xs font-black text-slate-700 outline-none focus:bg-slate-50 focus:rounded"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleAddLesson(modIdx, 'video')}
                          className="text-[9px] font-bold text-primary hover:underline"
                        >
                          + Video
                        </button>
                        <span className="text-slate-200">|</span>
                        <button
                          type="button"
                          onClick={() => handleAddLesson(modIdx, 'pdf')}
                          className="text-[9px] font-bold text-highlight hover:underline"
                        >
                          + PDF
                        </button>
                        <span className="text-slate-200">|</span>
                        <button
                          type="button"
                          onClick={() => handleAddLesson(modIdx, 'quiz')}
                          className="text-[9px] font-bold text-accent hover:underline"
                        >
                          + Quiz
                        </button>
                        {modules.length > 1 && (
                          <>
                            <span className="text-slate-200">|</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveModule(modIdx)}
                              className="text-[9px] font-bold text-red-500 hover:underline"
                            >
                              Delete Module
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Lessons nested inside Module */}
                    <div className="space-y-3.5">
                      {mod.lessons?.length === 0 ? (
                        <div className="py-6 text-center text-slate-400 text-[10px] font-semibold select-none border border-dashed rounded-lg">
                          No lessons added. Click Video, PDF, or Quiz shortcuts above to insert items.
                        </div>
                      ) : (
                        mod.lessons.map((les, lesIdx) => (
                          <div key={lesIdx} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                            
                            <div className="flex items-start md:items-center gap-2.5 w-full md:max-w-xl">
                              <div className="p-2 bg-white rounded-lg shadow-sm border shrink-0 text-slate-500 select-none">
                                {les.type === 'video' ? <PlayCircle size={15} className="text-primary" /> : les.type === 'pdf' ? <FileText size={15} className="text-highlight" /> : <HelpCircle size={15} className="text-accent" />}
                              </div>
                              <div className="space-y-1 w-full">
                                <input
                                  type="text"
                                  required
                                  value={les.title}
                                  onChange={(e) => handleLessonChange(modIdx, lesIdx, 'title', e.target.value)}
                                  placeholder="Lesson title..."
                                  className="w-full bg-transparent border-none p-0 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:p-1 focus:rounded"
                                />
                                {les.type === 'quiz' ? (
                                  <input
                                    type="text"
                                    required
                                    value={les.content}
                                    onChange={(e) => handleLessonChange(modIdx, lesIdx, 'content', e.target.value)}
                                    placeholder="Enter Quiz ID (e.g. q101)"
                                    className="w-full bg-transparent border-none p-0 text-[10px] text-slate-400 outline-none font-semibold focus:bg-white focus:p-1 focus:rounded"
                                  />
                                ) : (
                                  <AdminFileUpload
                                    label={`Upload ${les.type === 'video' ? 'Video' : 'PDF'}`}
                                    currentUrl={les.content}
                                    accept={les.type === 'video' ? 'video/*' : 'application/pdf'}
                                    onUploadSuccess={(url) => handleLessonChange(modIdx, lesIdx, 'content', url)}
                                  />
                                )}

                              </div>
                            </div>

                            <div className="flex items-center gap-4 justify-between md:justify-end select-none shrink-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Duration:</span>
                                <input
                                  type="number"
                                  required
                                  min={1}
                                  value={les.duration}
                                  onChange={(e) => handleLessonChange(modIdx, lesIdx, 'duration', Number(e.target.value))}
                                  className="w-14 border border-slate-200 px-1.5 py-1 text-[10px] rounded bg-white text-center font-bold outline-none"
                                />
                                <span className="text-[9px] font-bold text-slate-400">mins</span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveLesson(modIdx, lesIdx)}
                                className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 transition-all"
                                title="Remove lesson"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>

                          </div>
                        ))
                      )}
                    </div>

                  </div>
                ))}
              </div>

              {/* Wizard Save footer */}
              <div className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm flex flex-col sm:flex-row gap-4 items-stretch justify-between select-none">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl active:scale-95 transition-all text-center"
                >
                  ← Back to Specs
                </button>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-3 bg-accent hover:bg-accent-dark text-white text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-95 text-center uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Save size={15} />
                  {view === 'create' ? 'Publish Course' : 'Save Modifications'}
                </button>
              </div>

            </div>
          )}

        </form>
      )}

    </div>
  );
}

// Simple Helper Components for Wizard Icon layout
function ChevronRight(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ChevronLeft(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
