import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, CheckCircle2, ShieldCheck, Upload, AlertCircle, FileText, Send } from 'lucide-react';
import api from '../utils/api';
import Breadcrumb from '../components/ui/Breadcrumb';

const DiscountsPage = () => {
  const params = useParams();
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  let type = params.type;

  if (!type) {
    if (path.includes('alumni-offers')) type = 'alumni';
    else if (path.includes('students-discount')) type = 'students';
    else if (path.includes('unemployed-discount')) type = 'unemployed';
    else if (path.includes('veterans-military-discount')) type = 'veterans';
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('PMP Certification Training');
  const [proofFile, setProofFile] = useState(null);
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Discount Page Metadata Content Mapping
  const discountConfig = {
    alumni: {
      title: 'Alumni Loyalty Discount',
      desc: 'We value our learning alumni. If you have previously completed any certification course with LearnersKart, you qualify for an exclusive loyalty discount on your next program.',
      discountVal: '15% OFF',
      eligibility: [
        'Must have successfully completed at least one training track with LearnersKart.',
        'Must provide the Certificate ID or invoice receipt of your previous enrollment.',
        'Discount is non-transferable and applicable only to the alumni member.'
      ],
      steps: [
        'Complete the online discount application form below.',
        'Upload your previous LearnersKart certificate or invoice receipt.',
        'Our team will verify your credentials and email a unique 15% discount promo coupon within 12 hours.'
      ],
      proofLabel: 'Previous Certificate / Invoice Receipt (PDF or Image)',
    },
    students: {
      title: 'Academic Student Discount',
      desc: 'Empowering the next generation of industry leaders. If you are currently enrolled in an accredited university or secondary college, you qualify for our special student academic scholarship.',
      discountVal: '20% OFF',
      eligibility: [
        'Must be currently enrolled in an accredited university, college, or high school.',
        'Must possess a valid student photo ID card with active semester/academic dates.',
        'Applicable to all standard certification and e-learning tracks.'
      ],
      steps: [
        'Fill out your student discount request form below.',
        'Upload a clear photo or PDF scan of your current active Student ID card.',
        'Once approved by our academic board, you will receive a custom 20% OFF coupon code via email.'
      ],
      proofLabel: 'Valid Student ID Card / Enrollment Letter (PDF or Image)',
    },
    unemployed: {
      title: 'Career Re-Entry Scholarship',
      desc: 'We are here to support your professional comeback. If you are currently unemployed, laid off, or seeking a career transition, our scholarship program helps you upskill affordably.',
      discountVal: '25% OFF',
      eligibility: [
        'Currently unemployed, seeking employment, or transitioning careers.',
        'Must provide a termination letter, unemployment registration slip, or self-declaration bio.',
        'Dedicated to helping professionals acquire high-demand project management or quality credentials.'
      ],
      steps: [
        'Complete the career re-entry scholarship request form below.',
        'Upload your current resume along with a self-declaration letter or layoff notice.',
        'Our career advisors will review your application and send your 25% discount voucher code.'
      ],
      proofLabel: 'Layoff Notice / Unemployment Registration / Self-Declaration (PDF)',
    },
    veterans: {
      title: 'Military & Veterans Discount',
      desc: 'Honoring those who serve. We offer exclusive educational scholarship discounts to active-duty military members, veterans, reserves, and their immediate family dependents.',
      discountVal: '30% OFF',
      eligibility: [
        'Active-duty military, veterans, national guards, reserves, or direct dependents.',
        'Must provide a military ID card, discharge certificate (DD-214), or veteran service card.',
        'Applicable globally across all live online and classroom training formats.'
      ],
      steps: [
        'Fill out the military discount request form below.',
        'Upload a scan or photo of your military ID, veteran card, or service declaration.',
        'Our coordinators will verify your service status and dispatch a custom 30% OFF voucher.'
      ],
      proofLabel: 'Military ID / Veteran Card / DD-214 / Service Proof (PDF or Image)',
    }
  };

  // Fallback to alumni if type is invalid
  const config = discountConfig[type] || discountConfig.alumni;

  const handleFileChange = (e) => {
    setProofFile(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!proofFile) {
      return setError('Please upload the required proof document.');
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('course', course);
      formData.append('message', message || `Applying for ${config.title}`);
      formData.append('source', `discount-${type}`);
      formData.append('proofDocument', proofFile);

      const res = await api.post('/inquiry', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setSuccess(true);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
        setProofFile(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please check your file size (Max 5MB) and type.');
    } finally {
      setLoading(false);
    }
  };

  const courseOptions = [
    'PMP Certification Training',
    'PMP® Certification – E-Learning',
    'CAPM Certification Training',
    'Prince2 Foundation Certification Training',
    'Lean Six Sigma Green Belt Certification',
    'Lean Six Sigma Black Belt Certification',
    'CBAP® Certification Training',
    'Agile Certified Practitioner (PMI-ACP)',
    'Digital Marketing Certification Training'
  ];

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left">
      
      {/* Hero */}
      <div className="bg-primary text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-light/40 via-transparent to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{config.title}</h1>
            <p className="text-xs text-blue-200 mt-1.5 font-semibold leading-none">
              Special tuition scholarships for qualified certification aspirants.
            </p>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm self-start md:self-auto">
            <Breadcrumb 
              items={[
                { label: 'Discounts', url: '#' },
                { label: type }
              ]} 
              light={true} 
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Criteria & Guide (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Value description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-textdark leading-tight">
                Empowering Career Transitions with {config.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {config.desc}
              </p>
            </div>

            {/* Discount amount box */}
            <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-6 shadow-md flex items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-blue-200 leading-none">Scholarship Value</h3>
                <p className="text-3xl sm:text-4xl font-black mt-2 leading-none">{config.discountVal}</p>
                <p className="text-[10px] text-blue-100/80 font-semibold mt-1.5 leading-none">Applicable globally across all major certification tracks.</p>
              </div>
              <div className="bg-white/10 p-3.5 rounded-full backdrop-blur-sm shadow-inner">
                <span className="text-3xl">🏷️</span>
              </div>
            </div>

            {/* Eligibility */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6 space-y-3.5">
              <h3 className="font-extrabold text-sm sm:text-base text-textdark uppercase tracking-wider border-b border-slate-50 pb-2">
                Eligibility Criteria
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {config.eligibility.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-success flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6 space-y-4">
              <h3 className="font-extrabold text-sm sm:text-base text-textdark uppercase tracking-wider border-b border-slate-50 pb-2">
                How to Apply
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                {config.steps.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-7.5 h-7.5 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="leading-relaxed font-semibold pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Application Form (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-100 shadow-lg rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-textdark uppercase tracking-wider">
                Discount Request Form
              </h3>
              <p className="text-[11px] text-textmuted font-semibold mt-0.5 leading-none">
                Submit your proof to claim your scholarship voucher.
              </p>
            </div>

            {/* Status notifications */}
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 text-xs font-semibold flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Application Received!</p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                    Your discount scholarship application has been successfully submitted. Our verification board will review your credentials and email your promo coupon within 12 business hours.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3.5 text-xs font-semibold flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-semibold text-slate-600">
              {/* Full Name */}
              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-2.5 rounded-lg outline-none text-textdark font-semibold"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-2.5 rounded-lg outline-none text-textdark font-semibold"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-2.5 rounded-lg outline-none text-textdark font-semibold"
                />
              </div>

              {/* Target Course */}
              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-2">Select Course *</label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-2.5 rounded-lg outline-none text-textdark cursor-pointer font-semibold"
                >
                  {courseOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Proof File Uploader */}
              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-2">
                  {config.proofLabel} *
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-primary hover:bg-slate-50 transition-all cursor-pointer relative flex flex-col items-center justify-center gap-2">
                  <Upload className="w-6 h-6 text-slate-400" />
                  <span className="text-[11px] text-slate-500 leading-none">
                    {proofFile ? proofFile.name : 'Click to upload proof (Max 5MB)'}
                  </span>
                  <span className="text-[9px] text-slate-400 leading-none">PDF, JPEG, PNG formats supported.</span>
                  <input
                    type="file"
                    required
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
              </div>

              {/* Additional message */}
              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-2">Additional Message (Optional)</label>
                <textarea
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide additional details or class schedule preferences..."
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-2.5 rounded-lg outline-none text-textdark font-semibold"
                ></textarea>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3.5 rounded-xl shadow flex items-center justify-center gap-2 text-xs uppercase tracking-wider active:scale-98 transition-transform"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default DiscountsPage;
