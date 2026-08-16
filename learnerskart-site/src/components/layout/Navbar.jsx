import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import MegaMenu from './MegaMenu';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getAccessToken } from '../../utils/api';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  Tag,
  GraduationCap
} from 'lucide-react';

const discounts = [
  { name: 'Alumni Offers', path: '/discounts/alumni' },
  { name: 'Students Discount', path: '/discounts/students' },
  { name: 'Unemployed Discount', path: '/discounts/unemployed' },
  { name: 'Veterans & Military Discount', path: '/discounts/veterans' }
];

const freeResources = [
  { name: 'PMP Eligibility Check', path: '/free-resources/eligibility' },
  { name: 'PMP Application Guidance', path: '/free-resources/application-guidance' },
  { name: 'PMP Renewal (PDUs) Guidance', path: '/free-resources/renewal-guidance' },
  { name: 'PMP Exam Success Guide', path: '/free-resources/success-guide' },
  { name: 'Free PMP Mock Test', path: '/free-resources/mock-test' },
  { name: 'Free PMP Practice Test', path: '/free-resources/practice-test' },
  { name: 'Resume Update & Job Assistance', path: '/free-resources/resume-assistance' }
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems, selectedCountry, setSelectedCountry, countriesList: countries } = useCart();
  const cartCount = cartItems.length;
  const redirectToLMS = (path = '/lms/dashboard') => {
    const defaultToken = user?.role === 'admin' ? 'mock_admin_token_123' : 'mock_learner_token_456';
    const token = getAccessToken() || localStorage.getItem('lk_token') || defaultToken;
    window.location.href = `http://localhost:5174${path}?token=${token}`;
  };
  const navigate = useNavigate();
  
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [discountsOpen, setDiscountsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  
  const [coursesMenuOpen, setCoursesMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const discountRef = useRef(null);
  const resourcesRef = useRef(null);
  const profileRef = useRef(null);
  const countryRef = useRef(null);

  // Sticky Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on click outside (useful for click togglers)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setCountryOpen(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(event.target)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <header 
      className={`w-full z-40 transition-all duration-300 ${
        isSticky 
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-150 py-3' 
          : 'relative bg-white border-b border-gray-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0 gap-2 group">
            <img 
              src="https://learnerskart.com/wp-content/uploads/2023/05/4545c.png" 
              alt="LearnersKart Logo" 
              className="h-11 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </Link>

          <nav className="hidden lg:flex items-center space-x-6">
            {/* All Courses Mega Dropdown menu */}
            <div 
              className="relative py-2"
              onMouseEnter={() => setCoursesMenuOpen(true)}
              onMouseLeave={() => setCoursesMenuOpen(false)}
            >
              <button 
                type="button"
                onClick={() => user ? redirectToLMS('/lms/my-courses') : navigate('/courses')}
                className="flex items-center gap-2 bg-[#098ce9] hover:bg-[#0370cb] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm focus:outline-none whitespace-nowrap"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="6" height="6" rx="1" />
                  <rect x="15" y="3" width="6" height="6" rx="1" />
                  <rect x="3" y="15" width="6" height="6" rx="1" />
                  <rect x="15" y="15" width="6" height="6" rx="1" />
                </svg>
                All Courses
              </button>

              {coursesMenuOpen && (
                <MegaMenu setIsOpen={setCoursesMenuOpen} />
              )}
            </div>
            <NavLink to="/" className="flex items-center justify-center bg-[#f97316] hover:bg-[#e25c00] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm focus:outline-none whitespace-nowrap">Home</NavLink>
            <NavLink to="/about-us" className={({ isActive }) => `text-sm font-semibold transition-colors whitespace-nowrap ${isActive ? 'text-[#f6b40a]' : 'text-gray-700 hover:text-[#f6b40a]'}`}>About Us</NavLink>
            <button onClick={() => user ? redirectToLMS("/lms/mock-test") : (toast.error("Please login to access free resources"), navigate("/login"))} className="flex items-center justify-center bg-[#f97316] hover:bg-[#e25c00] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm focus:outline-none whitespace-nowrap">Free Resources</button>
            
            {/* Special Discounts Dropdown */}
            <div 
              className="relative py-2"
              onMouseEnter={() => setDiscountsOpen(true)}
              onMouseLeave={() => setDiscountsOpen(false)}
              ref={discountRef}
            >
              <button className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-[#f6b40a] transition-colors focus:outline-none">
                Special Discounts
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${discountsOpen ? 'rotate-180' : ''}`} />
              </button>
              {discountsOpen && (
                <div className="absolute left-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fadeIn">
                  {discounts.map((discount, idx) => (
                    <Link
                      key={idx}
                      to={discount.path}
                      className="block px-4 py-2.5 text-xs text-gray-600 hover:bg-amber-50 hover:text-[#f6b40a] font-semibold transition-colors"
                      onClick={() => setDiscountsOpen(false)}
                    >
                      {discount.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            

            
            <NavLink to="/blog" className={({ isActive }) => `text-sm font-semibold transition-colors whitespace-nowrap ${isActive ? 'text-[#f6b40a]' : 'text-gray-700 hover:text-[#f6b40a]'}`}>Blogs</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `text-sm font-semibold transition-colors whitespace-nowrap ${isActive ? 'text-[#f6b40a]' : 'text-gray-700 hover:text-[#f6b40a]'}`}>Contact Us</NavLink>
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center space-x-3 ml-auto">
            
            {/* Country Selector */}
            <div className="relative" ref={countryRef}>
              <button 
                onClick={() => setCountryOpen(!countryOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors focus:outline-none"
              >
                <span>{selectedCountry.flag}</span>
                <span className="hidden sm:inline uppercase">{selectedCountry.code}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              {countryOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country);
                        setCountryOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs text-gray-600 hover:bg-gray-50 hover:text-[#098ce9] font-semibold transition-colors"
                    >
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-600 hover:text-[#f6b40a] hover:bg-gray-50 rounded-full transition-colors block"
                aria-label="Search courses"
              >
                <Search className="w-5 h-5" />
              </button>
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-150 p-3 z-50">
                  <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <input 
                      type="text" 
                      required
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#098ce9]"
                      autoFocus
                    />
                    <button 
                      type="submit"
                      className="bg-[#098ce9] hover:bg-[#0370cb] text-white text-xs px-3 py-2 rounded-lg font-bold transition-colors"
                    >
                      Go
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Cart Link with Badge */}
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-600 hover:text-[#f6b40a] hover:bg-gray-50 rounded-full transition-colors block"
              aria-label="View shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f6b40a] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Authentication Avatar / Login Link */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 focus:outline-none"
                >
                  <img 
                    src={user.avatar ? (user.avatar.startsWith('/uploads') ? `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:5000${user.avatar}` : user.avatar) : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=60&auto=format&fit=crop'} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full border border-gray-200 object-cover shadow-sm hover:scale-105 transition-transform"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:inline" />
                </button>
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-150 py-2 z-50 animate-fadeIn"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-black text-[#098ce9] truncate">{user.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setProfileDropdownOpen(false)} className="block px-4 py-2 text-xs text-gray-600 hover:bg-amber-50 hover:text-[#f6b40a] font-semibold">Dashboard</Link>
                    <Link to="/dashboard/courses" onClick={() => setProfileDropdownOpen(false)} className="block px-4 py-2 text-xs text-gray-600 hover:bg-amber-50 hover:text-[#f6b40a] font-semibold">My Courses</Link>
                    <Link to="/dashboard/profile" onClick={() => setProfileDropdownOpen(false)} className="block px-4 py-2 text-xs text-gray-600 hover:bg-amber-50 hover:text-[#f6b40a] font-semibold">Profile Settings</Link>
                    <button 
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-xs text-red-600 hover:bg-red-50 font-bold border-t border-gray-50 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1 bg-[#098ce9] hover:bg-[#0370cb] text-white text-xs md:text-sm font-bold px-4.5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            )}

            {/* Mobile Hamburger toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-[#f6b40a] hover:bg-gray-50 rounded-full transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[73px] bg-white z-40 overflow-y-auto border-t border-gray-150 flex flex-col p-6 animate-fadeIn">
          <nav className="flex flex-col space-y-4">
            <button onClick={() => { setMobileMenuOpen(false); user ? redirectToLMS("/lms/my-courses") : navigate("/courses"); }} className="w-full text-left block text-base font-bold text-gray-800 hover:text-[#f6b40a] py-1 border-b border-gray-50">All Courses</button>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-gray-800 hover:text-[#f6b40a] py-1 border-b border-gray-50">Home</Link>
            <Link to="/about-us" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-gray-800 hover:text-[#f6b40a] py-1 border-b border-gray-50">About Us</Link>
            <button onClick={() => { setMobileMenuOpen(false); user ? redirectToLMS("/lms/mock-test") : (toast.error("Please login to access free resources"), navigate("/login")); }} className="w-full text-left block text-base font-bold text-gray-800 hover:text-[#f6b40a] py-1 border-b border-gray-50">Free Resources</button>
            
            {/* Special Discounts Mini Section */}
            <div className="border-b border-gray-50 py-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#098ce9] mb-2 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#f6b40a]" />
                Discount Programs
              </h3>
              <div className="flex flex-wrap gap-2 pl-3">
                {discounts.map((discount, idx) => (
                  <Link 
                    key={idx} 
                    to={discount.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[10px] bg-amber-50 text-[#f6b40a] px-2.5 py-1 rounded-full font-bold border border-amber-100"
                  >
                    {discount.name}
                  </Link>
                ))}
              </div>
            </div>
            

            
            <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-gray-800 hover:text-[#f6b40a] py-1 border-b border-gray-50">Blogs</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-gray-800 hover:text-[#f6b40a] py-1">Contact Us</Link>
            
            {/* Mobile Auth Button */}
            {!user ? (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#098ce9] hover:bg-[#0370cb] text-white font-black py-3 rounded-xl mt-6 shadow-md"
              >
                <User className="w-5 h-5" />
                Sign In to LearnersKart
              </Link>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-black py-3 rounded-xl mt-6 shadow-md"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
