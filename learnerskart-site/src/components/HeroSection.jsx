import React from 'react';
import { Calendar, Users, Trophy, BookOpen, Layers, Laptop, Star } from 'lucide-react';

const highlightItems = [
  {
    icon: Calendar,
    title: "Guaranteed Training Classes",
    desc: "Always-on classes you can count on.",
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    icon: Users,
    title: "Industry Expert Instructors",
    desc: "Pro instructors from top industries.",
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    icon: Trophy,
    title: "High Pass Rate",
    desc: "Proven success with high exam pass rates.",
    color: "text-[#f97316]",
    bg: "bg-orange-50"
  },
  {
    icon: BookOpen,
    title: "Career-Focused Curriculum",
    desc: "Get practical training with industry-relevant skills.",
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  {
    icon: Layers,
    title: "Hands-On, Real-World Training",
    desc: "Gain experience through real-world scenarios.",
    color: "text-red-600",
    bg: "bg-red-50"
  },
  {
    icon: Laptop,
    title: "Flexible Learning Options",
    desc: "Acquire new skills with flexible learning options.",
    color: "text-cyan-600",
    bg: "bg-cyan-50"
  }
];

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-gray-50/50 pt-12 md:pt-20 pb-16">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-200/40 rounded-full filter blur-3xl -z-10 animate-pulse" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-orange-100/30 rounded-full filter blur-3xl -z-10 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Two Column Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          
          {/* Left Column: Context & CTA */}
          <div className="flex flex-col text-center lg:text-left space-y-6">
            <div className="inline-flex self-center lg:self-start items-center gap-2 bg-orange-50 border border-orange-200 text-[#f97316] text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full shadow-sm">
              <Star className="w-3.5 h-3.5 fill-current" />
              Transform Your Career to Next Level
            </div>
            
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-[#0a3d91] tracking-tight leading-[1.1] font-sans">
              Learn, Certify, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#0a3d91] via-[#0b4fb8] to-[#f97316] bg-clip-text text-transparent">
                Lead with Confidence
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-500 font-semibold italic max-w-xl mx-auto lg:mx-0">
              "Certification is a key to learners' success"
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a 
                href="#courses" 
                className="w-full sm:w-auto text-center bg-[#f97316] hover:bg-[#ea580c] text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-orange-500/20 transform hover:-translate-y-0.5 transition-all duration-250 text-base"
              >
                Explore Courses
              </a>
              <a 
                href="#contact" 
                className="w-full sm:w-auto text-center bg-[#0a3d91] hover:bg-[#083072] text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all duration-250 text-base"
              >
                Contact Advisor
              </a>
            </div>
          </div>

          {/* Right Column: Premium Graphical Image & Floating Badge */}
          <div className="relative flex justify-center items-center">
            
            {/* Background Decorative Rings */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-orange-100 rounded-full w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] filter blur-2xl opacity-60 -z-10 animate-spin-slow" />
            
            {/* Hero Image Container */}
            <div className="relative max-w-md sm:max-w-lg lg:max-w-full">
              <img 
                src="https://learnerskart.com/wp-content/uploads/2025/06/freepik__adjust__35551-Photoroom.png" 
                alt="LearnersKart Professional Training" 
                className="w-full h-auto object-contain drop-shadow-2xl relative z-10 transition-transform duration-500 hover:scale-[1.02]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop";
                }}
              />

              {/* Floating Reviews Badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 sm:-left-6 sm:translate-x-0 bg-white/95 backdrop-blur-md shadow-2xl border border-blue-100 rounded-2xl p-4 flex items-center gap-3.5 z-20 w-[90%] sm:w-72 hover:scale-[1.03] transition-transform duration-300">
                <div className="bg-orange-100 p-2.5 rounded-xl text-[#f97316] flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-base font-extrabold text-[#0a3d91]">4.85</span>
                    <span className="text-xs font-semibold text-gray-400">/ 5 rating</span>
                  </div>
                  <p className="text-xs font-bold text-gray-500 mt-0.5">18,340 Learners reviews</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Section 4: Feature Pills / Highlights Bar */}
        <div className="mt-16 border-t border-gray-100 pt-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0a3d91] tracking-tight font-sans">
              Our Core Training Deliverables
            </h2>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              Designed carefully to ensure learner success and career advancement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlightItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-100 hover:-translate-y-1 transition-all duration-300 flex items-start gap-4 group"
                >
                  <div className={`${item.bg} ${item.color} p-3 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0a3d91] leading-tight transition-colors duration-200 group-hover:text-[#f97316]">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1.5 font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
