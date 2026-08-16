import React from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Users,
  Award,
  BookOpen,
  Clock,
  Briefcase,
  Share2,
  FileText,
  Globe,
  Headphones,
  PhoneCall
} from 'lucide-react';

const WhyLearnersKart = () => {
  const cards = [
    // Row 1
    {
      icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
      title: 'Guaranteed Classes',
      description: 'Never worry about cancellations. Our scheduled certification batches are 100% guaranteed to run.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: 'Quality Assurance',
      description: 'Accredited study materials and coursework aligned strictly with the latest global curriculum standards.',
    },
    {
      icon: <Users className="w-6 h-6 text-accent" />,
      title: 'Experienced Trainers',
      description: 'Learn from certified subject matter experts boasting over 15+ years of active industry experience.',
    },
    {
      icon: <Award className="w-6 h-6 text-violet-500" />,
      title: 'Recognized Credentials',
      description: 'Earn professional certificates globally respected and recognized by top Fortune 500 employers.',
    },
    // Row 2
    {
      icon: <BookOpen className="w-6 h-6 text-indigo-500" />,
      title: 'Structured Learning',
      description: 'Syllabi mapped step-by-step from fundamental definitions up to advanced real-world applications.',
    },
    {
      icon: <Clock className="w-6 h-6 text-pink-500" />,
      title: 'Flexible Learning',
      description: 'Choose from live weekend sessions, intensive bootcamps, or lifetime-access self-paced e-learning.',
    },
    {
      icon: <Briefcase className="w-6 h-6 text-teal-500" />,
      title: 'Industry Relevance',
      description: 'Our curriculum focuses heavily on practical case studies, real-world scenarios, and direct applications.',
    },
    {
      icon: <Share2 className="w-6 h-6 text-sky-500" />,
      title: 'Networking Events',
      description: 'Connect and collaborate with diverse cohorts of working professionals from top multinational companies.',
    },
    // Row 3
    {
      icon: <FileText className="w-6 h-6 text-amber-500" />,
      title: 'Rich Resources',
      description: 'Access complete downloadable slide decks, custom templates, flashcards, and full exam simulators.',
    },
    {
      icon: <Globe className="w-6 h-6 text-blue-500" />,
      title: 'Global Delivery',
      description: 'Seamless cross-border training solutions catering to individuals and corporate teams globally.',
    },
    {
      icon: <Headphones className="w-6 h-6 text-rose-500" />,
      title: 'Post-Training Support',
      description: 'Get continuous mentorship, resume guidance, and application assistance long after your course completes.',
    },
    {
      icon: <PhoneCall className="w-6 h-6 text-purple-500" />,
      title: '24/7 Team Support',
      description: 'Our dedicated customer success coordinators are available round the clock to resolve any queries.',
    },
  ];

  return (
    <section className="py-20 bg-lightbg/35 border-b border-slate-100 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 text-left md:text-center">
          <span className="text-accent text-xs font-extrabold uppercase tracking-widest leading-none">Why Choose Us</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-textdark mt-2.5 leading-tight">
            Why Professionals Choose LearnersKart
          </h2>
          <p className="text-sm text-textmuted mt-2 leading-relaxed">
            We are dedicated to providing premium, accessible, and highly effective certification training designed to propel your career.
          </p>
        </div>

        {/* 4x3 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-slate-100/80 shadow-sm hover:shadow-md transition-all duration-200 text-left flex flex-col items-start gap-4 group hover:-translate-y-0.5"
            >
              <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-primary/5 transition-colors flex-shrink-0">
                {card.icon}
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-textdark leading-tight group-hover:text-primary transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-textmuted leading-relaxed mt-2">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyLearnersKart;
