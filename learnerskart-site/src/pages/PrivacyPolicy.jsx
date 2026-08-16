import React from 'react';
import Breadcrumb from '../components/ui/Breadcrumb';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <Breadcrumb items={[{ label: 'Privacy Policy', path: '/privacy' }]} />
          <h1 className="text-3xl font-extrabold text-[#098ce9] tracking-tight">Privacy Policy</h1>
          <p className="text-slate-400 text-xs font-bold">Last updated: June 26, 2026</p>
        </div>

        <article className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm prose prose-blue max-w-none text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed space-y-6">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#098ce9]">1. Introduction</h2>
            <p>
              Welcome to LearnersKart. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#098ce9]">2. The Data We Collect About You</h2>
            <p>
              Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you, including:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Identity Data: Includes first name, last name, username, and role.</li>
              <li>Contact Data: Includes email address, billing address, and phone numbers.</li>
              <li>Financial Data: Includes transaction details (we do NOT store credit card details; all payments are processed securely by Razorpay).</li>
              <li>Technical Data: Includes IP address, browser type and version, and operating system.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#098ce9]">3. How We Use Your Personal Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>To register you as a new learner and set up your training workspace.</li>
              <li>To process and deliver your order, including managing payments, fees, and charges.</li>
              <li>To notify you about changes to our services, schedules, or terms.</li>
              <li>To deliver relevant website content and newsletters to you.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#098ce9]">4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
