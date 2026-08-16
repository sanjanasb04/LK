import React, { useState } from 'react';
import CourseCard from './CourseCard';

const initialCourses = [
  {
    title: "Project Management Professional (PMP)",
    category: "Project Management",
    level: "Expert",
    students: 783,
    lessons: 50,
    price: "Free",
    image: "/courses/pmp-v6.jpg",
    description: "Comprehensive PMP exam prep with 50 lessons, mock exams, and PMBOK 7th Edition guidelines."
  },
  {
    title: "PMP® Certification – E-Learning",
    category: "Project Management",
    level: "Intermediate",
    students: 540,
    lessons: 50,
    originalPrice: "₹6,999",
    price: "₹4,999",
    image: "/courses/pmp-v6.jpg",
    description: "Self-paced PMP® e-learning program with lifetime access to high-quality recorded video sessions and study guides."
  },
  {
    title: "Certified Associate In Project Management (CAPM®) Online Course",
    category: "Project Management",
    level: "Beginner",
    students: 545,
    lessons: 32,
    originalPrice: "₹14,999",
    price: "₹11,999",
    image: "/courses/capm-v9.jpg",
    description: "Start your project management career with the Certified Associate in Project Management (CAPM)® credential."
  },
  {
    title: "Prince2 Foundation Certification Training",
    category: "Project Management",
    level: "Beginner",
    students: 530,
    lessons: 24,
    originalPrice: "₹16,999",
    price: "₹13,999",
    image: "/courses/prince2-foundation-v4.jpg",
    description: "PRINCE2® Foundation level official certification training. Master principles, themes, and processes of structured project delivery."
  },
  {
    title: "PRINCE2 Practitioner Certification Training Course",
    category: "Project Management",
    level: "Intermediate",
    students: 524,
    lessons: 28,
    originalPrice: "₹16,999",
    price: "₹13,999",
    image: "/courses/prince2-practitioner-v4.jpg",
    description: "Transition from understanding to applying. Prepare to manage complex projects in a PRINCE2 environment with scenario-based learning."
  },
  {
    title: "PRINCE2 Foundation And Practitioner Certification Training",
    category: "Project Management",
    level: "Advanced",
    students: 535,
    lessons: 40,
    originalPrice: "₹24,999",
    price: "₹21,999",
    image: "/courses/prince2-combo-v3.jpg",
    description: "Get both certifications in one complete training package. Go from zero knowledge to a fully qualified PRINCE2 Practitioner."
  },
  {
    title: "Program Management Professional Certification Training",
    category: "Project Management",
    level: "Expert",
    students: 512,
    lessons: 30,
    originalPrice: "₹35,999",
    price: "₹32,999",
    image: "/courses/pgmp-v3.jpg",
    description: "Designed for senior program managers, this PgMP course aligns with PMI standards to help you coordinate multiple strategic projects."
  },
  {
    title: "Risk Management Professional Certification Training",
    category: "Project Management",
    level: "Expert",
    students: 518,
    lessons: 26,
    originalPrice: "₹24,999",
    price: "₹22,999",
    image: "/courses/rmp-v3.jpg",
    description: "Master the strategy of identifying, assessing, and mitigating organizational risks under top-certified industry mentors."
  },
  // Quality Management
  {
    title: "Lean Six Sigma Green Belt (LSSGB) Certification",
    category: "Quality Management",
    level: "Intermediate",
    students: 114,
    lessons: 24,
    originalPrice: "₹17,999",
    price: "₹14,999",
    image: "/courses/lssgb-v3.jpg",
    description: "Master quality management, statistical methods, DMAIC tools, and process excellence with our comprehensive LSSGB training."
  },
  {
    title: "Lean Six Sigma Yellow Belt (LSSYB) Certification Training",
    category: "Quality Management",
    level: "Beginner",
    students: 180,
    lessons: 16,
    originalPrice: "₹9,999",
    price: "₹6,999",
    image: "/courses/lssyb-v3.jpg",
    description: "Gain an introduction to Six Sigma foundations, waste identification, and DMAIC project participation. Ideal for entry-level professionals."
  },
  {
    title: "Lean Six Sigma Black Belt (LSSBB) Training",
    category: "Quality Management",
    level: "Expert",
    students: 92,
    lessons: 32,
    originalPrice: "₹24,999",
    price: "₹21,999",
    image: "/courses/lssbb-v3.jpg",
    description: "Lead enterprise-level improvement projects and implement advanced lean methodologies with Black Belt statistical expertise."
  },
  {
    title: "Lean Six Sigma Green & Black Belt Combo (LSSGB+LSSBB)",
    category: "Quality Management",
    level: "Advanced",
    students: 210,
    lessons: 56,
    originalPrice: "₹34,999",
    price: "₹29,999",
    image: "/courses/lssgb_lssbb-v3.jpg",
    description: "Complete quality mastery combo covering Green Belt tools through advanced Black Belt statistical design."
  },
  // Business Analysis
  {
    title: "CBAP® – Certified Business Analysis Professional",
    category: "Business Analysis",
    level: "Expert",
    students: 83,
    lessons: 21,
    originalPrice: "₹21,999",
    price: "₹18,999",
    image: "/courses/cbap-v3.jpg",
    description: "Become a premier business analysis expert. Aligned directly with the IIBA® BABOK® Guide v3.0 for highest exam success."
  },
  {
    title: "ECBA™ – Entry Certificate in Business Analysis",
    category: "Business Analysis",
    level: "Beginner",
    students: 147,
    lessons: 15,
    originalPrice: "₹10,999",
    price: "₹8,499",
    image: "/courses/ecba-v3.jpg",
    description: "Launch your career in business analysis. Gain foundational knowledge in requirements analysis and stakeholder mapping."
  },
  // Agile
  {
    title: "PMI-ACP® Agile Certified Practitioner Exam Prep",
    category: "Agile",
    level: "Intermediate",
    students: 215,
    lessons: 28,
    price: "Free",
    image: "/courses/pmi_acp-v3.jpg",
    description: "Establish your Agile credentials. Learn Scrum, Kanban, XP, and Lean frameworks to pass your PMI-ACP exam on your first attempt."
  },
  // DevOps
  {
    title: "DevOps Practitioner Certification",
    category: "DevOps",
    level: "Intermediate",
    students: 198,
    lessons: 30,
    originalPrice: "₹19,999",
    price: "₹16,999",
    image: "/courses/devops-v3.jpg",
    description: "Bridge the gap between development and operations. Learn CI/CD pipelines, Docker, Kubernetes, and configuration management tools."
  },
  // SAFe
  {
    title: "SAFe® 6.0 Product Owner / Product Manager (POPM)",
    category: "SAFe",
    level: "Expert",
    students: 68,
    lessons: 16,
    originalPrice: "₹31,999",
    price: "₹27,999",
    image: "/courses/safe-v3.jpg",
    description: "Deliver massive value in a Lean enterprise. Learn how to write epics, features, user stories and manage backlog grooming."
  }
];

const categories = ["All", "Project Management", "Quality Management", "Business Analysis", "Agile", "DevOps", "SAFe"];

export default function CoursesSection() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredCourses = activeTab === "All" 
    ? initialCourses 
    : initialCourses.filter(course => course.category === activeTab);

  return (
    <section id="courses" className="w-full bg-gray-50/60 py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-[#f97316] bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-100 shadow-sm">
            Our Courses
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0a3d91] tracking-tight mt-3 font-sans">
            Explore Top Professional Courses
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-3 font-semibold leading-relaxed">
            Gain industry-accredited certifications and master high-demand capabilities with live, expert-led training sessions.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap justify-center gap-2.5 p-2 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-fit">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 focus:outline-none ${
                  activeTab === cat
                    ? 'bg-[#0a3d91] text-white shadow-md shadow-blue-900/15 scale-105'
                    : 'text-gray-500 hover:text-[#0a3d91] hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, idx) => (
            <div key={idx} className="h-full">
              <CourseCard course={course} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-bold">No courses found in this category.</p>
          </div>
        )}

      </div>
    </section>
  );
}
