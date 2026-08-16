import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, HelpCircle, ArrowRight, MessageSquare } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb';
import Accordion from '../components/ui/Accordion';

const FAQsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('General');

  const categories = ['General', 'Courses', 'Payment', 'Certification', 'Technical'];

  const faqData = {
    General: [
      { q: 'What is LearnersKart?', a: 'LearnersKart is an accredited global professional training provider. We offer premium, expert-led certification prep bootcamps across project management, lean six sigma, agile practices, and business analysis.' },
      { q: 'Are your classes live or self-paced?', a: 'We provide both! You can enroll in our Live Online Interactive Training cohorts (led by industry experts via Zoom), attend Physical Classrooms in corporate hubs, or study on your own schedule using our E-Learning self-study packages.' },
      { q: 'Do you offer group or corporate discounts?', a: 'Absolutely. We offer customized curriculum roadmaps, scalable training platforms, and corporate-tier pricing for groups of 5 or more. Please contact our corporate advisor team via our Contact page.' },
      { q: 'Is there a money-back guarantee?', a: 'Yes, we back all our premium courses with a 7-day satisfaction guarantee. If you are unsatisfied with the training quality, you can request a full refund, subject to our cancellation policy guidelines.' }
    ],
    Courses: [
      { q: 'How long do I have access to the coursework?', a: 'When you purchase any course track (live or e-learning), you receive lifetime access to all lecture recordings, cheat-sheets, downloadable PDFs, and practice exam mock simulators.' },
      { q: 'Do you provide study materials?', a: 'Yes. All enrollments include officially accredited study guides, chapter-wise slides, vocabulary flashcards, reference templates, and full-length exam mock papers.' },
      { q: 'Can I reschedule my training class?', a: 'Yes. We offer flexible rescheduling. You can transfer to a different weekend or weekday batch by notifying your coordinator at least 48 hours prior to your scheduled class commencement.' },
      { q: 'Are the course instructors certified?', a: 'Without exception. All LearnersKart instructors are accredited subject matter experts who possess certified credentials (like PMP, PMI-ACP, CBAP, LSSMBB) and over 15+ years of active industry experience.' }
    ],
    Payment: [
      { q: 'What payment options do you accept?', a: 'We partner with Razorpay to accept credit cards (Visa, MasterCard, Amex), debit cards, UPI payments, Netbanking across major national banks, and digital wallets.' },
      { q: 'Is my credit card information secure?', a: 'Completely. All transactions are processed through Razorpay\'s secure SSL-encrypted payment gateway, which is PCI-DSS compliant. LearnersKart never stores your credit card details.' },
      { q: 'Is GST included in the course pricing?', a: 'A standard 18% Goods and Services Tax (GST) is applied to all purchases during checkout, as per government tax regulations for educational services.' },
      { q: 'How can I download my order invoice?', a: 'Upon successful checkout, a digital PDF invoice is automatically emailed to your registered address. You can also view your transaction history and download invoices from your user dashboard.' }
    ],
    Certification: [
      { q: 'Are the exam fees included in the training price?', a: 'No, the exam registration fees are paid directly to the respective certifying board (e.g., PMI for PMP, PeopleCert for ITIL). However, we guide you step-by-step through the application process.' },
      { q: 'Do I get a certificate of completion from LearnersKart?', a: 'Yes. Once you complete the course curriculum syllabus, an accredited LearnersKart Certificate of Completion (documenting your earned contact hours / PDUs) is instantly unlocked in your dashboard.' },
      { q: 'What is your exam pass rate guarantee?', a: 'We maintain a 98.7% first-time pass rate. In the unlikely event that you fail your board exam on the first try, we provide free dedicated mentoring, exam analysis, and complimentary access to another live training cohort.' }
    ],
    Technical: [
      { q: 'What are the technical requirements for live online classes?', a: 'You need a reliable high-speed internet connection (minimum 5 Mbps), a computer or laptop with a working webcam and microphone, and the Zoom desktop client installed.' },
      { q: 'Can I access the e-learning courses on my mobile phone?', a: 'Yes. The LearnersKart student portal and course players are fully responsive and optimized for mobile browsers, allowing you to learn on the go.' },
      { q: 'Who do I contact if I experience login or playback issues?', a: 'Our technical support team is available 24/7. You can reach out directly via the floating WhatsApp support button or email techsupport@learnerskart.com for instant resolution.' }
    ]
  };

  // Dynamically filter Q&As based on search query
  const getFilteredFAQs = () => {
    if (!searchQuery.trim()) {
      return faqData[activeCategory] || [];
    }

    const query = searchQuery.toLowerCase();
    const results = [];

    Object.keys(faqData).forEach((category) => {
      faqData[category].forEach((item) => {
        if (item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query)) {
          results.push(item);
        }
      });
    });

    return results;
  };

  const filteredFAQs = getFilteredFAQs();

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left">
      
      {/* Hero */}
      <div className="bg-primary text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-light/40 via-transparent to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h1>
            <p className="text-xs text-blue-200 mt-1.5 font-semibold leading-none">
              Have questions? We compiled answers to help you navigate our services.
            </p>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm self-start md:self-auto">
            <Breadcrumb items={[{ label: 'FAQs' }]} light={true} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Search Box */}
        <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 relative flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search FAQs by keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-4 py-3.5 pl-11 rounded-xl outline-none text-xs sm:text-sm font-semibold transition-all"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-accent font-bold hover:underline shrink-0"
            >
              Reset Search
            </button>
          )}
        </div>

        {/* Category Tabs (Only show if not searching, to prevent UI confusion) */}
        {!searchQuery && (
          <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                  activeCategory === cat
                    ? 'border-primary text-primary'
                    : 'border-transparent text-textmuted hover:text-textdark'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* FAQs Accordion List */}
        <div className="space-y-4">
          {searchQuery && (
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Search Results ({filteredFAQs.length}):
            </p>
          )}

          {filteredFAQs.length === 0 ? (
            <div className="bg-white border border-slate-100 shadow-sm rounded-xl py-16 px-6 text-center text-xs font-semibold text-textmuted">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-base text-textdark">No matching FAQs found</h4>
              <p className="mt-1 text-[11px]">Try searching for other terms (e.g. 'PMP', 'invoice', 'refund').</p>
            </div>
          ) : (
            filteredFAQs.map((faq, idx) => (
              <Accordion
                key={idx}
                title={faq.q}
                defaultOpen={idx === 0 && !searchQuery}
                className="border-slate-100"
              >
                <p className="leading-relaxed">{faq.a}</p>
              </Accordion>
            ))
          )}
        </div>

        {/* Still have questions CTA */}
        <div className="bg-slate-100 border border-slate-200/50 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm sm:text-base text-textdark flex items-center gap-2 justify-center sm:justify-start">
              <MessageSquare className="w-4.5 h-4.5 text-accent" />
              Still have questions?
            </h4>
            <p className="text-xs text-textmuted font-semibold leading-relaxed">
              If you couldn't find the answers in our FAQs, please send a message to our certification coordinators.
            </p>
          </div>
          <Link
            to="/contact"
            className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-6 py-3 rounded-lg shadow whitespace-nowrap inline-flex items-center gap-1 group"
          >
            Contact Career Advisor
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default FAQsPage;
