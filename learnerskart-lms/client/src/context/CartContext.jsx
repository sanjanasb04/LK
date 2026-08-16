import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const countriesList = [
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', rate: 1, symbol: '₹' },
  { code: 'US', name: 'USA', flag: '🇺🇸', currency: 'USD', rate: 0.012, symbol: '$' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', currency: 'AED', rate: 0.044, symbol: 'AED ' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR', rate: 0.045, symbol: 'SR ' },
  { code: 'GB', name: 'UK', flag: '🇬🇧', currency: 'GBP', rate: 0.0094, symbol: '£' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', rate: 0.016, symbol: 'C$' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', rate: 0.018, symbol: 'A$' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', currency: 'QAR', rate: 0.044, symbol: 'QR ' }
];

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    return {
      cartItems: [],
      isCartOpen: false,
      setIsCartOpen: () => {},
      addToCart: () => {},
      removeFromCart: () => {},
      clearCart: () => {},
      cartCount: 0,
      cartTotal: 0,
      countriesList: countriesList,
      selectedCountry: countriesList[1], // Default USD
      setSelectedCountry: () => {}
    };
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(() => {
    const saved = localStorage.getItem('lk_selected_country');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = countriesList.find(c => c.code === parsed.code);
        if (match) return match;
      } catch (err) {}
    }
    return countriesList[1]; // Default USD
  });

  // IP Geolocation Auto-Detection
  useEffect(() => {
    const saved = localStorage.getItem('lk_selected_country');
    if (saved) return;

    const autoDetect = async () => {
      try {
        let countryCode = null;
        try {
          const res = await fetch('https://ipapi.co/json/');
          if (res.ok) {
            const data = await res.json();
            countryCode = data?.country_code || data?.country;
          }
        } catch (e) {}

        if (!countryCode) {
          try {
            const res = await fetch('https://ipinfo.io/json');
            if (res.ok) {
              const data = await res.json();
              countryCode = data?.country;
            }
          } catch (e) {}
        }

        if (!countryCode) {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
          if (tz.includes('Kolkata') || tz.includes('India') || tz.includes('Calcutta')) {
            countryCode = 'IN';
          } else if (tz.includes('America/')) {
            countryCode = 'US';
          } else if (tz.includes('London') || tz.includes('Europe/')) {
            countryCode = 'GB';
          } else if (tz.includes('Dubai') || tz.includes('Asia/Dubai')) {
            countryCode = 'AE';
          }
        }

        if (countryCode) {
          const matched = countriesList.find(c => c.code === countryCode.toUpperCase());
          if (matched) {
            setSelectedCountry(matched);
            localStorage.setItem('lk_selected_country', JSON.stringify(matched));
          }
        }
      } catch (err) {}
    };
    autoDetect();
  }, []);

  const handleSetSelectedCountry = (country) => {
    setSelectedCountry(country);
    localStorage.setItem('lk_selected_country', JSON.stringify(country));
  };

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const exists = prevItems.find((i) => i.id === item.id);
      if (exists) return prevItems;
      return [...prevItems, item];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((total, item) => total + (item.price || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        countriesList,
        selectedCountry,
        setSelectedCountry: handleSetSelectedCountry
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
