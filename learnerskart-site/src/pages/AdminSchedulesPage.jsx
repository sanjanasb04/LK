import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import { Calendar, Plus, Trash2, Edit2, X, Check, Save } from 'lucide-react';

const AdminSchedulesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states for creating a schedule
  const [newSchedule, setNewSchedule] = useState({
    date: '',
    weekday: true,
    month: 7
  });

  // Editing state
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [editForm, setEditForm] = useState({
    date: '',
    weekday: true,
    month: 7
  });

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
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses?limit=100');
        if (res.data.success) {
          setCourses(res.data.courses);
          if (res.data.courses.length > 0) {
            setSelectedCourseId(res.data.courses[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    if (user && user.role === 'admin') {
      fetchCourses();
    }
  }, [user]);

  // Fetch schedules when courseId changes
  const fetchSchedules = async () => {
    if (!selectedCourseId) return;
    setLoading(true);
    try {
      const res = await api.get(`/schedules?courseId=${selectedCourseId}`);
      if (res.data.success) {
        setSchedules(res.data.schedules);
      }
    } catch (err) {
      console.error('Error fetching schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [selectedCourseId]);

  // Create schedule
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newSchedule.date.trim()) {
      alert('Please provide a valid date string.');
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.post('/schedules', {
        courseId: selectedCourseId,
        date: newSchedule.date,
        weekday: newSchedule.weekday,
        month: Number(newSchedule.month)
      });
      if (res.data.success) {
        setSchedules(prev => [res.data.schedule, ...prev]);
        setNewSchedule({ date: '', weekday: true, month: 7 });
      }
    } catch (err) {
      alert('Error creating schedule: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  // Edit schedule
  const handleEditClick = (sch) => {
    setEditingScheduleId(sch._id);
    setEditForm({
      date: sch.date,
      weekday: sch.weekday,
      month: sch.month
    });
  };

  const handleUpdate = async (id) => {
    setActionLoading(true);
    try {
      const res = await api.put(`/schedules/${id}`, {
        date: editForm.date,
        weekday: editForm.weekday,
        month: Number(editForm.month)
      });
      if (res.data.success) {
        setSchedules(prev =>
          prev.map(s => (s._id === id ? res.data.schedule : s))
        );
        setEditingScheduleId(null);
      }
    } catch (err) {
      alert('Error updating schedule: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  // Delete schedule
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule date?')) return;
    setActionLoading(true);
    try {
      const res = await api.delete(`/schedules/${id}`);
      if (res.data.success) {
        setSchedules(prev => prev.filter(s => s._id !== id));
      }
    } catch (err) {
      alert('Error deleting schedule: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const getMonthName = (m) => {
    const list = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return list[m - 1] || m;
  };

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <DashboardSidebar />

          {/* Main Panel */}
          <div className="flex-grow w-full lg:w-3/4 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-textdark flex items-center gap-2">
                  <Calendar className="w-6.5 h-6.5 text-primary" />
                  Manage Course Training Dates
                </h1>
                <p className="text-xs text-textmuted mt-1 font-semibold">
                  Add, modify or remove active training slots and weekday/weekend cohorts.
                </p>
              </div>

              {/* Course Selection Dropdown */}
              <div className="w-full sm:w-auto">
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full sm:w-64 bg-slate-50 border border-slate-200 text-xs font-bold px-3.5 py-3 rounded-lg outline-none cursor-pointer focus:bg-white focus:border-primary transition-all"
                >
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Form Card for Adding New Batch */}
            <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6">
              <h2 className="text-sm font-extrabold text-textdark uppercase tracking-wider mb-4">
                Add New Training Batch
              </h2>
              
              <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Date Input */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Date String
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jul 28 - Jul 31, 2026"
                    value={newSchedule.date}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary transition-all"
                  />
                </div>

                {/* Weekday/Weekend Selector */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Schedule Type
                  </label>
                  <select
                    value={String(newSchedule.weekday)}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, weekday: e.target.value === 'true' }))}
                    className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-lg outline-none cursor-pointer focus:bg-white focus:border-primary transition-all"
                  >
                    <option value="true">Weekday</option>
                    <option value="false">Weekend</option>
                  </select>
                </div>

                {/* Month Selector */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Month
                  </label>
                  <select
                    value={newSchedule.month}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, month: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-lg outline-none cursor-pointer focus:bg-white focus:border-primary transition-all"
                  >
                    {[7, 8, 9, 10, 11, 12].map(m => (
                      <option key={m} value={m}>
                        {getMonthName(m)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full bg-accent hover:bg-accent-dark text-white font-extrabold text-xs py-3 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Add Cohort
                </button>
              </form>
            </div>

            {/* Schedules Table */}
            <div className="bg-white border border-slate-100 shadow-md rounded-2xl overflow-hidden">
              {loading ? (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
                  <span className="text-xs text-textmuted font-semibold">Loading schedules...</span>
                </div>
              ) : schedules.length === 0 ? (
                <div className="py-20 text-center text-textmuted text-xs font-semibold">
                  No active training schedules found in database for this course.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider">
                        <th className="py-4 px-6">Date Range</th>
                        <th className="py-4 px-6">Schedule Type</th>
                        <th className="py-4 px-6">Month</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                      {schedules.map((sch) => {
                        const isEditing = editingScheduleId === sch._id;
                        return (
                          <tr key={sch._id} className="hover:bg-slate-50/40 transition-colors">
                            {/* Date Column */}
                            <td className="py-4.5 px-6">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editForm.date}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                                  className="bg-white border border-slate-200 text-xs px-2.5 py-1.5 rounded outline-none focus:border-primary font-semibold"
                                />
                              ) : (
                                <span className="font-extrabold text-textdark">{sch.date}</span>
                              )}
                            </td>

                            {/* Schedule Type Column */}
                            <td className="py-4.5 px-6">
                              {isEditing ? (
                                <select
                                  value={String(editForm.weekday)}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, weekday: e.target.value === 'true' }))}
                                  className="bg-white border border-slate-200 text-xs px-2.5 py-1 rounded outline-none cursor-pointer focus:border-primary font-bold"
                                >
                                  <option value="true">Weekday</option>
                                  <option value="false">Weekend</option>
                                </select>
                              ) : (
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                                  sch.weekday ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                  {sch.weekday ? 'weekday' : 'weekend'}
                                </span>
                              )}
                            </td>

                            {/* Month Column */}
                            <td className="py-4.5 px-6">
                              {isEditing ? (
                                <select
                                  value={editForm.month}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, month: Number(e.target.value) }))}
                                  className="bg-white border border-slate-200 text-xs px-2.5 py-1 rounded outline-none cursor-pointer focus:border-primary font-bold"
                                >
                                  {[7, 8, 9, 10, 11, 12].map(m => (
                                    <option key={m} value={m}>
                                      {getMonthName(m)}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <span>{getMonthName(sch.month)}</span>
                              )}
                            </td>

                            {/* Actions Column */}
                            <td className="py-4.5 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {isEditing ? (
                                  <>
                                    <button
                                      onClick={() => handleUpdate(sch._id)}
                                      disabled={actionLoading}
                                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-all"
                                      title="Save Changes"
                                    >
                                      <Save className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => setEditingScheduleId(null)}
                                      className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-all"
                                      title="Cancel"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleEditClick(sch)}
                                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-all"
                                      title="Edit Batch"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(sch._id)}
                                      disabled={actionLoading}
                                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all disabled:opacity-50"
                                      title="Delete Batch"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSchedulesPage;
