import React from 'react';
import { Users, BookOpen, Star, ShoppingCart, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CourseCard({ course }) {
  const { addToCart, cartItems } = useCart();
  
  // Check if item is already in cart
  const isAdded = cartItems.some(item => item.title === course.title);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Parse price to number
    let numericPrice = 0;
    if (course.price && course.price !== 'Free') {
      numericPrice = parseInt(course.price.replace(/[^\d]/g, ''), 10) || 0;
    }

    addToCart({
      id: course.title, // Use title as unique id
      title: course.title,
      price: numericPrice,
      priceText: course.price,
      image: course.image,
      category: course.category
    });
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-50 text-green-700 border-green-100';
      case 'Intermediate': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Expert': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group">
      
      {/* Thumbnail Image & Badges */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 flex-shrink-0">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop";
          }}
        />
        
        {/* Category & Level Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="bg-[#0a3d91]/95 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
            {course.category}
          </span>
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border shadow-sm ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
        </div>

        {/* Dynamic Hover Backdrop Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1 gap-3.5">
        
        {/* Student & Lesson Stats */}
        <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4 text-[#f97316]" />
            {course.students} Students
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-[#0a3d91]" />
            {course.lessons} Lessons
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-extrabold text-[#0a3d91] leading-snug group-hover:text-[#f97316] transition-colors duration-200 line-clamp-2 min-h-[3rem]">
          {course.title}
        </h3>

        {/* Ellipsis Description */}
        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {course.description}
        </p>

        {/* Pricing Area */}
        <div className="flex items-baseline gap-2 mt-auto pt-2 border-t border-gray-50">
          {course.originalPrice && (
            <span className="text-xs sm:text-sm text-gray-400 line-through font-semibold">
              {course.originalPrice}
            </span>
          )}
          <span className="text-lg sm:text-xl font-black text-[#0a3d91]">
            {course.price}
          </span>
        </div>

        {/* Card Interactive Actions */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <a 
            href="#contact" 
            className="text-center bg-gray-50 border border-gray-200 hover:bg-gray-100 text-[#0a3d91] text-xs font-extrabold py-3 px-3 rounded-xl transition-all duration-200"
          >
            View Detail
          </a>
          {isAdded ? (
            <button 
              disabled
              className="flex items-center justify-center gap-1 bg-green-50 text-green-700 border border-green-200 text-xs font-extrabold py-3 px-3 rounded-xl cursor-default"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              In Cart
            </button>
          ) : (
            <button 
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1 bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-extrabold py-3 px-3 rounded-xl shadow-sm hover:shadow transition-all duration-200"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add to Cart
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
