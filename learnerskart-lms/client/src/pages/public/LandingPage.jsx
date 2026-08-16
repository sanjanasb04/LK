import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Star, Shield, Users, ArrowRight, CheckCircle, 
  Award, Zap, Heart, Database, Clock, RefreshCw 
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const courses = [
    {
      title: "PMP® Certification Training Framework",
      slug: "pmp-certification-training",
      category: "Project Management",
      rating: 4.9,
      students: "1,240+",
      duration: "35 Hours",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300"
    },
    {
      title: "Lean Six Sigma Green Belt (LSSGB) Certification",
      slug: "lean-six-sigma-green-belt",
      category: "Quality Management",
      rating: 4.8,
      students: "850+",
      duration: "24 Hours",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300"
    },
    {
      title: "Lean Six Sigma Black Belt (LSSBB) Training",
      slug: "lean-six-sigma-black-belt",
      category: "Quality Management",
      rating: 4.9,
      students: "590+",
      duration: "32 Hours",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300"
    },
    {
      title: "CBAP® – Certified Business Analysis Professional",
      slug: "cbap-business-analysis",
      category: "Business Analysis",
      rating: 4.7,
      students: "420+",
      duration: "35 Hours",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300"
    },
    {
      title: "ECBA™ – Entry Certificate in Business Analysis",
      slug: "ecba-business-analysis",
      category: "Business Analysis",
      rating: 4.8,
      students: "610+",
      duration: "21 Hours",
      image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=300"
    },
    {
      title: "PMI-ACP® Agile Certified Practitioner Prep",
      slug: "pmi-acp-agile-practitioner",
      category: "Agile & Scrum",
      rating: 4.9,
      students: "740+",
      duration: "21 Hours",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=300"
    },
    {
      title: "DevOps Practitioner Certification",
      slug: "devops-practitioner",
      category: "DevOps & Cloud",
      rating: 4.8,
      students: "980+",
      duration: "30 Hours",
      image: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=300"
    },
    {
      title: "SAFe® 6.0 Product Owner / Product Manager (POPM)",
      slug: "safe-product-owner-product-manager",
      category: "Agile Scale",
      rating: 4.9,
      students: "310+",
      duration: "16 Hours",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans select-none antialiased">
      
      {/* Sleek Navigation Bar */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200/60 py-4 px-6 z-50 transition-all select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img 
              src="https://learnerskart.com/wp-content/uploads/2023/05/4545c.png" 
              alt="LearnersKart" 
              className="h-7 object-contain bg-white rounded px-1 py-0.5 border border-slate-100"
            />
            <span className="text-xs font-black bg-primary px-2 py-0.5 rounded text-white tracking-wider leading-none uppercase">
              LMS Portal
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <a href="#features" className="hover:text-primary transition-colors">Platform Features</a>
            <a href="#courses" className="hover:text-primary transition-colors">Official Catalog</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Success Reviews</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/lms/login')}
              className="text-xs font-extrabold text-slate-700 hover:text-primary transition-colors px-4 py-2"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/lms/login')}
              className="text-xs font-extrabold bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg shadow-primary/10"
            >
              Access LMS
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-20 lg:py-28 px-6 overflow-hidden">
        {/* Dynamic Abstract Background Elements */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/10 w-80 h-80 bg-accent/5 rounded-full filter blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold rounded-full uppercase tracking-wider">
            <Zap size={10} className="fill-current" />
            Official LearnersKart Training Hub
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight max-w-4xl mx-auto">
            Empower Your Career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Professional Certifications</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Direct online class portal, automated practice assessments, schedule coordinators, and certificate management built purely for corporate excellence.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button 
              onClick={() => navigate('/lms/login')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white text-xs font-black px-7 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl shadow-primary/20 hover:-translate-y-0.5"
            >
              Explore Dashboard
              <ArrowRight size={14} />
            </button>
            <a 
              href="#courses"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 border border-slate-200 hover:bg-slate-100/50 bg-white text-slate-700 text-xs font-extrabold px-6 py-3.5 rounded-xl transition-all shadow-sm"
            >
              View 8 Official Courses
            </a>
          </div>

          {/* Quick Platform Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-12 text-left select-none">
            {[
              { label: "Verified Courses", val: "8 Official" },
              { label: "Active Class Schedule", val: "Timetable-driven" },
              { label: "Interactive Testing", val: "Mock & Practice" },
              { label: "Authorized Partner", val: "Gold Certification" }
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-slate-200/50 p-4 rounded-xl shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{stat.label}</span>
                <span className="text-sm font-black text-slate-800 mt-1 block">{stat.val}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Course Catalog Grid Section */}
      <section id="courses" className="py-16 bg-white px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Our Professional Training Catalog
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-400">
              Select one of our official learning frameworks to accelerate your career growth and gain globally recognized credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, idx) => (
              <div 
                key={idx} 
                className="group bg-slate-50 border border-slate-200/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative overflow-hidden h-40">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                    <span className="absolute bottom-3 left-3 bg-white text-primary text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                      {course.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-3 text-left">
                    <h3 className="font-extrabold text-slate-800 text-xs line-clamp-2 leading-snug min-h-[2.5rem]">
                      {course.title}
                    </h3>
                    
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                      <Clock size={12} />
                      <span>{course.duration} Syllabus</span>
                      <span className="mx-1.5 text-slate-300">•</span>
                      <Award size={12} className="text-amber-500" />
                      <span>{course.students} Trained</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-200/40 mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-0.5 text-[10px] font-black text-amber-500">
                    <Star size={11} className="fill-current" />
                    <span>{course.rating}</span>
                  </div>
                  <button 
                    onClick={() => navigate('/lms/login')}
                    className="py-1 px-3 bg-slate-100 hover:bg-primary hover:text-white text-slate-700 text-[10px] font-bold rounded-lg transition-all"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Platform Features Section */}
      <section id="features" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6 text-left">
              <span className="inline-block px-3 py-1 bg-accent/10 text-accent border border-accent/20 text-[9px] font-bold rounded-full uppercase tracking-wider">
                Built for High Pass Rates
              </span>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">
                Modern Learning Engine Designed for Professional Standards
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                LearnersKart coordinates video walkthroughs, offline workbooks, and exam schedule management in one place. Say goodbye to fragmented learning channels.
              </p>

              <div className="space-y-4">
                {[
                  { title: "Direct Calendar Timetable", desc: "View dates and details of upcoming zoom sessions without leaving the platform." },
                  { title: "Targeted Assessment Simulator", desc: "Practice mock exams and green belt test workbooks to measure your performance." },
                  { title: "Official Certification Pipeline", desc: "Gain credential status verified by industry authorized trainer profiles." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="p-1.5 bg-success/10 text-success rounded-lg shrink-0 mt-0.5">
                      <CheckCircle size={14} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-xs">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Decorative Frame */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent opacity-10 rounded-2xl filter blur-xl transform rotate-2 -z-10" />
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600" 
                alt="Feature Showcase" 
                className="w-full h-auto rounded-2xl border border-slate-200 shadow-lg object-cover max-h-[400px]"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="testimonials" className="py-16 bg-white px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-black text-slate-900">What Our Alumni Say</h2>
            <p className="text-xs text-slate-400 font-medium">Over 5,000+ professionals have successfully scaled their skills.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
            {[
              {
                text: "The Mock tests prep simulator was the exact replica of my official PMI exam. The schedule coordinator made sure I never missed a session.",
                user: "Rahul Krishnamurthy",
                role: "PMP Certified Professional",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
              },
              {
                text: "Highly structured. I completed the Green Belt syllabus and immediately registered for the Black Belt. Standard syllabus, no distractions.",
                user: "Sarah Jenkins",
                role: "LSSGB Certified Coordinator",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
              },
              {
                text: "Simple dashboard, robust video playback and direct links to Zoom sessions. Perfect for busy managers trying to study.",
                user: "Dinesh Kumar",
                role: "SAFe Product Owner",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
              }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-slate-50 border border-slate-200/50 rounded-xl flex flex-col justify-between text-left shadow-sm">
                <p className="text-xs text-slate-500 italic leading-relaxed font-medium">
                  "{item.text}"
                </p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200/50">
                  <img 
                    src={item.avatar} 
                    alt={item.user} 
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-xs">{item.user}</h4>
                    <span className="text-[9px] font-bold text-slate-400 block mt-0.5">{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Footer */}
      <footer className="border-t border-slate-200/60 py-10 bg-slate-50 px-6 text-center select-none text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold">
          <div className="flex items-center gap-2">
            <img 
              src="https://learnerskart.com/wp-content/uploads/2023/05/4545c.png" 
              alt="Logo" 
              className="h-5 object-contain bg-white rounded p-0.5"
            />
            <span>© 2026 LearnersKart. All Rights Reserved.</span>
          </div>

          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Support Helpline</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
