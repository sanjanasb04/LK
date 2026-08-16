const fs = require('fs');
const filePath = 'client/src/pages/learner/MyCoursesPage.jsx';
let c = fs.readFileSync(filePath, 'utf8');

// 1. Add `X` to lucide-react imports if not there
if (!c.includes(' X ')) {
  c = c.replace(/import \{ ([^}]+) \} from 'lucide-react';/, "import { $1, X } from 'lucide-react';");
}

// 2. Add `const [detailsModalSlug, setDetailsModalSlug] = useState(null);` inside component
c = c.replace(/export default function MyCoursesPage\(\) \{/, "export default function MyCoursesPage() {\n  const [detailsModalSlug, setDetailsModalSlug] = useState(null);\n");

// 3. Add the modal JSX just before `return (`... wait, returning JSX, so add it right inside the outermost div.
const modalJSX = `
      {/* Course Details Modal (IFrame) */}
      {detailsModalSlug && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 flex items-center justify-center p-2 sm:p-6 backdrop-blur-sm">
          <div className="bg-white w-full max-w-7xl h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn relative">
            <div className="flex justify-between items-center p-3 sm:p-4 border-b border-slate-100 shrink-0 bg-white">
              <h3 className="font-black text-sm sm:text-lg text-slate-800">Course Details Overview</h3>
              <button onClick={() => setDetailsModalSlug(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 w-full bg-slate-50 overflow-hidden relative">
              <iframe 
                src={\`\${window.location.hostname === 'localhost' ? 'http://localhost:5173' : 'https://learnerskart.com'}/\${detailsModalSlug}?hideNav=true\`} 
                className="w-full h-full border-none"
                title="Course Details"
              />
            </div>
          </div>
        </div>
      )}
`;
c = c.replace(/return \(\n    <div className="space-y-6 text-left">/, `return (\n    <div className="space-y-6 text-left">\n${modalJSX}`);

// 4. Change the View Details button logic
c = c.replace(
  /onClick=\{\(\) => \{\n\s*const mainSiteUrl = window\.location\.hostname === 'localhost' \? 'http:\/\/localhost:5173' : 'https:\/\/learnerskart\.com';\n\s*window\.location\.href = `\$\{mainSiteUrl\}\/\$\{course\.slug\}`;\n\s*\}\}/,
  `onClick={() => setDetailsModalSlug(course.slug)}`
);

fs.writeFileSync(filePath, c);
console.log('MyCoursesPage updated with inline modal iframe.');
