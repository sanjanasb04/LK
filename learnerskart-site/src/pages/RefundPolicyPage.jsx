import React, { useEffect } from 'react';
import Breadcrumb from '../components/ui/Breadcrumb';

const RefundPolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <div className="bg-white border border-slate-100 px-4 py-2 rounded-lg backdrop-blur-sm self-start inline-block text-xs font-semibold">
          <Breadcrumb items={[{ label: 'Refund & Rescheduling' }]} />
        </div>

        {/* Content */}
        <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 sm:p-10 space-y-6 text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-textdark border-b border-slate-100 pb-4 leading-none uppercase tracking-wider">
            Cancellation & Refund Policy
          </h1>

          <p className="text-slate-400 font-bold uppercase text-[10px]">Last Updated: January 2026</p>

          <p>
            At LearnersKart, we strive to maintain the highest quality of professional training. This policy outlines our guidelines regarding cancellations, rescheduling, and tuition refunds.
          </p>

          <div className="space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-textdark uppercase tracking-wider">1. Student Cancellations and Refunds</h3>
            <p>
              We back our courses with a 7-day satisfaction guarantee. If you wish to cancel your enrollment and claim a refund, the following rules apply:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>Live Online Training:</strong> Refund requests must be submitted at least 48 hours prior to your scheduled class start. No refunds will be issued once the training cohort begins or if you attend any sessions.</li>
              <li><strong>Self-Paced E-Learning:</strong> Refunds are valid within 7 days of purchase, provided that you have not completed more than 10% of the video coursework or downloaded any study resources.</li>
              <li>A standard administrative processing fee of 10% will be deducted from all approved refunds.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-textdark uppercase tracking-wider">2. Rescheduling Policy</h3>
            <p>
              If you are unable to attend your scheduled training batch, you can request a reschedule to a future cohort:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Reschedule requests must be made in writing to support@learnerskart.com at least 48 hours before the cohort starts.</li>
              <li>The first reschedule is completely free of charge. Subsequent reschedule requests may incur an administrative fee of ₹1,500.</li>
              <li>Course seats are valid for up to 6 months from the original date of purchase.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-textdark uppercase tracking-wider">3. Classroom / Event Cancellation by LearnersKart</h3>
            <p>
              LearnersKart reserves the right to cancel or postpone a physical classroom or live online training batch due to instructor illness, severe weather, or force majeure events. In such cases, you will be offered a 100% full refund of the tuition fee, or a free transfer to a future batch. LearnersKart is not liable for any personal travel or hotel bookings made by the student.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
