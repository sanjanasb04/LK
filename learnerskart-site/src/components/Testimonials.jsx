import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Brian C. Kim",
    role: "Sales Manager",
    avatar: "https://learnerskart.com/wp-content/uploads/2024/10/co-instructor-06-60x60.jpg",
    quote: "The depth of knowledge shared by the instructors was exceptional. They clearly had extensive industry experience."
  },
  {
    name: "Gerald I. Daubert",
    role: "Team Leader",
    avatar: "https://learnerskart.com/wp-content/uploads/2024/10/co-instructor-04-60x60.jpg",
    quote: "I found the case studies particularly insightful. They helped me understand how to apply the concepts we learned."
  },
  {
    name: "Tomas M. Melendez",
    role: "Manager",
    avatar: "https://learnerskart.com/wp-content/uploads/2024/10/co-instructor-02-60x60.jpg",
    quote: "The training provided strong fundamentals in Project Management. I now feel much more confident in my abilities."
  },
  {
    name: "Dorotha M. Stewart",
    role: "Project Manager",
    avatar: "https://learnerskart.com/wp-content/uploads/2024/10/co-instructor-05-60x60.jpg",
    quote: "The course content was up-to-date and relevant to the current industry trends. I found the Learnerskart team to be exceptionally helpful."
  },
  {
    name: "James M. Alexander",
    role: "Manager",
    avatar: "https://learnerskart.com/wp-content/uploads/2024/07/instructor-04-60x60.jpg",
    quote: "The networking opportunities provided during the training were invaluable. I made connections that have benefited my career."
  },
  {
    name: "Ethel J. Phillips",
    role: "Manager",
    avatar: "https://learnerskart.com/wp-content/uploads/2024/07/instructor-01-60x60.jpg",
    quote: "This training helped me transition into a new career path. I really appreciated the Learnerskart team."
  },
  {
    name: "Robert B. Martin",
    role: "Senior Manager",
    avatar: "https://learnerskart.com/wp-content/uploads/2024/07/instructor-02-60x60.jpg",
    quote: "The instructors were engaging and approachable. They made complex topics easy to understand."
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const maxSlides = testimonials.length;
  
  // Responsive cards display calculation:
  // Mobile: 1 slide per view
  // Tablet (md): 2 slides per view
  // Desktop (lg): 3 slides per view
  const [slidesToScroll, setSlidesToScroll] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToScroll(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToScroll(2);
      } else {
        setSlidesToScroll(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(maxSlides - slidesToScroll + 1);

  const nextSlide = () => {
    setActiveIndex((prev) => {
      const next = prev + 1;
      return next >= totalPages ? 0 : next;
    });
  };

  const prevSlide = () => {
    setActiveIndex((prev) => {
      const next = prev - 1;
      return next < 0 ? totalPages - 1 : next;
    });
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 4500);
    return () => clearInterval(interval);
  }, [isPaused, totalPages]);

  return (
    <section className="w-full bg-gray-50/70 py-20 overflow-hidden border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl text-left">
            <span className="text-xs font-black uppercase tracking-wider text-[#f97316] bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-100 shadow-sm">
              Students Say
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0a3d91] tracking-tight mt-3 font-sans">
              Satisfaction is Always Present
            </h2>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              Read authentic feedback and reviews from our successful graduates around the globe
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-2.5">
            <button 
              onClick={prevSlide}
              className="p-3 bg-white border border-gray-200 hover:border-[#0a3d91] text-[#0a3d91] hover:bg-[#0a3d91] hover:text-white rounded-xl shadow-sm transition-all duration-200 focus:outline-none"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextSlide}
              className="p-3 bg-white border border-gray-200 hover:border-[#0a3d91] text-[#0a3d91] hover:bg-[#0a3d91] hover:text-white rounded-xl shadow-sm transition-all duration-200 focus:outline-none"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{ transform: `translateX(-${activeIndex * (100 / slidesToScroll)}%)` }}
          >
            {testimonials.map((testimonial, idx) => (
              <div 
                key={idx}
                className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col justify-between h-full flex-shrink-0"
                style={{ width: `calc((100% - ${(slidesToScroll - 1) * 24}px) / ${slidesToScroll})` }}
              >
                <div>
                  
                  {/* Star Rating & Quote Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <div className="bg-orange-50 text-[#f97316] p-2.5 rounded-2xl flex items-center justify-center">
                      <Quote className="w-5 h-5 fill-current" />
                    </div>
                  </div>

                  {/* Feedback Quote */}
                  <p className="text-xs sm:text-sm text-gray-500 font-semibold italic leading-relaxed min-h-[4.5rem]">
                    "{testimonial.quote}"
                  </p>

                </div>

                {/* Author Metadata */}
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-50">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-gray-100"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop";
                    }}
                  />
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-[#0a3d91] leading-tight">
                      {testimonial.name}
                    </h4>
                    <p className="text-xxs sm:text-xs font-bold text-gray-400 mt-0.5">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 gap-2">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === idx 
                  ? 'w-8 bg-[#0a3d91] shadow-sm shadow-blue-900/10' 
                  : 'w-2.5 bg-gray-200 hover:bg-gray-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
