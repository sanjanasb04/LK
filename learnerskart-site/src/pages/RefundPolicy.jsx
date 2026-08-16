import React from 'react';
import Breadcrumb from '../components/ui/Breadcrumb';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <Breadcrumb items={[{ label: 'Refund & Cancellation', path: '/refund-policy' }]} />
          <h1 className="text-3xl font-extrabold text-[#098ce9] tracking-tight">Refund & Cancellation Policy</h1>
          <p className="text-slate-400 text-xs font-bold">Last updated: June 26, 2026</p>
        </div>

        <article className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm prose prose-blue max-w-none text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed space-y-6">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#098ce9]">1. Cancellation Guidelines</h2>
            <p>
              We understand that professional schedules are subject to change. If you wish to cancel your enrollment, please note the following guidelines:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Cancellations requested more than 7 calendar days prior to the batch start date are eligible for a 100% refund.</li>
              <li>Cancellations requested between 3 to 7 calendar days prior to the batch start date are eligible for a 50% refund, or a 100% credit voucher for subsequent batches.</li>
              <li>Cancellations requested less than 3 days prior to the batch start date are non-refundable, but you can transfer your seat to a colleague or reschedule to another batch date for a nominal rescheduling fee.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#098ce9]">2. Refund Process</h2>
            <p>
              Once your refund request is approved by our billing coordinators, the transaction will be initiated. Refunds are processed back to the original payment method (Credit/Debit Card, NetBanking, UPI or Wallet) via our payment partner Razorpay.
            </p>
            <p>
              Please allow 5 to 7 working days for the refunded amount to reflect in your bank account or card statement, depending on your bank's processing timelines.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#098ce9]">3. 100% Pass Guarantee</h2>
            <p>
              We stand by our training excellence. If you attend 100% of our live virtual sessions and fail the official certification exam on your first attempt, we will provide free, unlimited access to any subsequent live virtual training cohorts for that course until you pass.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
