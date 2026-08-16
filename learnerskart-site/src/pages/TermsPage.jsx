import React, { useEffect } from 'react';
import Breadcrumb from '../components/ui/Breadcrumb';

const TermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <div className="bg-white border border-slate-100 px-4 py-2 rounded-lg backdrop-blur-sm self-start inline-block text-xs font-semibold">
          <Breadcrumb items={[{ label: 'Terms & Conditions' }]} />
        </div>

        {/* Content */}
        <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 sm:p-10 space-y-6 text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-textdark border-b border-slate-100 pb-4 leading-none uppercase tracking-wider">
            Terms and Conditions
          </h1>

          <p className="text-slate-400 font-bold uppercase text-[10px]">Last Updated: January 2026</p>

          <p>
            Welcome to LearnersKart. By accessing or using our website and enrolling in our certification training courses, you agree to comply with and be bound by the following terms and conditions of service. Please review them carefully.
          </p>

          <div className="space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-textdark uppercase tracking-wider">1. Intellect Property and Usage License</h3>
            <p>
              All curriculum courseware, lecture recordings, cheat-sheets, quiz questions, mock simulators, and graphics provided by LearnersKart are the intellectual property of LearnersKart and protected by international copyright laws. Enrolling in a course grants you a personal, non-transferable, non-exclusive license to use the materials for your individual study. You may not distribute, reproduce, or resell our materials without written authorization.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-textdark uppercase tracking-wider">2. Account Registration and Security</h3>
            <p>
              To access our study materials, you must register a student account. You agree to provide accurate, complete information and maintain the confidentiality of your credentials. You are solely responsible for all activities occurring under your account. LearnersKart reserves the right to terminate accounts that violate our terms of usage.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-textdark uppercase tracking-wider">3. Fee Payments and Taxes</h3>
            <p>
              All course prices, discount promotions, and tax rates are listed in Indian Rupees (INR). By placing an order, you authorize LearnersKart to charge the final amount (including the standard 18% GST and any coupon reductions) through our secure Razorpay gateway. All payments must be settled in full before course access is provisioned.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-textdark uppercase tracking-wider">4. Limitation of Liability</h3>
            <p>
              While we strive to maintain a 100% service uptime, LearnersKart is not liable for temporary technical outages, server delays, or Zoom software failures beyond our control. Our total liability for any claim relating to our courses is strictly limited to the tuition fee paid by you for that specific course track.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
