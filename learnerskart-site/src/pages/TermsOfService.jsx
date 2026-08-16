import React from 'react';
import Breadcrumb from '../components/ui/Breadcrumb';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <Breadcrumb items={[{ label: 'Terms of Service', path: '/terms' }]} />
          <h1 className="text-3xl font-extrabold text-[#098ce9] tracking-tight">Terms of Service</h1>
          <p className="text-slate-400 text-xs font-bold">Last updated: June 26, 2026</p>
        </div>

        <article className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm prose prose-blue max-w-none text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed space-y-6">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#098ce9]">1. Agreement to Terms</h2>
            <p>
              By accessing our website at learnerskart.com, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#098ce9]">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on LearnersKart's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Modify or copy the materials.</li>
              <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).</li>
              <li>Attempt to decompile or reverse engineer any software contained on LearnersKart's website.</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#098ce9]">3. Disclaimer</h2>
            <p>
              The materials on LearnersKart's website are provided on an 'as is' basis. LearnersKart makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#098ce9]">4. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of Karnataka, India and you irrevocably submit to the exclusive jurisdiction of the courts in Bengaluru.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
