import React from 'react';

const partners = [
  { name: 'Google', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { name: 'Microsoft', img: 'https://learnerskart.com/wp-content/uploads/2025/04/pngimg.com-microsoft_PNG17-300x64.png' },
  { name: 'IBM', img: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
  { name: 'JPMorgan Chase', img: 'https://learnerskart.com/wp-content/uploads/2025/04/JPMorgan_Chase-Logo.wine_-300x200.png' },
  { name: 'Bank of America', img: 'https://learnerskart.com/wp-content/uploads/2025/04/icons8-bank-of-america-526-300x300.png' },
  { name: 'Deloitte', img: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Deloitte.svg' },
  { name: 'Amazon', img: 'https://learnerskart.com/wp-content/uploads/2025/04/Amazon_logo.svg-300x91.png' },
  { name: 'Accenture', img: 'https://learnerskart.com/wp-content/uploads/2025/04/Accenture.svg-300x79.png' },
  { name: 'Infosys', img: 'https://learnerskart.com/wp-content/uploads/2025/04/Infosys_logo.svg-300x120.png' },
  { name: 'Home Depot', img: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/The_Home_Depot.svg' },
  { name: 'Kroger', img: 'https://learnerskart.com/wp-content/uploads/2025/04/FreshCart_Kroger_Lockup_-300x112-1.png' },
  { name: 'Coca-Cola', img: 'https://learnerskart.com/wp-content/uploads/2025/04/Coca-Cola_logo.svg-300x94.png' }
];

export default function PartnersSection() {
  // Triple the array elements to ensure seamless loop in marquee
  const extendedPartners = [...partners, ...partners, ...partners];

  return (
    <section className="w-full bg-white py-16 overflow-hidden border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <span className="text-xs font-black uppercase tracking-wider text-[#f97316]">
          Our Corporate Network
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0a3d91] tracking-tight mt-2 font-sans">
          Look at Our Partners
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
          Our alumni work at leading global organizations and Fortune 500 companies
        </p>
      </div>

      {/* Scrolling Marquee */}
      <div className="relative w-full overflow-hidden flex py-4">
        {/* Gradients to fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-6 sm:gap-10">
          {extendedPartners.map((corp, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-center bg-white border border-gray-100 rounded-xl px-5 py-4 w-36 sm:w-48 h-16 sm:h-20 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 flex-shrink-0"
            >
              <img 
                src={corp.img} 
                alt={corp.name} 
                className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  // If image fails, hide image and show stylish text
                  e.target.style.display = 'none';
                  const p = document.createElement('span');
                  p.className = 'text-[#0a3d91] font-black text-sm uppercase tracking-tight';
                  p.innerText = corp.name;
                  e.target.parentNode.appendChild(p);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
