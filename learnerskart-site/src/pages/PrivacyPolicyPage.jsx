import React, { useEffect } from 'react';
import Breadcrumb from '../components/ui/Breadcrumb';

const PrivacyPolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <div className="bg-white border border-slate-100 px-4 py-2 rounded-lg backdrop-blur-sm self-start inline-block text-xs font-semibold">
          <Breadcrumb items={[{ label: 'Privacy Policy' }]} />
        </div>

        {/* Content Panel */}
        <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 sm:p-10 space-y-6 text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-textdark border-b border-slate-100 pb-4 leading-none uppercase tracking-wider">
            Privacy Policy
          </h1>

          <p className="text-slate-400 font-bold uppercase text-[10px]">Last Updated: January 2026</p>

          <p>
            At LearnersKart, we are committed to protecting the privacy and security of our users\' personal information. This Privacy Policy describes how we collect, use, disclose, and protect your personal data when you visit our website (https://learnerskart.com) or enroll in our professional certification training programs.
          </p>

          <div className="space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-textdark uppercase tracking-wider">1. Information We Collect</h3>
            <p>
              We collect personal information that you voluntarily provide to us when registering an account, purchasing courses, submitting inquiries, or applying for special discounts. This information may include your full name, email address, phone number, physical billing address, organization/company name, professional designation, and uploaded proof documents (e.g. Student IDs or veteran certificates).
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-textdark uppercase tracking-wider">2. How We Use Your Information</h3>
            <p>
              We utilize your personal data to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Process your enrollment purchases and dispatch digital PDF invoices.</li>
              <li>Provision access to live Zoom cohorts, video lectures, and exam simulators.</li>
              <li>Verify eligibility for academic, alumni, or military tuition discounts.</li>
              <li>Send critical account updates, password resets, and curriculum newsletters.</li>
              <li>Improve our website players, course navigation, and technical customer support.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-textdark uppercase tracking-wider">3. Data Disclosure and Security</h3>
            <p>
              LearnersKart does not sell, trade, or rent your personal information to third parties. We disclose data only to trusted service partners (like Razorpay for payment processing and Cloudinary/local hosts for file storage) who operate under strict confidentiality agreements. We implement advanced industry-standard SSL encryption and firewall protection to secure your database records.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-textdark uppercase tracking-wider">4. Cookies and Web Analytics</h3>
            <p>
              We use cookies to maintain your login session, preserve your shopping cart selections, and analyze website traffic. You can choose to disable cookies in your browser settings, though doing so may prevent certain interactive checkout features from functioning correctly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
