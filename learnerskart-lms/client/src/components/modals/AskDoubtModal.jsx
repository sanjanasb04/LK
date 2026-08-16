import React, { useState } from 'react';
import { X, HelpCircle, Send } from 'lucide-react';
import api from '../../utils/api';
import useSocket from '../../hooks/useSocket';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AskDoubtModal({ courseId, lessonId, lessonTitle, onClose, onDoubtSubmitted }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const socket = useSocket();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      setLoading(true);
      
      // Post as a Community Post in "Doubt Corner" category
      const res = await api.post('/posts', {
        category: '🆘 Doubt Corner',
        title: `Question on: ${lessonTitle}`,
        body: question,
        tags: ['doubt', lessonTitle.replace(/\s+/g, '')]
      });

      if (res.data.success) {
        toast.success('Doubt submitted successfully (+25 XP!)');
        
        // Emit Socket event to alert instructors or classmates real-time
        if (socket) {
          socket.emit('new-doubt', {
            courseId,
            lessonId,
            questionText: question,
            userName: user?.name || 'A student'
          });
        }

        if (onDoubtSubmitted) onDoubtSubmitted();
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit question.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white border border-slate-100 rounded-panel w-full max-w-md shadow-modal overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-primary text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} />
            <h3 className="font-extrabold text-sm">Ask a Doubt</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-left">
            <span className="text-[10px] font-bold text-slate-400 block uppercase mb-0.5">Lesson Reference</span>
            <p className="text-xs font-bold text-slate-700">{lessonTitle}</p>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Your Question
            </label>
            <textarea
              required
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask clearly about calculations, charts, concepts or exam prep..."
              className="w-full border border-slate-200 px-3 py-2.5 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-2.5 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
            >
              {loading ? 'Submitting...' : 'Submit Question'}
              <Send size={12} />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
