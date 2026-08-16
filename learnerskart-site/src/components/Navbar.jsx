import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, BookOpen, Globe, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const courseCategories = [
  {
    title: "Project Management",
    courses: [
      "PMP Certification Training – International",
      "PMP® Certification – E-Learning",
      "PMP Certification Classroom Training",
      "PMP Certification Training – Bengaluru",
      "PMP Certification Training",
      "CAPM® Certification",
      "Prince2 Foundation",
      "Prince2 Practitioner",
      "Prince2 F&P",
      "PgMP",
      "PMI-RMP"
    ]
  },
  {
    title: "Quality Management",
    courses: [
      "LSSGB+LSSBB Combo",
      "LSSYB",
      "LSSGB",
      "LSSBB"
    ]
  },
  {
    title: "Business Analysis",
    courses: [
      "CCBA",
      "ECBA",
      "CBAP"
    ]
  },
  {
    title: "Agile & DevOps",
    courses: [
      "PMI-ACP",
      "SAFe Certification",
      "DevOps Practitioner",
      "Digital Marketing",
      "Service Management"
    ]
  }
];

const countries = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'USA', flag: '🇺🇸' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'GB', name: 'UK', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' }
];

const discountItems = [
  { name: 'Alumni Discount', href: '#footer' },
  { name: 'Corporate Discount', href: '#footer' },
  { name: 'Group Discount', href: '#footer' },
  { name: 'Mil/Vet Discount', href: '#footer' },
  { name: 'Unemployed Discount', href: '#footer' },
  { name: 'Students Discount', href: '#footer' }
];

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, openLogin, logout } = useAuth();
  
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [discountsOpen, setDiscountsOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle sticky scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`w-full z-40 transition-all duration-300 ${
        isSticky 
          ? 'fixed top-0 left-0 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 py-3' 
          : 'relative bg-white border-b border-gray-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <a href="#home" className="flex items-center flex-shrink-0 gap-2 group">
            <img 
              src="https://learnerskart.com/wp-content/uploads/2023/05/4545c.png" 
              alt="LearnersKart Logo" 
              className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                // Fallback to stylized text if logo fails to load
                e.target.style.display = 'none';
              }}
            />
            <span className="text-xl md:text-2xl font-black tracking-tight text-[#0a3d91] font-sans">
              Learners<span className="text-[#f97316]">Kart</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            
            {/* Mega Dropdown for All Courses */}
            <div 
              className="relative py-2"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button 
                className="flex items-center gap-1 text-sm font-semibold text-[#0a3d91] hover:text-[#f97316] transition-colors duration-200 focus:outline-none"
              >
                All Courses 
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Menu Portal/Container */}
              {megaMenuOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[850px] bg-white rounded-xl shadow-2xl border border-gray-100 grid grid-cols-4 gap-6 p-8 z-50 transition-all duration-300">
                  {courseCategories.map((category, idx) => (
                    <div key={idx} className="flex flex-col gap-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0a3d91] border-b border-gray-100 pb-2 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#f97316]" />
                        {category.title}
                      </h4>
                      <ul className="flex flex-col gap-2">
                        {category.courses.map((course, cIdx) => (
                          <li key={cIdx}>
                            <a 
                              href="#courses" 
                              className="text-xs text-gray-600 hover:text-[#f97316] hover:translate-x-1 transition-all duration-150 block"
                            >
                              {course}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <a href="#home" className="text-sm font-semibold text-gray-700 hover:text-[#f97316] transition-colors duration-200">Home</a>
            <a href="#about" className="text-sm font-semibold text-gray-700 hover:text-[#f97316] transition-colors duration-200">About Us</a>

            {/* Special Discounts Dropdown */}
            <div 
              className="relative py-2"
              onMouseEnter={() => setDiscountsOpen(true)}
              onMouseLeave={() => setDiscountsOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-[#f97316] transition-colors duration-200 focus:outline-none">
                Special Discounts
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${discountsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {discountsOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                  {discountItems.map((item, idx) => (
                    <a 
                      key={idx} 
                      href={item.href} 
                      className="block px-4 py-2 text-xs text-gray-700 hover:bg-orange-50 hover:text-[#f97316] transition-colors duration-150 font-medium"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="#blogs" className="text-sm font-semibold text-gray-700 hover:text-[#f97316] transition-colors duration-200">Blogs</a>
            <a href="http://localhost:5174/lms/mock-test" className="text-sm font-semibold text-[#f97316] hover:text-[#0a3d91] transition-colors duration-200 flex items-center gap-1">
              <span>🎯 Free Mock Tests</span>
            </a>
            <a href="#contact" className="text-sm font-semibold text-gray-700 hover:text-[#f97316] transition-colors duration-200">Contact Us</a>
          </nav>

          {/* Right Side Utility Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4 ml-auto">
            
            {/* LMS Portal Direct Gateway Button */}
            <a 
              href="http://localhost:5174/lms/dashboard" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden xl:flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black px-3.5 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
            >
              <span>🚀 LMS Portal</span>
            </a>
            
            {/* Country Selector */}
            <div className="relative">
              <button 
                onClick={() => setCountryOpen(!countryOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-all duration-200 focus:outline-none"
              >
                <span>{selectedCountry.flag}</span>
                <span className="hidden sm:inline">{selectedCountry.code}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {countryOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country);
                        setCountryOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 hover:text-[#0a3d91] font-medium transition-colors"
                    >
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Trigger */}
            <div className="relative">
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-600 hover:text-[#f97316] hover:bg-gray-50 rounded-full transition-all duration-200"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-3 z-50">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0a3d91]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          window.location.hash = '#courses';
                          setSearchOpen(false);
                        }
                      }}
                    />
                    <button 
                      onClick={() => {
                        window.location.hash = '#courses';
                        setSearchOpen(false);
                      }}
                      className="bg-[#0a3d91] hover:bg-[#083072] text-white text-xs px-3 py-2 rounded-lg font-bold transition-colors"
                    >
                      Go
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon with Badge */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-[#f97316] hover:bg-gray-50 rounded-full transition-all duration-200"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f97316] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Action Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden md:inline text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                  Hi, {user.name}
                </span>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-[#f97316] hover:bg-gray-50 rounded-full transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={openLogin}
                className="hidden sm:flex items-center gap-2 bg-[#0a3d91] hover:bg-[#083072] text-white text-xs md:text-sm font-bold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <User className="w-4 h-4" />
                Login
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-[#f97316] hover:bg-gray-50 rounded-full transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Responsive Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[100px] bg-white z-40 overflow-y-auto border-t border-gray-100 flex flex-col p-6 animate-fadeIn">
          <nav className="flex flex-col space-y-4">
            <div className="border-b border-gray-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0a3d91] mb-2">Our Core Courses</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2">
                {courseCategories.map((category, idx) => (
                  <div key={idx}>
                    <h4 className="text-xs font-semibold text-[#f97316] mb-1">{category.title}</h4>
                    <ul className="space-y-1">
                      {category.courses.slice(0, 3).map((course, cIdx) => (
                        <li key={cIdx}>
                          <a 
                            href="#courses" 
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-xs text-gray-600 hover:text-[#0a3d91] block py-0.5"
                          >
                            {course}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-gray-800 hover:text-[#f97316] py-1 border-b border-gray-50">Home</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-gray-800 hover:text-[#f97316] py-1 border-b border-gray-50">About Us</a>
            
            <div className="border-b border-gray-50 py-1">
              <h4 className="text-base font-bold text-gray-800 mb-2">Discounts & Offers</h4>
              <div className="flex flex-wrap gap-2 pl-2">
                {discountItems.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs bg-orange-50 text-[#f97316] px-2.5 py-1 rounded-full font-semibold border border-orange-100 hover:bg-orange-100 transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            <a href="#blogs" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-gray-800 hover:text-[#f97316] py-1 border-b border-gray-50">Blogs</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-gray-800 hover:text-[#f97316] py-1">Contact Us</a>

            {!user && (
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLogin();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#0a3d91] hover:bg-[#083072] text-white font-bold py-3 rounded-xl mt-4 transition-colors shadow-lg"
              >
                <User className="w-5 h-5" />
                Login to LearnersKart
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
