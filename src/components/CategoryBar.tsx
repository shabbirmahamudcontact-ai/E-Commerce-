import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Smartphone, 
  Shirt, 
  Tv, 
  ShoppingBag, 
  Bike, 
  Sparkles, 
  Layers
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-5 h-5" />,
  Shirt: <Shirt className="w-5 h-5" />,
  Tv: <Tv className="w-5 h-5" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5" />,
  Bike: <Bike className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />
};

export const CategoryBar: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory } = useApp();

  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            Shop by Popular Department
          </h2>
          <p className="text-xs text-slate-500">
            Browse verified authentic items delivered across Gaibandha
          </p>
        </div>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`text-xs font-bold transition-colors cursor-pointer ${
            selectedCategory === 'all' ? 'text-rose-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          View All Departments
        </button>
      </div>

      {/* Horizontal Scrollable Category Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        
        {/* All Products pill */}
        <button
          onClick={() => setSelectedCategory('all')}
          className={`shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className={`p-1.5 rounded-xl ${selectedCategory === 'all' ? 'bg-white/20' : 'bg-rose-50 text-rose-600'}`}>
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold leading-none">All Departments</p>
            <p className={`text-[10px] mt-0.5 ${selectedCategory === 'all' ? 'text-rose-100' : 'text-slate-400'}`}>
              Full Store
            </p>
          </div>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-600'}`}>
                {ICON_MAP[cat.icon] || <ShoppingBag className="w-4 h-4" />}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold leading-none">{cat.name}</p>
                <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-rose-100' : 'text-slate-400'}`}>
                  {cat.count} Items
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
