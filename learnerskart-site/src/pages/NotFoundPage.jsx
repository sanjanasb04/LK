import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20 px-6 text-center select-none">
      <div className="max-w-md w-full bg-white border border-slate-100 rounded-2xl p-8 sm:p-12 shadow-lg">
        {/* 404 Icon block */}
        <div className="bg-amber-50 p-4.5 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <HelpCircle className="w-10 h-10 text-accent animate-bounce" />
        </div>
        
        {/* Texts */}
        <h1 className="text-5xl font-black text-primary leading-none">404</h1>
        <h2 className="font-extrabold text-xl text-textdark mt-4">Page Not Found</h2>
        <p className="text-xs sm:text-sm text-textmuted mt-2.5 leading-relaxed">
          Oops! The page you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>

        {/* Home CTA */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-lg mt-8 text-sm shadow-md transition-all active:scale-98"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          Go to Home Page
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
