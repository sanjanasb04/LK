import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Users, ShieldCheck, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageMentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/mentors');
      if (res.data.success) {
        setMentors(res.data.mentors);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleVerify = async (id, isVerified) => {
    try {
      const res = await api.patch(`/admin/users/${id}`, { role: 'mentor' });
      if (res.data.success) {
        toast.success('Mentor verified successfully!');
        fetchMentors();
      }
    } catch (err) {
      toast.error('Failed to verify.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="text-left select-none">
        <h1 className="text-2xl font-black text-slate-800">Mentor Administration</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Verify training specifications and manage consultations hourly rates.</p>
      </div>

      {/* MENTOR LIST */}
      {loading ? (
        <div className="p-16 flex justify-center bg-white border border-slate-100 rounded-panel">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : mentors.length === 0 ? (
        <div className="p-16 bg-white border border-slate-100 rounded-panel text-slate-400 text-center select-none">
          <Users size={42} className="mx-auto text-slate-200 mb-2" />
          <h3 className="font-extrabold text-slate-700 text-sm">No mentors verified yet</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left select-none">
          {mentors.map(mentor => (
            <div key={mentor._id} className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm flex flex-col justify-between h-56 hover:shadow-md transition-shadow duration-300">
              <div>
                <div className="flex items-center gap-3">
                  <img 
                    src={mentor.user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'} 
                    alt="Mentor"
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                  <div className="min-w-0 text-left">
                    <h4 className="font-bold text-slate-800 text-xs truncate leading-snug">{mentor.user?.name}</h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{mentor.user?.email}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1">
                  {mentor.specialties?.map((spec, sIdx) => (
                    <span key={sIdx} className="px-2 py-0.5 text-[9px] font-bold bg-primary/10 text-primary rounded">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-slate-50 pt-3 mt-3">
                <span className="text-[9px] font-bold text-slate-400 block uppercase">
                  Rate: ₹{mentor.hourlyRate}/hr
                </span>
                
                <button
                  onClick={() => handleVerify(mentor.user?._id, true)}
                  className="flex items-center gap-1.5 py-1 px-3 bg-success hover:bg-success-dark text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm"
                >
                  <ShieldCheck size={12} />
                  Verify Coach
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
