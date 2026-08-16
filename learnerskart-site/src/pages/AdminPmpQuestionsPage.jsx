import React, { useState, useEffect } from 'react';
import { ShieldCheck, HelpCircle, Edit2, Trash2, Plus, Star, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';

const AdminPmpQuestionsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Lists
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Modal Control
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null); // null if creating

  // Form Fields
  const [questionText, setQuestionText] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanationText, setExplanationText] = useState('');
  const [questionType, setQuestionType] = useState('mock'); // 'mock' or 'practice'

  const [formLoading, setFormLoading] = useState(false);

  // Redirect non-admins
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'admin') {
        navigate('/dashboard');
      }
    }
  }, [user, authLoading, navigate]);

  const fetchQuestions = async () => {
    try {
      const res = await api.get('/pmp-questions');
      if (res.data.success) {
        setQuestions(res.data.questions);
      }
    } catch (err) {
      console.error('Error fetching admin PMP questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchQuestions();
    }
  }, [user]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingQuestion(null);
    setQuestionText('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setOpt4('');
    setCorrectIndex(0);
    setExplanationText('');
    setQuestionType('mock');
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (q) => {
    setEditingQuestion(q);
    setQuestionText(q.question);
    setOpt1(q.options[0] || '');
    setOpt2(q.options[1] || '');
    setOpt3(q.options[2] || '');
    setOpt4(q.options[3] || '');
    setCorrectIndex(q.correctOption || 0);
    setExplanationText(q.explanation);
    setQuestionType(q.type);
    setShowModal(true);
  };

  // Delete Question
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    setActionLoading(id);
    try {
      const res = await api.delete(`/pmp-questions/${id}`);
      if (res.data.success) {
        setQuestions(prev => prev.filter(q => q._id !== id));
      }
    } catch (error) {
      alert('Delete request failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(null);
    }
  };

  // Submit Handler (Create or Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!questionText || !opt1 || !opt2 || !explanationText) {
      alert('Please fill out all required fields');
      return;
    }

    const optionsArray = [opt1, opt2];
    if (opt3) optionsArray.push(opt3);
    if (opt4) optionsArray.push(opt4);

    if (correctIndex >= optionsArray.length) {
      alert('Correct option index is out of bounds for the number of choices provided');
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        question: questionText,
        options: optionsArray,
        correctOption: correctIndex,
        explanation: explanationText,
        type: questionType
      };

      if (editingQuestion) {
        // Update
        const res = await api.put(`/pmp-questions/${editingQuestion._id}`, payload);
        if (res.data.success) {
          setQuestions(prev => prev.map(item => item._id === editingQuestion._id ? res.data.question : item));
          setShowModal(false);
        }
      } else {
        // Create
        const res = await api.post('/pmp-questions', payload);
        if (res.data.success) {
          setQuestions(prev => [res.data.question, ...prev]);
          setShowModal(false);
        }
      }
    } catch (error) {
      alert('Operation failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT: Sidebar navigation */}
          <DashboardSidebar />

          {/* RIGHT: Questions Management Panel */}
          <main className="flex-grow space-y-6 w-full">
            
            {/* Header Title */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-textdark">PMP® Questions Manager</h2>
                <p className="text-xs text-textmuted font-semibold leading-tight uppercase tracking-wider">
                  Admin Control Panel • Mock & Practice Tests Editor
                </p>
              </div>
              <div className="bg-primary/10 p-3 rounded-2xl hidden sm:block">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
            </div>

            {/* List Table */}
            <div className="bg-white border border-slate-100 shadow-md rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
                <h3 className="font-extrabold text-sm text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Q&A Database List
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleOpenCreate}
                    className="bg-primary hover:bg-primary-dark text-white font-extrabold text-xs px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Add Question
                  </button>
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-1.5 rounded">
                    Total: {questions.length}
                  </span>
                </div>
              </div>

              {loading ? (
                /* Loading State */
                <div className="p-12 text-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                  <p className="text-xs text-textmuted font-semibold">Loading questions...</p>
                </div>
              ) : questions.length === 0 ? (
                /* Empty state */
                <div className="p-12 text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-sm text-textdark">No PMP questions found</h4>
                  <p className="text-xs text-textmuted max-w-xs mx-auto">
                    Click "Add Question" above to start populating your mock or practice tests.
                  </p>
                </div>
              ) : (
                /* Table Grid */
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                        <th className="px-6 py-4">Question Text</th>
                        <th className="px-6 py-4">Choices</th>
                        <th className="px-6 py-4">Correct</th>
                        <th className="px-6 py-4">Test Type</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {questions.map((q) => (
                        <tr key={q._id} className="hover:bg-slate-50/50 transition-colors">
                          
                          {/* Question */}
                          <td className="px-6 py-4.5 max-w-xs">
                            <p className="line-clamp-2 text-textdark font-bold leading-relaxed">
                              {q.question}
                            </p>
                          </td>

                          {/* Options Count */}
                          <td className="px-6 py-4.5 whitespace-nowrap">
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                              {q.options.length} Choices
                            </span>
                          </td>

                          {/* Correct Index */}
                          <td className="px-6 py-4.5 whitespace-nowrap">
                            <span className="bg-emerald-50 text-success border border-emerald-100 text-[10px] px-2 py-0.5 rounded font-extrabold uppercase">
                              Option {q.correctOption + 1}
                            </span>
                          </td>

                          {/* Question Type */}
                          <td className="px-6 py-4.5 whitespace-nowrap">
                            {q.type === 'mock' ? (
                              <span className="bg-blue-50 text-primary border border-blue-100 text-[10px] px-2 py-0.5 rounded font-extrabold uppercase">
                                Mock Test
                              </span>
                            ) : (
                              <span className="bg-purple-50 text-purple-600 border border-purple-100 text-[10px] px-2 py-0.5 rounded font-extrabold uppercase">
                                Practice Test
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4.5 text-right whitespace-nowrap">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleOpenEdit(q)}
                                className="bg-slate-50 hover:bg-slate-100 text-slate-600 p-2 rounded-lg border border-slate-200 transition-colors"
                                title="Edit Question"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(q._id)}
                                disabled={actionLoading === q._id}
                                className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg border border-red-100 transition-colors disabled:opacity-50"
                                title="Delete Question"
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

          </main>

        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in text-left">
          <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-5 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-extrabold text-sm"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2.5 rounded-xl">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-textdark uppercase tracking-wider">
                  {editingQuestion ? 'Edit Question' : 'Add Question'}
                </h4>
                <p className="text-[10px] text-textmuted font-semibold uppercase mt-0.5">PMP Exam Preparation Resource</p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-semibold text-slate-500">
              
              {/* Question Type */}
              <div className="space-y-1.5">
                <label className="block text-[10px] text-slate-500 uppercase tracking-wide">Test Type</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary font-semibold text-slate-700"
                >
                  <option value="mock">Mock Test (Q&A mode)</option>
                  <option value="practice">Practice Test (Score / exam mode)</option>
                </select>
              </div>

              {/* Question Text */}
              <div className="space-y-1.5">
                <label className="block text-[10px] text-slate-500 uppercase tracking-wide">Question Description</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Type the question content here..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary font-semibold text-slate-700 leading-relaxed"
                ></textarea>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="block text-[10px] text-slate-500 uppercase tracking-wide">Choices / Options</label>
                <input
                  type="text"
                  required
                  placeholder="Option A (e.g. A. Resource Plan)"
                  value={opt1}
                  onChange={(e) => setOpt1(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg outline-none focus:bg-white focus:border-primary"
                />
                <input
                  type="text"
                  required
                  placeholder="Option B (e.g. B. Facilitation)"
                  value={opt2}
                  onChange={(e) => setOpt2(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg outline-none focus:bg-white focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Option C (Optional)"
                  value={opt3}
                  onChange={(e) => setOpt3(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg outline-none focus:bg-white focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Option D (Optional)"
                  value={opt4}
                  onChange={(e) => setOpt4(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg outline-none focus:bg-white focus:border-primary"
                />
              </div>

              {/* Correct Option */}
              <div className="space-y-1.5">
                <label className="block text-[10px] text-slate-500 uppercase tracking-wide">Correct Answer Index</label>
                <select
                  value={correctIndex}
                  onChange={(e) => setCorrectIndex(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg outline-none focus:bg-white focus:border-primary font-semibold text-slate-700"
                >
                  <option value={0}>Option 1 (A)</option>
                  <option value={1}>Option 2 (B)</option>
                  {opt3 && <option value={2}>Option 3 (C)</option>}
                  {opt4 && <option value={3}>Option 4 (D)</option>}
                </select>
              </div>

              {/* Explanation */}
              <div className="space-y-1.5">
                <label className="block text-[10px] text-slate-500 uppercase tracking-wide">Elaborated Answer Explanation</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Explain why this choice is correct..."
                  value={explanationText}
                  onChange={(e) => setExplanationText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary font-semibold text-slate-700 leading-relaxed"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={formLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3 rounded-xl transition-all shadow flex items-center justify-center gap-2"
              >
                {formLoading ? 'Saving...' : 'Save Question'}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPmpQuestionsPage;
