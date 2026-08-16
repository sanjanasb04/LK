import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight, ArrowLeft, ShieldCheck, Tag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const {
    cartItems,
    couponCode,
    subtotal,
    discount,
    gst,
    finalTotal,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    formatPrice,
    calculateItemPrice,
  } = useCart();
  const { user } = useAuth();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  // Empty State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20 px-6 text-center select-none">
        <div className="bg-white border border-slate-100 rounded-2xl p-8 sm:p-12 shadow-md max-w-md w-full">
          <div className="bg-primary/5 p-4.5 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-extrabold text-xl sm:text-2xl text-textdark">Your Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-textmuted mt-2.5 leading-relaxed">
            Looks like you haven't added any certification programs to your shopping cart yet. Start exploring and choose a track to level up your career!
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold px-7 py-3 rounded-lg mt-8 text-sm shadow-md transition-all active:scale-98"
          >
            Browse Courses
            <ArrowRight className="w-4.5 h-4.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8 border-b border-slate-200/60 pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-textdark">Shopping Cart</h1>
          <p className="text-xs text-textmuted mt-1 font-semibold">
            Review your selected certification courses before proceeding to checkout.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 8 COLS: Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden">
              <div className="divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div key={item._id} className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                    
                    {/* Course Thumbnail & Details */}
                    <div className="flex gap-4 items-center">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover bg-slate-100 flex-shrink-0 border border-slate-100"
                        loading="lazy"
                      />
                      <div className="space-y-1">
                        <span className="bg-primary/5 text-primary text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-sm sm:text-base text-textdark leading-tight line-clamp-1 hover:text-primary transition-colors">
                          <Link to={`/${item.slug}`}>{item.title}</Link>
                        </h4>
                        <p className="text-[11px] text-textmuted font-semibold">Level: {item.level}</p>
                        <p className="text-[11px] text-slate-500 font-semibold">
                          Format: <span className="font-extrabold text-slate-700">{item.selectedMode === 'E-Learning' ? 'Training + Exam Prep' : (item.selectedMode || 'Live Online')}</span>
                        </p>
                      </div>
                    </div>

                    {/* Price and Remove Button */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                      <div className="text-right">
                        <p className="font-extrabold text-base text-primary">{formatPrice(calculateItemPrice(item))}</p>
                        {(!item.isFree && item.price > 0) && (
                          <p className="text-[10px] text-slate-400 line-through">
                            {formatPrice(
                              item.selectedMode === 'E-Learning'
                                ? Math.round((item.originalPrice || Math.round(item.price * 1.3)) * 0.5)
                                : item.selectedMode === 'Self Study'
                                ? Math.round((item.originalPrice || Math.round(item.price * 1.3)) * 0.4)
                                : item.selectedMode === 'Classroom'
                                ? Math.round((item.originalPrice || Math.round(item.price * 1.3)) * 1.2)
                                : (item.originalPrice || Math.round(item.price * 1.3))
                            )}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold self-end sm:self-auto"
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sm:hidden">Remove</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Back CTA */}
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 font-bold text-slate-500 hover:text-primary transition-colors text-xs py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* RIGHT 4 COLS: Order Summary */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Summary card */}
            <div className="bg-white border border-slate-100 shadow-lg rounded-2xl p-6 space-y-5">
              <h3 className="font-extrabold text-sm sm:text-base text-textdark border-b border-slate-100 pb-3 uppercase tracking-wider">
                Order Summary
              </h3>

              {/* Price Details */}
              <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 font-semibold">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} course{cartItems.length > 1 ? 's' : ''}):</span>
                  <span className="text-textdark">{formatPrice(subtotal)}</span>
                </div>

                {/* Coupon discount row */}
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4 fill-emerald-50 text-success" />
                      Discount (10% OFF):
                    </span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span className="text-textdark">{formatPrice(gst)}</span>
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-between items-baseline text-base font-black text-primary">
                  <span>Total Amount:</span>
                  <span className="text-xl">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Coupon inputs */}
              <div className="border-t border-slate-100 pt-4 space-y-2.5">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-xs font-bold text-success">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4 fill-emerald-50" />
                      <span>Code: {couponCode}</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-500 hover:text-red-600 hover:bg-white p-1 rounded-full shadow-sm"
                      title="Remove Coupon"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary px-3 py-2 rounded-lg outline-none text-xs font-semibold flex-grow uppercase"
                    />
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-4 py-2 rounded-lg shadow"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[10px] text-red-500 font-semibold">{couponError}</p>
                )}
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 text-sm sm:text-base flex items-center justify-center gap-2 mt-4"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Accepted Payments Trust badge */}
            <div className="bg-slate-100 border border-slate-200/50 rounded-xl p-4 text-center space-y-2.5">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Accepted Secure Payments:
              </p>
              {/* Payment simulation graphics / text */}
              <div className="flex flex-wrap items-center justify-center gap-3.5 text-[10px] font-bold text-slate-500">
                <span className="bg-white border border-slate-200 px-2 py-1 rounded shadow-sm">💳 Cards</span>
                <span className="bg-white border border-slate-200 px-2 py-1 rounded shadow-sm">📱 UPI</span>
                <span className="bg-white border border-slate-200 px-2 py-1 rounded shadow-sm">🏦 Netbanking</span>
                <span className="bg-white border border-slate-200 px-2 py-1 rounded shadow-sm">💳 Razorpay</span>
              </div>
              <p className="text-[9px] text-slate-400 leading-none">
                🔒 All transactions are secured by Razorpay SSL.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CartPage;
