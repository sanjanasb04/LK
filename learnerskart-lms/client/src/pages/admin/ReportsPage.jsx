import React from 'react';
import { Download, FileText, CheckCircle2, TrendingUp, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  
  const handleExport = (reportName) => {
    // Simulating reports downloads
    window.open(`/api/admin/reports?type=${reportName}`, '_blank');
    toast.success(`Platform ${reportName} report downloaded!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="text-left select-none">
        <h1 className="text-2xl font-black text-slate-800">Export System Reports</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Generate system spreadsheets for financial auditing and cohort progress audits.</p>
      </div>

      {/* EXPORTS CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left select-none">
        
        {/* REPORT 1: FINANCIALS */}
        <div className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm flex flex-col justify-between h-48 hover:shadow-md transition-shadow duration-300">
          <div>
            <div className="p-2.5 bg-accent/10 text-accent rounded-xl w-fit">
              <IndianRupee size={20} />
            </div>
            <h3 className="font-extrabold text-slate-800 text-xs mt-4">Financial Earnings Reports</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Contains details on course subscriptions, Razorpay transactions, and coupon audits.</p>
          </div>

          <button 
            onClick={() => handleExport('financial')}
            className="w-full flex items-center justify-center gap-1.5 py-2 border border-slate-200 hover:bg-slate-50 text-[10px] font-bold rounded-lg text-slate-700 transition-all"
          >
            <Download size={12} />
            Download Excel CSV
          </button>
        </div>

        {/* REPORT 2: COMPLETIONS */}
        <div className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm flex flex-col justify-between h-48 hover:shadow-md transition-shadow duration-300">
          <div>
            <div className="p-2.5 bg-success/15 text-success rounded-xl w-fit">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="font-extrabold text-slate-800 text-xs mt-4">Syllabus Completion Audits</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Contains data regarding course progress, lesson completes, and mock scores.</p>
          </div>

          <button 
            onClick={() => handleExport('progress')}
            className="w-full flex items-center justify-center gap-1.5 py-2 border border-slate-200 hover:bg-slate-50 text-[10px] font-bold rounded-lg text-slate-700 transition-all"
          >
            <Download size={12} />
            Download Excel CSV
          </button>
        </div>

        {/* REPORT 3: VERIFICATIONS */}
        <div className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm flex flex-col justify-between h-48 hover:shadow-md transition-shadow duration-300">
          <div>
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl w-fit">
              <FileText size={20} />
            </div>
            <h3 className="font-extrabold text-slate-800 text-xs mt-4">Credential Verification Logs</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Contains lists of verification IDs and names issued on diploma completions.</p>
          </div>

          <button 
            onClick={() => handleExport('certificates')}
            className="w-full flex items-center justify-center gap-1.5 py-2 border border-slate-200 hover:bg-slate-50 text-[10px] font-bold rounded-lg text-slate-700 transition-all"
          >
            <Download size={12} />
            Download Excel CSV
          </button>
        </div>

      </div>

    </div>
  );
}
