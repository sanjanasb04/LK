import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import Breadcrumb from '../components/ui/Breadcrumb';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('PMP Certification Training');
  const [trainingMode, setTrainingMode] = useState('Live Online');
  const [inquiryFor, setInquiryFor] = useState('Myself');
  const [message, setMessage] = useState('');
  const [activeMapTab, setActiveMapTab] = useState('india');
  
  // Alert Status
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await api.post('/inquiry', {
        name,
        email,
        phone,
        course,
        trainingMode,
        inquiryFor,
        message,
        source: 'contact',
      });

      if (res.data.success) {
        setSuccess(true);
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
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
    'Digital Marketing Certification Training',
    'General/Other Inquiries'
  ];

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left">
      
      {/* SECTION A — HERO */}
      <div className="bg-primary text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-light/40 via-transparent to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Contact Us</h1>
            <p className="text-xs text-blue-200 mt-1.5 font-semibold leading-none">
              Your learning and career success is our absolute priority.
            </p>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm self-start md:self-auto">
            <Breadcrumb items={[{ label: 'Contact' }]} light={true} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* SECTION B — CONTACT CARDS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Call Us */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-primary rounded-xl">
              <Phone className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-sm sm:text-base text-textdark leading-none">Call Us</h4>
              <p className="text-xs text-slate-600 font-semibold leading-tight">INDIA: +91-984-459-1589</p>
              <p className="text-xs text-slate-600 font-semibold leading-tight">USA: +1 (307)-998-3816</p>
            </div>
          </div>

          {/* Email Us */}
          <a 
            href="https://mail.google.com/mail/?view=cm&fs=1&to=info@learnerskart.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4 hover:border-primary/20 group"
          >
            <div className="p-3 bg-amber-50 text-accent group-hover:bg-amber-100/75 rounded-xl transition-all">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-sm sm:text-base text-textdark group-hover:text-primary transition-colors leading-none">Email Us</h4>
              <span className="text-xs text-primary group-hover:underline font-bold block leading-none">
                info@learnerskart.com
              </span>
              <p className="text-[10px] text-textmuted font-semibold mt-1">We typically reply within 12 hours.</p>
            </div>
          </a>

          {/* Visit Us */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-3 text-left">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=4th+floor,+9th+Main+Rd,+HSR+Layout,+Bengaluru,+Karnataka+560102"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-primary group transition-colors"
              >
                <h4 className="font-bold text-xs uppercase tracking-wider text-textdark group-hover:text-primary leading-none">Visit Us (India)</h4>
                <p className="text-xs text-slate-600 leading-tight font-semibold mt-1.5 group-hover:underline">4th floor, 9th Main Rd, HSR Layout,</p>
                <p className="text-xs text-slate-600 leading-tight font-semibold group-hover:underline">Bengaluru, Karnataka 560102</p>
              </a>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Learnerskart+Americas+LLC+30+N+Gould+St+Ste+R+Sheridan+WY+82801"
                target="_blank"
                rel="noopener noreferrer"
                className="block border-t border-slate-100 pt-2.5 hover:text-primary group transition-colors"
              >
                <h4 className="font-bold text-xs uppercase tracking-wider text-textdark group-hover:text-primary leading-none">Visit Us (USA)</h4>
                <p className="text-xs text-slate-600 leading-tight font-semibold mt-1.5 group-hover:underline">Learnerskart Americas LLC</p>
                <p className="text-xs text-slate-600 leading-tight font-semibold group-hover:underline">30 N Gould St Ste R</p>
                <p className="text-xs text-slate-600 leading-tight font-semibold group-hover:underline">Sheridan, WY 82801</p>
              </a>
            </div>
          </div>
        </div>

        {/* SECTION C — TWO COLUMN (FORM & MAP) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-100 shadow-md rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-extrabold text-lg text-textdark uppercase tracking-wider">
                Send a Message
              </h3>
              <p className="text-xs text-textmuted font-semibold mt-1">
                Fill out the form below, and a career advisor will reach out shortly.
              </p>
            </div>

            {/* Status alerts */}
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 text-xs font-semibold flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Inquiry Dispatched!</p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                    Your inquiry has been successfully recorded. A career counselor will contact you shortly. A confirmation email has been sent.
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
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
              {/* Full Name */}
              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-2.5 rounded-lg outline-none text-textdark"
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
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-2.5 rounded-lg outline-none text-textdark"
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
                  placeholder="+91 98450 12345"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-2.5 rounded-lg outline-none text-textdark"
                />
              </div>

              {/* Course selection */}
              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-2">Select Course *</label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-2.5 rounded-lg outline-none text-textdark cursor-pointer"
                >
                  {courseOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Training Format */}
              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-2">Training Format</label>
                <select
                  value={trainingMode}
                  onChange={(e) => setTrainingMode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-2.5 rounded-lg outline-none text-textdark cursor-pointer"
                >
                  <option value="Live Online">Live Online interactive</option>
                  <option value="Classroom">Physical Classroom</option>
                  <option value="E-Learning">Self-Paced E-Learning</option>
                  <option value="Self Study">Self Study (Printed Materials)</option>
                </select>
              </div>

              {/* Inquiry For */}
              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-2">Inquiry is for:</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Myself', 'My Company'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setInquiryFor(opt)}
                      className={`text-center py-2.5 border rounded-lg font-bold transition-all ${
                        inquiryFor === opt
                          ? 'bg-primary text-white border-primary'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="sm:col-span-2">
                <label className="block text-slate-500 uppercase tracking-wider mb-2">Your Message *</label>
                <textarea
                  required
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detail your queries or specific training schedules required..."
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-3 rounded-lg outline-none text-textdark"
                ></textarea>
              </div>

              {/* Submit */}
              <div className="sm:col-span-2 text-right pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-accent hover:bg-accent-dark text-white font-bold px-7 py-3 rounded-lg shadow flex items-center justify-center gap-2 text-xs uppercase tracking-wider self-end ml-auto"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Info + Map (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Office hours card */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-5 sm:p-6 text-left space-y-4">
              <h4 className="font-extrabold text-sm text-textdark uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-accent" />
                Business Hours
              </h4>
              
              <div className="space-y-4 text-xs font-semibold text-slate-600">
                <div>
                  <p className="text-[10px] text-accent uppercase tracking-wider font-extrabold mb-1">India Support (IST)</p>
                  <p className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="text-textdark">9:00 AM - 8:00 PM</span>
                  </p>
                  <p className="flex justify-between mt-1">
                    <span>Saturday:</span>
                    <span className="text-textdark">10:00 AM - 5:00 PM</span>
                  </p>
                </div>
                
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-[10px] text-primary uppercase tracking-wider font-extrabold mb-1">USA Support (EST)</p>
                  <p className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="text-textdark">9:00 AM - 6:00 PM</span>
                  </p>
                  <p className="flex justify-between mt-1">
                    <span>Saturday - Sunday:</span>
                    <span className="text-textdark text-red-500">Closed (Email Support 24/7)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden p-3.5 space-y-3">
              {/* Map Tabs */}
              <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveMapTab('india')}
                  className={`flex-1 text-center py-1.5 rounded-md text-xs font-bold transition-all ${
                    activeMapTab === 'india' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  🇮🇳 India Office
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMapTab('usa')}
                  className={`flex-1 text-center py-1.5 rounded-md text-xs font-bold transition-all ${
                    activeMapTab === 'usa' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  🇺🇸 USA Office
                </button>
              </div>

              {/* Map IFrame */}
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 relative">
                {activeMapTab === 'india' ? (
                  <iframe
                    title="LearnersKart Bengaluru Office Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.7502447990714!2d77.63124847507567!3d12.923791087386762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1460d62d2b51%3A0x1b415a770cf805d7!2sKoramangala%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1719223789045!5m2!1sen!2sin"
                    className="w-full h-full border-0 absolute inset-0"
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                ) : (
                  <iframe
                    title="LearnersKart Wyoming Office Location Map"
                    src="https://maps.google.com/maps?q=30%20N%20Gould%20St%20Ste%20R%2C%20Sheridan%20WY%2082801&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0 absolute inset-0"
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* SECTION D — FAQ TEASER */}
        <div className="bg-slate-100 border border-slate-200/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm sm:text-base text-textdark">Have more questions about our coursework?</h4>
            <p className="text-xs text-textmuted font-semibold">We compiled a comprehensive list of FAQs covering payments, certifications, and exams.</p>
          </div>
          <Link
            to="/faqs"
            className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow"
          >
            Read FAQs
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
