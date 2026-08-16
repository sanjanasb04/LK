import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Video, Award, Users, BookOpen, MapPin, CheckCircle } from 'lucide-react';

const TrainingModes = () => {
  const [activeTab, setActiveTab] = useState(0);

  const modes = [
    {
      title: 'Live Online Training',
      icon: <Video className="w-5 h-5" />,
      heading: 'Live Online Interactive Training',
      subtitle: 'Real-time learning from the comfort of your home.',
      bullets: [
        'Interactive live sessions with expert, accredited instructors.',
        'Hands-on labs and real-world case studies in real-time.',
        'Access to class recordings for lifetime review and recap.',
        'Direct Q&A support and exam preparation strategies.',
        'Earn official contact hours / professional development units (PDUs).'
      ],
      description: 'Our Live Online Interactive Training combines the structure of classroom learning with the convenience of studying from home. Perfect for busy working professionals who want to interact directly with mentors and peers without travel overheads.'
    },
    {
      title: 'Physical Classroom',
      icon: <MapPin className="w-5 h-5" />,
      heading: 'In-Person Physical Classroom Training',
      subtitle: 'Immersive, high-energy local learning environments.',
      bullets: [
        'Face-to-face instruction in premium local corporate hubs.',
        'Interactive team-based exercises and group case work.',
        'Excellent networking opportunities with industry peers.',
        'Structured learning roadmap with zero home distractions.',
        'Fully printed courseware, reference guides, and refreshments included.'
      ],
      description: 'Join our intensive, face-to-face classroom sessions in major cities. Experience classroom energy and group focus that drives deep retention and high pass rates. All materials and mock examinations are provided on-site.'
    },
    {
      title: 'Training + Exam Prep',
      icon: <Award className="w-5 h-5" />,
      heading: 'Integrated Training + Exam Preparation',
      subtitle: 'Complete end-to-end certification assurance program.',
      bullets: [
        'Official accredited training syllabus coverage.',
        'Highly optimized mock exam simulators with 1,000+ questions.',
        'Dedicated session reviewing difficult exam concepts.',
        'One-on-one application assistance and audit support.',
        'Exam pass guarantee - free retake training if you do not pass.'
      ],
      description: 'Designed specifically for professionals who want to eliminate exam anxiety. This comprehensive dual package covers both core theoretical concepts and intensive exam-passing strategies, ensuring you succeed on your first attempt.'
    },
    {
      title: 'Self-Study (E-Learning)',
      icon: <BookOpen className="w-5 h-5" />,
      heading: 'Self-Paced E-Learning & Study Material',
      subtitle: 'Learn at your own pace, on your own terms.',
      bullets: [
        'Lifetime access to premium, high-definition video lectures.',
        'Downloadable chapter slide decks, checklists, and summary sheets.',
        'Self-paced progress tracker with mobile-friendly layouts.',
        'Chapter-wise assessment quizzes and end-of-course mock exams.',
        'E-Learning completion certificate recognized by leading employers.'
      ],
      description: 'Get total flexibility with our self-paced courseware. Ideal for self-motivated individuals who want high-quality education without rigid timetables. Fits seamlessly around your work and personal life.'
    },
    {
      title: 'Corporate / Group',
      icon: <Users className="w-5 h-5" />,
      heading: 'Tailored Corporate & Group Trainings',
      subtitle: 'Custom learning roadmaps built for enterprise teams.',
      bullets: [
        'Customized curriculum aligning with your company projects.',
        'Flexible scheduling (weekdays, weekends, or block training).',
        'Transparent team-level progress tracking and analytics reports.',
        'Enterprise-grade discount pricing for groups of 5 or more.',
        'Available in both online interactive and on-site physical formats.'
      ],
      description: 'Empower your teams with scalable training solutions. We work closely with HR and project management heads to customize course contents, ensuring immediately measurable improvements in project delivery and quality standards.'
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-100 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 text-left md:text-center">
          <span className="text-accent text-xs font-extrabold uppercase tracking-widest leading-none">Tailored Solutions</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-textdark mt-2.5 leading-tight">
            Tailored Training Formats for Every Learner
          </h2>
          <p className="text-sm text-textmuted mt-2 leading-relaxed">
            Whether you thrive in interactive group classes, prefer self-paced studying, or need to upskill an entire corporate team, we have a learning format built for you.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Tab selectors (4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            {modes.map((mode, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`w-full flex items-center gap-3.5 p-4.5 rounded-xl border text-left font-bold text-sm sm:text-base transition-all duration-200 ${
                  activeTab === index
                    ? 'bg-primary text-white border-primary shadow-md translate-x-1'
                    : 'bg-slate-50 text-textdark border-slate-100 hover:bg-slate-100 hover:translate-x-1'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeTab === index ? 'bg-white/15' : 'bg-white shadow-sm'}`}>
                  {mode.icon}
                </div>
                <span>{mode.title}</span>
              </button>
            ))}
          </div>

          {/* Right: Active Tab Content (8 columns) */}
          <div className="lg:col-span-8 bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-10 flex flex-col justify-between text-left animate-fade-in">
            <div className="space-y-4">
              {/* Header */}
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-textdark leading-tight">
                  {modes[activeTab].heading}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-accent mt-1 leading-none">
                  {modes[activeTab].subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-textmuted leading-relaxed">
                {modes[activeTab].description}
              </p>

              {/* Checklist */}
              <div className="pt-2">
                <p className="font-bold text-xs text-textdark uppercase tracking-wider mb-3">Key Highlights:</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                  {modes[activeTab].bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action */}
            <div className="pt-8 border-t border-slate-200/60 mt-8 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-textmuted font-semibold">
                Interested in this training mode? Speak to a career advisor today.
              </span>
              <Link
                to="/contact"
                className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow transition-all"
              >
                Inquire Now
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TrainingModes;
