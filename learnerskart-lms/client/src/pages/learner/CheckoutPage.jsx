import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CreditCard, ShieldCheck, CheckCircle2, ShoppingBag, ArrowRight, ArrowLeft, 
  Info, Sparkles, Calendar, BookOpen, AlertCircle, Shield, Globe, Users, MapPin, X, Tag
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const countriesList = [
  { code: 'IN', currency: 'INR', symbol: '₹', name: 'India' },
  { code: 'US', currency: 'USD', symbol: '$', name: 'United States' },
  { code: 'AE', currency: 'AED', symbol: 'AED ', name: 'United Arab Emirates' },
  { code: 'SA', currency: 'SAR', symbol: 'SR ', name: 'Saudi Arabia' },
  { code: 'GB', currency: 'GBP', symbol: '£', name: 'United Kingdom' },
  { code: 'CA', currency: 'CAD', symbol: 'C$', name: 'Canada' },
  { code: 'AU', currency: 'AUD', symbol: 'A$', name: 'Australia' },
  { code: 'QA', currency: 'QAR', symbol: 'QR ', name: 'Qatar' }
];

const coursePricingData = {
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
    'Self Study': { inr: { standard: 9999, special: 7999 }, usd: { standard: 599, special: 399 } },
    'Live Online': { inr: { standard: 19999, special: 16999 }, usd: { standard: 1099, special: 899 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1599, special: 1299 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_lssyb: {
    'Self Study': { inr: { standard: 4999, special: 2999 }, usd: { standard: 199, special: 99 } },
    'Live Online': { inr: { standard: 9999, special: 6999 }, usd: { standard: 399, special: 299 } },
    'E-Learning': { inr: { standard: 34999, special: 31999 }, usd: { standard: 799, special: 599 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_lssgb: {
    'Self Study': { inr: { standard: 6999, special: 4999 }, usd: { standard: 299, special: 199 } },
    'Live Online': { inr: { standard: 14999, special: 11999 }, usd: { standard: 799, special: 599 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1299, special: 999 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_lssbb: {
    'Self Study': { inr: { standard: 8999, special: 6999 }, usd: { standard: 499, special: 299 } },
    'Live Online': { inr: { standard: 16999, special: 13999 }, usd: { standard: 999, special: 799 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1599, special: 1299 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_ccba: {
    'Self Study': { inr: { standard: 7999, special: 5999 }, usd: { standard: 399, special: 249 } },
    'Live Online': { inr: { standard: 15999, special: 12999 }, usd: { standard: 899, special: 699 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1399, special: 1099 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_ecba: {
    'Self Study': { inr: { standard: 6999, special: 4999 }, usd: { standard: 299, special: 199 } },
    'Live Online': { inr: { standard: 14999, special: 11999 }, usd: { standard: 799, special: 599 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1299, special: 999 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_cbap: {
    'Self Study': { inr: { standard: 9999, special: 7999 }, usd: { standard: 599, special: 399 } },
    'Live Online': { inr: { standard: 19999, special: 16999 }, usd: { standard: 1099, special: 899 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1599, special: 1299 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_acp: {
    'Self Study': { inr: { standard: 7999, special: 5999 }, usd: { standard: 399, special: 249 } },
    'Live Online': { inr: { standard: 15999, special: 12999 }, usd: { standard: 899, special: 699 } },
    'E-Learning': { inr: { standard: 54999, special: 51999 }, usd: { standard: 1399, special: 1099 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  },
  course_dm: {
    'Self Study': { inr: { standard: 5999, special: 3999 }, usd: { standard: 249, special: 149 } },
    'Live Online': { inr: { standard: 12999, special: 9999 }, usd: { standard: 699, special: 499 } },
    'E-Learning': { inr: { standard: 34999, special: 31999 }, usd: { standard: 799, special: 599 } },
    'Classroom': { inr: { standard: null, special: null }, usd: { standard: null, special: null } }
  }
};

const getPricingKey = (course) => {
  if (!course) return 'course_pmp';
  const slug = (course.slug || '').toLowerCase().replace(/%20/g, ' ').replace(/-/g, ' ');
  
  if (slug.includes('pmp') || slug.includes('project management') || slug.includes('project-management')) return 'course_pmp';
  if (slug.includes('capm')) return 'course_capm';
  if (slug.includes('prince2') && slug.includes('combo')) return 'course_prince2_combo';
  if (slug.includes('prince2') && slug.includes('foundation')) return 'course_prince2_foundation';
  if (slug.includes('prince2') && (slug.includes('practitioner') || slug.includes('prac'))) return 'course_prince2_practitioner';
  if (slug.includes('pgmp') || slug.includes('program management')) return 'course_pgmp';
  if (slug.includes('rmp') || slug.includes('risk management')) return 'course_rmp';
  if (slug.includes('lss') && slug.includes('combo')) return 'course_lss_combo';
  if (slug.includes('yellow') || slug.includes('lssyb')) return 'course_lssyb';
  if (slug.includes('green') || slug.includes('lssgb')) return 'course_lssgb';
  if (slug.includes('black') || slug.includes('lssbb')) return 'course_lssbb';
  if (slug.includes('ccba')) return 'course_ccba';
  if (slug.includes('ecba')) return 'course_ecba';
  if (slug.includes('cbap')) return 'course_cbap';
  if (slug.includes('acp') || slug.includes('agile certified')) return 'course_acp';
  if (slug.includes('digital marketing') || slug.includes('dm')) return 'course_dm';
  return 'course_pmp';
};

const getCalculatedPricing = (course, mode, selectedCountryCode, isOriginal = false) => {
  if (!course) return 4999;
  const finalId = getPricingKey(course) || 'course_pmp';
  const courseData = coursePricingData[finalId] || coursePricingData['course_pmp'];
  if (!courseData) return 4999;

  let lookupMode = mode;
  if (mode === 'Training + Exam Prep') {
    lookupMode = 'E-Learning';
  }
  const modeData = courseData[lookupMode] || courseData['Live Online'] || courseData['Self Study'];
  if (!modeData) return 4999;

  const isINR = selectedCountryCode === 'IN';
  const currencyKey = isINR ? 'inr' : 'usd';
  const priceTypeKey = isOriginal ? 'standard' : 'special';

  const basePrice = modeData[currencyKey] ? modeData[currencyKey][priceTypeKey] : 4999;
  if (basePrice === null || basePrice === undefined) return 4999;

  if (isINR) {
    return basePrice;
  } else {
    const prices = {
      US: basePrice,
      AE: Math.round(basePrice * 3.67),
      SA: Math.round(basePrice * 3.75),
      GB: Math.round(basePrice * 0.8),
      CA: Math.round(basePrice * 1.35),
      AU: Math.round(basePrice * 1.5),
      QA: Math.round(basePrice * 3.64)
    };
    return prices[selectedCountryCode] || Math.round(basePrice / 0.012);
  }
};

export default function CheckoutPage() {
  const { slug: rawSlug } = useParams();
  let slug = 'project-management-professional-pmp';
  try {
    slug = decodeURIComponent(rawSlug || '').trim() || 'project-management-professional-pmp';
  } catch (e) {
    slug = (rawSlug || '').replace(/%20/g, ' ').trim() || 'project-management-professional-pmp';
  }

  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countriesList[0]);
  const [trainingMode, setTrainingMode] = useState('Live Online'); 
  
  // Checkout Form States
  const [billingName, setBillingName] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // razorpay | stripe
  const [processing, setProcessing] = useState(false);

  // Spin Wheel Coupons states
  const [couponText, setCouponText] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Razorpay Connection / Sandbox Simulator Modal States
  const [useLiveRazorpay, setUseLiveRazorpay] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [razorpayCardNo, setRazorpayCardNo] = useState('');
  const [razorpayExpiry, setRazorpayExpiry] = useState('');
  const [razorpayCvv, setRazorpayCvv] = useState('');

  // Stripe Simulator Modal States
  const [stripeCardNo, setStripeCardNo] = useState('');
  const [stripeExpiry, setStripeExpiry] = useState('');
  const [stripeCvv, setStripeCvv] = useState('');

  const activeCourse = course || {
    _id: '658421085289a0b123456789',
    title: 'Project Management Professional (PMP)® Certification Training',
    slug: slug || 'project-management-professional-pmp',
    category: 'Project Management',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500',
    rating: 4.9,
    reviewsCount: 1240,
    price: 11999
  };

  // Sync country selection from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem('lk_selected_country');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const found = countriesList.find(c => c.code === parsed.code);
        if (found) setSelectedCountry(found);
      } catch (e) {}
    }
  }, []);

  // Prefill details from authenticated user
  useEffect(() => {
    if (user) {
      setBillingName(user.name || '');
      setBillingEmail(user.email || '');
    }
  }, [user]);

  // Fetch course details by slug
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get('/courses');
        let found = null;
        const rawSlug = typeof slug === 'string' && slug.trim() !== '' ? slug : 'project-management-professional-pmp';
        const normalizedSlug = rawSlug.toLowerCase().replace(/%20/g, ' ').replace(/-/g, ' ');

        if (res.data && res.data.success && Array.isArray(res.data.courses)) {
          found = res.data.courses.find(c => {
            const cSlug = (c.slug || '').toLowerCase().replace(/%20/g, ' ').replace(/-/g, ' ');
            return cSlug === normalizedSlug || cSlug.includes(normalizedSlug) || normalizedSlug.includes(cSlug);
          });
          if (!found) {
            found = res.data.courses.find(c => c.title.toLowerCase().includes('pmp') || c.category?.toLowerCase().includes('project management'));
          }
        }

        if (found) {
          setCourse(found);
        }
      } catch (err) {
        console.error('Course fetch notice, using fallback PMP course:', err);
      }
    };
    fetchCourse();
  }, [slug]);

  const handleCountryChange = (c) => {
    setSelectedCountry(c);
    localStorage.setItem('lk_selected_country', JSON.stringify(c));
    toast.success(`Country pricing updated to ${c.name}`);
  };

  const handleApplyCoupon = (e) => {
    if (e) e.preventDefault();
    const code = couponText.trim().toUpperCase();
    if (!code) return;

    if (code === 'LKTRAINING25') {
      setAppliedCoupon(code);
      setDiscountAmount(Math.round(subtotal * 0.25));
      toast.success('Coupon "LKTRAINING25" (25% OFF) applied successfully!');
    } else if (['LKPMP10', 'LKALL10', 'LKPMPAPP', 'LKREFER10', 'LKMOCK2', 'LEARN2026'].includes(code)) {
      setAppliedCoupon(code);
      setDiscountAmount(Math.round(subtotal * 0.10));
      toast.success(`Coupon "${code}" (10% OFF) applied successfully!`);
    } else {
      toast.error('Invalid coupon code.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setDiscountAmount(0);
    setCouponText('');
    toast.success('Coupon removed.');
  };

  // Helper to load Razorpay SDK dynamically
  const loadRazorpaySDK = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleProceedPayment = async (e) => {
    if (e) e.preventDefault();

    if (!billingName || !billingEmail || !billingPhone) {
      toast.error('Please enter your billing details (Name, Email, and Phone number).');
      return;
    }

    if (paymentMethod === 'stripe') {
      await executeEnrollment('stripe');
      return;
    }

    // Razorpay Flow
    if (!useLiveRazorpay) {
      // WHEN "Use Live Razorpay Merchant Gateway" IS UNCHECKED:
      // Do NOT load Razorpay SDK, do NOT create real Razorpay Checkout instance.
      // Open the existing custom Sandbox Simulator modal directly.
      setShowRazorpayModal(true);
      return;
    }

    // WHEN "Use Live Razorpay Merchant Gateway" IS CHECKED:
    try {
      setProcessing(true);

      const orderPayload = {
        courseIds: [activeCourse._id],
        items: [{ courseId: activeCourse._id, mode: trainingMode, batch: '' }],
        couponCode: appliedCoupon,
        currency: selectedCountry.currency,
        exchangeRate: selectedCountry.rate || 1,
      };

      const orderRes = await api.post('/payment/create-lms-order', orderPayload);
      const orderData = orderRes.data || {};
      const { keyId, orderId, isSimulator } = orderData;

      // Strict validation: Never use rzp_test_mockkey or order_mock_* / order_lms_*
      if (!keyId || keyId.includes('mockkey')) {
        toast.error('Razorpay payment error: Valid Razorpay Key ID is not configured on server.');
        setProcessing(false);
        return;
      }

      if (!orderId || orderId.startsWith('order_lms_') || orderId.startsWith('order_mock_') || isSimulator) {
        toast.error('Razorpay payment error: Server failed to generate a valid Razorpay Order ID.');
        setProcessing(false);
        return;
      }

      // Load Real Razorpay SDK only when live checkbox is enabled and valid credentials/order exist
      const isSDKLoaded = await loadRazorpaySDK();
      if (!isSDKLoaded) {
        toast.error('Failed to load Razorpay SDK. Please check your internet connection.');
        setProcessing(false);
        return;
      }

      const finalAmountPaise = selectedCountry.currency === 'INR' ? Math.round(finalTotal * 100) : Math.round(finalTotal * 80 * 100);

      const options = {
        key: keyId,
        order_id: orderId,
        amount: finalAmountPaise,
        currency: 'INR',
        name: 'LearnersKart',
        description: `${activeCourse.title} Enrollment`,
        image: 'https://learnerskart.com/wp-content/uploads/2023/05/4545c.png',
        handler: async function (response) {
          try {
            setProcessing(true);
            const verifyRes = await api.post('/payment/verify-lms', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data && verifyRes.data.success) {
              await executeEnrollment('razorpay', response.razorpay_payment_id);
            } else {
              toast.error('Payment signature verification failed.');
            }
          } catch (err) {
            console.error('Razorpay verification error:', err);
            toast.error(err.response?.data?.message || err.message || 'Verification failed.');
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: billingName,
          email: billingEmail,
          contact: billingPhone,
        },
        theme: {
          color: '#098ce9',
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            toast.info('Payment cancelled.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setProcessing(false);
    } catch (err) {
      console.error('Razorpay checkout initiation error:', err);
      toast.error(err.response?.data?.message || err.message || 'Payment initiation failed.');
      setProcessing(false);
    }
  };

  const executeEnrollment = async (methodType, customPaymentId) => {
    try {
      setProcessing(true);
      setShowRazorpayModal(false);
      
      const paymentId = customPaymentId || `pay_${methodType}_${Math.random().toString(36).substring(2, 11)}`;

      const res = await api.post(`/courses/${course._id}/enroll`, { paymentId });
      
      if (res.data.success) {
        toast.success(`Enrollment completed successfully! Ref: ${paymentId}`);
        navigate('/lms/my-courses');
      } else {
        toast.error(res.data.message || 'Enrollment failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error occurred during payment checkout.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  const isContactMode = trainingMode === 'Classroom' || trainingMode === 'Corporate';

  // Subtotal = standard main site special pricing directly
  const subtotal = getCalculatedPricing(activeCourse, trainingMode, selectedCountry.code, false) || 4999;
  const afterDiscount = subtotal - discountAmount;
  const gst = Math.round(afterDiscount * 0.18); // 18% GST matching main website
  const finalTotal = afterDiscount + gst;
  const currencySymbol = selectedCountry.symbol;

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto relative">
      
      {/* Back button */}
      <button 
        onClick={() => navigate('/lms/my-courses')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors select-none cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Catalog
      </button>

      {/* Header with Title and Country Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 select-none">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Checkout Order</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Complete your enrollment billing and choose your simulated payment gateway options.
          </p>
        </div>

        {/* Dynamic Country Selector */}
        <div className="relative shrink-0 select-none">
          <label className="text-[9px] font-black text-slate-400 block uppercase tracking-wider mb-1 text-left">
            Checkout Country
          </label>
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/60 p-2 rounded-xl shadow-sm">
            <Globe size={14} className="text-slate-400" />
            <select
              value={JSON.stringify(selectedCountry)}
              onChange={(e) => handleCountryChange(JSON.parse(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-700 border-none outline-none pr-6 cursor-pointer"
            >
              {countriesList.map((c) => (
                <option key={c.code} value={JSON.stringify(c)}>
                  {c.name} ({c.currency})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Order Form */}
        <form onSubmit={handleProceedPayment} className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Mode Selectors */}
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm space-y-4 text-left">
            <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wide">
              1. Training Delivery Mode
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { modeKey: 'Live Online', name: 'Live Online', desc: 'Virtual live classes', icon: <Globe size={14} /> },
                { modeKey: 'Self Study', name: 'Self Study', desc: 'Pre-recorded videos', icon: <BookOpen size={14} /> },
                { modeKey: 'E-Learning', name: 'Training + Exam Prep', desc: 'Comprehensive prep', icon: <Sparkles size={14} /> },
                { modeKey: 'Classroom', name: 'Classroom', desc: 'Physical class cohorts', icon: <MapPin size={14} /> },
                { modeKey: 'Corporate', name: 'Corporate / Group', desc: 'Custom enterprise fit', icon: <Users size={14} /> }
              ].map((mode) => {
                const isActive = trainingMode === mode.modeKey;
                return (
                  <button
                    key={mode.modeKey}
                    type="button"
                    onClick={() => setTrainingMode(mode.modeKey)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isActive 
                        ? 'bg-primary/5 border-primary text-slate-800 shadow-sm'
                        : 'bg-white border-slate-200/60 hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <p className="text-xs font-bold">{mode.name}</p>
                      <span className={isActive ? 'text-primary' : 'text-slate-400'}>{mode.icon}</span>
                    </div>
                    <span className="text-[9px] font-medium block mt-1.5 opacity-80">{mode.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Billing Details */}
          {!isContactMode && (
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm space-y-4 text-left">
            <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wide">
              2. Billing Information
            </span>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl outline-none focus:border-slate-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl outline-none focus:border-slate-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 234 567 890"
                    value={billingPhone}
                    onChange={(e) => setBillingPhone(e.target.value)}
                    className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl outline-none focus:border-slate-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Section 3: Payment Method */}
          {!isContactMode && (
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm space-y-4 text-left">
            <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wide">
              3. Select Payment Gateway
            </span>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('stripe')}
                className={`p-4 rounded-xl border text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  paymentMethod === 'stripe'
                    ? 'bg-primary/5 border-primary text-primary font-bold shadow-sm'
                    : 'bg-white border-slate-200/60 hover:bg-slate-50 text-slate-500 font-semibold'
                }`}
              >
                <CreditCard size={16} />
                <span className="text-xs">Stripe Gateway</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-4 rounded-xl border text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  paymentMethod === 'razorpay'
                    ? 'bg-primary/5 border-primary text-primary font-bold shadow-sm'
                    : 'bg-white border-slate-200/60 hover:bg-slate-50 text-slate-500 font-semibold'
                }`}
              >
                <ShieldCheck size={16} />
                <span className="text-xs">Razorpay Gateway</span>
              </button>
            </div>

            {/* Gateway Card Fields */}
            {paymentMethod === 'stripe' && (
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3 pt-4 select-none">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wide">
                  <Shield size={12} className="text-slate-400" />
                  <span>Stripe Secure Payment Fields</span>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Card Number: 4242 4242 4242 4242"
                    value={stripeCardNo}
                    onChange={(e) => setStripeCardNo(e.target.value)}
                    className="w-full text-[11px] font-mono font-bold p-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY: 12/29"
                    value={stripeExpiry}
                    onChange={(e) => setStripeExpiry(e.target.value)}
                    className="w-full text-[11px] font-mono font-bold p-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:border-primary transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="CVC: 123"
                    value={stripeCvv}
                    onChange={(e) => setStripeCvv(e.target.value)}
                    className="w-full text-[11px] font-mono font-bold p-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'razorpay' && (
              <div className="bg-emerald-50/40 border border-emerald-200/60 p-4 rounded-xl space-y-3 select-none">
                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-800 uppercase tracking-wide">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>Official Razorpay SDK Gateway Options</span>
                </div>
                <p className="text-[10px] text-emerald-600 font-semibold leading-relaxed">
                  By default, checkouts use the local Sandbox Simulator to bypass validation errors caused by testing keys. Check the box below if you want to initialize the real script.
                </p>
                <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={useLiveRazorpay}
                    onChange={(e) => setUseLiveRazorpay(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <span>Use Live Razorpay Merchant Gateway (requires real keys)</span>
                </label>
              </div>
            )}
          </div>
          )}

          {!isContactMode ? (
            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 px-6 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white text-xs font-black rounded-2xl transition-all shadow-md tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Processing Checkout...
                </>
              ) : (
                <>
                  Confirm Purchase ({currencySymbol}{finalTotal.toLocaleString()})
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                window.location.href = window.location.origin.includes('localhost') ? 'http://localhost:5173/contact' : '/contact';
              }}
              className="w-full py-4 px-6 bg-slate-800 hover:bg-slate-900 text-white text-xs font-black rounded-2xl transition-all shadow-md tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer"
            >
              Contact Advisor
              <ArrowRight size={14} />
            </button>
          )}
        </form>

        {/* Right Side: Order Summary & Coupon Fields */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Coupon Code Selection */}
          {!isContactMode && (
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm text-left space-y-4">
            <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wide">
              Promo Coupon (Spin Win / Referral)
            </span>

            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Tag size={14} />
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider">{appliedCoupon}</span>
                    <span className="text-[9px] block font-semibold text-emerald-600">
                      {appliedCoupon === 'LKTRAINING25' ? '25% discount applied' : '10% discount applied'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={handleRemoveCoupon}
                  className="text-emerald-700 hover:text-emerald-950 font-black text-xs cursor-pointer select-none"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. LKTRAINING25"
                  value={couponText}
                  onChange={(e) => setCouponText(e.target.value)}
                  className="flex-1 text-xs font-bold p-2.5 border border-slate-200 rounded-xl outline-none uppercase placeholder-slate-400"
                />
                <button
                  type="submit"
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}
          </div>
          )}

          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm text-left space-y-4 sticky top-24">
            <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wide">
              Order Summary
            </span>

            {/* Course thumbnail card */}
            <div className="flex gap-4 items-center">
              <img 
                src={activeCourse.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150'} 
                alt={activeCourse.title}
                className="w-16 h-12 object-cover rounded-lg border border-slate-100 shrink-0 shadow-sm"
              />
              <div className="min-w-0">
                <span className="inline-block text-[8px] font-black text-primary bg-primary/5 border border-primary/20 px-1.5 py-0.5 rounded uppercase">
                  {activeCourse.category}
                </span>
                <h3 className="font-extrabold text-slate-800 text-xs truncate mt-0.5 leading-snug">
                  {activeCourse.title}
                </h3>
              </div>
            </div>

            {/* Price Calculations */}
            {!isContactMode ? (
              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs font-semibold text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Standard Admission</span>
                  <span>{currencySymbol}{subtotal.toLocaleString()}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Coupon Discount</span>
                    <span className="text-emerald-500 font-bold">
                      -{currencySymbol}{discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span>GST (18%)</span>
                  <span>{currencySymbol}{gst.toLocaleString()}</span>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-slate-800 font-black">
                  <span className="text-xs uppercase tracking-wide text-slate-600">Total Bill</span>
                  <span className="text-lg">
                    {currencySymbol}{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs font-semibold text-slate-500">
                <div className="flex items-center justify-between text-slate-800 font-black">
                  <span className="text-xs uppercase tracking-wide text-slate-600">Pricing</span>
                  <span className="text-sm text-primary">Custom Quote</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                  For Corporate / Group and Classroom training, we offer tailored packages. Please contact our learning advisors for a customized quote.
                </p>
              </div>
            )}

            {/* Trust Badges */}
            <div className="border-t border-slate-100 pt-4 space-y-3 select-none">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Simulated Secure Enrollment Connection</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>Immediate Dashboard course activation</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* RAZORPAY SANDBOX OVERLAY SIMULATOR MODAL */}
      {showRazorpayModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2530] text-white w-full max-w-[420px] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col text-left">
            
            {/* Header bar matching standard Razorpay branding layout */}
            <div className="bg-[#0b1219] p-4 flex items-center justify-between border-b border-slate-800 select-none">
              <div className="flex items-center gap-3">
                <img 
                  src="https://learnerskart.com/wp-content/uploads/2023/05/4545c.png" 
                  alt="LearnersKart" 
                  className="w-8 h-8 rounded bg-white p-0.5 object-contain"
                />
                <div>
                  <h4 className="font-extrabold text-xs tracking-tight">LearnersKart</h4>
                  <p className="text-[9px] font-semibold text-slate-400">Professional Training Checkout</p>
                </div>
              </div>
              
              <button 
                onClick={() => setShowRazorpayModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Amount display */}
            <div className="bg-[#131d27] py-4 px-5 flex items-center justify-between border-b border-slate-800 select-none">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Amount Payable</span>
              <span className="text-lg font-black text-[#14b8a6]">
                {currencySymbol}{finalTotal.toLocaleString()}
              </span>
            </div>

            {/* Warning Message */}
            <div className="bg-amber-500/10 border-y border-amber-500/20 px-5 py-3 flex items-start gap-2.5 select-none">
              <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-wider block">
                  Resilient Gateway Connection Bypass
                </span>
                <p className="text-[9px] font-bold text-amber-500/80 leading-normal mt-0.5">
                  Real Razorpay network scripts are offline. Using Sandbox simulator. Click Pay to enroll.
                </p>
              </div>
            </div>

            {/* Billing Prefills */}
            <div className="p-5 space-y-4 border-b border-slate-800 bg-[#17212c] select-none">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                Prefilled Contacts
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 font-semibold">
                <div className="bg-[#0b1219] p-2 rounded-lg border border-slate-800/40">
                  <span className="block text-[8px] text-slate-500 uppercase">Email</span>
                  <span className="truncate block mt-0.5">{billingEmail}</span>
                </div>
                <div className="bg-[#0b1219] p-2 rounded-lg border border-slate-800/40">
                  <span className="block text-[8px] text-slate-500 uppercase">Phone</span>
                  <span className="truncate block mt-0.5">{billingPhone}</span>
                </div>
              </div>
            </div>

            {/* Card Inputs */}
            <div className="p-5 space-y-4 flex-1">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                Enter simulated payment card
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    placeholder="4111 1111 1111 1111"
                    value={razorpayCardNo}
                    onChange={(e) => setRazorpayCardNo(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                    className="w-full text-xs font-mono font-bold p-3 border border-slate-800 bg-[#0e1720] rounded-xl outline-none focus:border-slate-600 text-white placeholder-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-1">Expiry Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={razorpayExpiry}
                      onChange={(e) => setRazorpayExpiry(e.target.value)}
                      className="w-full text-xs font-mono font-bold p-3 border border-slate-800 bg-[#0e1720] rounded-xl outline-none focus:border-slate-600 text-white placeholder-slate-600 text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-1">CVV</label>
                    <input
                      type="password"
                      required
                      placeholder="123"
                      maxLength="3"
                      value={razorpayCvv}
                      onChange={(e) => setRazorpayCvv(e.target.value)}
                      className="w-full text-xs font-mono font-bold p-3 border border-slate-800 bg-[#0e1720] rounded-xl outline-none focus:border-slate-600 text-white placeholder-slate-600 text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <div className="p-4 bg-[#0e1720] border-t border-slate-800 flex gap-3 justify-end shrink-0">
              <button 
                onClick={() => setShowRazorpayModal(false)}
                className="py-2 px-4 border border-slate-700 text-slate-300 hover:bg-[#1a2530] text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              
              <button 
                onClick={() => executeEnrollment('razorpay')}
                className="py-2 px-6 bg-primary hover:bg-primary-dark text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer"
              >
                Pay {currencySymbol}{finalTotal.toLocaleString()}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
