import React, { useState, useEffect, useRef } from 'react';
import { Award, Users, BookOpen, Smile } from 'lucide-react';

const statsData = [
  {
    icon: Users,
    target: 50,
    suffix: "K+",
    label: "Students Enrolled",
    desc: "Empowered learners worldwide"
  },
  {
    icon: BookOpen,
    target: 30,
    suffix: "+",
    label: "Classes Completed",
    desc: "Diverse topics and courses"
  },
  {
    icon: Smile,
    target: 90,
    suffix: "%",
    label: "Satisfaction Rate",
    desc: "Positive feedback from graduates"
  },
  {
    icon: Award,
    target: 200,
    suffix: "+",
    label: "Top Instructors",
    desc: "Industry-certified educators"
  }
];

function Counter({ target, duration = 1500, trigger }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let start = 0;
    const end = target;
    if (start === end) return;

    const totalMiliseconds = duration;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 10);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration, trigger]);

  return <span>{count}</span>;
}

export default function StatsBar() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target); // Trigger animation only once
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-gradient-to-br from-[#0a3d91] via-[#083072] to-[#041a3f] text-white py-16 overflow-hidden border-b border-[#041a3f]"
    >
      {/* Decorative abstract elements */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full filter blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {statsData.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300 group"
              >
                <div className="bg-white/10 text-[#f97316] p-4 rounded-2xl mb-4 group-hover:scale-115 transition-all duration-350">
                  <Icon className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                
                <div className="text-3xl sm:text-4xl md:text-5xl font-black font-sans tracking-tight flex items-baseline justify-center">
                  <Counter target={stat.target} trigger={inView} />
                  <span className="text-[#f97316] font-bold">{stat.suffix}</span>
                </div>
                
                <h3 className="text-sm sm:text-base font-extrabold mt-3 tracking-wide">
                  {stat.label}
                </h3>
                
                <p className="text-xxs sm:text-xs text-blue-200 mt-1 font-medium max-w-[170px] opacity-80">
                  {stat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
