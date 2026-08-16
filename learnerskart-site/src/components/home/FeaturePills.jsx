import React from 'react';
import { Calendar, UserCheck, Trophy, Briefcase, Wrench, Clock } from 'lucide-react';

const FeaturePills = () => {
  const features = [
    {
      icon: <Calendar className="w-5 h-5 text-primary" />,
      title: 'Guaranteed Training Classes',
      description: 'Always-on classes you can count on.',
      bgColor: 'bg-blue-50/50 border-blue-100/50',
    },
    {
      icon: <UserCheck className="w-5 h-5 text-accent" />,
      title: 'Industry Expert Instructors',
      description: 'Pro instructors from top industries.',
      bgColor: 'bg-amber-50/50 border-amber-100/50',
    },
    {
      icon: <Trophy className="w-5 h-5 text-emerald-500" />,
      title: 'High Pass Rate',
      description: 'Proven success with high exam pass rates.',
      bgColor: 'bg-emerald-50/50 border-emerald-100/50',
    },
    {
      icon: <Briefcase className="w-5 h-5 text-indigo-500" />,
      title: 'Career-Focused Curriculum',
      description: 'Get practical training with industry-relevant skills.',
      bgColor: 'bg-indigo-50/50 border-indigo-100/50',
    },
    {
      icon: <Wrench className="w-5 h-5 text-violet-500" />,
      title: 'Hands-On Training',
      description: 'Gain experience through real-world scenarios.',
      bgColor: 'bg-violet-50/50 border-violet-100/50',
    },
    {
      icon: <Clock className="w-5 h-5 text-pink-500" />,
      title: 'Flexible Learning',
      description: 'Acquire new skills with flexible learning options.',
      bgColor: 'bg-pink-50/50 border-pink-100/50',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-100 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 p-5 rounded-xl border transition-all duration-200 hover:shadow-md text-left ${f.bgColor}`}
            >
              <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-textdark mb-1 leading-tight">
                  {f.title}
                </h3>
                <p className="text-xs text-textmuted leading-relaxed">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturePills;
