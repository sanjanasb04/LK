import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MessageSquare, Star, CheckCircle2 } from 'lucide-react';
import TestimonialCard from '../ui/TestimonialCard';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Testimonials = () => {
  const testimonials = [
    { name:"Brian C. Kim", role:"Sales Manager", avatar:"https://learnerskart.com/wp-content/uploads/2024/10/co-instructor-06-60x60.jpg", quote:"The depth of knowledge shared by the instructors was exceptional. They clearly had extensive industry experience." },
    { name:"Gerald I. Daubert", role:"Team Leader", avatar:"https://learnerskart.com/wp-content/uploads/2024/10/co-instructor-04-60x60.jpg", quote:"I found the case studies particularly insightful. They helped me understand how to apply the concepts we learned." },
    { name:"Tomas M. Melendez", role:"Manager", avatar:"https://learnerskart.com/wp-content/uploads/2024/10/co-instructor-02-60x60.jpg", quote:"The training provided strong fundamentals in Project Management. I now feel much more confident in my abilities." },
    { name:"Dorotha M. Stewart", role:"Project Manager", avatar:"https://learnerskart.com/wp-content/uploads/2024/10/co-instructor-05-60x60.jpg", quote:"The course content was up-to-date and relevant to industry trends. The Learnerskart team was exceptionally helpful." },
    { name:"James M. Alexander", role:"Manager", avatar:"https://learnerskart.com/wp-content/uploads/2024/07/instructor-04-60x60.jpg", quote:"The networking opportunities during training were invaluable. I made connections that benefited my career." },
    { name:"Ethel J. Phillips", role:"Manager", avatar:"https://learnerskart.com/wp-content/uploads/2024/07/instructor-01-60x60.jpg", quote:"This training helped me transition into a new career path. I really appreciated the Learnerskart team." },
    { name:"Robert B. Martin", role:"Senior Manager", avatar:"https://learnerskart.com/wp-content/uploads/2024/07/instructor-02-60x60.jpg", quote:"The instructors were engaging and approachable. They made complex topics easy to understand." }
  ];

  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dbTestimonials, setDbTestimonials] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Feedback Form State
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState('');
  const [role, setRole] = useState('');

  // Fetch approved testimonials on mount
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get('/testimonials');
        if (res.data.success && res.data.testimonials.length > 0) {
          setDbTestimonials(res.data.testimonials);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      }
    };
    fetchTestimonials();
  }, []);

  const activeList = dbTestimonials.length > 0 ? dbTestimonials : testimonials;

  // Auto-slide effect
  useEffect(() => {
    if (activeList.length === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, activeList]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === activeList.length - 1 ? 0 : prev + 1));
  };

  const getVisibleTestimonials = () => {
    const list = [];
    if (activeList.length === 0) return list;
    for (let i = 0; i < Math.min(3, activeList.length); i++) {
      list.push(activeList[(currentIndex + i) % activeList.length]);
    }
    return list;
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!quote) return;
    setSubmitLoading(true);
    try {
      const res = await api.post('/testimonials', {
        rating,
        quote,
        role: role || 'Learner'
      });
      if (res.data.success) {
        setFeedbackSuccess(true);
        setQuote('');
        setRole('');
        setRating(5);
      }
    } catch (err) {
      alert('Failed to submit feedback: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <section className="py-20 bg-lightbg/20 border-b border-slate-100 select-none relative overflow-hidden text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header and Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-accent text-xs font-extrabold uppercase tracking-widest leading-none">Students Say</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-textdark mt-2.5 leading-tight">
              Customer Satisfaction is Our Priority
            </h2>
            <p className="text-sm text-textmuted mt-2 leading-relaxed max-w-xl">
              Discover how our certification training programs have helped professionals worldwide accelerate their career growth and achieve their goals.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 self-start sm:self-auto">
            <button
              onClick={() => {
                setFeedbackSuccess(false);
                setShowFeedbackModal(true);
              }}
              className="bg-primary hover:bg-primary-dark text-white font-extrabold text-xs px-5 py-3.5 rounded-lg shadow-sm hover:shadow transition-all active:scale-95 whitespace-nowrap flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              Write a Review
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm hover:shadow text-slate-700 transition-all active:scale-95"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm hover:shadow text-slate-700 transition-all active:scale-95"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Testimonials Display */}
        {/* Desktop: 3 cards, Mobile: 1 card */}
        <div className="hidden lg:grid grid-cols-3 gap-8">
          {getVisibleTestimonials().map((testimonial, idx) => (
            <div key={`desktop-${currentIndex}-${idx}`} className="animate-fade-in">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>

        {/* Mobile: 1 card */}
        <div className="lg:hidden animate-fade-in">
          {activeList.length > 0 && (
            <TestimonialCard testimonial={activeList[currentIndex]} />
          )}
        </div>

        {/* Indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {activeList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx ? 'w-6 bg-primary' : 'w-2 bg-slate-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>

      </div>

      {/* FEEDBACK MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 text-left relative transform scale-100 transition-all duration-300">
            
            {/* Close Button */}
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-extrabold text-sm"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2.5 rounded-xl">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-textdark uppercase tracking-wider">Leave Feedback</h4>
                <p className="text-[10px] text-textmuted font-semibold uppercase mt-0.5">Share your learning experience</p>
              </div>
            </div>

            {!user ? (
              /* Non-authenticated Prompt */
              <div className="space-y-4 text-center py-4">
                <p className="text-sm font-semibold text-slate-600">
                  Please log in to submit your course feedback and certification review.
                </p>
                <Link
                  to="/login"
                  state={{ from: { pathname: '/' } }}
                  className="inline-block bg-primary hover:bg-primary-dark text-white font-extrabold px-6 py-3 rounded-lg text-xs shadow transition-all active:scale-95"
                >
                  Sign In to Continue
                </Link>
              </div>
            ) : feedbackSuccess ? (
              /* Success message */
              <div className="space-y-4 text-center py-6 animate-fade-in">
                <div className="bg-emerald-50 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-textdark">Thank You for Your Feedback!</h5>
                  <p className="text-[11px] text-textmuted mt-1 leading-relaxed">
                    Your review has been submitted successfully and is pending administrative verification. Once approved, it will be published live on our wall of testimonials!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-lg text-xs transition-colors"
                >
                  Close Window
                </button>
              </div>
            ) : (
              /* Feedback Form */
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                
                {/* Rating Selector */}
                <div className="space-y-1.5">
                  <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-wider">Course Rating</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="text-amber-400 hover:scale-110 transition-transform focus:outline-none"
                      >
                        <Star className={`w-6 h-6 ${rating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Job Title / Role */}
                <div className="space-y-1.5">
                  <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-wider">Job Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scrum Master, Project Manager, Student"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs outline-none focus:bg-white focus:border-primary font-semibold text-slate-700"
                  />
                </div>

                {/* Review Textarea */}
                <div className="space-y-1.5">
                  <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-wider">Review Quote / Comments</label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Describe your learning cohort experience, instructors support, study guides, etc..."
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs outline-none focus:bg-white focus:border-primary font-semibold text-slate-700 leading-relaxed"
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75"
                >
                  {submitLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Submitting Review...</span>
                    </>
                  ) : (
                    <span>Submit Review for Moderation</span>
                  )}
                </button>

              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};

export default Testimonials;
