import React, { useEffect } from 'react';
import Breadcrumb from '../components/ui/Breadcrumb';

const MoneyBackPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <div className="bg-white border border-slate-100 px-4 py-2 rounded-lg backdrop-blur-sm self-start inline-block text-xs font-semibold">
          <Breadcrumb items={[{ label: 'Money Back Policy' }]} />
        </div>

        {/* Content */}
        <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 sm:p-10 space-y-6 text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-textdark border-b border-slate-100 pb-4 leading-none uppercase tracking-wider">
            Money Back Policy
          </h1>

          <p className="text-slate-400 font-bold uppercase text-[10px]">Last Updated: January 2026</p>

          <p>
            At LearnersKart, we stand behind the quality of our training curriculum. We offer a transparent, hassle-free 7-day money-back guarantee to ensure a completely risk-free learning experience for all our students.
          </p>

          <div className="space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-textdark uppercase tracking-wider">1. 7-Day Satisfaction Window</h3>
            <p>
              If you are not entirely satisfied with the training quality, course resources, or mentor delivery, you can claim a refund within 7 days of your purchase date, provided you meet the eligibility criteria listed below:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>For Live Interactive cohorts: Refund requests must be filed before attending the second class session.</li>
              <li>For Self-Paced e-learning: You must have viewed less than 10% of the syllabus content and not downloaded more than 2 PDFs.</li>
              <li>Voucher or exam fee bookings are non-refundable once the codes have been generated or dispatched.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-textdark uppercase tracking-wider">2. How to Claim Your Refund</h3>
            <p>
              To initiate a refund request under our money-back guarantee:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 pl-2">
              <li>Email a formal request to billing@learnerskart.com.</li>
              <li>Provide your Order ID, purchase invoice email, and a brief description of your feedback.</li>
              <li>Our financial department will review your logs and process the approved refund directly back to your original payment card/UPI bank account within 5-7 working days.</li>
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-textdark uppercase tracking-wider">3. Abuse of Policy</h3>
            <p>
              To prevent abuse of our educational resources, LearnersKart reserves the right to deny refund requests to users who repeatedly purchase and refund courses, or who have already completed a significant portion of the training curriculum.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoneyBackPage;
