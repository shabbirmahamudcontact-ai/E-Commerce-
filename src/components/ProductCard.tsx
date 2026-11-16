import React from 'react';
import { Product } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';
import { Heart, ShoppingCart, Eye, Star, Zap, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useApp();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-rose-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      
      {/* Top badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {product.badge && (
            <span className="bg-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
              {product.badge}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="bg-amber-400 text-slate-900 font-black text-[10px] px-1.5 py-0.5 rounded shadow-2xs">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            isWishlisted 
              ? 'bg-rose-50 text-rose-600 shadow-md scale-110' 
              : 'bg-white/80 hover:bg-white text-slate-400 hover:text-rose-600 shadow-xs'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>
      </div>

      {/* Image Thumbnail with Hover Quick View Button */}
      <div 
        onClick={() => setQuickViewProduct(product)}
        className="relative aspect-square w-full overflow-hidden bg-slate-50 cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="bg-white/95 hover:bg-white text-slate-800 text-xs font-bold px-3 py-2 rounded-xl shadow-lg flex items-center gap-1.5 hover:scale-105 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-rose-600" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-semibold text-rose-600 uppercase tracking-wider">{product.brand}</span>
            <span className="truncate max-w-[120px]">{product.category}</span>
          </div>

          {/* Product Name & Bengali Title */}
          <h3 
            onClick={() => setQuickViewProduct(product)}
            className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 hover:text-rose-600 transition-colors cursor-pointer leading-snug"
          >
            {product.name}
          </h3>
          {product.bengaliName && (
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
              {product.bengaliName}
            </p>
          )}

          {/* Ratings & Sold Count */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex items-center gap-1.5 mt-2 cursor-pointer group/rating hover:opacity-95"
            title={`${product.rating.toFixed(1)} out of 5 stars (${product.reviewsCount} customer reviews) - Click to view reviews`}
          >
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 text-amber-800 px-1.5 py-0.5 rounded-md text-[11px] font-extrabold shadow-2xs">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <div className="hidden xs:flex items-center text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-2.5 h-2.5 ${
                    star <= Math.round(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-slate-200 text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-400 font-medium group-hover/rating:text-rose-600 transition-colors">
              ({product.reviewsCount} {product.reviewsCount === 1 ? 'review' : 'reviews'})
            </span>
            <span className="text-[10px] text-slate-300">•</span>
            <span className="text-[10px] text-emerald-600 font-semibold truncate">
              {product.soldCount} sold
            </span>
          </div>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-base sm:text-lg font-black text-slate-900">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through ml-1.5">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {product.originalPrice > product.price && (
              <span className="text-[10px] font-bold text-emerald-600">
                Save ৳{(product.originalPrice - product.price).toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock remaining info */}
          <div className="mb-2">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-rose-500 h-full rounded-full" 
                style={{ width: `${Math.min(100, (product.soldCount / (product.soldCount + product.stock)) * 100)}%` }} 
              />
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(product)}
            className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-sm shadow-rose-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>

      </div>

    </div>
  );
};
