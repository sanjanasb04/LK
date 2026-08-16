import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TopBanner from './TopBanner';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from '../ui/WhatsAppButton';
import SpinTheWheelPopup from '../common/SpinTheWheelPopup';


const Layout = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hideNav = queryParams.get('hideNav') === 'true';

  if (hideNav) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Header Group (Top announcement bar + Navigation bar) */}
      <div className="sticky top-0 z-50 w-full flex flex-col">
        <TopBanner />
        <Navbar />
      </div>

      {/* Main Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer Section */}
      <Footer />

      {/* Floating WhatsApp Support Button */}
      <WhatsAppButton />

      {/* Promotional Spin-The-Wheel Lead Popup */}
      <SpinTheWheelPopup />
    </div>
  );
};

export default Layout;
