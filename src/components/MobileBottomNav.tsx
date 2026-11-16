import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Home, Layers, ShoppingBag, Heart, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { 
    cartCount, 
    wishlist, 
    user, 
    setIsCartOpen, 
    setIsUserPanelOpen, 
    setUserPanelTab,
    setIsAuthModalOpen,
    setIsAdminOpen,
    setSelectedCategory 
  } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 shadow-lg flex items-center justify-around text-[10px] font-semibold text-slate-600">
      
      {/* Home */}
      <button
        onClick={() => {
          setSelectedCategory('all');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex flex-col items-center gap-0.5 hover:text-rose-600 cursor-pointer"
      >
        <Home className="w-5 h-5 text-rose-600" />
        <span className="text-rose-600 font-bold">Home</span>
      </button>

      {/* Departments */}
      <button
        onClick={() => {
          const el = document.getElementById('products-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="flex flex-col items-center gap-0.5 hover:text-rose-600 cursor-pointer"
      >
        <Layers className="w-5 h-5" />
        <span>Catalog</span>
      </button>

      {/* Cart with count badge */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center gap-0.5 relative hover:text-rose-600 cursor-pointer"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>

      {/* Wishlist */}
      <button
        onClick={() => {
          if (user) {
            setUserPanelTab('wishlist');
            setIsUserPanelOpen(true);
          } else {
            setIsAuthModalOpen(true);
          }
        }}
        className="flex flex-col items-center gap-0.5 relative hover:text-rose-600 cursor-pointer"
      >
        <div className="relative">
          <Heart className="w-5 h-5" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </div>
        <span>Wishlist</span>
      </button>

      {/* Admin Panel Quick Access - Only visible if logged in as Admin */}
      {user && user.role === 'admin' && (
        <button
          onClick={() => setIsAdminOpen(true)}
          className="flex flex-col items-center gap-0.5 hover:text-amber-500 cursor-pointer text-amber-600 animate-pulse"
        >
          <span className="text-base leading-none">👑</span>
          <span className="font-black">Admin</span>
        </button>
      )}

      {/* User Account / Sign In */}
      <button
        onClick={() => {
          if (user) {
            setUserPanelTab('orders');
            setIsUserPanelOpen(true);
          } else {
            setIsAuthModalOpen(true);
          }
        }}
        className="flex flex-col items-center gap-0.5 hover:text-rose-600 cursor-pointer"
      >
        <User className="w-5 h-5" />
        <span>{(user?.name || 'Sign In').split(' ')[0]}</span>
      </button>

    </div>
  );
};
