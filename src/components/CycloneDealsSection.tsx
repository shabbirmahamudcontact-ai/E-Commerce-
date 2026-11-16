import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ProductCard } from './ProductCard.tsx';
import { Zap, Flame, Clock, Sparkles, ArrowRight } from 'lucide-react';

export const CycloneDealsSection: React.FC = () => {
  const { products, setSelectedCategory } = useApp();

  const cycloneProducts = products.filter(p => p.isCyclone);

  if (cycloneProducts.length === 0) return null;

  return (
    <section className="py-8 bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white rounded-3xl mx-4 max-w-7xl lg:mx-auto my-6 px-4 md:px-8 shadow-xl relative overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

      {/* Header with Title and Countdown */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-slate-900 font-black text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-slate-900" />
              Cyclone Flash Sale
            </span>
            <span className="text-xs text-rose-200 font-medium">Limited Stock In Gaibandha</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <span>Mega Cyclone Offers</span>
            <Flame className="w-7 h-7 text-amber-400 fill-amber-400 animate-bounce" />
          </h2>
          <p className="text-xs md:text-sm text-rose-100/80 mt-0.5">
            Up to 50% Cashback, instant discounts & exclusive express delivery at College Road.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            setSelectedCategory('all');
            const el = document.getElementById('products-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-white hover:bg-rose-50 text-rose-900 font-bold text-xs md:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>View All Cyclone Deals</span>
          <ArrowRight className="w-4 h-4 text-rose-600" />
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 relative z-10">
        {cycloneProducts.slice(0, 4).map(product => (
          <div key={product.id} className="text-slate-900">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
