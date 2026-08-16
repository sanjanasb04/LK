import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Users, Calendar, PlusCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageBatches() {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [mode, setMode] = useState('Online');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);


  const fetchBatchesAndCourses = async () => {
    try {
      setLoading(true);
      const [batchesRes, coursesRes] = await Promise.all([
        api.get('/batches'),
        api.get('/courses')
      ]);

      if (batchesRes.data.success) setBatches(batchesRes.data.batches);
      if (coursesRes.data.success) {
        setCourses(coursesRes.data.courses);
        if (coursesRes.data.courses.length > 0) {
          setCourse(coursesRes.data.courses[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatchesAndCourses();
  }, []);

  const handleDeleteBatch = async (id) => {
    if (!window.confirm('Delete this batch?')) return;
    try {
      const res = await api.delete('/batches/' + id);
      if (res.data.success) {
        toast.success('Batch deleted');
        fetchBatchesAndCourses();
      }
    } catch(err) {
      toast.error('Failed to delete');
    }
  };

  const handleEditBatch = (batch) => {
    setEditingId(batch._id);
    setName(batch.name);
    setCourse(batch.course?._id || '');
    setStartDate(batch.startDate ? new Date(batch.startDate).toISOString().split('T')[0] : '');
    setEndDate(batch.endDate ? new Date(batch.endDate).toISOString().split('T')[0] : '');
    setMode(batch.mode);
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setStartDate('');
    setEndDate('');
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    if (!name || !course || !startDate || !endDate) return;

    try {
      let res;
      if (editingId) {
         res = await api.put('/batches/' + editingId, { name, course, startDate, endDate, mode });
      } else {
         res = await api.post('/batches', { name, course, startDate, endDate, mode });
      }
      if (res.data.success) {
        toast.success(editingId ? 'Batch updated successfully!' : 'Study Batch created successfully!');
        setEditingId(null);
        setName('');
        setStartDate('');
        setEndDate('');
        fetchBatchesAndCourses();
      }

    } catch (err) {
      toast.error('Failed to create batch.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="text-left select-none">
        <h1 className="text-2xl font-black text-slate-800">Batch Scheduling</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Configure student cohort groups and start dates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left select-none">
        
        {/* CREATE BATCH FORM */}
        <div className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm h-fit">
          <h3 className="font-extrabold text-slate-800 text-xs border-b border-slate-50 pb-2 mb-4 flex justify-between">
            {editingId ? 'Edit Study Cohort' : 'Create Study Cohort'}
            {editingId && <button type="button" onClick={handleCancelEdit} className="text-red-500 hover:underline">Cancel</button>}
          </h3>

          
          <form onSubmit={handleCreateBatch} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Batch Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. PMP-WEEKEND-AUG2026"
                className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Select Course</label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none"
              >
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Batch Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none"
              >
                <option>Online</option>
                <option>Classroom</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
            >
              {editingId ? 'Update Batch' : 'Schedule Batch'}
            </button>

          </form>
        </div>

        {/* BATCHES LIST */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-bold text-slate-800 text-xs">Active & Scheduled Batches</h3>
          {loading ? (
            <div className="p-10 bg-white border border-slate-100 rounded-panel text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : batches.length === 0 ? (
            <div className="p-8 bg-white border border-slate-100 rounded-panel text-center text-slate-400">
              No batches scheduled yet.
            </div>
          ) : (
            <div className="space-y-3">
              {batches.map(batch => (
                <div key={batch._id} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs leading-snug">{batch.name}</h4>
                    <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">
                      Course: {batch.course?.title} • Mode: {batch.mode}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">
                      Schedules: {new Date(batch.startDate).toLocaleDateString()} to {new Date(batch.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <button onClick={() => handleEditBatch(batch)} className="text-primary hover:underline text-[9px] font-bold">Edit</button>
                      <button onClick={() => handleDeleteBatch(batch._id)} className="text-red-500 hover:underline text-[9px] font-bold">Delete</button>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-success/15 text-success rounded-lg uppercase tracking-wider">
                      {batch.learners?.length || 0} Learners
                    </span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
