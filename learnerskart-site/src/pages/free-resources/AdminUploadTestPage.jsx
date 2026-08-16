import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Trash2, HelpCircle, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const AdminUploadTestPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not super admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'admin') {
        navigate('/dashboard');
      }
    }
  }, [user, authLoading, navigate]);

  // Upload state
  const [file, setFile] = useState(null);
  const [testName, setTestName] = useState('');
  const [testType, setTestType] = useState('both'); // 'practice' | 'mock' | 'both'
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // List states
  const [practiceSets, setPracticeSets] = useState([]);
  const [mockSets, setMockSets] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);

  const fetchLists = async () => {
    setLoadingLists(true);
    try {
      const pRes = await api.get('/practice-test/sets');
      if (pRes.data.success) {
        setPracticeSets(pRes.data.sets);
      }

      const mRes = await api.get('/mock-test/sets');
      if (mRes.data.success) {
        setMockSets(mRes.data.sets);
      }
    } catch (err) {
      console.error('Failed to load test sets:', err);
    } finally {
      setLoadingLists(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setUploadError(null);
      setUploadSuccess(null);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError('Please select a question paper file to upload.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('testName', testName);
    formData.append('testType', testType);

    try {
      const res = await api.post('/practice-test/upload-test', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setUploadSuccess(res.data.message || 'Successfully parsed and imported questions!');
        setFile(null);
        setTestName('');
        // Clear file input
        const fileInput = document.getElementById('test-file-input');
        if (fileInput) fileInput.value = '';
        fetchLists();
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || 'Failed to parse file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSet = async (setName, type) => {
    const confirmMsg = `Are you sure you want to permanently delete all questions inside ${setName} from ${type === 'practice' ? 'Practice Tests' : 'Mock Tests'}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      if (type === 'practice') {
        const res = await api.delete(`/practice-test/sets/${setName}`);
        if (res.data.success) {
          alert(res.data.message || `Deleted Practice set ${setName}`);
        }
      } else {
        const res = await api.delete(`/mock-test/sets/${setName}`);
        if (res.data.success) {
          alert(res.data.message || `Deleted Mock set ${setName}`);
        }
      }
      fetchLists();
    } catch (err) {
      alert('Failed to delete set: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-8 text-left select-none max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-black text-textdark uppercase tracking-tight">Upload Question Paper</h2>
          <p className="text-xs text-textmuted font-semibold mt-1">Upload PMP test documents (.pdf, .docx) to auto-generate sets.</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form Panel */}
        <div className="lg:col-span-1 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-6 h-fit">
          <h3 className="text-sm font-black text-textdark uppercase tracking-wider border-b pb-3">Seeding Form</h3>
          
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-textmuted uppercase tracking-wider">Test Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Set 1, Set 2 (Auto if blank)"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-xs font-semibold text-slate-700 bg-slate-50/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-textmuted uppercase tracking-wider block">Choose Test Type</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTestType('practice')}
                  className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider rounded-xl border text-center transition-all ${
                    testType === 'practice'
                      ? 'bg-primary/5 border-primary text-primary'
                      : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
                  }`}
                >
                  Practice
                </button>
                <button
                  type="button"
                  onClick={() => setTestType('mock')}
                  className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider rounded-xl border text-center transition-all ${
                    testType === 'mock'
                      ? 'bg-primary/5 border-primary text-primary'
                      : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
                  }`}
                >
                  Mock
                </button>
                <button
                  type="button"
                  onClick={() => setTestType('both')}
                  className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider rounded-xl border text-center transition-all ${
                    testType === 'both'
                      ? 'bg-primary/5 border-primary text-primary'
                      : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
                  }`}
                >
                  Both
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-textmuted uppercase tracking-wider">Upload Document (.pdf, .docx, .doc)</label>
              <div className="relative border-2 border-dashed border-slate-200 hover:border-primary/50 bg-slate-50/50 rounded-2xl p-6 text-center transition-colors">
                <input
                  type="file"
                  id="test-file-input"
                  accept=".pdf,.docx,.doc"
                  disabled={uploading}
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className="space-y-2">
                  <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-primary">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-textdark uppercase tracking-tight">
                      {file ? file.name : 'Choose or Drag File'}
                    </p>
                    <p className="text-[9px] text-textmuted font-semibold mt-0.5">
                      Supports PDF and Word formats
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {uploadError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[11px] text-red-600 font-bold leading-normal">
                ⚠️ {uploadError}
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[11px] text-emerald-700 font-bold flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="leading-normal">{uploadSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Parsing File...</span>
                </>
              ) : (
                <span>Upload & Parse</span>
              )}
            </button>
          </form>
        </div>

        {/* Right Listings Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Practice Tests Section */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-black text-textdark uppercase tracking-wider border-b pb-3 flex items-center justify-between">
              <span>📚 Practice Test Sets</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                {practiceSets.length} Sets
              </span>
            </h3>

            {loadingLists ? (
              <div className="py-8 flex justify-center items-center gap-2">
                <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                <span className="text-xs font-bold text-textmuted uppercase tracking-wider">Loading...</span>
              </div>
            ) : practiceSets.length === 0 ? (
              <div className="py-8 text-center text-xs text-textmuted font-semibold">
                No Practice Test sets generated yet. Upload a document to create one!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {practiceSets.map((s, idx) => (
                  <div key={idx} className="border border-slate-100 rounded-xl p-4 flex items-center justify-between bg-slate-50/20 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-textdark uppercase tracking-wide">{s.name}</p>
                      <p className="text-[10px] text-textmuted font-bold">{s.count} Questions</p>
                    </div>
                    <button
                      onClick={() => handleDeleteSet(s.name, 'practice')}
                      className="p-2 rounded-lg border border-slate-100 hover:bg-slate-50 text-danger transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mock Tests Section */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-black text-textdark uppercase tracking-wider border-b pb-3 flex items-center justify-between">
              <span>🧪 Mock Test Sets</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                {mockSets.length} Sets
              </span>
            </h3>

            {loadingLists ? (
              <div className="py-8 flex justify-center items-center gap-2">
                <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                <span className="text-xs font-bold text-textmuted uppercase tracking-wider">Loading...</span>
              </div>
            ) : mockSets.length === 0 ? (
              <div className="py-8 text-center text-xs text-textmuted font-semibold">
                No Mock Test sets generated yet. Upload a document to create one!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockSets.map((s, idx) => (
                  <div key={idx} className="border border-slate-100 rounded-xl p-4 flex items-center justify-between bg-slate-50/20 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-textdark uppercase tracking-wide">{s.name}</p>
                      <p className="text-[10px] text-textmuted font-bold">{s.count} Questions</p>
                    </div>
                    <button
                      onClick={() => handleDeleteSet(s.name, 'mock')}
                      className="p-2 rounded-lg border border-slate-100 hover:bg-slate-50 text-danger transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUploadTestPage;
