import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAccessToken } from '../../utils/api';

const categoriesData = [
  {
    id: 'pm',
    name: 'Project Management',
    courses: [
      { title: 'Project Management Professional (PMP)', slug: 'project-management-professional-pmp', icon: '🏆' },
      { title: 'Certified Associate In Project Management (CAPM®) Online Course', slug: 'capm-certification-training', icon: '🎓' },
      { title: 'Prince2 Foundation Certification Training', slug: 'prince2-foundation-certification-training', icon: '🛡️' },
      { title: 'PRINCE2 Practitioner Certification Training Course', slug: 'prince2-practitioner-training', icon: '📋' },
      { title: 'PRINCE2 Foundation And Practitioner Certification Training', slug: 'prince2-foundation-and-practitioner-training', icon: '📦' },
      { title: 'Program Management Professional Certification Training', slug: 'program-management-professional-certification-training', icon: '🚀' },
      { title: 'Risk Management Professional Certification Training', slug: 'risk-management-professional-certification-training', icon: '⚠️' }
    ]
  },
  {
    id: 'qm',
    name: 'Quality Management',
    courses: [
      { title: 'Lean Six Sigma Green And Black Belt Combo Certification Training', slug: 'lssgb-lssbb-combo-certification-training', icon: '🥋' },
      { title: 'Lean Six Sigma Yellow Belt Certification Training', slug: 'lean-six-sigma-yellow-belt-certification-training', icon: '🎗️' },
      { title: 'Lean Six Sigma Green Belt Certification Training', slug: 'lean-six-sigma-green-belt-certification-training', icon: '🟢' },
      { title: 'Lean Six Sigma Black Belt Certification Training', slug: 'lean-six-sigma-black-belt-certification-training', icon: '⚫' }
    ]
  },
  {
    id: 'ba',
    name: 'Business Analysis',
    courses: [
      { title: 'Certification Of Capability In Business Analysis™ (CCBA®) Certification Training', slug: 'ccba-certification-training', icon: '📊' },
      { title: 'ECBA Certification Training', slug: 'ecba-certification-training', icon: '📉' },
      { title: 'Certified Business Analysis Professional (CBAP®) Training', slug: 'cbap-training', icon: '💼' }
    ]
  },
  {
    id: 'agile',
    name: 'Agile',
    courses: [
      { title: 'Agile Certified Practitioner Certification Training', slug: 'pmi-acp', icon: '⚡' }
    ]
  },
  {
    id: 'dm',
    name: 'Digital Marketing',
    courses: [
      { title: 'Digital Marketing Training', slug: 'digital-marketing-training', icon: '📈' }
    ]
  },
  {
    id: 'safe',
    name: 'SAFe',
    courses: []
  },
  {
    id: 'service',
    name: 'Service Management',
    courses: []
  },
  {
    id: 'devops',
    name: 'DevOps',
    courses: []
  }
];

const MegaMenu = ({ setIsOpen }) => {
  const [activeCategory, setActiveCategory] = useState(categoriesData[0]);
  const { user } = useAuth();

  const redirectToLMS = (path = '/lms/my-courses') => {
    const token = getAccessToken() || localStorage.getItem('lk_token') || 'mock_admin_token_123';
    window.location.href = `http://localhost:5174${path}?token=${token}`;
  };

  const handleItemClick = (e, targetPath = '/lms/my-courses') => {
    if (setIsOpen) setIsOpen(false);
    if (user) {
      if (e) e.preventDefault();
      redirectToLMS(targetPath);
    }
  };

  return (
    <div className="absolute top-full left-0 mt-2 w-[680px] bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden flex z-50 text-left animate-fade-in">
      
      {/* Left Column: Categories List */}
      <div className="w-5/12 bg-slate-50/80 border-r border-slate-100 py-4 select-none">
        <ul className="space-y-1">
          {categoriesData.map((category) => (
            <li key={category.id}>
              <button
                type="button"
                onMouseEnter={() => setActiveCategory(category)}
                className={
                  "w-full flex items-center justify-between px-5 py-3 text-xs font-bold transition-all text-left " +
                  (activeCategory.id === category.id
                    ? "bg-white text-primary border-l-4 border-primary shadow-sm"
                    : "text-slate-600 border-l-4 border-transparent hover:bg-slate-100/50 hover:text-primary")
                }
              >
                <span>{category.name}</span>
                <ChevronRight className={"w-3.5 h-3.5 transition-transform " + (activeCategory.id === category.id ? "translate-x-1 text-primary" : "text-slate-400")} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Column: Courses List for hovered category */}
      <div className="w-7/12 p-6 flex flex-col justify-between min-h-[340px] bg-white">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
              {activeCategory.name} ({activeCategory.courses.length} Courses)
            </h4>
            {activeCategory.courses.length > 0 && (
              <Link
                to={"/courses?category=" + encodeURIComponent(activeCategory.name)}
                onClick={(e) => handleItemClick(e, '/lms/my-courses')}
                className="text-[10px] font-black text-accent hover:underline uppercase tracking-wider"
              >
                View All
              </Link>
            )}
          </div>

          {activeCategory.courses.length > 0 ? (
            <ul className="space-y-1.5">
              {activeCategory.courses.map((course) => (
                <li key={course.slug}>
                  <Link
                    to={"/courses/" + course.slug}
                    onClick={(e) => handleItemClick(e, '/lms/my-courses')}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition-all">
                      {course.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-primary transition-colors">
                      {course.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <span className="text-2xl mb-1.5">🚀</span>
              <p className="text-xs font-bold text-slate-700">New cohort details coming soon!</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Inquire now to reserve your early-bird seat.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
