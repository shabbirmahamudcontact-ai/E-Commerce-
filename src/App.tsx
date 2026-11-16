/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode, useEffect } from 'react';
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
import { InfoPageModal } from './components/InfoPageModal.tsx';
import { ToastContainer } from './components/ToastContainer.tsx';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, errorMessage: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message || 'Unexpected rendering error' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Fokirer Bajar UI Error:', error, info);
  }

  handleResetAndReload = () => {
    try {
      localStorage.removeItem('kapaly_cart');
      localStorage.removeItem('kapaly_user');
    } catch {
      // Ignore storage errors
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-800">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl font-black">
              !
            </div>
            <h1 className="text-xl font-black text-slate-900">Something went wrong on this view</h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              We prevented a blank screen so you can return safely to Fokirer Bajar.
              {this.state.errorMessage ? ` (${this.state.errorMessage})` : ''}
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleResetAndReload}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition-colors"
              >
                Reset Session &amp; Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const KNOWN_PATHS = new Set([
  '/',
  '/cart',
  '/checkout',
  '/login',
  '/orders',
  '/wishlist',
  '/points',
  '/wallet',
  '/admin',
  '/track',
  '/cyclone',
  '/return-policy',
  '/payment-guide',
  '/terms',
  '/privacy'
]);

function MainApp() {
  const {
    user,
    orders,
    products,
    loading,
    setIsAdminOpen,
    setQuickViewProduct,
    setIsCartOpen,
    setIsCheckoutOpen,
    setIsAuthModalOpen,
    setIsUserPanelOpen,
    setUserPanelTab,
    setActiveInfoPage,
    openRiderTracking
  } = useApp();

  useEffect(() => {
    const syncRoute = () => {
      const baseRaw = import.meta.env.BASE_URL || '/';
      const baseNormalized = baseRaw === '/' ? '/' : baseRaw.replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase();
      let pathname = window.location.pathname || '/';
      if (baseNormalized !== '/' && pathname.toLowerCase().startsWith(baseNormalized.toLowerCase())) {
        pathname = pathname.slice(baseNormalized.length) || '/';
      }
      const rawPath = pathname.replace(/\/+$/, '') || '/';
      const path = rawPath.toLowerCase();

      if (hash === '#admin' || path === '/admin') {
        setIsAdminOpen(true);
        return;
      }

      if (hash.startsWith('#product-') || path.startsWith('/product/')) {
        const prodId = hash.startsWith('#product-')
          ? window.location.hash.slice('#product-'.length)
          : rawPath.slice('/product/'.length).replace(/\/+$/, '');
        if (prodId && products.length > 0) {
          const found = products.find((p) => p.id === prodId);
          if (found) {
            setQuickViewProduct(found);
          }
        }
        return;
      }

      if (path === '/cart' || hash === '#cart') {
        setIsCartOpen(true);
        return;
      }
      if (path === '/checkout' || hash === '#checkout') {
        setIsCheckoutOpen(true);
        return;
      }
      if (path === '/login' || hash === '#login') {
        if (user) {
          setUserPanelTab('orders');
          setIsUserPanelOpen(true);
        } else {
          setIsAuthModalOpen(true);
        }
        return;
      }
      if (path === '/orders' || hash === '#orders') {
        if (user) {
          setUserPanelTab('orders');
          setIsUserPanelOpen(true);
        } else if (!loading) {
          setIsAuthModalOpen(true);
        }
        return;
      }
      if (path === '/wishlist' || hash === '#wishlist') {
        if (user) {
          setUserPanelTab('wishlist');
          setIsUserPanelOpen(true);
        } else if (!loading) {
          setIsAuthModalOpen(true);
        }
        return;
      }
      if (path === '/points' || hash === '#points') {
        if (user) {
          setUserPanelTab('points');
          setIsUserPanelOpen(true);
        } else if (!loading) {
          setIsAuthModalOpen(true);
        }
        return;
      }
      if (path === '/wallet' || hash === '#wallet') {
        if (user) {
          setUserPanelTab('wallet');
          setIsUserPanelOpen(true);
        } else if (!loading) {
          setIsAuthModalOpen(true);
        }
        return;
      }
      if (path === '/track') {
        if (orders.length > 0) {
          openRiderTracking(orders[0]);
        } else if (user) {
          setUserPanelTab('orders');
          setIsUserPanelOpen(true);
        } else if (!loading) {
          setIsAuthModalOpen(true);
        }
        return;
      }
      if (path === '/cyclone') {
        document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (path === '/return-policy' || hash === '#return-policy') {
        setActiveInfoPage('replacement');
        return;
      }
      if (path === '/payment-guide' || hash === '#payment-guide') {
        setActiveInfoPage('payment');
        return;
      }
      if (path === '/terms' || hash === '#terms') {
        setActiveInfoPage('terms');
        return;
      }
      if (path === '/privacy' || hash === '#privacy') {
        setActiveInfoPage('privacy');
        return;
      }

      if (!KNOWN_PATHS.has(path)) {
        window.history.replaceState({}, '', baseRaw);
      }
    };

    syncRoute();
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, [
    user,
    orders,
    products,
    loading,
    setIsAdminOpen,
    setQuickViewProduct,
    setIsCartOpen,
    setIsCheckoutOpen,
    setIsAuthModalOpen,
    setIsUserPanelOpen,
    setUserPanelTab,
    setActiveInfoPage,
    openRiderTracking
  ]);

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

      {/* Customer Care & Policy Pages */}
      <InfoPageModal />

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
    <ErrorBoundary>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </ErrorBoundary>
  );
}
