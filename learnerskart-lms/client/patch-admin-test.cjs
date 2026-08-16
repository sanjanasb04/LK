const fs = require('fs');
const filePath = 'client/src/pages/admin/AdminUploadTestPage.jsx';
let c = fs.readFileSync(filePath, 'utf8');

// 1. Add new state variables
c = c.replace(/const \[passPercentage, setPassPercentage\] = useState\(80\);/, `const [passPercentage, setPassPercentage] = useState(80);\n  const [freeQuestionsCount, setFreeQuestionsCount] = useState(60);\n  const [leadGenQuestionsCount, setLeadGenQuestionsCount] = useState(180);\n  const [price, setPrice] = useState(999);`);

// 2. Add to API payload
c = c.replace(/course: courseId,\n\s*timeLimit: Number\(timeLimit\),\n\s*passPercentage: Number\(passPercentage\),/, `course: courseId,\n        timeLimit: Number(timeLimit),\n        passPercentage: Number(passPercentage),\n        freeQuestionsCount: Number(freeQuestionsCount),\n        leadGenQuestionsCount: Number(leadGenQuestionsCount),\n        price: Number(price),`);

// 3. Add UI Inputs
const uiAdditions = `
              </div>

              {/* Monetization & Lead Gen Config */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-amber-50/50 p-6 rounded-2xl border border-amber-200/50 mt-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Free Questions (Stage 1)</label>
                  <input type="number" value={freeQuestionsCount} onChange={(e) => setFreeQuestionsCount(e.target.value)} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-amber-500" />
                  <p className="text-[10px] text-slate-500 mt-1">Number of questions available totally free.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Lead Gen Phase (Stage 2)</label>
                  <input type="number" value={leadGenQuestionsCount} onChange={(e) => setLeadGenQuestionsCount(e.target.value)} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-amber-500" />
                  <p className="text-[10px] text-slate-500 mt-1">Number of questions requiring Email/Name.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Unlock Price (Stage 3) (₹)</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-amber-500" />
                  <p className="text-[10px] text-slate-500 mt-1">Price to unlock remaining questions/results.</p>
                </div>
              </div>
`;
c = c.replace(/<\/div>\s*\{\/\* Questions Builder \*\/\}/, uiAdditions + '\n              {/* Questions Builder */}');

fs.writeFileSync(filePath, c);
console.log('AdminUploadTestPage patched with monetization fields.');
