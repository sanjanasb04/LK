const fs = require('fs');
const filePath = 'client/src/pages/learner/ActivityPage.jsx';
let c = fs.readFileSync(filePath, 'utf8');

// Insert useAuth to get user role
c = c.replace(/export default function ActivityPage\(\) \{/, `import { useAuth } from '../../context/AuthContext';\nimport { ShieldCheck, FileText, Upload } from 'lucide-react';\n\nexport default function ActivityPage() {\n  const { user } = useAuth();`);

// The new Free Resources & Admin Section HTML
const newSection = `
      {/* Free Resources Section */}
      <div className="mt-10 space-y-4">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Free Resources & Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Eligibility Check', icon: '📝', desc: 'Check if you are eligible for certifications', link: '/free-resources/eligibility' },
            { title: 'Application Guidance', icon: '📋', desc: 'Step-by-step help for your exam application', link: '/free-resources/application-guidance' },
            { title: 'Renewal Guidance', icon: '🔄', desc: 'Learn how to earn PDUs and renew certificates', link: '/free-resources/renewal-guidance' },
            { title: 'Exam Success Guide', icon: '🏆', desc: 'Tips and tricks to pass on your first try', link: '/free-resources/success-guide' },
            { title: 'Case Studies', icon: '📊', desc: 'Real-world project management scenarios', link: '/free-resources/case-studies' },
            { title: 'Resume Assistance', icon: '📄', desc: 'Get expert feedback on your resume', link: '/free-resources/resume-assistance' }
          ].map((res, idx) => (
            <div key={idx} className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 hover:shadow-md hover:border-blue-500/30 transition-all group flex items-start gap-3 cursor-pointer" onClick={() => window.location.href = res.link}>
              <div className="bg-slate-50 text-2xl p-2 rounded-lg group-hover:bg-blue-50 transition-colors">{res.icon}</div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">{res.title}</h4>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-snug">{res.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Material Upload */}
      {(user?.isAdmin || user?.role === 'admin') && (
        <div className="mt-8 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md text-white">
          <h4 className="font-bold text-sm text-blue-300 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" /> Admin Controls: Add Recorded Videos & Course Materials
          </h4>
          <form className="flex flex-col md:flex-row gap-4 items-end" onSubmit={(e) => { e.preventDefault(); alert('Material added successfully (Mock)'); }}>
            <div className="w-full md:w-1/3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Material Title</label>
              <input type="text" placeholder="e.g. Session 1 Recording" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm font-semibold outline-none focus:border-blue-500 text-white" required />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Upload File (Video/Doc/PDF/Excel)</label>
              <input type="file" accept=".doc,.docx,.pdf,.xls,.xlsx,video/*" className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm font-semibold bg-slate-900 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30 text-slate-300" required />
            </div>
            <div className="w-full md:w-1/3">
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm shadow transition-colors flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" /> Upload Material
              </button>
            </div>
          </form>
        </div>
      )}
`;

// Insert before the last </div>
c = c.replace(/    <\/div>\s*<div className="space-y-4">/g, newSection + '\n    </div>\n    <div className="space-y-4">');

// Fallback logic if the exact div isn't matched
if (!c.includes('Free Resources Section')) {
  // Try inserting before the last </div>
  const lastDivIndex = c.lastIndexOf('</div>');
  c = c.substring(0, lastDivIndex) + newSection + '\n' + c.substring(lastDivIndex);
}

fs.writeFileSync(filePath, c);
console.log('ActivityPage updated with Free Resources and Admin Uploads.');
