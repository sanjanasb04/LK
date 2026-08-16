const fs = require('fs');
const filePath = 'client/src/pages/learner/MyCoursesPage.jsx';
let c = fs.readFileSync(filePath, 'utf8');

// 1. Insert seeded data for progress calculation at the top (after coursePricingData)
const seededData = `
const seededRecordings = [
  { _id: 'mock_rec_1', course: { title: 'Project Management Professional (PMP)' } },
  { _id: 'mock_rec_2', course: { title: 'Lean Six Sigma Green Belt (LSSGB)' } },
  { _id: 'mock_rec_3', course: { title: 'Agile & Scrum Practitioner' } },
  { _id: 'mock_rec_4', course: { title: 'Project Management Professional (PMP)' } }
];

const baseMaterials = [
  { id: 'mat_pmp', tag: 'PMP Study Resource' },
  { id: 'mat_lss', tag: 'Six Sigma Calculator' },
  { id: 'mat_scrum', tag: 'Agile Slide Deck' },
  { id: 'mat_evm', tag: 'Formula Cheat Sheet' } // usually maps to PMP
];

const getDynamicProgress = (course) => {
  if (!course || !course.isEnrolled) return 0;
  if (course.isCompleted) return 100;

  try {
    const customVideosStr = localStorage.getItem('lk_custom_videos');
    const customMaterialsStr = localStorage.getItem('lk_custom_materials');
    const customVideos = customVideosStr ? JSON.parse(customVideosStr) : [];
    const customMaterials = customMaterialsStr ? JSON.parse(customMaterialsStr) : [];
    
    const watchedStr = localStorage.getItem('lk_watched_videos');
    const readStr = localStorage.getItem('lk_read_materials');
    const watched = watchedStr ? JSON.parse(watchedStr) : [];
    const read = readStr ? JSON.parse(readStr) : [];

    const allRecordings = [...seededRecordings, ...customVideos];
    const allMaterials = [...baseMaterials, ...customMaterials];

    const courseTitle = course.title || '';
    const courseVideos = allRecordings.filter(rec => (rec.course?.title || '').toLowerCase() === courseTitle.toLowerCase());
    const courseMats = allMaterials.filter(mat => {
      const tag = mat.tag.toLowerCase();
      if (courseTitle.includes('PMP') && (tag.includes('pmp') || tag.includes('formula'))) return true;
      if (courseTitle.includes('Six Sigma') && tag.includes('six sigma')) return true;
      if (courseTitle.includes('Agile') && tag.includes('agile')) return true;
      return false;
    });

    const totalAssets = courseVideos.length + courseMats.length;
    if (totalAssets === 0) return 0;

    const watchedCount = courseVideos.filter(v => watched.includes(v._id)).length;
    const readCount = courseMats.filter(m => read.includes(m.id)).length;
    
    return Math.round(((watchedCount + readCount) / totalAssets) * 100);
  } catch (e) {
    return 0;
  }
};
`;

if (!c.includes('const getDynamicProgress')) {
  c = c.replace(/const getPricingKey = \(course\) => \{/, seededData + '\nconst getPricingKey = (course) => {');
}

// 2. Update completionPercent logic
c = c.replace(
  /const completionPercent = course\.isEnrolled \? \(course\.isCompleted \? 100 : \(course\.progress \|\| 40\)\) : 0;/,
  `const completionPercent = getDynamicProgress(course);`
);

// 3. Make View Details button orange
// Replace "bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition-all border border-slate-200 cursor-pointer"
// With "bg-accent hover:bg-accent-dark text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-sm" (accent is usually orange in this theme)

c = c.replace(
  /className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition-all border border-slate-200 cursor-pointer"/,
  'className="py-2 px-4 bg-accent hover:bg-accent-dark text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer"'
);

fs.writeFileSync(filePath, c);
console.log('MyCoursesPage updated: dynamic progress + orange View Details button.');
