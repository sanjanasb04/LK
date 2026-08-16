import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, User, Building2, ArrowRight } from 'lucide-react';

const BenefitsSection = () => {
  const individualBenefits = [
    'Career Growth Promotion',
    'Higher Salary Potential',
    'Flexible Learning Options',
    'Enhanced Skill Set',
    'Global Recognition',
    'Exam Preparation Support'
  ];

  const corporateBenefits = [
    'Stronger Project Delivery',
    'Customized Training Solutions',
    'Scalable Learning for Teams',
    'Employee Retention & Engagement',
    'Compliance & Quality Standards',
    'Measurable ROI'
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-100 select-none text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Card 1: Individuals */}
          <div className="bg-lightbg/40 border border-blue-50 rounded-2xl p-8 sm:p-12 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              {/* Icon & Label */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary text-white rounded-xl shadow-sm">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-accent text-xs font-extrabold uppercase tracking-widest leading-none">For Professionals</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-textdark mt-1 leading-tight">
                    Benefits for Individuals
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-bold text-primary mb-5">
                Gain valuable Expert-Led Live Sessions
              </p>
              <p className="text-xs sm:text-sm text-textmuted leading-relaxed mb-6">
                Accelerate your professional trajectory, stand out to recruiters, and qualify for high-paying roles by earning internationally accredited credentials.
              </p>

              {/* Checklist */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 font-semibold mb-8">
                {individualBenefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/contact"
              className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-lg text-xs transition-all shadow self-start inline-flex items-center gap-1.5 group"
            >
              Contact Course Advisor
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Card 2: Corporate */}
          <div className="bg-amber-50/20 border border-amber-100/30 rounded-2xl p-8 sm:p-12 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              {/* Icon & Label */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-accent text-white rounded-xl shadow-sm">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-primary text-xs font-extrabold uppercase tracking-widest leading-none">For Enterprise</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-textdark mt-1 leading-tight">
                    Benefits for Corporate Clients
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-bold text-accent mb-5">
                Personalized Corporate Training Solutions
              </p>
              <p className="text-xs sm:text-sm text-textmuted leading-relaxed mb-6">
                Equip your teams with cutting-edge tools, standardized frameworks, and methodologies that minimize project delays and optimize operational efficiency.
              </p>

              {/* Checklist */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 font-semibold mb-8">
                {corporateBenefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-accent flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/contact"
              className="bg-accent hover:bg-accent-dark text-white font-bold px-6 py-3 rounded-lg text-xs transition-all shadow self-start inline-flex items-center gap-1.5 group"
            >
              Skill Up Your Teams
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
