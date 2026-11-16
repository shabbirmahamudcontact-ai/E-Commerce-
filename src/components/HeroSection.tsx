import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Zap, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Truck, 
  RefreshCcw, 
  CreditCard, 
  Flame, 
  Sparkles, 
  Clock, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

interface BannerSlide {
  id: number;
  tag: string;
  title: string;
  highlight: string;
  subtitle: string;
  bgGradient: string;
  image: string;
  categorySlug: string;
  discountBadge: string;
  ctaText: string;
}

const HERO_SLIDES: BannerSlide[] = [
  {
    id: 1,
    tag: '⚡ GAIBANDHA CYCLONE FESTIVAL',
    title: 'Grand Opening Specials at',
    highlight: 'College Road, Gaibandha',
    subtitle: 'Massive cashback offers, flash voucher codes & guaranteed fastest delivery in North Bengal.',
    bgGradient: 'from-rose-950 via-rose-900 to-slate-900',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1000&auto=format&fit=crop&q=80',
    categorySlug: 'all',
    discountBadge: 'UP TO 50% OFF',
    ctaText: 'Explore Cyclone Deals'
  },
  {
    id: 2,
    tag: '📱 SMARTPHONE & GADGET CARNIVAL',
    title: 'Samsung S24 Ultra & iPhone 15 Pro',
    highlight: 'Official Brand Warranty',
    subtitle: 'Direct from authorized Bangladesh importers with 0% EMI and free Gaibandha doorstep dispatch.',
    bgGradient: 'from-indigo-950 via-slate-900 to-rose-950',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000&auto=format&fit=crop&q=80',
    categorySlug: 'smartphones-gadgets',
    discountBadge: 'MEGA ৳35,000 SAVINGS',
    ctaText: 'Shop Flagship Mobiles'
  },
  {
    id: 3,
    tag: '🏍️ EVALY-STYLE MOTOR SHOW',
    title: 'Yamaha R15 V4 & Bajaj Pulsar NS160',
    highlight: 'Free Gaibandha BRTA Reg',
    subtitle: 'Drive your dream bike home! Exclusive Cyclone showroom discounts with express delivery.',
    bgGradient: 'from-slate-950 via-stone-900 to-rose-950',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1000&auto=format&fit=crop&q=80',
    categorySlug: 'bikes-vehicles',
    discountBadge: 'CYCLONE EXCLUSIVE',
    ctaText: 'Check Bike Deals'
  }
];

export const HeroSection: React.FC = () => {
  const { 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    products, 
    addToCart, 
    setQuickViewProduct 
  } = useApp();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 18, seconds: 45 });
  const [tickerIndex, setTickerIndex] = useState(0);

  // Live order ticker items
  const tickerEvents = [
    '⚡ Shabbir M. from College Road placed an order for Walton Smart Refrigerator (৳48,900)',
    '🚀 Express delivery dispatched to Govt. College Gate, Gaibandha: Samsung Galaxy S24 Ultra',
    '🎉 Nusrat Jahan saved ৳1,750 with voucher FOKIR100 on Jamdani Saree',
    '⚡ Yamaha R15 V4 booking confirmed for buyer in Sundarganj, Gaibandha'
  ];

  // Auto slide banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Countdown timer simulation for Cyclone deals
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Ticker rotation
  useEffect(() => {
    const tickerTimer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickerEvents.length);
    }, 4000);
    return () => clearInterval(tickerTimer);
  }, []);

  const featuredDeal = products.find(p => p.id === 'kp-101') || products[0];

  return (
    <section className="relative pt-28 md:pt-32 pb-8 bg-gradient-to-b from-rose-50/40 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main Grid: Left Category List + Central Big Banner + Right Promo Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left Category Sidebar (Desktop - Iconic Evaly Layout) */}
          <div className="hidden lg:block lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-3 h-full">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 px-2">
              <span className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-rose-600" />
                Departments
              </span>
              <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                All Live
              </span>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-rose-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>All Mega Categories</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all group ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-rose-50/50 hover:text-rose-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-rose-500 transition-colors" />
                      <span className="truncate">{cat.name}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Gaibandha Branch Info */}
            <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-100 text-[11px] text-slate-600">
              <p className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                📍 College Road Hub
              </p>
              <p className="text-slate-500 leading-snug">
                Pick up directly from our Gaibandha hub or enjoy 2-hour doorstep delivery.
              </p>
            </div>
          </div>

          {/* Central Animated Banner Carousel */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-xl min-h-[380px] md:min-h-[440px] flex flex-col justify-end">
            {HERO_SLIDES.map((slide, idx) => {
              const active = idx === currentSlide;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 flex flex-col justify-between p-6 md:p-8 bg-gradient-to-r ${slide.bgGradient} ${
                    active ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {/* Background overlay image with dark gradient */}
                  <div className="absolute inset-0 -z-10 mix-blend-overlay opacity-30">
                    <img 
                      src={slide.image} 
                      alt={slide.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  {/* Top badge */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/90 text-white text-[11px] font-bold tracking-wide uppercase shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      {slide.tag}
                    </span>
                    <span className="bg-amber-400 text-slate-900 font-black text-xs px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                      {slide.discountBadge}
                    </span>
                  </div>

                  {/* Main Banner Typography */}
                  <div className="mt-auto">
                    <h2 className="text-white text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
                      {slide.title} <br />
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-amber-300 to-white">
                        {slide.highlight}
                      </span>
                    </h2>
                    <p className="mt-2 text-slate-300 text-xs md:text-sm line-clamp-2 max-w-md">
                      {slide.subtitle}
                    </p>

                    <div className="mt-5 flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (slide.categorySlug !== 'all') {
                            setSelectedCategory(slide.categorySlug);
                          }
                          const el = document.getElementById('products-section');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs md:text-sm px-5 py-3 rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <div className="hidden sm:flex items-center gap-1.5 text-xs text-rose-200 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl">
                        <Truck className="w-4 h-4 text-emerald-400" />
                        <span>Gaibandha Local Stock</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Carousel navigation dots & arrows */}
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      i === currentSlide ? 'w-6 bg-rose-500' : 'w-2 bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Highlight Card - Cyclone Flash Deal of the Day */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {featuredDeal && (
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-rose-200/80 relative overflow-hidden flex-1 flex flex-col justify-between">
                
                {/* Header with live timer */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1 text-xs font-black text-rose-600 uppercase tracking-wider">
                      <Zap className="w-4 h-4 fill-rose-600" />
                      Cyclone Flash
                    </span>
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                      -{featuredDeal.discountPercent ?? 0}% OFF
                    </span>
                  </div>

                  {/* Timer UI */}
                  <div className="bg-slate-900 text-white p-2 rounded-xl mb-3 flex items-center justify-between text-center">
                    <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 pl-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ends In:</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-xs font-bold">
                      <span className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-400">
                        {String(timeLeft.hours).padStart(2, '0')}
                      </span>
                      :
                      <span className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-400">
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </span>
                      :
                      <span className="bg-slate-800 px-1.5 py-0.5 rounded text-rose-400">
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Product preview */}
                  <div 
                    onClick={() => setQuickViewProduct(featuredDeal)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-50 mb-2 border border-slate-100">
                      <img 
                        src={featuredDeal.image} 
                        alt={featuredDeal.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        {featuredDeal.seller}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-rose-600 transition-colors">
                      {featuredDeal.name}
                    </h3>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-black text-rose-600">
                      ৳{(featuredDeal.price ?? 0).toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ৳{(featuredDeal.originalPrice ?? 0).toLocaleString()}
                    </span>
                  </div>

                  {/* Stock meter */}
                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                      <span>Sold: {featuredDeal.soldCount ?? 0}</span>
                      <span className="text-rose-600">Only {featuredDeal.stock ?? 0} left!</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-rose-600 h-full rounded-full" 
                        style={{ width: `${Math.min(100, ((featuredDeal.soldCount ?? 0) / Math.max(1, (featuredDeal.soldCount ?? 0) + (featuredDeal.stock ?? 0))) * 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Instant Actions */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setQuickViewProduct(featuredDeal)}
                    className="w-full py-2 px-2 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Quick View
                  </button>
                  <button
                    onClick={() => addToCart(featuredDeal)}
                    className="w-full py-2 px-2 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm shadow-rose-600/30 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Grab Now</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Gaibandha Express Promo */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold leading-tight">Gaibandha Sadar Express</p>
                <p className="text-[10px] text-emerald-100 leading-tight">Orders on College Rd delivered in 2h</p>
              </div>
            </div>
          </div>

        </div>

        {/* Live Activity Ticker */}
        <div className="mt-4 bg-white rounded-2xl px-4 py-2.5 shadow-xs border border-slate-200/80 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            <span className="shrink-0 font-bold text-rose-600 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-rose-600" />
              LIVE TICKER:
            </span>
            <p className="text-slate-600 font-medium truncate transition-all duration-300">
              {tickerEvents[tickerIndex]}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-slate-500 font-semibold text-[11px] shrink-0">
            <span>📍 College Road, Gaibandha</span>
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-white rounded-2xl p-3 border border-slate-200/70 flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-none">100% Authentic</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Direct brand warranty</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-slate-200/70 flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-none">Fast Gaibandha Delivery</p>
              <p className="text-[10px] text-slate-500 mt-0.5">2-24 Hours doorstep delivery</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-slate-200/70 flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-none">bKash, Nagad & COD</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Safe instant checkout</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-slate-200/70 flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <RefreshCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-none">7 Days Return</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Hassle-free replacement</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
