import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../../utils/api';

const AdminFileUpload = ({ label, currentUrl, onUploadSuccess, accept = "image/*" }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
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

      if (res.data.success) {
        setSuccess(true);
        onUploadSuccess(res.data.url);
        // Clear input to allow re-uploading the same file if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-[10px] font-black text-textmuted uppercase tracking-wider block">{label}</label>}
      
      <div className="flex items-center gap-3">
        {/* Preview / Current Image block if image */}
        {currentUrl && accept.includes('image') && (
          <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex-shrink-0 relative group">
            <img src={currentUrl.startsWith('http') ? currentUrl : `http://localhost:5000${currentUrl}`} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-white text-[8px] font-bold uppercase tracking-wider">Current</span>
            </div>
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
                <p className="text-[10px] font-bold text-primary uppercase tracking-tight">Uploading...</p>
              ) : success ? (
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Uploaded!</p>
              ) : (
                <p className="text-[10px] font-bold text-textdark uppercase tracking-tight truncate">
                  {currentUrl ? 'Click to change' : 'Upload File'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {error && (
        <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
};

export default AdminFileUpload;
