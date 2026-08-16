import React from 'react';
import { FileText, ShieldCheck, Lock } from 'lucide-react';

export default function PDFViewer({ url, title = 'Course Material' }) {
  return (
    <div 
      onContextMenu={(e) => e.preventDefault()} 
      className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg h-[550px] select-none"
    >
      {/* Protected Viewer toolbar */}
      <div className="bg-slate-950 px-4 py-3 flex items-center justify-between text-white border-b border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="text-highlight shrink-0" size={18} />
          <h3 className="text-sm font-semibold truncate select-none">{title}</h3>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold select-none">
          <ShieldCheck size={14} />
          <span>Protected Reader (Download Disabled)</span>
        </div>
      </div>

      {/* PDF Document Container */}
      <div className="flex-1 bg-slate-800 relative">
        {url ? (
          <iframe
            src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
            title={title}
            width="100%"
            height="100%"
            className="border-none pointer-events-auto"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Lock size={40} className="text-slate-500" />
            <p className="text-sm font-medium">Protected Document</p>
          </div>
        )}
      </div>
    </div>
  );
}
