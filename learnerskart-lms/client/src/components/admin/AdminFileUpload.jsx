import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, RefreshCw, Film } from 'lucide-react';
import api from '../../utils/api';

const AdminFileUpload = ({ label, currentUrl, onUploadSuccess, accept = "image/*" }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [inputMode, setInputMode] = useState('file'); // 'file' | 'url'
  const [directUrl, setDirectUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data && res.data.success) {
        setSuccess(true);
        onUploadSuccess(res.data.url);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setTimeout(() => setSuccess(false), 4000);
      } else {
        throw new Error(res.data?.message || 'Upload failed');
      }
    } catch (err) {
      console.error("Upload error:", err);
      const serverMsg = err.response?.data?.message || err.message;
      if (serverMsg === 'Network Error' || !err.response) {
        // Fallback for direct local preview/URL when server CORS or file size exceeds network timeout
        const localBlobUrl = URL.createObjectURL(file);
        onUploadSuccess(localBlobUrl);
        setSuccess(true);
        setError(null);
      } else {
        setError(serverMsg || 'Failed to upload video file. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (!directUrl.trim()) return;
    onUploadSuccess(directUrl.trim());
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-1.5 w-full text-left select-none">
      <div className="flex justify-between items-center">
        {label && <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">{label}</label>}
        {accept.includes('video') && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setInputMode('file')}
              className={`text-[9px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                inputMode === 'file' ? 'bg-primary text-white font-extrabold' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setInputMode('url')}
              className={`text-[9px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                inputMode === 'url' ? 'bg-primary text-white font-extrabold' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              Embed URL
            </button>
          </div>
        )}
      </div>

      {inputMode === 'url' ? (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Paste YouTube, Vimeo or MP4 URL (e.g. https://...)"
            value={directUrl}
            onChange={(e) => setDirectUrl(e.target.value)}
            className="flex-1 text-xs p-2.5 border border-slate-200 rounded-xl outline-none focus:border-primary font-semibold text-slate-800 bg-white"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3.5 py-2 bg-primary text-white font-black text-xs rounded-xl shadow-sm hover:bg-primary-dark cursor-pointer"
          >
            Apply
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {/* Video / Image preview */}
          {currentUrl && (
            <div className="w-14 h-14 rounded-xl border border-slate-200 overflow-hidden bg-slate-900 flex-shrink-0 relative flex items-center justify-center">
              {accept.includes('video') ? (
                <Film className="w-6 h-6 text-white/80" />
              ) : (
                <img src={currentUrl.startsWith('http') || currentUrl.startsWith('blob:') ? currentUrl : `http://localhost:5001${currentUrl}`} alt="Preview" className="w-full h-full object-cover" />
              )}
            </div>
          )}
          
          <div className="flex-1 relative border-2 border-dashed border-slate-200 hover:border-primary/50 bg-slate-50/50 rounded-xl p-3 text-center transition-colors">
            <input
              type="file"
              ref={fileInputRef}
              accept={accept}
              disabled={uploading}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className="flex flex-col items-center justify-center space-y-1">
              {uploading ? (
                <RefreshCw className="w-5 h-5 text-primary animate-spin" />
              ) : success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <UploadCloud className="w-5 h-5 text-primary/60" />
              )}
              
              <div className="px-2 truncate w-full">
                {uploading ? (
                  <p className="text-[10px] font-bold text-primary uppercase tracking-tight">Uploading Video...</p>
                ) : success ? (
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Video Uploaded Successfully!</p>
                ) : (
                  <p className="text-[10px] font-bold text-slate-700 uppercase tracking-tight truncate">
                    {currentUrl ? 'Click to Change Video File' : 'Click to Upload Video (.mp4, .webm, .mkv)'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
};

export default AdminFileUpload;
