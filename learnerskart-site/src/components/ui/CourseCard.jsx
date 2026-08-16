import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Clock, ArrowRight, ShoppingBag } from 'lucide-react';
import StarRating from './StarRating';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const parseBatchStartDate = (dateStr) => {
  if (!dateStr) return new Date(0);
  try {
    const yearMatch = dateStr.match(/\b(202\d)\b/);
    const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
    
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const words = dateStr.toLowerCase().split(/[\s,\-\&]+/);
    let monthIndex = -1;
    let day = 1;
    
    for (let word of words) {
      const mIdx = monthNames.findIndex(m => word.startsWith(m));
      if (mIdx !== -1) {
        monthIndex = mIdx;
        break;
      }
    }
    
    if (monthIndex === -1) return new Date(0);
    
    const dayMatch = dateStr.match(/\b\d+\b/);
    if (dayMatch) {
      day = parseInt(dayMatch[0]);
    }
    
    return new Date(year, monthIndex, day);
  } catch (e) {
    console.error('Error parsing batch date:', e);
    return new Date(0);
  }
};

const CourseCard = ({ course, schedules }) => {
  const { user } = useAuth();
  const { addToCart, cartItems, formatPrice, getCalculatedPricing, selectedCountry } = useCart();
  
  const countryCode = selectedCountry?.code || 'IN';
  const customPriceVal = getCalculatedPricing(course._id, 'Live Online', countryCode, false);
  const customOriginalPriceVal = getCalculatedPricing(course._id, 'Live Online', countryCode, true);

  const displayedPrice = customPriceVal !== null 
    ? customPriceVal 
    : (nextBatch && nextBatch.weekday ? Math.round(course.price * 0.8) : course.price);

  const displayedOriginalPrice = customOriginalPriceVal !== null
    ? customOriginalPriceVal
    : (nextBatch && nextBatch.weekday ? course.price : course.originalPrice);

  const isAlreadyInCart = cartItems.some(item => item._id === course._id);

  // Find next upcoming batch date (ignoring past dates)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureSchedules = (schedules || []).filter(batch => {
    const batchStart = parseBatchStartDate(batch.date);
    return batchStart >= today;
  });

  const sortedSchedules = [...futureSchedules].sort((a, b) => {
    if (a.month !== b.month) return a.month - b.month;
    if (a.weekday && !b.weekday) return -1;
    if (!a.weekday && b.weekday) return 1;
    return 0;
  });

  // Fallback: If all batches in DB are in the past, show all batches sorted
  const activeSchedules = sortedSchedules.length > 0 
    ? sortedSchedules 
    : [...(schedules || [])].sort((a, b) => {
        if (a.month !== b.month) return a.month - b.month;
        if (a.weekday && !b.weekday) return -1;
        if (!a.weekday && b.weekday) return 1;
        return 0;
      });

  const nextBatch = activeSchedules[0];

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const batchLabel = nextBatch ? `${nextBatch.date} (${nextBatch.weekday ? 'weekday batch' : 'weekend batch'})` : '';
    addToCart(course, 'Live Online', batchLabel);
    window.location.href = '/checkout';
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Expert':
        return 'bg-rose-50 text-rose-600 border border-rose-100';
      default:
        return 'bg-blue-50 text-primary border border-blue-100';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full group select-none">
      {/* Thumbnail */}
      <Link to={`/${course.slug}`} className="relative block overflow-hidden rounded-t-xl bg-slate-100 aspect-[3/2] hover-zoom">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
          alt={course.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow text-left">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <StarRating rating={course.rating || 4.8} size={14} />
          <span className="text-xs font-bold text-slate-700">({course.reviewCount || 25})</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-textdark mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          <Link to={`/${course.slug}`}>{course.title}</Link>
        </h3>

        {/* Short description */}
        <p className="text-xs text-textmuted mb-4 line-clamp-2 leading-relaxed">
          {course.shortDescription || course.description}
        </p>

        {/* Meta info */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 mb-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>{course.students}+ Students</span>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span>{course.lessons?.length || 8} Lessons</span>
          </div>
          <div className="flex items-center gap-1 justify-end">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{course.duration || '16 Hrs'}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-auto flex items-center justify-between pt-1">
          {/* Price */}
          <div>
            {course.isFree || displayedPrice === 0 ? (
              <span className="text-lg font-extrabold text-success uppercase tracking-wide">Free</span>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-primary">
                  {formatPrice(displayedPrice)}
                </span>
                {displayedOriginalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatPrice(displayedOriginalPrice)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!course.isFree && displayedPrice > 0 && (
              <button
                onClick={handleAddToCart}
                disabled={isAlreadyInCart}
                className={`p-2.5 rounded-lg border transition-all ${
                  isAlreadyInCart
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-slate-50 text-primary border-primary/20 hover:bg-primary hover:text-white hover:border-primary'
                }`}
                title={isAlreadyInCart ? 'Already in Cart' : 'Add to Cart'}
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            )}
            <Link
              to={`/${course.slug}`}
              className="bg-accent text-white hover:bg-accent-dark px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-1"
            >
              Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
