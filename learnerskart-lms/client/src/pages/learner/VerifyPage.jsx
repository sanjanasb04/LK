import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Award, ShieldCheck, AlertOctagon, CheckCircle2 } from 'lucide-react';
import api from '../../utils/api';

export default function VerifyPage() {
  const { certId } = useParams();
  const [cert, setCert] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/certificates/verify/${certId}`);
        if (res.data.success && res.data.certificate) {
          setCert(res.data.certificate);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Certificate verification failed.');
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [certId]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-700">
      
      {/* Visual Seal Card */}
      <div className="w-full max-w-md bg-white border border-slate-100 p-8 rounded-panel shadow-md text-center space-y-6">
        
        <img 
          src="https://learnerskart.com/wp-content/uploads/2023/05/4545c.png" 
          alt="Logo" 
          className="h-10 mx-auto object-contain select-none"
        />

        {loading ? (
          <div className="py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="text-xs text-slate-400 mt-2">Querying platform registry...</p>
          </div>
        ) : error ? (
          <div className="py-4 space-y-3">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <AlertOctagon size={28} />
            </div>
            <h2 className="text-lg font-extrabold text-slate-800">Verification Failed</h2>
            <p className="text-xs text-red-500 font-semibold">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Valid status banner */}
            <div className="p-4 bg-success/10 border border-success/20 rounded-xl text-success flex flex-col items-center gap-1">
              <ShieldCheck size={32} className="fill-success/15" />
              <span className="text-sm font-black uppercase tracking-wider">Valid Credential Verified ✅</span>
            </div>

            <div className="space-y-3.5 text-left border-y border-slate-50 py-5 text-xs font-semibold">
              <div className="flex justify-between">
                <span className="text-slate-400">Awarded To:</span>
                <span className="text-slate-800 font-bold">{cert.user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Course Completed:</span>
                <span className="text-slate-800 font-bold max-w-[200px] text-right truncate" title={cert.course?.title}>
                  {cert.course?.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date Awarded:</span>
                <span className="text-slate-800 font-bold">{new Date(cert.issueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Credential ID:</span>
                <span className="font-mono text-slate-800 font-bold">{cert.verificationId}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
              This certificate was officially generated and authorized by the LearnersKart Training board after evaluating student completion metrics.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}
