/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { CategoryBar } from './components/CategoryBar.tsx';
import { CycloneDealsSection } from './components/CycloneDealsSection.tsx';
import { ProductGrid } from './components/ProductGrid.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { UserPanelModal } from './components/UserPanelModal.tsx';
import { LoginModal } from './components/LoginModal.tsx';
import { Footer } from './components/Footer.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import { InvoiceModal } from './components/InvoiceModal.tsx';
import { RiderTrackingModal } from './components/RiderTrackingModal.tsx';
import { AiAssistant } from './components/AiAssistant.tsx';
import { AdminPanelModal } from './components/AdminPanelModal.tsx';
import { ToastContainer } from './components/ToastContainer.tsx';

function MainApp() {
  const { setIsAdminOpen, products, setQuickViewProduct } = useApp();

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      } else if (window.location.hash.startsWith('#product-')) {
        const prodId = window.location.hash.replace('#product-', '');
        const found = products.find(p => p.id === prodId);
        if (found) {
          setQuickViewProduct(found);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setIsAdminOpen, products, setQuickViewProduct]);
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Transparent / Frosted Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Proper Hero Section */}
        <HeroSection />

        {/* Category Navigation Pills */}
        <CategoryBar />

        {/* Signature Evaly Cyclone Mega Deals */}
        <CycloneDealsSection />

        {/* Product Catalog Grid */}
        <ProductGrid />
      </main>

      {/* Footer with College Road Gaibandha Address & Hotline */}
      <Footer />

      {/* Sticky Bottom Navigation for Mobile Devices */}
      <MobileBottomNav />

      {/* Interactive Modals and Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <UserPanelModal />
      <LoginModal />

      {/* Customer Printable Invoice */}
      <InvoiceModal />

      {/* Live Rider GPS Tracking */}
      <RiderTrackingModal />

      {/* AI Customer Support Agent */}
      <AiAssistant />

      {/* Dedicated Merchant & Operations Admin Panel */}
      <AdminPanelModal />

      {/* Notification Toast System */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
