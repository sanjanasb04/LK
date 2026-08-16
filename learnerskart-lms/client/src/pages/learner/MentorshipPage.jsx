import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import MentorCard from '../../components/ui/MentorCard';
import BookSessionModal from '../../components/modals/BookSessionModal';
import { Users, Calendar, Video, Clock, MessageCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MentorshipPage() {
  const [mentors, setMentors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [loading, setLoading] = useState(false);

  const loadMentorshipData = async () => {
    try {
      setLoading(true);
      // Fetch mentors
      const mentorsRes = await api.get('/mentors');
      if (mentorsRes.data.success) {
        setMentors(mentorsRes.data.mentors);
      }

      // Fetch user's bookings
      const bookingsRes = await api.get('/mentor-sessions/me');
      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.sessions);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load mentorship page details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMentorshipData();
  }, []);

  const handleBookClick = (mentor) => {
    setSelectedMentor(mentor);
    setBookingModalOpen(true);
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await api.patch(`/mentor-sessions/${id}`, { status: 'Cancelled' });
      if (res.data.success) {
        toast.success('Session cancelled successfully.');
        loadMentorshipData();
      }
    } catch (err) {
      toast.error('Failed to cancel booking.');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/mentor-sessions/${selectedSessionId}/feedback`, {
        score: ratingScore,
        comment: ratingComment
      });
      if (res.data.success) {
        toast.success('Thank you for your rating feedback!');
        setFeedbackOpen(false);
        setRatingComment('');
        loadMentorshipData();
      }
    } catch (err) {
      toast.error('Feedback submission failed.');
    }
  };

  const upcomingSessions = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending');
  const pastSessions = bookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="text-left">
        <h1 className="text-2xl font-black text-slate-800">Personalized Mentorship</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Book 1-on-1 consultations with certification leads and industry specialists</p>
      </div>

      {/* SECTION A & B: Scheduled and explore */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* UPCOMING SESSIONS LIST */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={18} className="text-primary" />
            <h2 className="font-extrabold text-slate-800 text-sm">Scheduled Consultations</h2>
          </div>

          {loading ? (
            <div className="p-10 bg-white border border-slate-100 rounded-panel text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : upcomingSessions.length === 0 ? (
            <div className="p-8 bg-white border border-slate-100 rounded-panel text-center text-slate-400">
              <Calendar size={42} className="mx-auto text-slate-200 mb-2" />
              <p className="text-xs font-semibold">No upcoming sessions. Book a slot below to get started!</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {upcomingSessions.map(session => {
                const mentorName = session.mentor?.user?.name || 'Authorized Consultant';
                const avatar = session.mentor?.user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150';
                
                return (
                  <div key={session._id} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img 
                        src={avatar} 
                        alt="Mentor" 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-xs truncate leading-snug">{session.type} with {mentorName}</h4>
                        <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                          Date: {new Date(session.date).toDateString()} • Time: {session.timeSlot} (IST)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end select-none shrink-0">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-lg uppercase tracking-wider ${
                        session.status === 'Confirmed' 
                          ? 'bg-success/15 text-success' 
                          : 'bg-amber-100 text-amber-600'
                      }`}>
                        {session.status}
                      </span>
                      {session.status === 'Confirmed' && (
                        <button 
                          onClick={() => window.open(session.meetingLink, '_blank')}
                          className="flex items-center gap-1 py-1.5 px-3 bg-success hover:bg-success-dark text-white font-bold text-[10px] rounded-lg transition-colors shadow-sm"
                        >
                          <Video size={12} />
                          Join call
                        </button>
                      )}
                      <button 
                        onClick={() => handleCancelBooking(session._id)}
                        className="py-1.5 px-3 border border-red-200 text-red-500 hover:bg-red-50 font-bold text-[10px] rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PAST SESSIONS HISTORY LOG */}
          {pastSessions.length > 0 && (
            <div className="pt-4 space-y-3">
              <h3 className="font-bold text-slate-800 text-xs">Past Session Logs</h3>
              <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-500">
                    <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-100 select-none">
                      <tr>
                        <th className="px-4 py-3">Mentor</th>
                        <th className="px-4 py-3">Topic</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Rating</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pastSessions.map(session => (
                        <tr key={session._id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3.5 font-bold text-slate-700">
                            {session.mentor?.user?.name || 'Consultant'}
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-slate-600">{session.type}</td>
                          <td className="px-4 py-3.5 font-semibold text-slate-400">{new Date(session.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3.5">
                            {session.feedback?.score ? (
                              <div className="flex items-center gap-0.5 text-amber-400 font-bold">
                                <Star size={12} className="fill-amber-400" />
                                <span>{session.feedback.score}</span>
                              </div>
                            ) : session.status === 'Completed' ? (
                              <button 
                                onClick={() => { setSelectedSessionId(session._id); setFeedbackOpen(true); }}
                                className="text-primary font-bold hover:underline"
                              >
                                Rate Session
                              </button>
                            ) : (
                              <span className="text-slate-300 italic">Cancelled</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-right font-bold">
                            <button 
                              onClick={() => handleBookClick(session.mentor)}
                              className="text-primary hover:underline"
                            >
                              Book Follow-up
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* EXPLORE DIRECTORY PANEL */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Users size={18} className="text-primary" />
            <h2 className="font-extrabold text-slate-800 text-sm">Explore Coaches</h2>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {mentors.map(mentor => (
              <MentorCard 
                key={mentor._id} 
                mentor={mentor} 
                onBookClick={() => handleBookClick(mentor)}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Booking Calendar Modal overlays */}
      {bookingModalOpen && selectedMentor && (
        <BookSessionModal
          mentor={selectedMentor}
          onClose={() => setBookingModalOpen(false)}
          onBookingSuccess={loadMentorshipData}
        />
      )}

      {/* FEEDBACK OVERLAY FORM */}
      {feedbackOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-panel w-full max-w-sm shadow-modal overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 bg-primary text-white flex justify-between items-center select-none">
              <span className="font-bold text-sm">Leave Session Feedback</span>
              <button onClick={() => setFeedbackOpen(false)} className="text-white hover:text-slate-200">✕</button>
            </div>
            
            <form onSubmit={handleFeedbackSubmit} className="p-5 space-y-4 text-left">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Score Rating (1-5)</label>
                <div className="flex gap-2.5">
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setRatingScore(score)}
                      className={`w-9 h-9 rounded-lg border font-bold flex items-center justify-center transition-all ${
                        ratingScore === score 
                          ? 'bg-amber-400 border-amber-400 text-white shadow-sm' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Comments</label>
                <textarea
                  rows={3}
                  required
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="How was your session? What did you find most helpful?"
                  className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
