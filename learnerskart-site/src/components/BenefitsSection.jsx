import React from 'react';
import { UserCheck, Building2, CheckCircle, ArrowUpRight } from 'lucide-react';

const individualBenefits = [
  "Accelerate Career Growth & Promotions",
  "Command Higher Salary & Compensation",
  "Highly Flexible, Self-Paced Learning",
  "Master Practical, Enhanced Job Skills",
  "Obtain Global, Industry-Recognized Credentials",
  "Gain Comprehensive Exam Prep & Pass Support"
];

const corporateBenefits = [
  "Ensure Stronger, High-Quality Project Delivery",
  "Customized Training Tailored to Business Needs",
  "Seamlessly Scalable Learning for Large Teams",
  "Increase Employee Retention & Job Satisfaction",
  "Meet Strict Industry Compliance Standards",
  "Achieve Clear, Measurable Return on Investment (ROI)"
];

export default function BenefitsSection() {
  return (
    <section className="w-full bg-white py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-[#f97316] bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-100 shadow-sm">
            Proven Outcomes
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0a3d91] tracking-tight mt-3 font-sans leading-tight">
            Empowering Careers & Enterprises
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-3 font-semibold">
            Discover how LearnersKart training delivers measurable impact, whether you are an individual professional or a growing corporate team.
          </p>
        </div>

        {/* Two-Column Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* LEFT: Benefits for Individuals */}
          <div className="bg-gradient-to-br from-blue-50/70 to-white border border-blue-100 rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="bg-[#0a3d91]/10 text-[#0a3d91] p-3.5 rounded-2xl flex items-center justify-center shadow-sm">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xxs sm:text-xs font-black uppercase tracking-wider text-[#f97316]">
                    Gain valuable Expert-Led Live Sessions
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0a3d91] tracking-tight font-sans">
                    Benefits for Individuals
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 font-semibold mb-8 leading-relaxed">
                Take command of your career pathway. Acquire credentials respected by top-tier global employers and master practical capabilities you can apply immediately on the job.
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {individualBenefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-gray-700 leading-tight">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-blue-100/40">
              <a 
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0a3d91] hover:bg-[#083072] text-white font-bold px-6 py-4 rounded-xl transition-all duration-200 text-sm shadow-md"
              >
                Contact Course Advisor
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* RIGHT: Benefits for Corporate Clients */}
          <div className="bg-gradient-to-br from-orange-50/50 to-white border border-orange-100 rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="bg-orange-50 text-[#f97316] p-3.5 rounded-2xl flex items-center justify-center shadow-sm">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xxs sm:text-xs font-black uppercase tracking-wider text-[#0a3d91]">
                    Personalized Corporate Training
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0a3d91] tracking-tight font-sans">
                    Benefits for Corporate Clients
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 font-semibold mb-8 leading-relaxed">
                Standardize performance across your enterprise. Scale skill development, improve project delivery timelines, and boost employee satisfaction with customized corporate learning tracks.
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {corporateBenefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-gray-700 leading-tight">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-orange-100/40">
              <a 
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold px-6 py-4 rounded-xl transition-all duration-200 text-sm shadow-md"
              >
                Skill Up Your Teams
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
