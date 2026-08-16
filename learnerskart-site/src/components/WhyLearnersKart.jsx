import React from 'react';
import { 
  CalendarCheck, 
  ShieldCheck, 
  UserCheck, 
  Award, 
  Layers, 
  Clock, 
  Briefcase, 
  Share2, 
  BookOpen, 
  Globe, 
  HeartHandshake, 
  Headphones 
} from 'lucide-react';

const reasons = [
  { icon: CalendarCheck, title: "Guaranteed Running Classes", bg: "bg-blue-50 text-blue-600" },
  { icon: ShieldCheck, title: "Quality Assurance", bg: "bg-emerald-50 text-emerald-600" },
  { icon: UserCheck, title: "Experienced Trainers", bg: "bg-purple-50 text-purple-600" },
  { icon: Award, title: "Recognized Credentials", bg: "bg-orange-50 text-[#f97316]" },
  
  { icon: Layers, title: "Structured Learning", bg: "bg-pink-50 text-pink-600" },
  { icon: Clock, title: "Flexible Learning", bg: "bg-cyan-50 text-cyan-600" },
  { icon: Briefcase, title: "Industry Relevance", bg: "bg-amber-50 text-amber-600" },
  { icon: Share2, title: "Networking Opportunities", bg: "bg-indigo-50 text-indigo-600" },
  
  { icon: BookOpen, title: "Comprehensive Resources", bg: "bg-teal-50 text-teal-600" },
  { icon: Globe, title: "Global Delivery", bg: "bg-rose-50 text-rose-600" },
  { icon: HeartHandshake, title: "Post Training Support", bg: "bg-violet-50 text-violet-600" },
  { icon: Headphones, title: "24/7 Dedicated Support", bg: "bg-sky-50 text-sky-600" }
];

export default function WhyLearnersKart() {
  return (
    <section className="w-full bg-gray-50/50 py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-[#f97316] bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-100 shadow-sm">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0a3d91] tracking-tight mt-3 font-sans leading-tight">
            Why LearnersKart for Your Next Professional Certification?
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-3 font-semibold">
            We are committed to delivering the highest quality professional training to help you successfully achieve your career aspirations.
          </p>
        </div>

        {/* 4x3 Grid (Responsive) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-blue-100 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center gap-4 group"
              >
                <div className={`${item.bg} p-4 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#0a3d91] tracking-tight leading-snug">
                  {item.title}
                </h3>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
