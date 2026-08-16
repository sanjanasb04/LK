import React, { useState } from 'react';
import { X, Calendar, Clock, BookOpen, CreditCard, ChevronRight } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function BookSessionModal({ mentor, onClose, onBookingSuccess }) {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [type, setType] = useState('Career Guidance');
  const [agenda, setAgenda] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate availability slots (for visual demo fallback)
  const daysOfWeek = ['Monday', 'Wednesday', 'Friday'];
  const slots = ['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !timeSlot || !agenda) {
      toast.error('Please fill in all booking details.');
      return;
    }

    try {
      setLoading(true);
      
      // Simulate Razorpay Gateway payment popup
      toast.loading('Contacting payment gateway...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.dismiss();

      // Trigger Razorpay confirmation
      toast.success('Payment authorized successfully! ₹' + (mentor.hourlyRate || 500));

      const res = await api.post('/mentor-sessions', {
        mentorId: mentor._id,
        date: new Date(date),
        timeSlot,
        type,
        agenda
      });

      if (res.data.success) {
        toast.success('Mentorship session booked successfully!');
        if (onBookingSuccess) onBookingSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white border border-slate-100 rounded-panel w-full max-w-lg shadow-modal overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-primary text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <h3 className="font-extrabold text-sm">Schedule Session with {mentor.user?.name}</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Select Date */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Select Date
            </label>
            <div className="relative">
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-slate-200 focus:border-primary px-3 py-2 text-xs rounded-xl focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Select Slot */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Select Available Time Slot (IST)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={`py-2 px-3 text-xs border rounded-xl font-semibold transition-all ${
                    timeSlot === slot
                      ? 'border-primary bg-primary text-white'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Session Type */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Session Focus
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option>Career Guidance</option>
              <option>Exam Strategy</option>
              <option>Technical Doubts</option>
              <option>Mock Interview</option>
            </select>
          </div>

          {/* Agenda */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Session Agenda
            </label>
            <textarea
              required
              rows={3}
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              placeholder="What specifically would you like to cover in this session?"
              className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Payment Terms and Confirm Button */}
          <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-700 font-extrabold text-xs">
              <CreditCard size={15} className="text-slate-400" />
              <span>Total due: ₹{mentor.hourlyRate || 500}</span>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-accent hover:bg-accent-dark disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1"
            >
              {loading ? 'Processing...' : 'Pay & Confirm'}
              <ChevronRight size={14} />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
