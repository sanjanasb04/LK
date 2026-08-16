import React from 'react';
import { 
  Linkedin, 
  Youtube, 
  Facebook, 
  Instagram, 
  Twitter, 
  MapPin, 
  Phone, 
  Mail,
  Send,
  Sparkles
} from 'lucide-react';

export default function Footer() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to the LearnersKart newsletter!');
  };

  return (
    <footer className="w-full bg-[#04122b] text-gray-300 pt-20 pb-8 border-t border-blue-950">
      
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-8 md:gap-12">
          
          {/* COL 1 — Company */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider border-b border-blue-950 pb-2 flex items-center gap-1.5">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium">
              <li><a href="#contact" className="hover:text-[#f97316] transition-colors">Contact Us</a></li>
              <li><a href="#about" className="hover:text-[#f97316] transition-colors">About Us</a></li>
              <li><a href="#about" className="hover:text-[#f97316] transition-colors">FAQs</a></li>
              <li><a href="#blogs" className="hover:text-[#f97316] transition-colors">Blogs</a></li>
              <li><a href="#contact" className="hover:text-[#f97316] transition-colors">Feedback Form</a></li>
            </ul>
          </div>

          {/* COL 2 — Support */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider border-b border-blue-950 pb-2">
              Support
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium">
              <li><a href="#contact" className="hover:text-[#f97316] transition-colors">Cancellation & Refund</a></li>
              <li><a href="#contact" className="hover:text-[#f97316] transition-colors">Rescheduling Policy</a></li>
              <li><a href="#contact" className="hover:text-[#f97316] transition-colors">Terms and Conditions</a></li>
              <li><a href="#contact" className="hover:text-[#f97316] transition-colors">Privacy Policy</a></li>
              <li><a href="#contact" className="hover:text-[#f97316] transition-colors">Money Back Policy</a></li>
            </ul>
          </div>

          {/* COL 3 — Service Offerings */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider border-b border-blue-950 pb-2">
              Service Offerings
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium">
              <li><a href="#courses" className="hover:text-[#f97316] transition-colors">Self Study</a></li>
              <li><a href="#courses" className="hover:text-[#f97316] transition-colors">Live Online</a></li>
              <li><a href="#courses" className="hover:text-[#f97316] transition-colors">Classroom (In-Person)</a></li>
              <li><a href="#courses" className="hover:text-[#f97316] transition-colors">Corporate / Group</a></li>
              <li><a href="#courses" className="hover:text-[#f97316] transition-colors">Training + Exam Prep</a></li>
            </ul>
          </div>

          {/* COL 4 — Special Offers */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider border-b border-blue-950 pb-2">
              Special Offers
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium">
              <li><a href="#courses" className="hover:text-[#f97316] transition-colors">Alumni Discount</a></li>
              <li><a href="#courses" className="hover:text-[#f97316] transition-colors">Corporate Discount</a></li>
              <li><a href="#courses" className="hover:text-[#f97316] transition-colors">Group Discount</a></li>
              <li><a href="#courses" className="hover:text-[#f97316] transition-colors">Mil / Vet Discount</a></li>
              <li><a href="#courses" className="hover:text-[#f97316] transition-colors">Unemployed Discount</a></li>
              <li><a href="#courses" className="hover:text-[#f97316] transition-colors">Students Discount</a></li>
            </ul>
          </div>

          {/* COL 5 — Join Our Network */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider border-b border-blue-950 pb-2">
              Join Our Network
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium">
              <li><a href="#contact" className="hover:text-[#f97316] transition-colors">Become an Instructor</a></li>
              <li><a href="#contact" className="hover:text-[#f97316] transition-colors">Refer & Earn</a></li>
              <li><a href="#contact" className="hover:text-[#f97316] transition-colors">Blog As a Guest</a></li>
              <li><a href="#contact" className="hover:text-[#f97316] transition-colors">Become Training Partner</a></li>
              <li><a href="#contact" className="hover:text-[#f97316] transition-colors">Affiliate Partner</a></li>
            </ul>
          </div>

          {/* COL 6 — Get in Touch */}
          <div className="flex flex-col gap-6 md:col-span-2 xl:col-span-1">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider border-b border-blue-950 pb-2">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-5 text-xxs sm:text-xs">
              {/* INDIA OFFICE */}
              <div className="space-y-1.5">
                <h5 className="text-[#f97316] font-black tracking-wider uppercase text-xxs">India Office</h5>
                <p className="flex items-start gap-2 leading-relaxed">
                  <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>4th floor, No: 207/189, 9th Main Rd, 6th Sector, HSR Layout, Bengaluru, Karnataka 560102</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <a href="tel:+919844591589" className="hover:text-[#f97316] font-bold">+91-984-459-1589</a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <a href="mailto:info@learnerskart.com" className="hover:text-[#f97316] font-bold">info@learnerskart.com</a>
                </p>
              </div>
              
              {/* USA OFFICE */}
              <div className="space-y-1.5">
                <h5 className="text-[#f97316] font-black tracking-wider uppercase text-xxs">USA Office</h5>
                <p className="flex items-start gap-2 leading-relaxed">
                  <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>30 N Gould St Ste R, Sheridan, WY 82801</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <a href="tel:+13079983816" className="hover:text-[#f97316] font-bold">+1 (307)-998-3816</a>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Middle Bar: Newsletter & Social Links */}
      <div className="border-y border-blue-950 py-10 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Newsletter Input */}
          <div className="w-full lg:w-1/2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-shrink-0 max-w-xs">
              <h4 className="text-white text-sm font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#f97316] animate-pulse" />
                Subscribe to Our Newsletter
              </h4>
              <p className="text-xxs sm:text-xs text-gray-500 mt-1 font-semibold">
                Get the latest exam prep insights and training deals.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="w-full flex gap-2">
              <input 
                type="email" 
                required
                placeholder="Your corporate email address..."
                className="w-full text-xs px-4 py-3 bg-[#020a1c] border border-blue-950 rounded-xl focus:outline-none focus:border-[#f97316] text-white"
              />
              <button 
                type="submit"
                className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-1.5 shadow-md flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                Subscribe
              </button>
            </form>
          </div>

          {/* Social Icons Row */}
          <div className="flex flex-col items-center lg:items-end gap-3 flex-shrink-0">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Join Our Network Community
            </h4>
            <div className="flex items-center gap-2.5">
              <a href="#" className="p-2.5 bg-[#020a1c] hover:bg-[#f97316] hover:text-white border border-blue-950 rounded-xl transition-all duration-200" aria-label="LinkedIn"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="p-2.5 bg-[#020a1c] hover:bg-[#f97316] hover:text-white border border-blue-950 rounded-xl transition-all duration-200" aria-label="YouTube"><Youtube className="w-4 h-4" /></a>
              <a href="#" className="p-2.5 bg-[#020a1c] hover:bg-[#f97316] hover:text-white border border-blue-950 rounded-xl transition-all duration-200" aria-label="Facebook"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="p-2.5 bg-[#020a1c] hover:bg-[#f97316] hover:text-white border border-blue-950 rounded-xl transition-all duration-200" aria-label="Instagram"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="p-2.5 bg-[#020a1c] hover:bg-[#f97316] hover:text-white border border-blue-950 rounded-xl transition-all duration-200" aria-label="Twitter"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="p-2.5 bg-[#020a1c] hover:bg-[#f97316] hover:text-white border border-blue-950 rounded-xl transition-all duration-200" aria-label="Reddit">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.85-1.64-6.29-1.72l1.41-4.53 4.63.97c.02.85.72 1.54 1.58 1.54 1.65 0 3-1.35 3-3s-1.35-3-3-3c-.9 0-1.7.4-2.24 1.05l-4.88-1.02c-.42-.09-.82.17-.9.59L9.27 8c-2.48.04-4.73.68-6.4 1.7-.56-.73-1.43-1.2-2.37-1.2-1.65 0-3 1.35-3 3 0 1.13.63 2.11 1.56 2.62-.06.38-.1.77-.1 1.16 0 4.14 4.93 7.5 11 7.5s11-3.36 11-7.5c0-.39-.04-.78-.1-1.16.93-.51 1.56-1.49 1.56-2.62zM9 13c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5S9 13.83 9 13zm8.38 5.4c-1.38 1.38-3.98 1.5-5.38 1.5-1.41 0-4.01-.12-5.38-1.5-.3-.3-.3-.78 0-1.08.3-.3.78-.3 1.08 0 1 .1 2.8.2 4.3.2 1.5 0 3.3-.1 4.3-.2.3-.3.78-.3 1.08 0 .3.3.3.78 0 1.08zm-3.88-3.9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Lower Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xxs sm:text-xs text-gray-500 font-semibold">
        <p>
          &copy; 2026 LearnersKart. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a href="#contact" className="hover:text-white transition-colors">Terms of Use</a>
          <span>|</span>
          <a href="#contact" className="hover:text-white transition-colors">Privacy Policy</a>
        </div>
      </div>

    </footer>
  );
}
