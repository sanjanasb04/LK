import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileSidebar from './MobileSidebar';

export default function LMSLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bglight">
      
      {/* Collapsible Left Sidebar (desktop only) */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Drawer Sidebar (mobile only) */}
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navbar */}
        <TopBar onMenuClick={() => setMobileOpen(true)} />

        {/* Dynamic Route Content Body */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}
