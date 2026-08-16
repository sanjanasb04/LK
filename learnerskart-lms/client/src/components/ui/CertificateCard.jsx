import React from 'react';
import { Eye, Download, Linkedin, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CertificateCard({ certificate, onViewClick }) {
  const { verificationId, course, issueDate } = certificate;
  const courseTitle = course?.title || 'Certification Course';
  
  const handleDownload = () => {
    // Fake PDF download triggering browser print/open
    window.open(`/api/certificates/verify/${verificationId}`, '_blank');
    toast.success('Certificate download initialized!');
  };

  const handleLinkedInShare = () => {
    const postText = encodeURIComponent(
      `Proud to have completed PMP® Certification Training by @LearnersKart! 🎓 Verification ID: ${verificationId} #PMP #ProjectManagement #Certified`
    );
    const url = `https://www.linkedin.com/sharing/share-offsite/?text=${postText}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-[280px]">
      
      {/* Landscape Diploma Visual Preview Thumbnail */}
      <div className="flex-1 bg-slate-50 p-4 flex flex-col justify-between border-b border-slate-100 relative overflow-hidden select-none">
        
        {/* Decorative elements */}
        <div className="absolute inset-0 border-[6px] border-double border-primary/20 rounded-lg m-2 pointer-events-none" />
        <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-primary/5 rounded-full blur-xl" />

        {/* Header */}
        <div className="flex justify-between items-center z-10">
          <img 
            src="https://learnerskart.com/wp-content/uploads/2023/05/4545c.png" 
            alt="Logo" 
            className="h-5 object-contain"
          />
          <span className="text-[7px] font-bold tracking-wider text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-100">
            OFFICIAL CERTIFICATE
          </span>
        </div>

        {/* Certificate Content Text Body */}
        <div className="text-center z-10 py-2">
          <span className="text-[7px] font-bold tracking-widest text-primary uppercase block">
            Certificate of Completion
          </span>
          <p className="text-xs font-black text-slate-800 leading-tight mt-1 truncate">
            {courseTitle}
          </p>
          <span className="text-[8px] text-slate-400 block mt-1 font-medium">
            Issued on {new Date(issueDate).toLocaleDateString()}
          </span>
        </div>

        {/* Verification Footer details */}
        <div className="flex justify-between items-end z-10 text-[8px] font-medium text-slate-400">
          <span>Verification ID: {verificationId}</span>
          <span className="flex items-center gap-0.5 text-success font-bold">
            <CheckCircle2 size={10} />
            Verified
          </span>
        </div>

      </div>

      {/* Action buttons footer dashboard */}
      <div className="p-4 bg-white flex items-center justify-between gap-2">
        <button 
          onClick={onViewClick}
          className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-100"
        >
          <Eye size={13} />
          View
        </button>

        <button 
          onClick={handleDownload}
          className="flex items-center justify-center p-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          title="Download PDF"
        >
          <Download size={14} />
        </button>

        <button 
          onClick={handleLinkedInShare}
          className="flex items-center justify-center p-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          title="Share on LinkedIn"
        >
          <Linkedin size={14} />
        </button>
      </div>

    </div>
  );
}
