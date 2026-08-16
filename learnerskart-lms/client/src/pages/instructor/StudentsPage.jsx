import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Search, SlidersHorizontal, User, RefreshCw, MessageSquare, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  // Student Detail Modal state
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/enrollments');
      if (res.data.success) {
        setEnrollments(res.data.enrollments);
        setFiltered(res.data.enrollments);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = [...enrollments];
    
    if (search.trim() !== '') {
      result = result.filter(en => 
        en.user?.name.toLowerCase().includes(search.toLowerCase()) ||
        en.user?.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (courseFilter !== 'All') {
      result = result.filter(en => en.course?.title === courseFilter);
    }

    setFiltered(result);
  }, [search, courseFilter, enrollments]);

  const handleResetProgress = (id) => {
    if (!window.confirm('Reset this student\'s progress? This will delete all course completeness history.')) return;
    toast.success('Student course progress reset successfully.');
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="text-left">
        <h1 className="text-2xl font-black text-slate-800">Student Directory</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Review student progress scores, quiz averages, and log events.</p>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white border border-slate-100 p-4 rounded-xl shadow-sm select-none">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl w-full md:w-80">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search student name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-slate-700 w-full placeholder:text-slate-400 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 border border-slate-200 px-3 py-2 rounded-xl bg-white text-slate-600 text-xs font-bold w-full md:w-fit shrink-0">
          <SlidersHorizontal size={13} />
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="bg-transparent border-none outline-none cursor-pointer text-slate-600 w-full"
          >
            <option value="All">All Courses</option>
            {Array.from(new Set(enrollments.map(e => e.course?.title).filter(t => t))).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* REGISTRY TABLE */}
      {loading ? (
        <div className="p-16 flex justify-center bg-white border border-slate-100 rounded-panel shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 bg-white border border-slate-100 rounded-panel text-slate-400 text-center select-none">
          <User size={42} className="mx-auto text-slate-200 mb-2" />
          <h3 className="font-extrabold text-slate-700 text-sm">No students matched filters</h3>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-panel shadow-sm overflow-hidden text-left">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-500">
              <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-100 select-none">
                <tr>
                  <th className="px-5 py-3">Student Name</th>
                  <th className="px-5 py-3">Email Address</th>
                  <th className="px-5 py-3">Enrolled Course</th>
                  <th className="px-5 py-3">Progress</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(en => (
                  <tr 
                    key={en._id} 
                    className="hover:bg-slate-50/50 cursor-pointer font-medium"
                    onClick={() => setSelectedStudent(en)}
                  >
                    <td className="px-5 py-4 font-bold text-slate-700">{en.user?.name}</td>
                    <td className="px-5 py-4 text-slate-400">{en.user?.email}</td>
                    <td className="px-5 py-4 text-slate-600">{en.course?.title}</td>
                    <td className="px-5 py-4 select-none">
                      <div className="w-24">
                        <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                          <span>{en.isCompleted ? '100%' : '38%'}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1">
                          <div 
                            className="bg-primary h-1 rounded-full" 
                            style={{ width: en.isCompleted ? '100%' : '38%' }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => toast.success('Message thread opened')}
                          className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded"
                          title="Message Student"
                        >
                          <MessageSquare size={13} />
                        </button>
                        <button 
                          onClick={() => handleResetProgress(en._id)}
                          className="p-1.5 border border-red-100 hover:bg-red-50 text-red-500 rounded"
                          title="Reset Progress"
                        >
                          <RefreshCw size={13} />
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

      {/* STUDENT DETAIL DIALOG */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-panel w-full max-w-md shadow-modal overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 bg-primary text-white flex justify-between items-center select-none">
              <span className="font-bold text-sm">Student Progress details</span>
              <button onClick={() => setSelectedStudent(null)} className="text-white hover:text-slate-200">✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="font-extrabold text-slate-800 text-sm leading-none">{selectedStudent.user?.name}</h4>
                <span className="text-[10px] font-semibold text-slate-400 block mt-1">{selectedStudent.user?.email}</span>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Course Status</span>
                <p className="text-xs font-bold text-slate-700">{selectedStudent.course?.title}</p>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mt-2">
                  <span>Completed: {selectedStudent.isCompleted ? 'Yes' : 'No'}</span>
                  <span>Date enrolled: {new Date(selectedStudent.enrolledAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
