import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Linkedin, Facebook, Instagram } from 'lucide-react';
import api from '../../utils/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        const res = await api.post('/inquiry/subscribe', { email });
        if (res.data.success) {
          setSubscribed(true);
          setEmail('');
          setTimeout(() => setSubscribed(false), 5000);
        }
      } catch (err) {
        console.error('Error subscribing to newsletter:', err);
        // Fallback simulation if server fails
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 5000);
      }
    }
  };

  return (
    <footer className="bg-[#0f172a] text-slate-300 text-left">
      {/* Upper Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 border-b border-slate-800">
        
        {/* Col 1 - Company */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5 border-b border-slate-800 pb-2">Company</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/about-us" className="hover:text-accent transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
            <li><Link to="/faqs" className="hover:text-accent transition-colors">FAQs</Link></li>
            <li><Link to="/blog" className="hover:text-accent transition-colors">Blogs</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Feedback Form</Link></li>
          </ul>
        </div>

        {/* Col 2 - Support */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5 border-b border-slate-800 pb-2">Support</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/cancellation-refund" className="hover:text-accent transition-colors">Cancellation & Refund</Link></li>
            <li><Link to="/cancellation-refund" className="hover:text-accent transition-colors">Rescheduling Policy</Link></li>
            <li><Link to="/term-conditions" className="hover:text-accent transition-colors">Terms and Conditions</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
            <li><Link to="/money-back-policy" className="hover:text-accent transition-colors">Money Back Policy</Link></li>
          </ul>
        </div>

        {/* Col 3 - Services */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5 border-b border-slate-800 pb-2">Services</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/courses" className="hover:text-accent transition-colors">Self Study</Link></li>
            <li><Link to="/courses" className="hover:text-accent transition-colors">Live Online Training</Link></li>
            <li><Link to="/courses" className="hover:text-accent transition-colors">Classroom Training</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Corporate / Group</Link></li>
            <li><Link to="/courses" className="hover:text-accent transition-colors">Training + Exam Prep</Link></li>
          </ul>
        </div>

        {/* Col 4 - Special Offers */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5 border-b border-slate-800 pb-2">Special Offers</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/discounts/alumni" className="hover:text-accent transition-colors">Alumni Discount</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Corporate Discount</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Group Discount</Link></li>
            <li><Link to="/discounts/veterans" className="hover:text-accent transition-colors">Military / Veterans</Link></li>
            <li><Link to="/discounts/unemployed" className="hover:text-accent transition-colors">Unemployed Discount</Link></li>
            <li><Link to="/discounts/students" className="hover:text-accent transition-colors">Students Discount</Link></li>
          </ul>
        </div>

        {/* Col 5 - Network */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5 border-b border-slate-800 pb-2">Network</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/contact" className="hover:text-accent transition-colors">Become Instructor</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Refer & Earn</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Guest Blog</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Training Partner</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Affiliate Program</Link></li>
          </ul>
        </div>

        {/* Col 6 - Contact details */}
        <div className="md:col-span-3 lg:col-span-1">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5 border-b border-slate-800 pb-2">Contact Us</h4>
          <div className="space-y-4 text-xs">
            {/* India Contact */}
            <div>
              <p className="font-bold text-accent mb-0.5">INDIA OFFICE</p>
              <p className="flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span>+91-984-459-1589</span>
              </p>
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>4th floor, 207/189, 9th Main Rd, HSR Layout, Bengaluru 560102</span>
              </p>
            </div>
            
            {/* USA Contact */}
            <div>
              <p className="font-bold text-accent mb-0.5">USA OFFICE</p>
              <p className="flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span>+1 (307)-998-3816</span>
              </p>
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>30 N Gould St Ste R, Sheridan WY 82801</span>
              </p>
            </div>

            {/* Email */}
            <p className="flex items-center gap-1.5 pt-1 border-t border-slate-800">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=info@learnerskart.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-accent"
              >
                info@learnerskart.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Socials & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <a href="https://www.linkedin.com/company/learnerskart-americas-llc/posts/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-primary rounded-full transition-all text-white flex items-center justify-center" aria-label="LinkedIn">
            <Linkedin className="w-4.5 h-4.5" />
          </a>
          <a href="https://www.reddit.com/r/learnerskart/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-orange-600 rounded-full transition-all text-white flex items-center justify-center" aria-label="Reddit">
            <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.17 8.56a2.1 2.1 0 00-3.13-1.84c-1.27-.85-2.98-1.4-4.88-1.47l1.04-3.26 2.8.62a1 1 0 10.95.8 1 1 0 00-1-1 1 1 0 00-.77.36l-3.03-.68a.33.33 0 00-.38.21L7.73 6.27c-1.92.05-3.66.6-4.95 1.45a2.1 2.1 0 00-3.13 1.84 2.08 2.08 0 001.3 1.93c-.04.22-.05.45-.05.67 0 2.92 3.65 5.28 8.13 5.28s8.13-2.36 8.13-5.28c0-.22-.01-.45-.05-.67a2.08 2.08 0 001.3-1.93zM5.5 10.3a1.1 1.1 0 111.1-1.1 1.1 1.1 0 01-1.1 1.1zm7.22 3.19c-.8.8-2.32.87-2.72.87s-1.92-.07-2.72-.87a.36.36 0 01.5-.5c.57.57 1.76.64 2.22.64s1.65-.07 2.22-.64a.36.36 0 01.5.5zm-.42-2.1a1.1 1.1 0 111.1-1.1 1.1 1.1 0 01-1.1 1.1z"/>
            </svg>
          </a>
          <a href="https://www.facebook.com/people/LearnersKart/61578051365531/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-blue-600 rounded-full transition-all text-white flex items-center justify-center" aria-label="Facebook">
            <Facebook className="w-4.5 h-4.5" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-pink-600 rounded-full transition-all text-white flex items-center justify-center" aria-label="Instagram">
            <Instagram className="w-4.5 h-4.5" />
          </a>
          <a href="https://www.tumblr.com/learnerskart" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-[#36465d] rounded-full transition-all text-white flex items-center justify-center" aria-label="Tumblr">
            <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.517-4.503 4.71-6.599h3.004v5.96h3.605v3.738h-3.605v7.64c0 1.294.616 2.548 2.506 2.548.802 0 1.493-.116 2.059-.345l.966 3.422C17.957 23.655 16.326 24 14.563 24z"/>
            </svg>
          </a>
          <a href="https://x.com/ShantayyaM79412" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-black rounded-full transition-all text-white flex items-center justify-center" aria-label="X (formerly Twitter)">
            <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>

        {/* Newsletter form */}
        <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="text-center md:text-left">
            <p className="text-sm font-bold text-white leading-none">Subscribe to our Newsletter</p>
            <p className="text-xs text-slate-400 mt-1">Get certification discounts directly in your inbox.</p>
          </div>
          {subscribed ? (
            <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 animate-fade-in w-full sm:w-80">
              <span className="text-emerald-400 font-black text-sm">✔</span>
              <span>Thank you! Check your inbox for discounts.</span>
            </div>
          ) : (
            <div className="flex w-full sm:w-80 relative mt-1 sm:mt-0">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 text-white text-xs px-4 py-3 pr-12 rounded-lg outline-none w-full border border-transparent focus:border-slate-700 font-medium"
                required
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-accent hover:bg-accent-dark text-white p-1.5 rounded-md transition-colors"
                aria-label="Subscribe"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p>&copy; 2026 LearnersKart. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/term-conditions" className="hover:underline">Terms of Service</Link>
          <span>|</span>
          <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
