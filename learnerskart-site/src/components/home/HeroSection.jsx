import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, Star } from 'lucide-react';
import StarRating from '../ui/StarRating';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#f0f5ff] via-[#f3f6ff] to-white pt-10 pb-16 lg:py-24 overflow-hidden select-none text-left">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-blue-50/50 blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] rounded-full bg-amber-50/30 blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-5 space-y-6">
            {/* Small Label */}
            <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-primary px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-accent" />
              <span>Transform Your Career to Next Level</span>
            </div>

            {/* H1 Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-textdark leading-[1.1] tracking-tight">
              Learn, Certify, <br />
              <span className="text-primary">Lead with Confidence</span>
            </h1>

            {/* Quote block */}
            <div className="border-l-4 border-accent pl-4">
              <p className="text-lg font-medium text-slate-700 italic">
                "Certification is a key to learners' success"
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-textmuted leading-relaxed max-w-xl">
              Empower yourself with globally recognized professional certifications. Join over 18,000+ successful professionals who transformed their careers with LearnersKart.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/courses"
                className="bg-accent hover:bg-accent-dark text-white font-bold px-7 py-3.5 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 group text-sm sm:text-base"
              >
                Explore Courses
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
              </Link>
              <Link
                to="/about-us"
                className="bg-white hover:bg-slate-50 text-textdark border border-slate-200 font-bold px-7 py-3.5 rounded-lg transition-all shadow-sm hover:shadow text-sm sm:text-base"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 relative flex justify-center items-center">
            <div className="relative max-w-md sm:max-w-lg lg:max-w-none w-full flex justify-center">
              
              {/* Soft blue glowing aura behind the office environment image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-gradient-to-br from-blue-400/30 to-indigo-500/20 rounded-full blur-3xl -z-10"></div>

              <img
                src="/hero-office.png"
                alt="LearnersKart Professional Training"
                className="w-full max-w-4xl lg:scale-110 xl:scale-115 transform transition-transform duration-300 h-auto object-cover z-10 relative"
                style={{
                  maskImage: 'radial-gradient(ellipse, rgba(0, 0, 0, 1) 68%, rgba(0, 0, 0, 0.4) 86%, rgba(0, 0, 0, 0) 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse, rgba(0, 0, 0, 1) 68%, rgba(0, 0, 0, 0.4) 86%, rgba(0, 0, 0, 0) 100%)'
                }}
                loading="eager"
              />

              {/* Floating Certification Badge (Top Left Side) */}
              <div className="absolute -top-6 -left-6 sm:left-6 lg:-left-12 bg-white rounded-xl shadow-2xl border border-slate-100 p-4 flex items-center gap-3 z-20 max-w-[200px] flex">
                <div className="bg-blue-50 p-2.5 rounded-lg">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <span className="font-extrabold text-slate-800 text-sm">100% Verified</span>
                  <p className="text-[10px] text-textmuted font-bold mt-0.5 leading-none">Accredited Content</p>
                </div>
              </div>

              {/* Floating Reviews Badge (Right Side) */}
              <div className="absolute -bottom-8 -right-8 sm:-right-4 lg:-right-16 bg-white rounded-xl shadow-2xl border border-slate-100 p-4 flex items-center gap-3.5 z-20 animate-bounce-slow max-w-[240px] flex">
                <div className="bg-amber-50 p-2.5 rounded-lg">
                  <Star className="w-6 h-6 fill-amber-400 stroke-amber-400" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-slate-800 text-sm">4.95</span>
                    <StarRating rating={4.95} size={11} />
                  </div>
                  <p className="text-[10px] text-textmuted font-bold tracking-tight mt-0.5 leading-none">18,940 Learners Reviews</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Custom slow bounce animation */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
