import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, CheckCircle2, ShieldCheck, Heart, Users, Target, Rocket, Lightbulb, Globe, Star } from 'lucide-react';
import StatsBar from '../components/home/StatsBar';
import AccreditationLogos from '../components/home/AccreditationLogos';

const AboutUsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const coreValues = [
    {
      icon: <Target className="w-6 h-6 text-primary" />,
      title: 'Excellence',
      desc: 'We deliver the highest quality, industry-accredited professional certification training available.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: 'Integrity',
      desc: 'Honest, transparent, and strictly compliant with global educational boards and bodies.',
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-accent" />,
      title: 'Innovation',
      desc: 'Continuously refining and evolving our learning simulators, video resources, and methodologies.',
    },
    {
      icon: <Globe className="w-6 h-6 text-indigo-500" />,
      title: 'Accessibility',
      desc: 'Accredited training accessible to everyone, everywhere, at highly affordable corporate-tier rates.',
    },
  ];

  const instructors = [
    {
      name: 'Dr. Alok Kumar',
      role: 'Senior Project Management Expert',
      avatar: 'https://learnerskart.com/wp-content/uploads/2024/10/co-instructor-06-60x60.jpg',
      bio: 'Dr. Kumar has trained over 10,000+ certification aspirants globally, specializing in hybrid PMP and Agile methodologies.',
      rating: 4.9,
    },
    {
      name: 'Master Black Belt Rajan',
      role: 'Six Sigma Master Trainer',
      avatar: 'https://learnerskart.com/wp-content/uploads/2024/10/co-instructor-02-60x60.jpg',
      bio: 'Rajan is an industry veteran with 20+ years driving operational excellence, quality control, and Lean Six Sigma programs.',
      rating: 4.8,
    },
    {
      name: 'Linda Vance',
      role: 'Senior Business Analyst Trainer',
      avatar: 'https://learnerskart.com/wp-content/uploads/2024/10/co-instructor-05-60x60.jpg',
      bio: 'Linda is a dedicated BABOK Guide specialist who helps senior business analysts qualify for ECBA and CBAP boards.',
      rating: 4.9,
    },
    {
      name: 'Sarah Jenkins',
      role: 'Agile & DevOps Coordinator',
      avatar: 'https://learnerskart.com/wp-content/uploads/2024/10/co-instructor-04-60x60.jpg',
      bio: 'Sarah leads interactive bootcamps covering PMI-ACP and Scaled Agile (SAFe) practices for agile scrum teams.',
      rating: 4.7,
    },
  ];

  const points = [
    { num: '1', title: 'Industry-Recognized Certifications', desc: 'Our syllabi are accredited by PMI, PeopleCert, IASSC, and other elite global institutions.' },
    { num: '2', title: 'Expert Mentors from Top Industries', desc: 'Acquire practical knowledge from trainers currently leading large-scale corporate teams.' },
    { num: '3', title: 'Flexible Learning Formats', desc: 'Switch seamlessly between interactive live classes, self-study, or localized classrooms.' },
    { num: '4', title: 'Dedicated Career Support', desc: 'Enjoy post-class resume guidance, exam application audits, and continuous mentorship.' },
    { num: '5', title: 'Global Delivery Capability', desc: 'Serving individual learners and enterprise cohorts across North America, Europe, Asia, and India.' },
    { num: '6', title: 'High Exam Pass Rate Guarantee', desc: 'We take pride in our 98.7% first-time pass rate, supported by our full-refund exam pass promise.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left">
      
      {/* SECTION A — HERO */}
      <section className="relative bg-gradient-to-br from-[#f0f5ff] via-[#f3f6ff] to-white py-16 sm:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-primary text-xs font-extrabold uppercase tracking-widest leading-none">Welcome to LearnersKart</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-textdark leading-tight">
                Unlock Endless Opportunities <br />
                <span className="text-primary">For Learning and Growth</span>
              </h1>
              <p className="text-xs sm:text-sm text-textmuted leading-relaxed max-w-2xl">
                LearnersKart is a premier global educational platform dedicated to empowering individuals and organizational teams with the high-impact skills required to succeed in today's rapidly evolving digital economy.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                We deliver elite, highly affordable Professional Certification Training across project management, quality control, business analysis, and agile frameworks. Led by accredited industry veterans, our bootcamps bridge the gap between academic theory and workplace execution, guaranteeing global certification and career advancement.
              </p>
              <div className="pt-2 flex gap-4">
                <Link to="/courses" className="bg-accent hover:bg-accent-dark text-white font-bold px-6 py-3 rounded-lg shadow-sm text-xs">
                  Explore Courses
                </Link>
                <Link to="/contact" className="bg-white text-textdark border border-slate-200 font-bold px-6 py-3 rounded-lg shadow-sm text-xs hover:bg-slate-50">
                  Contact Advisor
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center">
              <img
                src="/about-team.jpg"
                alt="About LearnersKart Team"
                className="w-full h-auto rounded-2xl shadow-md border border-slate-100 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B — MISSION & VISION */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="bg-lightbg/30 border border-blue-50 p-8 sm:p-10 rounded-2xl flex gap-4 items-start hover:shadow-md transition-shadow">
              <div className="p-3.5 bg-primary text-white rounded-xl shadow-sm">
                <Target className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-base sm:text-lg text-textdark uppercase tracking-wider leading-none">Our Mission</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  To empower individuals and corporate teams with world-class professional certification training that accelerates career development, bridges technical skill gaps, and drives overall organizational excellence.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-amber-50/15 border border-amber-100/30 p-8 sm:p-10 rounded-2xl flex gap-4 items-start hover:shadow-md transition-shadow">
              <div className="p-3.5 bg-accent text-white rounded-xl shadow-sm">
                <Rocket className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-base sm:text-lg text-textdark uppercase tracking-wider leading-none">Our Vision</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  To be the most trusted, impactful, and accessible professional certification training partner globally, transforming careers and businesses one certification at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C — STATS BAR */}
      <StatsBar />

      {/* SECTION D — CORE VALUES */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-accent text-xs font-extrabold uppercase tracking-widest">Our DNA</span>
            <h2 className="text-3xl font-extrabold text-textdark mt-2">Our Core Values</h2>
            <p className="text-xs sm:text-sm text-textmuted mt-2 font-medium">
              We operate under a strict code of educational excellence and customer-centric support.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 p-6 rounded-xl space-y-4 hover:shadow-sm transition-shadow">
                <div className="p-2.5 bg-white rounded-lg shadow-sm border border-slate-100 inline-block">
                  {val.icon}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-textdark leading-tight">{val.title}</h3>
                <p className="text-xs text-textmuted leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION E — TEAM SECTION */}
      <section className="py-20 bg-lightbg/10 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-accent text-xs font-extrabold uppercase tracking-widest">Elite Educators</span>
            <h2 className="text-3xl font-extrabold text-textdark mt-2">Meet Our Expert Instructors</h2>
            <p className="text-xs sm:text-sm text-textmuted mt-2 font-medium">
              Learn from accredited corporate advisors who bring real-world experience into the lecture hall.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {instructors.map((inst, i) => (
              <div key={i} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-center space-y-4 hover:shadow-md transition-shadow">
                <img
                  src={inst.avatar}
                  alt={inst.name}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-100 mx-auto shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-textdark leading-tight">{inst.name}</h3>
                  <p className="text-[10px] font-bold text-accent mt-1 leading-none uppercase tracking-wider">{inst.role}</p>
                </div>
                
                {/* Rating */}
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  <span className="text-xs font-bold text-slate-700">{inst.rating} Rating</span>
                </div>

                <p className="text-xs text-textmuted leading-relaxed line-clamp-3">
                  {inst.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION F — WHY CHOOSE US */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-accent text-xs font-extrabold uppercase tracking-widest">The LearnersKart Advantage</span>
            <h2 className="text-3xl font-extrabold text-textdark mt-2">Why Hundreds Trust Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {points.map((pt) => (
              <div key={pt.num} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-black text-sm flex items-center justify-center flex-shrink-0">
                  {pt.num}
                </div>
                <div className="space-y-1 text-left">
                  <h3 className="font-bold text-sm sm:text-base text-textdark leading-tight">{pt.title}</h3>
                  <p className="text-xs text-textmuted leading-relaxed">{pt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION G — ACCREDITATION LOGOS */}
      <AccreditationLogos />

      {/* SECTION H — CTA BANNER */}
      <section className="py-16 bg-primary text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-light/40 via-transparent to-transparent -z-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            Ready to Accelerate Your Career Trajectory?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed font-semibold">
            Gain access to accredited curricula, mock assessments, and corporate network portals. Start learning today.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link to="/courses" className="bg-accent hover:bg-accent-dark text-white font-bold px-8 py-3.5 rounded-lg shadow-md text-xs uppercase tracking-wider">
              Explore All Courses
            </Link>
            <Link to="/contact" className="bg-white/10 hover:bg-white/15 text-white border border-white/25 font-bold px-8 py-3.5 rounded-lg text-xs uppercase tracking-wider">
              Contact Advisors
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUsPage;
