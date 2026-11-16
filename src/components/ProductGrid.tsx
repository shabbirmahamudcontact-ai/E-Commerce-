import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ProductCard } from './ProductCard.tsx';
import { SlidersHorizontal, ArrowUpDown, Zap, PackageOpen } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    categories, 
    searchQuery,
    setSearchQuery 
  } = useApp();

  const [sortOption, setSortOption] = useState<'featured' | 'price-low' | 'price-high' | 'discount' | 'popular'>('featured');
  const [cycloneFilter, setCycloneFilter] = useState(false);

  // Filter products by category, search query, and cyclone
  let filtered = [...products];

  if (selectedCategory !== 'all') {
    filtered = filtered.filter(p => p.categorySlug === selectedCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      (p.name || '').toLowerCase().includes(q) || 
      (p.bengaliName || '').toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  }

  if (cycloneFilter) {
    filtered = filtered.filter(p => p.isCyclone);
  }

  // Sort
  if (sortOption === 'price-low') {
    filtered.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  } else if (sortOption === 'price-high') {
    filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  } else if (sortOption === 'discount') {
    filtered.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0));
  } else if (sortOption === 'popular') {
    filtered.sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0));
  }

  const activeCategoryObj = categories.find(c => c.slug === selectedCategory);

  return (
    <section id="products-section" className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Catalog Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              {activeCategoryObj ? activeCategoryObj.name : 'Trending Marketplace Deals'}
            </h2>
            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {filtered.length} items
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified sellers with express delivery from College Road, Gaibandha hub
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Cyclone filter toggle */}
          <button
            onClick={() => setCycloneFilter(!cycloneFilter)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              cycloneFilter
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${cycloneFilter ? 'fill-white' : 'text-rose-600'}`} />
            <span>Cyclone Deals Only</span>
          </button>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="bg-transparent font-bold outline-none cursor-pointer"
            >
              <option value="featured">Featured Deals</option>
              <option value="popular">Most Popular (Sold)</option>
              <option value="discount">Biggest Discount %</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 mt-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 mt-6 p-8">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No products found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            We couldn't find items matching your search or filters in Gaibandha stock.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setCycloneFilter(false);
            }}
            className="mt-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

    </section>
  );
};
