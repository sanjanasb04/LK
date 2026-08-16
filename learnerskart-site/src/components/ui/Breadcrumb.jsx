import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items = [], light = false }) => {
  return (
    <nav 
      className={`flex items-center gap-1.5 text-xs font-semibold select-none ${
        light ? 'text-white/80' : 'text-textmuted'
      }`} 
      aria-label="Breadcrumb"
    >
      <Link 
        to="/" 
        className={`transition-colors flex items-center gap-1 ${
          light ? 'text-white hover:text-orange-200' : 'hover:text-primary'
        }`}
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight 
              className={`w-3 h-3 flex-shrink-0 ${
                light ? 'text-white/60' : 'text-slate-400'
              }`} 
            />
            {isLast ? (
              <span 
                className={`${
                  light ? 'text-white font-black' : 'text-primary font-bold'
                } truncate`} 
                aria-current="page"
              >
                {item.label || item.name}
              </span>
            ) : (
              <Link
                to={item.url || item.path || '/'}
                className={`hover:underline truncate transition-colors ${
                  light ? 'text-white/80 hover:text-white' : 'hover:text-primary'
                }`}
              >
                {item.label || item.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
