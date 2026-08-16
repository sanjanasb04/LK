import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const StarRating = ({ rating, size = 16, className = '' }) => {
  const stars = [];
  const floorRating = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4 && rating % 1 <= 0.8;

  for (let i = 1; i <= 5; i++) {
    if (i <= floorRating) {
      stars.push(
        <Star
          key={i}
          size={size}
          className={`fill-amber-400 stroke-amber-400 ${className}`}
        />
      );
    } else if (i === floorRating + 1 && hasHalfStar) {
      stars.push(
        <StarHalf
          key={i}
          size={size}
          className={`fill-amber-400 stroke-amber-400 ${className}`}
        />
      );
    } else {
      stars.push(
        <Star
          key={i}
          size={size}
          className={`text-slate-200 stroke-slate-200 ${className}`}
        />
      );
    }
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
};

export default StarRating;
