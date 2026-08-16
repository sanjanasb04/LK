import React, { useState } from 'react';
import { Video, Landmark, GraduationCap, BookOpen, Users, CheckCircle2, ChevronRight } from 'lucide-react';

const trainingModes = [
  {
    icon: Video,
    title: "Live Online Interactive Training",
    description: "Engage in real-time, virtual classroom sessions led by industry experts. Get the classroom experience from the comfort of your home.",
    features: [
      "Real-Time Instructor Interaction",
      "Highly Flexible Scheduling",
      "Engaging & Interactive Environment",
      "Cost-Effective Virtual Format",
      "Recorded Sessions for Lifetime Review",
      "Network with Global Peers",
      "Weekday & Weekend Batches Available",
      "24/7 Dedicated Learning Support"
    ],
    color: "from-blue-500 to-[#0a3d91]",
    textColor: "text-[#0a3d91]"
  },
  {
    icon: Landmark,
    title: "Physical Classroom Training",
    description: "Experience traditional, immersive face-to-face learning in our modern, fully-equipped training centers with interactive group exercises.",
    features: [
      "Face-to-Face Personal Mentorship",
      "Highly Structured Environment",
      "Hands-On Group Activities & Lab Work",
      "Direct Collaborative Engagement",
      "Immediate Instructor Feedback",
      "Zero Distractions Learning Space",
      "Convenient City Center Locations",
      "24/7 Support Portal Access"
    ],
    color: "from-orange-500 to-[#f97316]",
    textColor: "text-[#f97316]"
  },
  {
    icon: GraduationCap,
    title: "Training + Exam Preparation",
    description: "A comprehensive, success-oriented boot camp combining core training with intensive exam practice and preparation strategies.",
    features: [
      "Targeted Mock Exam Simulators",
      "Industry Certified & Accredited Trainers",
      "Custom Success Study Blueprint",
      "High-Quality Study & Review Material",
      "Intensive Mock Review Sessions",
      "Detailed Performance Analytics",
      "Personalized Exam Prep Feedback",
      "100% Exam Pass Support"
    ],
    color: "from-purple-500 to-indigo-700",
    textColor: "text-purple-700"
  },
  {
    icon: BookOpen,
    title: "Self-Study (E-Learning)",
    description: "Learn at your own pace. Access our premium database of high-quality recorded lectures, slides, and study resources anytime, anywhere.",
    features: [
      "Maximum Learning Flexibility",
      "Study at Your Own Natural Pace",
      "Fits Easily into Busy Lifestyles",
      "Lifetime Unlimited Material Access",
      "Highly Cost-Effective Option",
      "Learn Anywhere, Anytime, on Any Device",
      "Regular Course Content Updates",
      "Self-Assessment Quizzes Included"
    ],
    color: "from-emerald-500 to-teal-750",
    textColor: "text-emerald-700"
  },
  {
    icon: Users,
    title: "Corporate / Group Trainings",
    description: "Customized enterprise training programs designed specifically to align with your organization's business goals and project requirements.",
    features: [
      "Tailored Content & Custom Case Studies",
      "Scheduled Around Your Team's Calendar",
      "High-Impact Team Building Exercises",
      "Consistent Skill Development Across Teams",
      "Boosts Employee Performance & Morale",
      "Measurable ROI and Project Delivery",
      "Dedicated Enterprise Account Manager",
      "Flexible Delivery (Online or Onsite)"
    ],
    color: "from-rose-500 to-red-700",
    textColor: "text-red-700"
  }
];

export default function TrainingModes() {
  const [expandedIndex, setExpandedIndex] = useState(0);

  return (
    <section className="w-full bg-white py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-[#f97316] bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-100 shadow-sm">
            Learning Pathways
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0a3d91] tracking-tight mt-3 font-sans leading-tight">
            Tailored Training Solutions for Every Learner
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-3 font-semibold">
            Choose the perfect mode of learning that aligns with your schedule, learning style, and professional goals.
          </p>
        </div>

        {/* Accordion Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Left Column: Selector Cards */}
          <div className="w-full lg:w-5/12 flex flex-col gap-4">
            {trainingModes.map((mode, idx) => {
              const Icon = mode.icon;
              const isExpanded = expandedIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setExpandedIndex(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 focus:outline-none ${
                    isExpanded
                      ? 'bg-[#0a3d91] border-[#0a3d91] text-white shadow-xl shadow-blue-900/10 translate-x-2'
                      : 'bg-gray-50/50 border-gray-100 hover:border-blue-200 hover:bg-white text-gray-700'
                  }`}
                >
                  <div className={`p-3 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                    isExpanded ? 'bg-white/10 text-[#f97316]' : 'bg-white text-[#0a3d91] shadow-sm'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-black tracking-tight leading-tight truncate">
                      {mode.title}
                    </h3>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${
                    isExpanded ? 'rotate-90 text-[#f97316]' : 'text-gray-400'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Expanded Display */}
          <div className="w-full lg:w-7/12">
            <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-6 sm:p-10 h-full flex flex-col justify-between shadow-sm relative overflow-hidden">
              {/* Background gradient hint */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${trainingModes[expandedIndex].color} opacity-[0.03] rounded-full filter blur-xl`} />

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3.5 rounded-2xl bg-white shadow-md text-[#f97316]`}>
                    {React.createElement(trainingModes[expandedIndex].icon, { className: "w-7 h-7" })}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0a3d91] tracking-tight font-sans">
                    {trainingModes[expandedIndex].title}
                  </h3>
                </div>

                <p className="text-sm sm:text-base text-gray-500 font-semibold leading-relaxed">
                  {trainingModes[expandedIndex].description}
                </p>

                <div className="border-t border-gray-100 pt-6">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#0a3d91] mb-4">
                    Key Deliverables & Benefits
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6">
                    {trainingModes[expandedIndex].features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4">
                <a 
                  href="#contact"
                  className="w-full sm:w-auto text-center bg-[#0a3d91] hover:bg-[#083072] text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-200 text-sm shadow-md"
                >
                  Inquire Now
                </a>
                <a 
                  href="#courses"
                  className="w-full sm:w-auto text-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-6 py-3.5 rounded-xl transition-all duration-200 text-sm"
                >
                  View Related Courses
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
