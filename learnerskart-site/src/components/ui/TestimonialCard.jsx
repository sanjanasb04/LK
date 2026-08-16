import React from 'react';
import { Quote } from 'lucide-react';
import StarRating from './StarRating';

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-md p-6 lg:p-8 flex flex-col justify-between h-full relative group select-none text-left">
      {/* Quote Icon Background decoration */}
      <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-100/80 stroke-1 transform rotate-180" />

      {/* Quote text */}
      <blockquote className="text-sm text-slate-700 leading-relaxed italic mb-6 relative z-10">
        "{testimonial.quote}"
      </blockquote>

      {/* User profile details */}
      <div className="flex items-center gap-4 mt-auto">
        <img
          src={testimonial.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
          alt={testimonial.name}
          className="w-11 h-11 rounded-full object-cover border-2 border-primary/10 shadow-sm"
          loading="lazy"
        />
        <div>
          <h4 className="font-bold text-sm text-textdark leading-none">{testimonial.name}</h4>
          <p className="text-[11px] text-textmuted font-medium mt-1 leading-none">{testimonial.role}</p>
          <div className="mt-2">
            <StarRating rating={testimonial.rating || 5} size={12} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
