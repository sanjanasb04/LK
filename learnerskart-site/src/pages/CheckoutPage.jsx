import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard, ShieldCheck, CheckCircle2, ShoppingBag, ArrowRight, ArrowLeft, Info,
  Sparkles, Calendar, BookOpen, Download, Send, Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder_key_not_exposed';
const stripePromise = loadStripe(stripePublishableKey);

const StripeCheckoutForm = ({ amount, billingInfo, cartItems, courseSelections, couponCode, selectedCountry, onSuccess, onError, setLoading, loading, formatPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setLoading(true);
    setErrorMessage('');

    try {
      const itemsPayload = cartItems.map(item => ({
        courseId: item._id,
        mode: courseSelections[item._id]?.mode || 'Live Online',
        batch: courseSelections[item._id]?.batch || ''
      }));

      // 1. Create stripe payment intent on the backend
      const intentRes = await api.post('/payment/stripe-create-intent', {
          amount: amount,
          courseIds: cartItems.map(item => item._id),
          items: itemsPayload,
          couponCode,
        currency: selectedCountry.currency,
        exchangeRate: selectedCountry.rate,
      });

      if (!intentRes.data.success) {
        throw new Error(intentRes.data.message || 'Intent creation failed');
      }

      const { clientSecret, isFree } = intentRes.data;

      // Handle free courses bypass
      if (isFree) {
        // Stripe bypass verify
        const verifyRes = await api.post('/payment/stripe-verify', {
          paymentIntentId: 'stripe_free_' + Date.now(),
          courseIds: cartItems.map(item => item._id),
          items: itemsPayload,
          billingInfo,
          batchDates: cartItems.map(item => courseSelections[item._id]?.batch || ''),
          trainingMode: cartItems.map(item => courseSelections[item._id]?.mode || '').join(', '),
          couponCode,
          currency: selectedCountry.currency,
          exchangeRate: selectedCountry.rate
        });

        if (verifyRes.data.success) {
          onSuccess({ orderId: verifyRes.data.orderId, amountPaid: 0 });
        } else {
          throw new Error(verifyRes.data.message || 'Free verification failed');
        }
        return;
      }

      // Check if simulator mode is active (when stripe is dummy/unconfigured)
      if (clientSecret.startsWith('stripe_sim_secret_')) {
        // Simulated checkout success delay
        setTimeout(async () => {
          try {
            const verifyRes = await api.post('/payment/stripe-verify', {
              paymentIntentId: clientSecret,
              courseIds: cartItems.map(item => item._id),
              items: itemsPayload,
              billingInfo,
              batchDates: cartItems.map(item => courseSelections[item._id]?.batch || ''),
              trainingMode: cartItems.map(item => courseSelections[item._id]?.mode || '').join(', '),
              couponCode,
              currency: selectedCountry.currency,
              exchangeRate: selectedCountry.rate
            });

            if (verifyRes.data.success) {
              onSuccess({ orderId: verifyRes.data.orderId, amountPaid: amount });
            } else {
              throw new Error(verifyRes.data.message || 'Simulation verification failed');
            }
          } catch (err) {
            setErrorMessage(err.message || 'Payment simulation failed.');
            onError(err.message);
          } finally {
            setProcessing(false);
            setLoading(false);
          }
        }, 1500);
        return;
      }

      // 2. Real Stripe Payment Flow
      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingInfo.name,
            email: billingInfo.email,
            phone: billingInfo.phone,
            address: {
              line1: billingInfo.address || undefined,
              city: billingInfo.city || undefined,
              state: billingInfo.state || undefined,
              postal_code: billingInfo.pincode || undefined,
              country: 'IN'
            }
          }
        }
      });

      if (paymentResult.error) {
        throw new Error(paymentResult.error.message);
      }

      if (paymentResult.paymentIntent.status === 'succeeded') {
        // 3. Confirm enrollment on the server
        const verifyRes = await api.post('/payment/stripe-verify', {
          paymentIntentId: paymentResult.paymentIntent.id,
          courseIds: cartItems.map(item => item._id),
          items: itemsPayload,
          billingInfo,
          batchDates: cartItems.map(item => courseSelections[item._id]?.batch || ''),
          trainingMode: cartItems.map(item => courseSelections[item._id]?.mode || '').join(', '),
          couponCode,
          currency: selectedCountry.currency,
          exchangeRate: selectedCountry.rate
        });

        if (verifyRes.data.success) {
          onSuccess({ orderId: verifyRes.data.orderId, amountPaid: amount });
        } else {
          throw new Error(verifyRes.data.message || 'Enrollment verification failed');
        }
      } else {
        throw new Error('Payment was not completed successfully.');
      }

    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred during payment.');
      onError(err.message);
    } finally {
      setProcessing(false);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="border border-slate-200/80 p-4 rounded-xl bg-slate-50 shadow-inner">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Card Credentials</label>
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
          <CardElement options={{
            style: {
              base: {
                fontSize: '14px',
                color: '#1e293b',
                fontFamily: 'Inter, sans-serif',
                '::placeholder': {
                  color: '#94a3b8',
                },
              },
              invalid: {
                color: '#ef4444',
              },
            },
            hidePostalCode: true
          }} />
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-600 font-bold text-xs p-3 rounded-lg border border-red-100 flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing || loading}
        className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3.5 rounded-xl shadow active:scale-98 transition-all flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50"
      >
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            <span>Authorizing Card...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Pay Now {formatPrice(amount)}</span>
          </>
        )}
      </button>
    </form>
  );
};

const CheckoutPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { cartItems, couponCode, subtotal, discount, gst, finalTotal, clearCart, formatPrice, selectedCountry, calculateItemPrice, updateCartItemSelections } = useCart();
  const navigate = useNavigate();

  // Step state: 1 = Details, 2 = Payment, 3 = Confirmation
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  // Simulator States
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);
  const [simulatorOrderId, setSimulatorOrderId] = useState('');
  const [simulatorAmount, setSimulatorAmount] = useState(0);

  const [simTab, setSimTab] = useState('upi'); // 'upi', 'card', 'netbanking', 'wallet'
  const [showAdminUPIQR, setShowAdminUPIQR] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [utrError, setUtrError] = useState('');

  const handleAdminUPIVerify = () => {
    if (transactionId.length !== 12) {
      setUtrError('Please enter a valid 12-digit UPI UTR number.');
      return;
    }
    handleSimulatedSuccess('pay_utr_' + transactionId);
  };


  const handleSimulatedSuccess = async (customPaymentId) => {
    setShowSimulatorModal(false);
    setLoading(true);
    try {
      const courseIds = cartItems.map((item) => item._id);
      const itemsPayload = cartItems.map(item => ({
        courseId: item._id,
        mode: courseSelections[item._id]?.mode || 'Live Online',
        batch: courseSelections[item._id]?.batch || ''
      }));
      const verificationPayload = {
        courseIds,
        items: itemsPayload,
        billingInfo,
        batchDates: cartItems.map((item) => courseSelections[item._id]?.batch || ''),
        trainingMode: cartItems.map((item) => courseSelections[item._id]?.mode || '').join(', '),
        couponCode,
        isFree: false,
        currency: selectedCountry.currency,
        exchangeRate: selectedCountry.rate,
      };

      const verifyRes = await api.post('/payment/verify', {
        ...verificationPayload,
        razorpay_order_id: simulatorOrderId,
        razorpay_payment_id: typeof customPaymentId === 'string' ? customPaymentId : 'pay_sim_' + Date.now(),
        razorpay_signature: 'direct_payment_bypass',
      });

      if (verifyRes.data.success) {
        setOrderResult({
          orderId: verifyRes.data.orderId,
          amountPaid: simulatorAmount,
          courses: cartItems.map((c) => c.title),
        });
        clearCart();
        setStep(3);
      } else {
        alert('Simulator verification failed: ' + verifyRes.data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Simulation error occurred.');
    } finally {
      setLoading(false);
    }
  };;
  


  // Scroll to top on step or mount change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // Form States
  const [billingInfo, setBillingInfo] = useState({
    name: user?.name || 'Super Admin',
    email: user?.email || 'admin@learnerskart.com',
    phone: user?.phone || '9876543211',
    address: 'Shivabasav nagar, Haveri',
    city: 'Haveri',
    state: 'Karnataka',
    country: user?.country || 'India',
    pincode: '581110',
  });

  const [courseSelections, setCourseSelections] = useState({});

  // Sync user info
  useEffect(() => {
    if (user) {
      setBillingInfo((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country || 'India',
      }));
    }
  }, [user]);

  // Initialize course selections (mode & batch)
  useEffect(() => {
    if (cartItems.length > 0) {
      const selections = {};
      cartItems.forEach((item) => {
        const savedBatch = localStorage.getItem(`lk_batch_${item._id}`) || item.selectedBatch;
        const savedMode = localStorage.getItem(`lk_mode_${item._id}`) || item.selectedMode;
        
        // Generate default date (next Saturday)
        const nextSat = new Date();
        nextSat.setDate(nextSat.getDate() + ((6 - nextSat.getDay() + 7) % 7));
        const defaultDate = nextSat.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' (Weekend Batch)';

        const mode = savedMode || 'Live Online';
        const batch = savedBatch || defaultDate;

        selections[item._id] = { batch, mode };
        
        // Sync back to CartContext if missing
        if (item.selectedMode !== mode || item.selectedBatch !== batch) {
          updateCartItemSelections(item._id, { selectedMode: mode, selectedBatch: batch });
        }
      });
      setCourseSelections(selections);
    }
  }, [cartItems]);

  // Redirect if cart empty (and not on confirmation step)
  useEffect(() => {
    if (cartItems.length === 0 && step !== 3) {
      navigate('/cart');
    }
  }, [cartItems, step, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectionChange = (courseId, field, value) => {
    setCourseSelections((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [field]: value,
      },
    }));
    updateCartItemSelections(courseId, {
      [field === 'mode' ? 'selectedMode' : 'selectedBatch']: value
    });
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

  // Handle Details Form Submit
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  // Trigger Razorpay Payment
  const handlePayment = async () => {
    setLoading(true);
    try {
      const courseIds = cartItems.map((item) => item._id);
      const itemsPayload = cartItems.map(item => ({
        courseId: item._id,
        mode: courseSelections[item._id]?.mode || 'Live Online',
        batch: courseSelections[item._id]?.batch || ''
      }));
      
      // 1. Create order on Express backend
      const orderRes = await api.post('/payment/create-order', {
          amount: amount,
          courseIds,
          items: itemsPayload,
          couponCode,
        currency: selectedCountry.currency,
        exchangeRate: selectedCountry.rate,
      });

      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || 'Failed to create order on server');
      }

      const { isFree, orderId, amount, keyId, isSimulator, currency: orderCurrency } = orderRes.data;

      // Prepare payload for verification
      const verificationPayload = {
        courseIds,
        items: itemsPayload,
        billingInfo,
        batchDates: cartItems.map((item) => courseSelections[item._id]?.batch || ''),
        trainingMode: cartItems.map((item) => courseSelections[item._id]?.mode || '').join(', '), // or average
        couponCode,
        isFree,
        currency: selectedCountry.currency,
        exchangeRate: selectedCountry.rate,
      };

      // Case A: Free course bypass
      if (isFree) {
        const verifyRes = await api.post('/payment/verify', {
          ...verificationPayload,
          razorpay_order_id: orderId,
        });

        if (verifyRes.data.success) {
          setOrderResult({
            orderId: verifyRes.data.orderId,
            amountPaid: 0,
            courses: cartItems.map((c) => c.title),
          });
          clearCart();
          setStep(3);
        }
        setLoading(false);
        return;
      }

      // Case B: Simulator Mode
      if (keyId === 'rzp_test_simulator' || isSimulator) {
        setSimulatorOrderId(orderId);
        setSimulatorAmount(amount);
        setShowSimulatorModal(true);
        setLoading(false);
        return;
      }

      // Case C: Real Razorpay Gateway Integration
      const isSDKLoaded = await loadRazorpaySDK();
      if (!isSDKLoaded) {
        alert('Failed to load Razorpay SDK. Check your internet connection.');
        setLoading(false);
        return;
      }

      const activeKey = keyId;
      const isDirectPayment = false;

      const options = {
        key: activeKey,
        amount: Math.round(amount * 100),
        currency: orderCurrency || 'INR',
        name: 'LearnersKart',
        description: 'Professional Certification Training',
        image: 'https://learnerskart.com/wp-content/uploads/2023/05/4545c.png',
        // Omit order_id in direct/mock key mode to prevent Razorpay validation errors
        ...(!isDirectPayment && { order_id: orderId }),
        handler: async function (response) {
          setLoading(true);
          try {
            const verifyRes = await api.post('/payment/verify', {
              ...verificationPayload,
              razorpay_order_id: response.razorpay_order_id || orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature || 'direct_payment_bypass',
            });

            if (verifyRes.data.success) {
              setOrderResult({
                orderId: verifyRes.data.orderId,
                amountPaid: amount,
                courses: cartItems.map((c) => c.title),
              });
              clearCart();
              setStep(3);
            }
          } catch (err) {
            alert('Payment verification failed: ' + (err.response?.data?.message || err.message));
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: billingInfo.name,
          email: billingInfo.email,
          contact: billingInfo.phone,
        },
        theme: {
          color: '#098ce9',
        },
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();
      setLoading(false);
    } catch (error) {
      console.error('Checkout Error:', error);
      alert('An error occurred while processing checkout: ' + error.message);
      setLoading(false);
    }
  };

  // Simulated Invoice download
  const handleDownloadInvoice = () => {
    if (!orderResult) return;
    
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert('Please allow popups to print/download the invoice.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${orderResult.orderId}</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 40px;
            font-size: 14px;
            line-height: 1.6;
          }
          .invoice-card {
            max-width: 800px;
            margin: auto;
            border: 1px solid #eee;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #098ce9;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: 800;
            color: #098ce9;
          }
          .logo span {
            color: #f6b40a;
          }
          .title {
            text-align: right;
          }
          .title h1 {
            margin: 0;
            color: #098ce9;
            font-size: 28px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .meta-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 20px;
            margin-bottom: 40px;
          }
          .meta-box h3 {
            margin-top: 0;
            color: #098ce9;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
          }
          .meta-box p {
            margin: 5px 0;
            font-size: 13px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th {
            background-color: #098ce9;
            color: white;
            text-align: left;
            padding: 12px;
            font-size: 12px;
            text-transform: uppercase;
            font-weight: bold;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #eee;
            font-size: 13px;
          }
          .totals {
            width: 50%;
            margin-left: auto;
            margin-bottom: 40px;
          }
          .totals table {
            margin-bottom: 0;
          }
          .totals td {
            border-bottom: none;
            padding: 8px 12px;
          }
          .totals tr.final-row td {
            border-top: 2px solid #098ce9;
            font-size: 16px;
            font-weight: 800;
            color: #098ce9;
          }
          .footer {
            text-align: center;
            font-size: 11px;
            color: #888;
            border-top: 1px solid #eee;
            padding-top: 20px;
            margin-top: 40px;
          }
          @media print {
            body {
              padding: 0;
            }
            .invoice-card {
              border: none;
              box-shadow: none;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-card">
          <div class="header">
            <div class="logo">Learners<span>Kart</span></div>
            <div class="title">
              <h1>Invoice</h1>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #888;">Order ID: ${orderResult.orderId}</p>
            </div>
          </div>

          <div class="meta-grid">
            <div class="meta-box">
              <h3>Billed To</h3>
              <p><strong>Name:</strong> ${billingInfo.name || 'Customer'}</p>
              <p><strong>Email:</strong> ${billingInfo.email || 'N/A'}</p>
              <p><strong>Phone:</strong> ${billingInfo.phone || 'N/A'}</p>
              ${billingInfo.address ? `
                <p><strong>Address:</strong> ${billingInfo.address}, ${billingInfo.city}, ${billingInfo.state}, ${billingInfo.country} - ${billingInfo.pincode}</p>
              ` : ''}
            </div>
            <div class="meta-box" style="text-align: right;">
              <h3>Invoice Details</h3>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
              <p><strong>Payment Status:</strong> <span style="color: green; font-weight: bold;">Paid</span></p>
              <p><strong>Transaction ID:</strong> ${orderResult.orderId}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Certification Course Description</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${orderResult.courses.map(title => `
                <tr>
                  <td><strong>${title || 'Certification Training Program'}</strong><br><span style="font-size: 11px; color: #666;">Professional Cohort Training & Accreditation</span></td>
                  <td style="text-align: right;">${formatPrice(subtotal / orderResult.courses.length)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <table>
              <tr>
                <td>Subtotal:</td>
                 <td style="text-align: right;">${formatPrice(subtotal)}</td>
              </tr>
              ${discount > 0 ? `
                <tr>
                  <td style="color: green;">Coupon Discount:</td>
                   <td style="text-align: right; color: green;">-${formatPrice(discount)}</td>
                </tr>
              ` : ''}
              <tr>
                <td>GST (18%):</td>
                 <td style="text-align: right;">${formatPrice(gst)}</td>
              </tr>
              <tr class="final-row">
                <td>Total Amount Paid:</td>
                 <td style="text-align: right;">${formatPrice(orderResult.amountPaid)}</td>
              </tr>
            </table>
          </div>

          <div class="footer">
            <p>Thank you for choosing LearnersKart! Learn, Certify, and Lead with Confidence.</p>
            <p style="color: #bbb; margin-top: 5px;">This is a system-generated document. No signature required.</p>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Tracker */}
        <div className="max-w-xl mx-auto mb-12 select-none">
          <div className="flex items-center justify-between relative text-xs font-extrabold text-textmuted uppercase tracking-wider">
            {/* Line connector */}
            <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-200 -z-10">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(step - 1) * 50}%` }}
              ></div>
            </div>

            {/* Step 1 */}
            <div className="flex flex-col items-center gap-1.5 bg-slate-50 px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${
                step >= 1 ? 'bg-primary text-white border-primary' : 'bg-white border-slate-300'
              }`}>
                1
              </div>
              <span className={step >= 1 ? 'text-primary' : ''}>Details</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-1.5 bg-slate-50 px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${
                step >= 2 ? 'bg-primary text-white border-primary' : 'bg-white border-slate-300'
              }`}>
                2
              </div>
              <span className={step >= 2 ? 'text-primary' : ''}>Payment</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-1.5 bg-slate-50 px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${
                step >= 3 ? 'bg-primary text-white border-primary' : 'bg-white border-slate-300'
              }`}>
                3
              </div>
              <span className={step >= 3 ? 'text-primary' : ''}>Confirmation</span>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL (8 COLS): Form Content */}
          <div className="lg:col-span-8">
            
            {/* STEP 1: DETAILS */}
            {step === 1 && (
              <form onSubmit={handleDetailsSubmit} className="bg-white border border-slate-100 shadow-md rounded-xl p-6 sm:p-8 space-y-6 animate-fade-in">
                <h3 className="font-extrabold text-base text-textdark border-b border-slate-100 pb-3 uppercase tracking-wider">
                  Billing Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={billingInfo.name}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={billingInfo.email}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={billingInfo.phone}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary"
                    />
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 uppercase tracking-wider mb-2">Billing Address</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={billingInfo.address}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-slate-500 uppercase tracking-wider mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={billingInfo.city}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-slate-500 uppercase tracking-wider mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={billingInfo.state}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-slate-500 uppercase tracking-wider mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      required
                      value={billingInfo.country}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary"
                    />
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-slate-500 uppercase tracking-wider mb-2">Postal Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={billingInfo.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg outline-none focus:bg-white focus:border-primary"
                    />
                  </div>
                </div>

                {/* Course configuration fields (modes/dates) */}
                <div className="border-t border-slate-100 pt-5 space-y-4 text-xs">
                  <h4 className="font-extrabold text-sm text-textdark uppercase tracking-wider mb-3">Configure Classes</h4>
                  {cartItems.map((item) => {
                    const selections = courseSelections[item._id] || {};
                    return (
                      <div key={item._id} className="bg-slate-50 border border-slate-100 rounded-xl p-4.5 space-y-3">
                        <p className="font-bold text-slate-800 line-clamp-1">{item.title}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1.5">
                          {/* Training Mode */}
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Training Format</label>
                            <select
                              value={selections.mode || 'Live Online'}
                              onChange={(e) => handleSelectionChange(item._id, 'mode', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 font-bold text-slate-700"
                            >
                              <option value="Live Online">Live Online</option>
                              <option value="Classroom">Classroom</option>
                              <option value="E-Learning">Training + Exam Prep</option>
                              <option value="Self Study">Self Study</option>
                            </select>
                          </div>
                          {/* Batch selection */}
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Preferred Batch</label>
                            <select
                              value={selections.batch || ''}
                              onChange={(e) => handleSelectionChange(item._id, 'batch', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 font-bold text-slate-700"
                            >
                              <option value={selections.batch}>{selections.batch}</option>
                              <option value="Flexible Schedule (To be decided)">Flexible / Call me to decide</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 pt-6 flex justify-between items-center mt-6">
                  <Link to="/cart" className="text-slate-400 hover:text-primary font-bold flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Cart
                  </Link>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-white font-bold px-7 py-3 rounded-lg shadow flex items-center gap-2"
                  >
                    Proceed to Payment
                    <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: PAYMENT */}
            {step === 2 && (
              <div className="bg-white border border-slate-100 shadow-md rounded-xl p-6 sm:p-8 space-y-6 animate-fade-in text-left">
                <h3 className="font-extrabold text-base text-textdark border-b border-slate-100 pb-3 uppercase tracking-wider">
                  Payment Verification
                </h3>

                {/* Secure warning box */}
                <div className="bg-emerald-50/50 border border-emerald-100 text-emerald-800 p-4 rounded-xl flex gap-3 text-xs leading-relaxed">
                  <ShieldCheck className="w-6 h-6 text-success flex-shrink-0" />
                  <div>
                    <p className="font-bold">Secure SSL Transaction</p>
                    <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">
                      Your checkout session is fully encrypted and secured. Clicking the payment button will trigger the secure Razorpay payment gateway widget.
                    </p>
                  </div>
                </div>



                {/* Billing Summary Box */}
                <div className="border border-slate-100 rounded-xl p-4.5 text-xs bg-slate-50 font-semibold space-y-1">
                  <p className="font-bold text-slate-700 uppercase tracking-wide mb-1 text-[10px]">Billing Invoice Info:</p>
                  <p>Name: <span className="text-slate-600 font-medium">{billingInfo.name}</span></p>
                  <p>Email: <span className="text-slate-600 font-medium">{billingInfo.email}</span></p>
                  <p>Phone: <span className="text-slate-600 font-medium">{billingInfo.phone}</span></p>
                  <p>Address: <span className="text-slate-600 font-medium">{billingInfo.address}, {billingInfo.city}, {billingInfo.state} {billingInfo.pincode}</span></p>
                </div>

                {/* Stripe Elements Integration */}
                <div className="border border-slate-100 rounded-xl p-5 bg-white shadow-sm space-y-4">
                  <h4 className="font-extrabold text-xs text-textdark uppercase tracking-wider border-b border-slate-100 pb-2">
                    💳 Pay Securely via Credit / Debit Card (Stripe)
                  </h4>
                  <Elements stripe={stripePromise}>
                    <StripeCheckoutForm
                      amount={finalTotal}
                      billingInfo={billingInfo}
                      cartItems={cartItems}
                      courseSelections={courseSelections}
                      couponCode={couponCode}
                      selectedCountry={selectedCountry}
                      onSuccess={(result) => {
                        setOrderResult({
                          orderId: result.orderId,
                          amountPaid: result.amountPaid,
                          courses: cartItems.map((c) => c.title),
                        });
                        clearCart();
                        setStep(3);
                      }}
                      onError={(err) => {
                        console.error('Stripe Payment Error:', err);
                      }}
                      setLoading={setLoading}
                      loading={loading}
                      formatPrice={formatPrice}
                    />
                  </Elements>
                </div>

                <div className="text-center py-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">— OR —</span>
                </div>

                {/* Legacy Simulator / Alternative Method */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-left">
                  <div>
                    <p className="font-bold text-slate-700">Alternative Payment (Simulator / UPI)</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Use custom simulator modal or local UPI QR scanning method.</p>
                  </div>
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="bg-primary hover:bg-primary-dark text-white font-extrabold px-5 py-2.5 rounded-lg active:scale-97 shadow-sm transition-all uppercase text-[10px] tracking-wider disabled:opacity-50"
                  >
                    Open Simulator / UPI Options
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-6 flex justify-between items-center mt-6">
                  <button
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="text-slate-400 hover:text-primary font-bold flex items-center gap-1 disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Details
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CONFIRMATION */}
            {step === 3 && orderResult && (
              <div className="bg-white border border-slate-100 shadow-xl rounded-2xl p-8 sm:p-12 text-center space-y-6 animate-fade-in">
                
                {/* Success Circle Icon */}
                <div className="bg-emerald-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-inner border border-emerald-100 animate-pulse">
                  <CheckCircle2 className="w-11 h-11 text-success" />
                </div>

                {/* Success Title */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-primary leading-tight">Payment Successful!</h2>
                  <p className="text-xs sm:text-sm text-textmuted mt-1.5 font-semibold">
                    Thank you for your purchase. Your enrollment is confirmed!
                  </p>
                </div>

                {/* Order Details */}
                <div className="max-w-md mx-auto bg-slate-50 border border-slate-100 rounded-xl p-5 text-left text-xs space-y-2.5 font-semibold">
                  <div className="flex justify-between border-b border-slate-200/50 pb-2 mb-2">
                    <span className="text-slate-400">Order ID:</span>
                    <span className="text-textdark font-bold truncate select-all">{orderResult.orderId}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2 mb-2">
                    <span className="text-slate-400">Courses Enrolled:</span>
                    <span className="text-textdark font-bold text-right leading-tight max-w-[200px]">{orderResult.courses.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Amount Paid:</span>
                     <span className="text-primary font-black text-sm">{formatPrice(orderResult.amountPaid)}</span>
                  </div>
                </div>

                {/* Email warning */}
                <div className="max-w-md mx-auto flex gap-2 text-[11px] text-textmuted leading-relaxed font-medium justify-center items-start">
                  <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-left">
                    A secure digital invoice and confirmation email have been dispatched to <strong>{billingInfo.email}</strong>. Please check your inbox or spam folder.
                  </p>
                </div>

                {/* Action CTA */}
                <div className="pt-6 flex flex-wrap gap-4 justify-center items-center">
                  <Link
                    to="/dashboard/courses"
                    className="bg-primary hover:bg-primary-dark text-white font-bold px-7 py-3 rounded-lg text-sm shadow-md transition-all active:scale-98"
                  >
                    Go to My Dashboard
                  </Link>
                  <button
                    onClick={handleDownloadInvoice}
                    className="bg-white hover:bg-slate-50 text-textdark border border-slate-200 font-bold px-6 py-3 rounded-lg text-xs shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* RIGHT PANEL (4 COLS): Order Summary Sidebar */}
          {step !== 3 && (
            <div className="lg:col-span-4 bg-white border border-slate-100 shadow-md rounded-xl p-5 sm:p-6 space-y-4">
              <h4 className="font-extrabold text-xs sm:text-sm text-textdark uppercase tracking-wider border-b border-slate-100 pb-2">
                Order Summary
              </h4>

              {/* Items checklist */}
              <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-3 items-center text-left">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-11 h-11 rounded-lg object-cover bg-slate-100 flex-shrink-0 border"
                      loading="lazy"
                    />
                    <div className="space-y-0.5 text-xs font-semibold">
                      <p className="text-textdark line-clamp-1 leading-tight">{item.title}</p>
                      <p className="text-[9px] text-textmuted leading-none">
                        Format: {item.selectedMode === 'E-Learning' ? 'Training + Exam Prep' : (item.selectedMode || 'Live Online')}
                      </p>
                      <p className="text-[10px] text-textmuted">{formatPrice(calculateItemPrice(item))}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="border-t border-slate-100 pt-3 space-y-2.5 text-xs sm:text-sm text-slate-600 font-semibold">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-textdark">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount:</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span className="text-textdark">{formatPrice(gst)}</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between font-black text-primary text-base">
                  <span>Total Amount:</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="border-t border-slate-100 pt-4 flex gap-2 text-[10px] text-textmuted leading-tight font-medium text-left">
                <ShieldCheck className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p>
                  Secure gateway powered by <strong>Razorpay</strong>. Fully accredited SSL encryption guarantees transaction protection.
                </p>
              </div>
            </div>
          )}

      {/* MOCK PAYMENT SIMULATOR MODAL */}
      {showSimulatorModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in text-left">
          <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl max-w-lg w-full overflow-hidden flex flex-col relative transform scale-100 transition-all duration-300">
            
            {/* Header banner */}
            <div className="bg-primary p-6 text-white flex justify-between items-center">
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm uppercase tracking-wider">LearnersKart Secure Payment</h4>
                <p className="text-[10px] text-white/80 font-bold uppercase">Dev Sandbox Simulator</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/70 font-semibold uppercase">Total Amount</p>
                <p className="font-black text-lg">{formatPrice(simulatorAmount)}</p>
              </div>
            </div>

            {/* Main Area: Sidebar + Option details */}
            <div className="flex flex-col sm:flex-row min-h-[360px] bg-slate-50">
              
              {/* Left Column: Payment Mode Tabs */}
              <div className="w-full sm:w-2/5 border-r border-slate-100 bg-white flex flex-row sm:flex-col text-[11px] font-extrabold text-slate-500 uppercase tracking-wider select-none">
                <button
                  type="button"
                  onClick={() => setSimTab('upi')}
                  className={`flex-grow sm:flex-grow-0 text-left px-5 py-4 border-b sm:border-b-0 border-r sm:border-r-4 ${
                    simTab === 'upi' ? 'bg-primary/5 text-primary border-primary' : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  ⚡ UPI / QR
                </button>
                <button
                  type="button"
                  onClick={() => setSimTab('card')}
                  className={`flex-grow sm:flex-grow-0 text-left px-5 py-4 border-b sm:border-b-0 border-r sm:border-r-4 ${
                    simTab === 'card' ? 'bg-primary/5 text-primary border-primary' : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  💳 Credit/Debit Card
                </button>
                <button
                  type="button"
                  onClick={() => setSimTab('netbanking')}
                  className={`flex-grow sm:flex-grow-0 text-left px-5 py-4 border-b sm:border-b-0 border-r sm:border-r-4 ${
                    simTab === 'netbanking' ? 'bg-primary/5 text-primary border-primary' : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  🏛️ Net Banking
                </button>
                <button
                  type="button"
                  onClick={() => setSimTab('wallet')}
                  className={`flex-grow sm:flex-grow-0 text-left px-5 py-4 border-b sm:border-b-0 border-r sm:border-r-4 ${
                    simTab === 'wallet' ? 'bg-primary/5 text-primary border-primary' : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  👛 Wallets
                </button>
              </div>

              {/* Right Column: Option Panel Content */}
              <div className="w-full sm:w-3/5 p-6 flex flex-col justify-between min-h-[300px]">
                
                <div className="space-y-4">
                  {simTab === 'upi' && (
                    <div className="space-y-4 animate-fade-in">
                      {!showAdminUPIQR ? (
                        <>
                          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Popular UPI Apps:</p>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => { setSelectedUpiApp('Google Pay'); setShowAdminUPIQR(true); }}
                              className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-sm transition-all"
                            >
                              <span className="font-extrabold text-xs tracking-tight text-emerald-600">G</span>
                              <span className="font-extrabold text-xs tracking-tight text-red-500">Pay</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => { setSelectedUpiApp('PhonePe'); setShowAdminUPIQR(true); }}
                              className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-sm transition-all"
                            >
                              <span className="font-extrabold text-xs tracking-tight text-indigo-700">PhonePe</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => { setSelectedUpiApp('Paytm'); setShowAdminUPIQR(true); }}
                              className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-sm transition-all"
                            >
                              <span className="font-extrabold text-xs tracking-tight text-sky-500">Paytm</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => { setSelectedUpiApp('BHIM UPI'); setShowAdminUPIQR(true); }}
                              className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-sm transition-all"
                            >
                              <span className="font-extrabold text-[10px] tracking-tight text-slate-700">BHIM UPI</span>
                            </button>
                          </div>

                          <div className="space-y-1.5 pt-2">
                            <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Or enter UPI ID</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="success@upi"
                                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs flex-grow outline-none focus:border-primary font-bold text-slate-700"
                              />
                              <button
                                type="button"
                                onClick={() => handleSimulatedSuccess()}
                                className="bg-primary hover:bg-primary-dark text-white font-extrabold px-4 py-2 rounded-lg text-xs"
                              >
                                Verify & Pay
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-3.5 animate-fade-in text-xs">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                            <p className="font-extrabold text-[10px] text-primary uppercase tracking-wide">Scan & Pay via {selectedUpiApp}</p>
                            <button
                              type="button"
                              onClick={() => setShowAdminUPIQR(false)}
                              className="text-[10px] font-extrabold text-slate-400 hover:text-slate-600 uppercase"
                            >
                              &larr; Back
                            </button>
                          </div>

                          <div className="bg-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center border border-slate-200/50 shadow-inner">
                            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100">
                              <svg className="w-28 h-28" viewBox="0 0 100 100">
                                <rect x="5" y="5" width="20" height="20" fill="#0f172a" />
                                <rect x="9" y="9" width="12" height="12" fill="white" />
                                <rect x="12" y="12" width="6" height="6" fill="#0f172a" />

                                <rect x="75" y="5" width="20" height="20" fill="#0f172a" />
                                <rect x="79" y="9" width="12" height="12" fill="white" />
                                <rect x="82" y="12" width="6" height="6" fill="#0f172a" />

                                <rect x="5" y="75" width="20" height="20" fill="#0f172a" />
                                <rect x="9" y="79" width="12" height="12" fill="white" />
                                <rect x="12" y="82" width="6" height="6" fill="#0f172a" />

                                <rect x="35" y="5" width="8" height="4" fill="#0f172a" />
                                <rect x="55" y="5" width="4" height="8" fill="#0f172a" />
                                <rect x="35" y="25" width="4" height="4" fill="#0f172a" />
                                <rect x="45" y="15" width="8" height="4" fill="#0f172a" />
                                <rect x="65" y="25" width="4" height="8" fill="#0f172a" />
                                <rect x="5" y="45" width="4" height="4" fill="#0f172a" />
                                <rect x="15" y="55" width="8" height="4" fill="#0f172a" />
                                <rect x="25" y="45" width="4" height="8" fill="#0f172a" />
                                
                                <rect x="35" y="45" width="12" height="12" fill="#0f172a" />
                                <rect x="55" y="45" width="8" height="4" fill="#0f172a" />
                                <rect x="65" y="55" width="4" height="8" fill="#0f172a" />
                                
                                <rect x="35" y="75" width="8" height="8" fill="#0f172a" />
                                <rect x="55" y="75" width="4" height="4" fill="#0f172a" />
                                <rect x="65" y="85" width="8" height="4" fill="#0f172a" />

                                <rect x="38" y="38" width="24" height="24" rx="4" fill="white" />
                                <text x="50" y="52" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#0a3d91">LK</text>
                              </svg>
                            </div>
                            <p className="text-[10px] text-slate-500 font-extrabold mt-2 tracking-wide uppercase">Scan to Pay via UPI App</p>
                          </div>

                          <div className="bg-white border border-slate-200/60 p-3 rounded-xl flex items-center justify-between shadow-sm">
                            <div>
                              <p className="text-[9px] text-slate-400 font-extrabold uppercase leading-none">Admin UPI ID</p>
                              <p className="text-xs font-bold text-slate-700 mt-1">info@learnerskart</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText('info@learnerskart');
                                alert('UPI ID copied to clipboard!');
                              }}
                              className="text-[10px] font-extrabold text-accent hover:underline uppercase"
                            >
                              Copy ID
                            </button>
                          </div>

                          <div className="space-y-1.5 pt-1 text-slate-600">
                            <label className="block text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">Enter UPI UTR / Ref No. (12 Digits)</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                maxLength={12}
                                placeholder="e.g. 324589012345"
                                value={transactionId}
                                onChange={(e) => {
                                  setTransactionId(e.target.value.replace(/\D/g, ''));
                                  setUtrError('');
                                }}
                                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs flex-grow outline-none focus:border-primary font-bold text-slate-700 tracking-widest"
                              />
                              <button
                                type="button"
                                onClick={handleAdminUPIVerify}
                                className="bg-primary hover:bg-primary-dark text-white font-extrabold px-4 py-2 rounded-lg text-xs"
                              >
                                Submit
                              </button>
                            </div>
                            {utrError && <p className="text-[10px] text-red-500 font-bold leading-none">{utrError}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {simTab === 'card' && (
                    <div className="space-y-3.5 animate-fade-in text-xs font-semibold text-slate-500">
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Enter Card Details:</p>
                      
                      <div className="space-y-1.5">
                        <label className="block text-[9px] uppercase tracking-wide">Card Number</label>
                        <input
                          type="text"
                          defaultValue="4111 2222 3333 4444"
                          placeholder="4111 2222 3333 4444"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 outline-none focus:border-primary font-bold text-slate-700 tracking-wider"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="block text-[9px] uppercase tracking-wide">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            defaultValue="12/29"
                            placeholder="MM/YY"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 outline-none focus:border-primary font-bold text-slate-700"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[9px] uppercase tracking-wide">CVV</label>
                          <input
                            type="password"
                            defaultValue="123"
                            placeholder="123"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 outline-none focus:border-primary font-bold text-slate-700"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleSimulatedSuccess}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3 rounded-lg text-xs mt-2 transition-all shadow"
                      >
                        Pay {formatPrice(simulatorAmount)}
                      </button>
                    </div>
                  )}

                  {simTab === 'netbanking' && (
                    <div className="space-y-4 animate-fade-in text-xs font-semibold text-slate-500">
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Popular Banks:</p>
                      
                      <div className="grid grid-cols-2 gap-2.5">
                        {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map((bank) => (
                          <button
                            type="button"
                            key={bank}
                            onClick={handleSimulatedSuccess}
                            className="p-3 bg-white border border-slate-200 rounded-xl hover:border-primary text-center font-bold text-slate-700 text-[11px] truncate"
                          >
                            {bank}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Or select another bank</label>
                        <select
                          onChange={handleSimulatedSuccess}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-primary font-bold text-slate-700"
                        >
                          <option value="">Choose Bank...</option>
                          <option value="sbi">Kotak Mahindra Bank</option>
                          <option value="hdfc">IndusInd Bank</option>
                          <option value="icici">Yes Bank</option>
                          <option value="axis">Punjab National Bank</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {simTab === 'wallet' && (
                    <div className="space-y-4 animate-fade-in text-xs font-semibold text-slate-500">
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Linked Wallets:</p>
                      
                      <div className="space-y-2.5">
                        {['Paytm Wallet', 'PhonePe Wallet', 'Amazon Pay'].map((wallet) => (
                          <button
                            type="button"
                            key={wallet}
                            onClick={handleSimulatedSuccess}
                            className="w-full p-3.5 bg-white border border-slate-200 rounded-xl hover:border-primary flex items-center justify-between px-4 font-bold text-slate-700"
                          >
                            <span>{wallet}</span>
                            <span className="text-[10px] text-primary">Link & Pay ➜</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Cancel footer */}
                <div className="pt-4 border-t border-slate-200/50 mt-4 flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide">🔒 256-Bit SSL Encrypted</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSimulatorModal(false);
                      setLoading(false);
                    }}
                    className="text-slate-400 hover:text-slate-600 font-bold text-xs"
                  >
                    Cancel Payment
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
