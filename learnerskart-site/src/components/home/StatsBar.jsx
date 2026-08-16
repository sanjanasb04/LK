import React, { useRef } from 'react';
import useIntersection from '../../hooks/useIntersection';
import useCountUp from '../../hooks/useCountUp';
import { Users, Presentation, Smile, GraduationCap } from 'lucide-react';

const StatsBar = () => {
  const containerRef = useRef(null);
  const isVisible = useIntersection(containerRef, '0px');

  const studentsCount = useCountUp(32, 2000, isVisible);
  const classesCount = useCountUp(18, 2000, isVisible);
  const satisfactionCount = useCountUp(99, 2000, isVisible);
  const instructorsCount = useCountUp(200, 2000, isVisible);

  const stats = [
    {
      icon: <Users className="w-8 h-8 text-accent" />,
      value: `${studentsCount}K+`,
      label: 'Enrolled Students',
    },
    {
      icon: <Presentation className="w-8 h-8 text-accent" />,
      value: `${classesCount}K+`,
      label: 'Training Classes',
    },
    {
      icon: <Smile className="w-8 h-8 text-accent" />,
      value: `${satisfactionCount}%`,
      label: 'Satisfaction Rate',
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-accent" />,
      value: `${instructorsCount}+`,
      label: 'Expert Instructors',
    },
  ];

  return (
    <section
      ref={containerRef}
      className="bg-primary py-12 md:py-16 text-white select-none relative overflow-hidden"
    >
      {/* Decorative patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-light/30 via-primary/10 to-transparent -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center">
              <div className="mb-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm shadow-inner">
                {stat.icon}
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-none">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-blue-100 font-semibold mt-2.5 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
