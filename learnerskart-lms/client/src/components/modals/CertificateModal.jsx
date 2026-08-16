import React, { useRef } from 'react';
import { X, Download, Share2, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CertificateModal({ certificate, onClose }) {
  const printAreaRef = useRef(null);
  const { verificationId, course, issueDate, user } = certificate;
  const courseTitle = course?.title || 'Certification Training';
  const userName = user?.name || 'Rahul Krishnamurthy';

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const postText = encodeURIComponent(
      `Proud to have completed PMP® Certification Training by @LearnersKart! 🎓 Verification ID: ${verificationId} #PMP #ProjectManagement #Certified`
    );
    const url = `https://www.linkedin.com/sharing/share-offsite/?text=${postText}`;
    window.open(url, '_blank');
    toast.success('Shared to LinkedIn!');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white border border-slate-100 rounded-panel w-full max-w-4xl shadow-modal overflow-hidden flex flex-col h-[600px] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Toolbar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between z-10 border-b border-slate-800 select-none">
          <span className="font-bold text-xs">Certificate Viewer</span>
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Print"
            >
              <Printer size={16} />
            </button>
            <button 
              onClick={handleShare}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Share"
            >
              <Share2 size={16} />
            </button>
            <div className="w-px h-4 bg-slate-800" />
            <button onClick={onClose} className="text-slate-300 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Certificate Landscape layout container */}
        <div className="flex-1 bg-slate-100 overflow-y-auto p-8 flex items-center justify-center">
          
          {/* A4 landscape page */}
          <div 
            ref={printAreaRef}
            className="w-[800px] h-[500px] bg-white border-[14px] border-double border-primary/30 p-8 shadow-lg flex flex-col justify-between relative text-center scale-90 sm:scale-100"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {/* Elegant Background watermark and corners */}
            <div className="absolute top-2 left-2 bottom-2 right-2 border border-primary/20 pointer-events-none" />
            <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-primary/50" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-primary/50" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-primary/50" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-primary/50" />
            
            {/* Header Logos */}
            <div className="flex justify-between items-center z-10 select-none">
              <img 
                src="https://learnerskart.com/wp-content/uploads/2023/05/4545c.png" 
                alt="LearnersKart" 
                className="h-7 object-contain"
              />
              <span className="font-sans text-[8px] font-black text-slate-400 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-widest">
                PMI Authorized Training partner
              </span>
            </div>

            {/* Document Title */}
            <div className="my-2 z-10">
              <h1 className="text-2xl font-bold tracking-widest text-primary uppercase leading-tight">
                Certificate of Completion
              </h1>
              <p className="text-[10px] text-slate-400 italic mt-1 font-sans">
                This is officially awarded to
              </p>
            </div>

            {/* Learner Name */}
            <div className="z-10 my-1">
              <h2 className="text-2xl font-bold text-slate-800 tracking-wide border-b border-slate-200 inline-block px-10 pb-1">
                {userName.toUpperCase()}
              </h2>
            </div>

            {/* Completion Course text */}
            <div className="z-10 text-slate-600 font-sans text-xs px-12 leading-relaxed">
              for successfully completing all syllabus modules and examinations required for the
              <p className="text-sm font-black text-primary italic mt-1.5 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                {courseTitle}
              </p>
              Duration: 35 contact hours | Date of Award: {new Date(issueDate).toLocaleDateString()}
            </div>

            {/* Signatures and Seals */}
            <div className="flex justify-around items-end z-10 mt-4 select-none">
              {/* Instructor Signature */}
              <div className="flex flex-col items-center">
                <span className="font-mono text-sm italic text-slate-700 tracking-wide mb-1" style={{ fontFamily: '"Great Vibes", cursive, Georgia' }}>
                  John Smith, PMP
                </span>
                <div className="w-32 border-t border-slate-300" />
                <span className="font-sans text-[8px] font-bold text-slate-400 uppercase mt-1">
                  Lead Instructor
                </span>
              </div>

              {/* Gold seal stamp */}
              <div className="w-16 h-16 rounded-full border-4 border-amber-400 flex items-center justify-center bg-amber-50 shadow-sm relative -top-2">
                <div className="w-12 h-12 rounded-full border border-dashed border-amber-400 flex items-center justify-center">
                  <span className="font-sans font-black text-[7px] text-amber-500 uppercase tracking-widest leading-none">
                    OFFICIAL SEAL
                  </span>
                </div>
              </div>

              {/* CEO Signature */}
              <div className="flex flex-col items-center">
                <span className="font-mono text-sm italic text-slate-700 tracking-wide mb-1" style={{ fontFamily: '"Great Vibes", cursive, Georgia' }}>
                  Rahul K.
                </span>
                <div className="w-32 border-t border-slate-300" />
                <span className="font-sans text-[8px] font-bold text-slate-400 uppercase mt-1">
                  CEO, LearnersKart
                </span>
              </div>
            </div>

            {/* Verification Tag */}
            <div className="z-10 font-sans text-[8px] text-slate-400 flex justify-between items-center px-4 border-t border-slate-100 pt-2">
              <span>Verification URL: https://learnerskart.com/lms/verify/{verificationId}</span>
              <span className="font-bold">Credential ID: {verificationId}</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
