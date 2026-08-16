import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/ui/StatCard';
import { 
  PlusCircle, BookOpen, Users, Star, IndianRupee, MessageSquare, 
  Tv, Eye, PlayCircle, Calendar, ArrowRight, ShieldCheck 
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadInstructorData = async () => {
      try {
        setLoading(true);
        // Load courses
        const coursesRes = await api.get('/courses');
        if (coursesRes.data.success) {
          setCourses(coursesRes.data.courses);
        }

        // Load enrollments
        const enrollRes = await api.get('/enrollments');
        if (enrollRes.data.success) {
          setEnrollments(enrollRes.data.enrollments.slice(0, 5));
        }

        // Load doubts (posts from community Doubt Corner)
        const doubtsRes = await api.get('/posts?category=🆘 Doubt Corner');
        if (doubtsRes.data.success) {
          setDoubts(doubtsRes.data.posts.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInstructorData();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left select-none">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Instructor Portal</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">Manage PMP/Agile curriculums, check students performance, and review doubts.</p>
        </div>

        <button 
          onClick={() => navigate('/lms/instructor/courses/new')}
          className="flex items-center gap-1.5 py-2.5 px-5 bg-accent hover:bg-accent-dark text-white text-xs font-bold rounded-xl transition-all shadow-md shrink-0"
        >
          <PlusCircle size={15} />
          Create New Course
        </button>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="My Courses" 
          value={courses.length.toString()} 
          icon={<BookOpen size={20} />} 
          color="text-primary bg-primary/10"
        />
        <StatCard 
          title="Total Students" 
          value="182" 
          icon={<Users size={20} />} 
          color="text-highlight bg-highlight/10"
        />
        <StatCard 
          title="Avg Course Rating" 
          value="4.8 ⭐" 
          icon={<Star size={20} />} 
          color="text-success bg-success/10"
        />
        <StatCard 
          title="Total Revenue" 
          value="₹91,000" 
          icon={<IndianRupee size={20} />} 
          color="text-accent bg-accent/10"
        />
      </div>

      {/* SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: ENROLLMENTS AND DOUBTS (Flex-2) */}
        <div className="lg:col-span-2 space-y-6 text-left">
          
          {/* RECENT ENROLLMENTS */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-xs">Recent Student Enrollments</h3>
            <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-500">
                  <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Email Address</th>
                      <th className="px-4 py-3">Course Title</th>
                      <th className="px-4 py-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enrollments.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-6 text-slate-400 italic">No registrations found.</td>
                      </tr>
                    ) : (
                      enrollments.map(en => (
                        <tr key={en._id} className="hover:bg-slate-50/50 font-medium">
                          <td className="px-4 py-3 font-bold text-slate-700">{en.user?.name}</td>
                          <td className="px-4 py-3 text-slate-400">{en.user?.email}</td>
                          <td className="px-4 py-3 text-slate-600">{en.course?.title}</td>
                          <td className="px-4 py-3 text-right text-slate-400">{new Date(en.enrolledAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* PENDING DOUBTS RESPONSE QUEUE */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1">
              <MessageSquare size={15} className="text-primary" />
              Pending Doubts Queue ({doubts.length})
            </h3>
            
            <div className="space-y-3">
              {doubts.length === 0 ? (
                <div className="p-6 bg-white border border-slate-100 rounded-xl text-center text-slate-400">
                  Clear! No pending doubt tickets.
                </div>
              ) : (
                doubts.map(doubt => (
                  <div 
                    key={doubt._id}
                    onClick={() => navigate('/lms/community')}
                    className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex justify-between items-start gap-4 cursor-pointer"
                  >
                    <div>
                      <span className="text-[8px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded uppercase">
                        Unresolved Doubt
                      </span>
                      <h4 className="font-bold text-slate-800 text-xs mt-1.5 leading-snug">{doubt.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {doubt.body}
                      </p>
                    </div>
                    
                    <button className="shrink-0 py-1 px-2.5 bg-primary text-white text-[10px] font-bold rounded hover:bg-primary-dark transition-colors">
                      Resolve
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: HOST SESSIONS / ANALYTICS */}
        <div className="space-y-6 text-left shrink-0 select-none">
          
          {/* Quick Stats list */}
          <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
            <h3 className="font-extrabold text-slate-800 text-xs mb-3 border-b border-slate-50 pb-2">Upcoming Classes Hosted By Me</h3>
            <div className="space-y-3">
              <div className="p-3 border border-slate-100 rounded-lg flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded uppercase">
                    Zoom Session
                  </span>
                  <h4 className="text-xs font-bold text-slate-700 mt-1 truncate">Earned Value Calculations Seminar</h4>
                  <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Today 6:00 PM IST</span>
                </div>
                <button className="py-1 px-2.5 bg-success text-white text-[10px] font-bold rounded hover:bg-success-dark transition-colors shrink-0">
                  Go Live
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm text-center">
            <ShieldCheck size={28} className="text-primary mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 text-xs">Instructor Analytics</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Review monthly progress indicators, quiz completion grids, and rating distributions.
            </p>
            <button 
              onClick={() => navigate('/lms/instructor/analytics')}
              className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              Open Analytics Dashboard
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
