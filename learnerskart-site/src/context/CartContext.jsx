import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const CartContext = createContext();

export const countriesList = [
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', rate: 1, symbol: '₹' },
  { code: 'US', name: 'USA', flag: '🇺🇸', currency: 'USD', rate: 0.012, symbol: '$' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', currency: 'AED', rate: 0.044, symbol: 'AED ' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR', rate: 0.045, symbol: 'SR ' },
  { code: 'GB', name: 'UK', flag: '🇬🇧', currency: 'GBP', rate: 0.0094, symbol: '£' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', rate: 0.016, symbol: 'C$' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', rate: 0.018, symbol: 'A$' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', currency: 'QAR', rate: 0.044, symbol: 'QR ' }
];

export const coursePricingData = {
  course_pmp: {
    'Self Study': { inr: { standard: 6999, special: 4999 }, usd: { standard: 299, special: 199 } },
    'Live Online': { inr: { standard: 14999, special: 11999 }, usd: { standard: 899, special: 699 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1499, special: 1199 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_capm: {
    'Self Study': { inr: { standard: 6999, special: 4999 }, usd: { standard: 299, special: 199 } },
    'Live Online': { inr: { standard: 14999, special: 11999 }, usd: { standard: 799, special: 599 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1299, special: 999 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_prince2_foundation: {
    'Self Study': { inr: { standard: 8999, special: 6999 }, usd: { standard: 499, special: 299 } },
    'Live Online': { inr: { standard: 16999, special: 13999 }, usd: { standard: 999, special: 799 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1599, special: 1299 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_prince2_practitioner: {
    'Self Study': { inr: { standard: 8999, special: 6999 }, usd: { standard: 499, special: 299 } },
    'Live Online': { inr: { standard: 16999, special: 13999 }, usd: { standard: 999, special: 799 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1599, special: 1299 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_prince2_combo: {
    'Self Study': { inr: { standard: 12999, special: 9999 }, usd: { standard: 699, special: 499 } },
    'Live Online': { inr: { standard: 24999, special: 21999 }, usd: { standard: 1799, special: 1499 } },
    'E-Learning': { inr: { standard: 89999, special: 85999 }, usd: { standard: 2899, special: 2499 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_pgmp: {
    'Self Study': { inr: { standard: 9999, special: 7999 }, usd: { standard: 699, special: 499 } },
    'Live Online': { inr: { standard: 35999, special: 32999 }, usd: { standard: 1799, special: 1499 } },
    'E-Learning': { inr: { standard: 89999, special: 85999 }, usd: { standard: 2899, special: 2499 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_rmp: {
    'Self Study': { inr: { standard: 8999, special: 6999 }, usd: { standard: 499, special: 299 } },
    'Live Online': { inr: { standard: 24999, special: 22999 }, usd: { standard: 999, special: 799 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1599, special: 1299 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_lss_combo: {
    'Self Study': { inr: { standard: 12999, special: 9999 }, usd: { standard: 699, special: 499 } },
    'Live Online': { inr: { standard: 24999, special: 21999 }, usd: { standard: 1799, special: 1499 } },
    'E-Learning': { inr: { standard: 89999, special: 85999 }, usd: { standard: 2899, special: 2499 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_lssyb: {
    'Self Study': { inr: { standard: 7999, special: 5999 }, usd: { standard: 499, special: 299 } },
    'Live Online': { inr: { standard: 16999, special: 13999 }, usd: { standard: 899, special: 699 } },
    'E-Learning': { inr: { standard: 41999, special: 39999 }, usd: { standard: 1399, special: 1199 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_lssgb: {
    'Self Study': { inr: { standard: 9999, special: 7999 }, usd: { standard: 499, special: 299 } },
    'Live Online': { inr: { standard: 19999, special: 17999 }, usd: { standard: 999, special: 799 } },
    'E-Learning': { inr: { standard: 47999, special: 44999 }, usd: { standard: 1799, special: 1499 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_lssbb: {
    'Self Study': { inr: { standard: 12999, special: 9999 }, usd: { standard: 699, special: 499 } },
    'Live Online': { inr: { standard: 22999, special: 19999 }, usd: { standard: 1799, special: 1499 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 2899, special: 2499 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_ccba: {
    'Self Study': { inr: { standard: 9999, special: 7999 }, usd: { standard: 499, special: 299 } },
    'Live Online': { inr: { standard: 19999, special: 17999 }, usd: { standard: 999, special: 799 } },
    'E-Learning': { inr: { standard: 39999, special: 34999 }, usd: { standard: 1599, special: 1299 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_ecba: {
    'Self Study': { inr: { standard: 7999, special: 5999 }, usd: { standard: 499, special: 299 } },
    'Live Online': { inr: { standard: 16999, special: 13999 }, usd: { standard: 899, special: 699 } },
    'E-Learning': { inr: { standard: 52999, special: 49999 }, usd: { standard: 1399, special: 1199 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_cbap: {
    'Self Study': { inr: { standard: 12999, special: 9999 }, usd: { standard: 699, special: 499 } },
    'Live Online': { inr: { standard: 22999, special: 19999 }, usd: { standard: 999, special: 799 } },
    'E-Learning': { inr: { standard: 66999, special: 62999 }, usd: { standard: 1799, special: 1499 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_acp: {
    'Self Study': { inr: { standard: 8999, special: 6999 }, usd: { standard: 499, special: 299 } },
    'Live Online': { inr: { standard: 19999, special: 17999 }, usd: { standard: 999, special: 799 } },
    'E-Learning': { inr: { standard: 59999, special: 57999 }, usd: { standard: 1599, special: 1399 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_dm: {
    'Self Study': { inr: { standard: 8999, special: 6999 }, usd: { standard: 499, special: 299 } },
    'Live Online': { inr: { standard: 24999, special: 19999 }, usd: { standard: 1199, special: 899 } },
    'E-Learning': { inr: { standard: 34999, special: 30999 }, usd: { standard: 1399, special: 1199 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  }
};

const idMap = {
  'pmp-international': { id: 'course_pmp', mode: 'Live Online', title: 'Project Management Professional (PMP)' },
  'pmp-elearning': { id: 'course_pmp', mode: 'Self Study', title: 'Project Management Professional (PMP)' },
  'pmp-classroom': { id: 'course_pmp', mode: 'Classroom', title: 'Project Management Professional (PMP)' },
  'pmp-bengaluru': { id: 'course_pmp', mode: 'Classroom', title: 'Project Management Professional (PMP)' },
  'pmp-training': { id: 'course_pmp', mode: 'Live Online', title: 'Project Management Professional (PMP)' },
  'capm': { id: 'course_capm', title: 'Certified Associate In Project Management (CAPM®) Online Course' },
  'prince2-foundation': { id: 'course_prince2_foundation', title: 'Prince2 Foundation Certification Training' },
  'lssgb': { id: 'course_lssgb', title: 'Lean Six Sigma Green Belt Certification Training' },
  'lssbb': { id: 'course_lssbb', title: 'Lean Six Sigma Black Belt Certification Training' },
  'cbap': { id: 'course_cbap', title: 'Certified Business Analysis Professional (CBAP®) Training' },
  'pmi-acp': { id: 'course_acp', title: 'Agile Certified Practitioner Certification Training' },
  'digital-marketing': { id: 'course_dm', title: 'Digital Marketing Training' }
};

export const getPricingKey = (course) => {
  if (!course) return null;
  const slug = (course.slug || '').toLowerCase();
  
  if (slug.includes('pmp') || slug.includes('project-management-professional')) {
    return 'course_pmp';
  }
  if (slug.includes('capm')) {
    return 'course_capm';
  }
  if (slug.includes('prince2') && slug.includes('combo')) {
    return 'course_prince2_combo';
  }
  if (slug.includes('prince2') && slug.includes('foundation')) {
    return 'course_prince2_foundation';
  }
  if (slug.includes('prince2') && (slug.includes('practitioner') || slug.includes('prac'))) {
    return 'course_prince2_practitioner';
  }
  if (slug.includes('pgmp') || slug.includes('program-management-professional')) {
    return 'course_pgmp';
  }
  if (slug.includes('rmp') || slug.includes('risk-management')) {
    return 'course_rmp';
  }
  if (slug.includes('lss') && slug.includes('combo')) {
    return 'course_lss_combo';
  }
  if (slug.includes('yellow') || slug.includes('lssyb')) {
    return 'course_lssyb';
  }
  if (slug.includes('green') || slug.includes('lssgb')) {
    return 'course_lssgb';
  }
  if (slug.includes('black') || slug.includes('lssbb')) {
    return 'course_lssbb';
  }
  if (slug.includes('ccba')) {
    return 'course_ccba';
  }
  if (slug.includes('ecba')) {
    return 'course_ecba';
  }
  if (slug.includes('cbap')) {
    return 'course_cbap';
  }
  if (slug.includes('acp') || slug.includes('agile-certified')) {
    return 'course_acp';
  }
  if (slug.includes('digital-marketing') || slug.includes('dm')) {
    return 'course_dm';
  }
  
  const idStr = String(course._id || course.id || '');
  if (idStr.includes('pmp')) return 'course_pmp';
  if (idStr.includes('capm')) return 'course_capm';
  if (idStr.includes('prince2_foundation')) return 'course_prince2_foundation';
  if (idStr.includes('prince2_practitioner')) return 'course_prince2_practitioner';
  if (idStr.includes('prince2_combo')) return 'course_prince2_combo';
  if (idStr.includes('pgmp')) return 'course_pgmp';
  if (idStr.includes('rmp')) return 'course_rmp';
  if (idStr.includes('lss_combo')) return 'course_lss_combo';
  if (idStr.includes('lssyb')) return 'course_lssyb';
  if (idStr.includes('lssgb')) return 'course_lssgb';
  if (idStr.includes('lssbb')) return 'course_lssbb';
  if (idStr.includes('ccba')) return 'course_ccba';
  if (idStr.includes('ecba')) return 'course_ecba';
  if (idStr.includes('cbap')) return 'course_cbap';
  if (idStr.includes('acp')) return 'course_acp';
  if (idStr.includes('dm')) return 'course_dm';
  
  return null;
};

export const normalizeCartItem = (item) => {
  if (!item) return item;
  const finalId = getPricingKey(item);
  if (finalId) {
    const titleMap = {
      course_pmp: 'Project Management Professional (PMP)',
      course_capm: 'Certified Associate In Project Management (CAPM®) Online Course',
      course_prince2_foundation: 'Prince2 Foundation Certification Training',
      course_prince2_practitioner: 'PRINCE2 Practitioner Certification Training Course',
      course_prince2_combo: 'PRINCE2 Foundation And Practitioner Certification Training',
      course_pgmp: 'Program Management Professional Certification Training',
      course_rmp: 'Risk Management Professional Certification Training',
      course_lss_combo: 'Lean Six Sigma Green And Black Belt Combo Certification Training',
      course_lssyb: 'Lean Six Sigma Yellow Belt Certification Training',
      course_lssgb: 'Lean Six Sigma Green Belt Certification Training',
      course_lssbb: 'Lean Six Sigma Black Belt Certification Training',
      course_ccba: 'Certification Of Capability In Business Analysis™ (CCBA®) Certification Training',
      course_ecba: 'ECBA Certification Training',
      course_cbap: 'Certified Business Analysis Professional (CBAP®) Training',
      course_acp: 'Agile Certified Practitioner Certification Training',
      course_dm: 'Digital Marketing Training'
    };
    return {
      ...item,
      title: titleMap[finalId] || item.title,
      selectedMode: item.selectedMode || 'Live Online'
    };
  }
  return item;
};

export const getCalculatedPricing = (course, mode, selectedCountryCode, isOriginal = false) => {
  if (!course) return null;
  const finalId = typeof course === 'object' ? getPricingKey(course) : getPricingKey({ slug: course, _id: course });
  const courseData = coursePricingData[finalId];
  if (!courseData) return null;

  let lookupMode = mode;
  if (mode === 'Training + Exam Prep') {
    lookupMode = 'E-Learning';
  }
  const modeData = courseData[lookupMode] || courseData['Live Online'];
  if (!modeData) return null;

  const isINR = selectedCountryCode === 'IN';
  const currencyKey = isINR ? 'inr' : 'usd';
  const priceTypeKey = isOriginal ? 'standard' : 'special';

  const basePrice = modeData[currencyKey]?.[priceTypeKey];
  if (basePrice === undefined || basePrice === null) return null;

  if (isINR) {
    return basePrice;
  } else {
    // basePrice is directly in USD
    const matchCountry = countriesList.find(c => c.code === selectedCountryCode);
    if (!matchCountry || matchCountry.code === 'US') {
      return basePrice;
    }
    // For other non-INR currencies, scale relative to USD rate (0.012)
    const ratio = (matchCountry.rate || 0.012) / 0.012;
    return Math.round(basePrice * ratio);
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('lk_cart_items');
    const items = saved ? JSON.parse(saved) : [];
    return items.map(normalizeCartItem);
  });

  const [couponCode, setCouponCode] = useState(() => {
    return localStorage.getItem('lk_coupon_code') || '';
  });

  const [discount, setDiscount] = useState(0);

  const [countries, setCountries] = useState(countriesList);

  const [selectedCountry, setSelectedCountry] = useState(() => {
    const saved = localStorage.getItem('lk_selected_country');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = countriesList.find(c => c.code === parsed.code);
        if (match) return match;
      } catch (err) {}
    }
    return countriesList[0]; // Default to India (INR)
  });

  // Fetch exchange rates from database
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await api.get('/currencies');
        if (res.data.success && res.data.currencies.length > 0) {
          setCountries(res.data.currencies);
          
          // Sync current choice with new rates
          const saved = localStorage.getItem('lk_selected_country');
          if (saved) {
            const parsed = JSON.parse(saved);
            const match = res.data.currencies.find(c => c.code === parsed.code);
            if (match) {
              setSelectedCountry(match);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch backend currencies:', err);
      }
    };
    fetchCurrencies();
  }, []);

  // IP Geolocation auto-detection hook with resilient fallbacks
  useEffect(() => {
    const saved = localStorage.getItem('lk_selected_country');
    if (saved) return;

    const autoDetect = async () => {
      try {
        let countryCode = null;

        // Provider 1: ipapi.co
        try {
          const response = await fetch('https://ipapi.co/json/');
          if (response.ok) {
            const data = await response.json();
            countryCode = data?.country_code || data?.country;
          }
        } catch (e) {}

        // Provider 2: ipinfo.io fallback
        if (!countryCode) {
          try {
            const response = await fetch('https://ipinfo.io/json');
            if (response.ok) {
              const data = await response.json();
              countryCode = data?.country;
            }
          } catch (e) {}
        }

        // Timezone fallback if API rates limited
        if (!countryCode) {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
          if (tz.includes('Kolkata') || tz.includes('India') || tz.includes('Calcutta')) {
            countryCode = 'IN';
          } else if (tz.includes('America/')) {
            countryCode = 'US';
          } else if (tz.includes('London') || tz.includes('Europe/')) {
            countryCode = 'GB';
          } else if (tz.includes('Dubai') || tz.includes('Asia/Dubai')) {
            countryCode = 'AE';
          }
        }

        if (countryCode) {
          const matched = countriesList.find(c => c.code === countryCode.toUpperCase());
          if (matched) {
            setSelectedCountry(matched);
            localStorage.setItem('lk_selected_country', JSON.stringify(matched));
          }
        }
      } catch (err) {
        console.log('Location detection fallback completed.', err);
      }
    };
    autoDetect();
  }, [countries]);

  useEffect(() => {
    localStorage.setItem('lk_selected_country', JSON.stringify(selectedCountry));
  }, [selectedCountry]);

  // Helper to format price in local currency
  const formatPrice = (priceInINR) => {
    const numPrice = Number(priceInINR);
    if (priceInINR === undefined || priceInINR === null || isNaN(numPrice) || numPrice === 0) {
      return 'Free';
    }
    const converted = Math.round(numPrice * selectedCountry.rate);
    return `${selectedCountry.symbol}${converted.toLocaleString('en-IN')}`;
  };

  // Save cart items to local storage
  useEffect(() => {
    localStorage.setItem('lk_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save coupon to local storage
  useEffect(() => {
    if (couponCode) {
      localStorage.setItem('lk_coupon_code', couponCode);
    } else {
      localStorage.removeItem('lk_coupon_code');
    }
  }, [couponCode]);

  // Helper to calculate price based on training mode and batch discount rules
  const calculateItemPrice = (item) => {
    const normalized = normalizeCartItem(item);
    let mode = normalized.selectedMode || 'Live Online';
    if (mode === 'Training + Exam Prep') {
      mode = 'E-Learning';
    }
    const countryCode = selectedCountry?.code || 'IN';
    
    const customPrice = getCalculatedPricing(normalized, mode, countryCode, false);
    if (customPrice !== null) {
      return customPrice;
    }

    if (normalized.isFree || normalized.price === 0) return 0;

    let price = normalized.price;
    if (mode === 'E-Learning') {
      price = Math.round(normalized.price * 0.5); // 50% for E-Learning
    } else if (mode === 'Self Study') {
      price = Math.round(normalized.price * 0.4); // 40% for Self Study
    } else if (mode === 'Classroom') {
      price = Math.round(normalized.price * 1.2); // Classroom is 20% more expensive
    }
    
    const batch = normalized.selectedBatch || '';
    if ((mode === 'Live Online' || mode === 'Classroom') && batch.toLowerCase().includes('weekday')) {
      price = Math.round(price * 0.8); // 20% weekday discount
    }
    
    return price;
  };

  const calculateItemOriginalPrice = (item) => {
    const normalized = normalizeCartItem(item);
    let mode = normalized.selectedMode || 'Live Online';
    if (mode === 'Training + Exam Prep') {
      mode = 'E-Learning';
    }
    const countryCode = selectedCountry?.code || 'IN';
    
    const customOriginalPrice = getCalculatedPricing(normalized, mode, countryCode, true);
    if (customOriginalPrice !== null) {
      return customOriginalPrice;
    }

    let baseOriginal = normalized.originalPrice;
    if (!baseOriginal && normalized.price > 0) {
      baseOriginal = Math.round(normalized.price * 1.3);
    }
    if (!baseOriginal) return 0;

    let price = baseOriginal;
    if (mode === 'E-Learning') {
      price = Math.round(baseOriginal * 0.5);
    } else if (mode === 'Self Study') {
      price = Math.round(baseOriginal * 0.4);
    } else if (mode === 'Classroom') {
      price = Math.round(baseOriginal * 1.2);
    }
    
    return price;
  };

  // Calculate prices
  const subtotal = cartItems.reduce((sum, item) => sum + calculateItemPrice(item), 0);
  const originalSubtotal = cartItems.reduce((sum, item) => sum + calculateItemOriginalPrice(item), 0);

  useEffect(() => {
    const code = couponCode.toUpperCase();
    if (code === 'LEARN2026' || code === 'LKPMP10' || code === 'LKALL10' || code === 'LKREFER10' || code === 'LKMOCK2' || code === 'LKPMPAPP') {
      setDiscount(Math.round(originalSubtotal * 0.10)); // 10% discount
    } else if (code === 'LKTRAINING25') {
      setDiscount(Math.round(originalSubtotal * 0.25)); // 25% discount
    } else {
      setDiscount(0);
    }
  }, [couponCode, originalSubtotal]);

  const afterDiscount = subtotal - discount;
  const gst = Math.round(afterDiscount * 0.18); // 18% GST
  const finalTotal = afterDiscount + gst;

  // Add course to cart
  const addToCart = (course, mode = 'Live Online', batch = '') => {
    const normalized = normalizeCartItem(course);
    const existsIndex = cartItems.findIndex((item) => item._id === normalized._id);
    if (existsIndex > -1) {
      // Update selections in place if already in cart
      setCartItems((prev) => {
        const updated = [...prev];
        updated[existsIndex] = {
          ...updated[existsIndex],
          selectedMode: mode,
          selectedBatch: batch
        };
        return updated;
      });
      return { success: true, message: `${normalized.title} selections updated in cart.` };
    } else {
      const newItem = {
        ...normalized,
        selectedMode: mode,
        selectedBatch: batch
      };
      setCartItems((prev) => [...prev, newItem]);
      return { success: true, message: `${normalized.title} added to cart.` };
    }
  };

  // Update dynamic selections
  const updateCartItemSelections = (courseId, selections) => {
    setCartItems(prev =>
      prev.map(item =>
        item._id === courseId ? { ...item, ...selections } : item
      )
    );
  };

  // Remove course from cart
  const removeFromCart = (courseId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== courseId));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setCouponCode('');
    setDiscount(0);
  };

  // Apply Coupon
  const applyCoupon = (code) => {
    const c = code.toUpperCase();
    if (c === 'LEARN2026' || c === 'LKPMP10' || c === 'LKALL10' || c === 'LKREFER10' || c === 'LKMOCK2' || c === 'LKPMPAPP') {
      setCouponCode(c);
      return { success: true, message: `Coupon "${c}" (10% OFF) applied successfully.` };
    }
    if (c === 'LKTRAINING25') {
      setCouponCode(c);
      return { success: true, message: 'Coupon "LKTRAINING25" (25% OFF) applied successfully.' };
    }
    return { success: false, message: 'Invalid coupon code.' };
  };

  // Remove Coupon
  const removeCoupon = () => {
    setCouponCode('');
    setDiscount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        couponCode,
        subtotal,
        discount,
        gst,
        finalTotal,
        addToCart,
        updateCartItemSelections,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        selectedCountry,
        setSelectedCountry,
        formatPrice,
        calculateItemPrice,
        getCalculatedPricing,
        countriesList: countries,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
