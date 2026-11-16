import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User as UserIcon, 
  MapPin, 
  PhoneCall, 
  Zap, 
  ChevronDown, 
  X, 
  ShieldCheck, 
  Menu,
  Clock,
  Sparkles,
  LogOut,
  Package,
  Coins,
  Wallet,
  Settings
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    user, 
    logout,
    cartCount, 
    cartTotal, 
    wishlist, 
    setIsCartOpen, 
    setIsAuthModalOpen, 
    setIsUserPanelOpen,
    setUserPanelTab,
    isAdminOpen,
    setIsAdminOpen,
    openRiderTracking,
    orders,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    products,
    setQuickViewProduct,
    selectedLocation,
    setSelectedLocation,
    storeInfo,
    showToast
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Transparent navbar effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search suggestions and user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchSuggestions(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = searchQuery.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSelectSuggestion = (prod: any) => {
    setQuickViewProduct(prod);
    setShowSearchSuggestions(false);
    setSearchQuery('');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      {/* Top Announcement Bar - Bangladeshi E-Commerce Style */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-rose-400 font-semibold animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>CYCLONE MEGA SALE IS LIVE</span>
            </div>
            <span className="hidden sm:inline text-slate-500">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Express 2-Hour Delivery in Gaibandha</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Location Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer font-medium"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span className="truncate max-w-[140px] md:max-w-[200px]">{selectedLocation}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLocationDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 font-bold text-slate-900 border-b border-slate-100 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-600" />
                    <span>Select Gaibandha Delivery Zone</span>
                  </div>
                  {storeInfo?.deliveryLocations?.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setShowLocationDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-rose-50 flex items-center justify-between transition-colors ${
                        selectedLocation === loc ? 'font-bold text-rose-600 bg-rose-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{loc}</span>
                      {selectedLocation === loc && <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />}
                    </button>
                  ))}
                  <div className="p-2 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500">
                    📍 Hub: College Road, Gaibandha
                  </div>
                </div>
              )}
            </div>

            <span className="hidden sm:inline text-slate-500">|</span>
            <button
              onClick={() => {
                if (orders.length > 0) openRiderTracking(orders[0]);
                else showToast('Please place an order to track live rider', 'info');
              }}
              className="hidden sm:flex items-center gap-1 text-rose-300 hover:text-white cursor-pointer font-semibold"
            >
              <span>🛵 Follow Rider</span>
            </button>

            <span className="hidden md:inline text-slate-500">|</span>
            <div className="hidden md:flex items-center gap-1 text-slate-300">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span className="font-medium">09638-FOKIR</span>
            </div>

            <span className="hidden sm:inline text-slate-500">|</span>
            {/* Quick Top Bar Auth / Logout Option */}
            {user ? (
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setIsUserPanelOpen(true)}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Hi, <strong className="text-rose-400">{user.name.split(' ')[0]}</strong>
                </button>
                <button
                  onClick={logout}
                  className="text-rose-400 hover:text-rose-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded"
                  title="Sign out of your account"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1 text-rose-300 hover:text-white transition-colors cursor-pointer text-xs font-bold"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Transparent / Glassmorphic Navbar */}
      <nav 
        className={`transition-all duration-300 border-b ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md border-slate-200/80 py-2.5' 
            : 'bg-white/80 backdrop-blur-sm border-white/20 py-3 md:py-3.5 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-3 md:gap-6">
          
          {/* Logo & Gaibandha Subtitle */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center gap-2 text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
                <span className="font-black text-xl tracking-tighter">FB</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
                    FOKIRER BAJAR<span className="text-rose-600">.</span>
                  </span>
                  <span className="hidden sm:inline-block bg-rose-100 text-rose-700 font-bold text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Cyclone
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 -mt-1 hidden xs:block">
                  ফকিরের বাজার • College Road, Gaibandha
                </p>
              </div>
            </button>
          </div>

          {/* Search Bar with Category Select & Instant Live Suggestions */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl relative hidden md:block">
            <div className="flex items-center bg-slate-100 hover:bg-slate-50 focus-within:bg-white rounded-full border border-slate-200 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-200/50 transition-all shadow-inner overflow-hidden">
              
              {/* Category dropdown inside search */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter products by category"
                className="bg-transparent text-xs font-semibold text-slate-700 px-3 py-2.5 border-r border-slate-200 outline-none cursor-pointer max-w-[150px] truncate"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>

              <div className="flex-1 flex items-center px-3">
                <input
                  type="text"
                  placeholder="Search smartphones, bikes, fashion, groceries in Gaibandha..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchSuggestions(true);
                  }}
                  onFocus={() => setShowSearchSuggestions(true)}
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none py-2"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button 
                onClick={() => setShowSearchSuggestions(false)}
                className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 flex items-center gap-1.5 font-semibold text-sm transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>

            {/* Live Search Suggestions Dropdown */}
            {showSearchSuggestions && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in">
                <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Results for "{searchQuery}"</span>
                  <span>{filteredSuggestions.length} found</span>
                </div>
                {filteredSuggestions.length > 0 ? (
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {filteredSuggestions.map(item => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectSuggestion(item)}
                        className="p-2.5 hover:bg-rose-50/60 flex items-center gap-3 cursor-pointer transition-colors"
                      >
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.category} • {item.brand}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-rose-600">৳{item.price.toLocaleString()}</p>
                          {item.originalPrice > item.price && (
                            <p className="text-xs text-slate-400 line-through">৳{item.originalPrice.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500">
                    No matching products found. Try "Samsung", "Yamaha", "Walton", or "Panjabi".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons: Wishlist, Cart & User Account */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Wishlist Button */}
            <button
              onClick={() => {
                if (user) {
                  setUserPanelTab('wishlist');
                  setIsUserPanelOpen(true);
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              title="Saved Wishlist"
              className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Admin Panel Button - Strictly restricted to Admin users only (hidden from general customers) */}
            {user && user.role === 'admin' && (
              <button
                onClick={() => setIsAdminOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all shadow-xs cursor-pointer border border-amber-300 animate-pulse"
                title="Open Merchant & Dispatch Admin Panel"
              >
                <span className="text-sm">👑</span>
                <span className="hidden sm:inline">Admin Mode</span>
              </button>
            )}

            {/* Cart Button with Count & BDT Subtotal */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 transition-all border border-rose-200/60 cursor-pointer shadow-xs"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-rose-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[10px] font-semibold text-rose-600 uppercase tracking-wider leading-none">Cart</p>
                <p className="text-xs font-bold text-slate-900 leading-tight">৳{cartTotal.toLocaleString()}</p>
              </div>
            </button>

            {/* User Account / Login & Logout Controls */}
            {user ? (
              <div ref={userDropdownRef} className="relative">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer bg-white shadow-xs group"
                    title="Open Account Menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-xs font-bold text-slate-900 truncate max-w-[100px]">{user.name.split(' ')[0]}</p>
                      <p className="text-[10px] font-semibold text-emerald-600">৳{user.balance} Balance</p>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* 1-Click Desktop Logout Button */}
                  <button
                    onClick={logout}
                    className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-full hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors text-xs font-bold cursor-pointer"
                    title="Log Out (লগআউট)"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Logout</span>
                  </button>
                </div>

                {/* User Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 text-slate-800 animate-in fade-in zoom-in-95">
                    {/* User Profile Header */}
                    <div className="px-4 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white font-black text-base flex items-center justify-center shadow-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-extrabold text-sm text-slate-900 truncate">{user.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{user.phone || user.email}</p>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                        <div 
                          onClick={() => {
                            setUserPanelTab('wallet');
                            setIsUserPanelOpen(true);
                            setShowUserDropdown(false);
                          }}
                          className="p-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">Wallet</p>
                          <p className="font-black text-rose-600">৳{(user.balance ?? 0).toLocaleString()}</p>
                        </div>
                        <div 
                          onClick={() => {
                            setUserPanelTab('points');
                            setIsUserPanelOpen(true);
                            setShowUserDropdown(false);
                          }}
                          className="p-2 rounded-xl bg-amber-50 border border-amber-100 hover:bg-amber-100/50 transition-colors cursor-pointer"
                        >
                          <p className="text-[10px] text-amber-700 font-semibold uppercase">Club Points</p>
                          <p className="font-black text-amber-600">{user.points ?? 0} pts</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Navigation Links */}
                    <div className="py-1 text-xs">
                      <button
                        onClick={() => {
                          setUserPanelTab('orders');
                          setIsUserPanelOpen(true);
                          setShowUserDropdown(false);
                        }}
                        className="w-full px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-semibold cursor-pointer text-left"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        <span>My Orders ({orders.length})</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserPanelTab('points');
                          setIsUserPanelOpen(true);
                          setShowUserDropdown(false);
                        }}
                        className="w-full px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-semibold cursor-pointer text-left"
                      >
                        <Coins className="w-4 h-4 text-amber-500" />
                        <span>Loyalty Points Rewards</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserPanelTab('wishlist');
                          setIsUserPanelOpen(true);
                          setShowUserDropdown(false);
                        }}
                        className="w-full px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-semibold cursor-pointer text-left"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>Saved Wishlist ({wishlist.length})</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserPanelTab('profile');
                          setIsUserPanelOpen(true);
                          setShowUserDropdown(false);
                        }}
                        className="w-full px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-semibold cursor-pointer text-left"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Profile & Address Settings</span>
                      </button>

                      {user.role === 'admin' && (
                        <button
                          onClick={() => {
                            setIsAdminOpen(true);
                            setShowUserDropdown(false);
                          }}
                          className="w-full px-4 py-2 hover:bg-amber-50 flex items-center gap-2.5 text-amber-800 font-bold cursor-pointer text-left"
                        >
                          <span className="text-sm">👑</span>
                          <span>Admin Control Center</span>
                        </button>
                      )}
                    </div>

                    {/* Prominent Red Logout Button */}
                    <div className="pt-2 border-t border-slate-100 px-3">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-between cursor-pointer transition-colors border border-rose-200"
                      >
                        <span className="flex items-center gap-2">
                          <LogOut className="w-4 h-4" />
                          <span>Log Out (লগআউট)</span>
                        </span>
                        <span className="text-[10px] text-rose-400 uppercase font-semibold">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20 cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In / Login</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="px-4 mt-2 md:hidden">
          <div className="flex items-center bg-slate-100 rounded-full border border-slate-200 px-3 py-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-500/50">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search products in Gaibandha..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-900 outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-3 mt-2 shadow-lg divide-y divide-slate-100 text-sm">
            {/* Account Card in Mobile Menu */}
            <div className="pb-3">
              {user ? (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                        <p className="text-[11px] text-slate-500">{user.phone || user.email}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                      {user.points} pts
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setIsUserPanelOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer text-center"
                    >
                      My Account
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-3 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In / Register (লগইন করুন)</span>
                </button>
              )}
            </div>

            <div className="py-2 flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold">Delivery Location:</span>
              <span className="font-bold text-rose-600">{selectedLocation}</span>
            </div>
            <div className="py-2.5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Categories</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                    selectedCategory === 'all' ? 'bg-rose-50 text-rose-600 font-bold' : 'text-slate-700'
                  }`}
                >
                  All Products
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium truncate ${
                      selectedCategory === cat.slug ? 'bg-rose-50 text-rose-600 font-bold' : 'text-slate-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <span>📍 College Road, Gaibandha</span>
              <span>📞 09638-FOKIR</span>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
