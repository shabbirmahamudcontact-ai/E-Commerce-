import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { apiFetch, loadStaticFallbackDb } from '../lib/api.ts';
import { Review } from '../types.ts';
import { 
  X, 
  Star, 
  ShoppingCart, 
  Heart, 
  Truck, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  MapPin, 
  Store,
  Share2,
  ThumbsUp,
  MessageSquare,
  PenLine,
  Filter,
  Check,
  Sparkles,
  ArrowUpDown,
  Copy,
  ExternalLink,
  Globe,
  MessageCircle,
  Send
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setIsCheckoutOpen,
    showToast,
    user,
    submitReview,
    voteHelpful
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [filterStar, setFilterStar] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'helpful'>('recent');
  const [votedReviewIds, setVotedReviewIds] = useState<Set<string>>(new Set());

  // Social Share State
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Form State
  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load reviews when modal product changes
  useEffect(() => {
    if (quickViewProduct?.id) {
      setLoadingReviews(true);
      apiFetch(`/api/products/${quickViewProduct.id}/reviews`)
        .then(res => (res.ok ? res.json() : null))
        .then(async data => {
          if (data && Array.isArray(data.reviews)) {
            setReviews(data.reviews);
          } else {
            const fb = await loadStaticFallbackDb();
            setReviews(fb.reviews.filter(r => r.productId === quickViewProduct.id));
          }
        })
        .catch(async () => {
          const fb = await loadStaticFallbackDb();
          setReviews(fb.reviews.filter(r => r.productId === quickViewProduct.id));
        })
        .finally(() => {
          setLoadingReviews(false);
        });

      // Reset form & share states
      setQuantity(1);
      setActiveImageIndex(0);
      setIsWritingReview(false);
      setFilterStar('all');
      setNewRating(5);
      setNewTitle('');
      setNewComment('');
      setSelectedTags([]);
      setFormError(null);
      setCopied(false);
      setShowShareMenu(false);
      if (user?.name) {
        setNewUserName(user.name);
      }
      if (user?.city) {
        setNewLocation(user.city);
      } else {
        setNewLocation('College Road, Gaibandha');
      }
    }
  }, [quickViewProduct?.id, user?.name, user?.city]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isWishlisted = isInWishlist(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleInstantBuy = () => {
    addToCart(product, quantity);
    setQuickViewProduct(null);
    setIsCheckoutOpen(true);
  };

  const getProductShareUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${window.location.pathname}#product-${product.id}`;
    }
    return `https://fokirerbajar.com.bd/#product-${product.id}`;
  };

  const getShareText = () => {
    return `Check out "${product.name}" (৳${product.price.toLocaleString()}) on Fokirer Bajar - Mega E-Commerce Marketplace, College Road, Gaibandha!`;
  };

  const handleCopyUrlOnly = async () => {
    const shareUrl = getProductShareUrl();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        showToast('Product URL copied to clipboard! (লিংক কপি করা হয়েছে)', 'success');
      }
    } catch (e) {
      console.warn('Clipboard write error:', e);
      showToast('Could not copy link automatically', 'error');
    }
  };

  const handleNativeShareDirect = async () => {
    const shareUrl = getProductShareUrl();
    const shareText = getShareText();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | Fokirer Bajar`,
          text: shareText,
          url: shareUrl,
        });
        showToast('Shared successfully!', 'success');
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          showToast('Sharing cancelled or unavailable', 'info');
        }
      }
    } else {
      showToast('Native sharing not supported on this browser. Use social buttons below!', 'info');
    }
  };

  const handleShare = async () => {
    const shareUrl = getProductShareUrl();
    const shareText = getShareText();

    // 1. Copy product URL to clipboard
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        showToast('Product URL copied to clipboard! (লিংক কপি করা হয়েছে)', 'success');
      }
    } catch (err) {
      console.warn('Clipboard write error:', err);
    }

    // 2. Open native sharing options if available
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | Fokirer Bajar`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          setShowShareMenu(true);
        }
      }
    } else {
      // If Web Share API is not available on device/browser, toggle social share options
      setShowShareMenu(prev => !prev);
    }
  };

  // Pre-defined quick tags
  const QUICK_TAGS = [
    '⚡ 2-Hour Gaibandha Delivery',
    '📦 Secure Bubble Packaging',
    '💯 100% Genuine Product',
    '💰 Best Price & Cyclone Offer',
    '🌟 High Quality Build',
    '👌 Friendly Rider Service'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  // Submit Review Form
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newComment.trim() || newComment.trim().length < 5) {
      setFormError('Please write a review comment with at least 5 characters.');
      return;
    }

    setSubmitting(true);
    const finalComment = selectedTags.length > 0
      ? `${newComment.trim()}\n\nHighlights: ${selectedTags.join(', ')}`
      : newComment.trim();

    const res = await submitReview(product.id, {
      rating: newRating,
      comment: finalComment,
      title: newTitle.trim() || undefined,
      userName: newUserName.trim() || user?.name || 'Customer at College Road',
      location: newLocation.trim() || 'College Road, Gaibandha'
    });

    setSubmitting(false);

    if (res.success && res.review) {
      setReviews(prev => [res.review!, ...prev]);
      setIsWritingReview(false);
      setNewComment('');
      setNewTitle('');
      setSelectedTags([]);
      setFilterStar('all');
    } else if (res.error) {
      setFormError(res.error);
    }
  };

  // Vote helpful
  const handleVoteHelpful = async (reviewId: string) => {
    if (votedReviewIds.has(reviewId)) {
      showToast('You have already marked this review as helpful!', 'info');
      return;
    }

    setVotedReviewIds(prev => new Set(prev).add(reviewId));
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r));

    await voteHelpful(reviewId);
    showToast('Thank you for your feedback on this review!', 'success');
  };

  // Calculate rating statistics
  const totalReviewsCount = reviews.length;
  const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
  const currentAvgRating = totalReviewsCount > 0 ? Number((ratingSum / totalReviewsCount).toFixed(1)) : (product.rating ?? 5.0);

  const distribution: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    const star = Math.max(1, Math.min(5, Math.round(r.rating)));
    distribution[star] = (distribution[star] || 0) + 1;
  });

  // Filter and sort reviews
  const filteredReviews = reviews.filter(r => {
    if (filterStar === 'all') return true;
    return Math.round(r.rating) === filterStar;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'highest') {
      return b.rating - a.rating;
    }
    if (sortBy === 'helpful') {
      return (b.helpfulCount || 0) - (a.helpfulCount || 0);
    }
    // recent
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5: return '⭐⭐⭐⭐⭐ 5 Stars - Outstanding / অসাধারণ!';
      case 4: return '⭐⭐⭐⭐ 4 Stars - Very Good / খুবই ভালো';
      case 3: return '⭐⭐⭐ 3 Stars - Average / মোটামুটি';
      case 2: return '⭐⭐ 2 Stars - Below Average / প্রত্যাশার চেয়ে কম';
      case 1: return '⭐ 1 Star - Poor / সন্তোষজনক নয়';
      default: return 'Rate this product';
    }
  };

  const activeRatingValue = hoverRating || newRating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full my-auto max-h-[92vh] overflow-y-auto relative animate-in zoom-in-95 duration-200 flex flex-col"
      >
        {/* Top action buttons: Share & Close */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handleShare}
            className={`h-9 px-3 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white/95 hover:bg-white border-slate-200 text-slate-700 hover:text-rose-600'
            }`}
            title="Share product (Copies URL & opens native share)"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-rose-600" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          <button
            onClick={() => setQuickViewProduct(null)}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Product Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pb-4">
          
          {/* Left: Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
              <img
                src={images[activeImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail switcher if multiple images */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === i ? 'border-rose-600 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Local hub badge */}
            <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl text-xs text-rose-950 flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <p className="font-bold">Dispatch from Gaibandha Hub</p>
                <p className="text-[11px] text-slate-500">College Road, Gaibandha Sadar (Delivery in 2h - 24h)</p>
              </div>
            </div>
          </div>

          {/* Right: Info, Pricing & Purchase */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Brand & Category */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-bold text-rose-600 uppercase tracking-wider">{product.brand}</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold">{product.category}</span>
              </div>

              {/* Title & Bengali Title */}
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                {product.name}
              </h1>
              {product.bengaliName && (
                <p className="text-sm font-semibold text-slate-500 mt-0.5">
                  {product.bengaliName}
                </p>
              )}

              {/* Interactive Rating & Sold anchor */}
              <div className="flex items-center gap-2.5 mt-2.5 pb-3 border-b border-slate-100">
                <button
                  onClick={() => {
                    const el = document.getElementById('reviews-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100/90 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs group"
                  title="Click to view all reviews and rating breakdown"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{(currentAvgRating ?? 5.0).toFixed(1)}</span>
                  <div className="flex items-center text-amber-400 ml-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= Math.round(currentAvgRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-200 text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-amber-900/80 group-hover:text-rose-600 ml-1">
                    ({totalReviewsCount} {totalReviewsCount === 1 ? 'review' : 'reviews'})
                  </span>
                </button>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-emerald-600">{product.soldCount ?? 0} items sold</span>
              </div>

              {/* Pricing Box */}
              <div className="bg-slate-50 rounded-2xl p-4 my-3 border border-slate-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-rose-600">
                    ৳{(product.price ?? 0).toLocaleString()}
                  </span>
                  {(product.originalPrice ?? 0) > (product.price ?? 0) && (
                    <span className="text-sm sm:text-base text-slate-400 line-through">
                      ৳{(product.originalPrice ?? 0).toLocaleString()}
                    </span>
                  )}
                  {(product.discountPercent ?? 0) > 0 && (
                    <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      -{product.discountPercent}% OFF
                    </span>
                  )}
                </div>
                {(product.originalPrice ?? 0) > (product.price ?? 0) && (
                  <p className="text-xs font-bold text-emerald-600 mt-1">
                    You save ৳{((product.originalPrice ?? 0) - (product.price ?? 0)).toLocaleString()} with Cyclone Mega Deal!
                  </p>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">Key Specifications:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Seller & Social Sharing Area */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs flex-wrap gap-2">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Store className="w-4 h-4 text-slate-400" />
                  <span>Seller: <strong className="text-slate-900">{product.seller}</strong></span>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Dedicated Social Media Sharing Button */}
                  <button 
                    type="button"
                    onClick={handleShare} 
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                      copied 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 ring-2 ring-emerald-200' 
                        : 'bg-white hover:bg-rose-50 border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-600'
                    }`}
                    title="Copy product URL to clipboard and open native share options"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Share Product</span>
                      </>
                    )}
                  </button>

                  {/* Wishlist Button */}
                  <button 
                    type="button"
                    onClick={() => toggleWishlist(product.id)} 
                    className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                      isWishlisted 
                        ? 'bg-rose-50 border-rose-300 text-rose-600' 
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                    title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Social Media Sharing Drawer / Options Panel */}
              {showShareMenu && (
                <div className="mt-3 p-3.5 bg-gradient-to-br from-rose-50/60 to-amber-50/50 border border-rose-200/80 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-rose-600" />
                      <span className="text-xs font-extrabold text-slate-900">
                        Share on Social Media (বন্ধুদের সাথে শেয়ার করুন)
                      </span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowShareMenu(false)}
                      className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-white/80 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 1-Click Social Media Channels */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {/* WhatsApp */}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(getShareText() + '\n' + getProductShareUrl())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xs transition-all text-center group cursor-pointer"
                      title="Share to WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 mb-0.5" />
                      <span className="text-[10px] font-bold">WhatsApp</span>
                    </a>

                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getProductShareUrl())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-all text-center group cursor-pointer"
                      title="Share to Facebook"
                    >
                      <Globe className="w-4 h-4 mb-0.5" />
                      <span className="text-[10px] font-bold">Facebook</span>
                    </a>

                    {/* Telegram */}
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(getProductShareUrl())}&text=${encodeURIComponent(getShareText())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white shadow-2xs transition-all text-center group cursor-pointer"
                      title="Share to Telegram"
                    >
                      <Send className="w-4 h-4 mb-0.5" />
                      <span className="text-[10px] font-bold">Telegram</span>
                    </a>

                    {/* X (Twitter) */}
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(getProductShareUrl())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 hover:bg-black text-white shadow-2xs transition-all text-center group cursor-pointer"
                      title="Share to X"
                    >
                      <span className="text-xs font-black mb-0.5">𝕏</span>
                      <span className="text-[10px] font-bold">X (Twitter)</span>
                    </a>
                  </div>

                  {/* Copy URL Input Bar */}
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                    <input
                      type="text"
                      readOnly
                      value={getProductShareUrl()}
                      className="text-xs text-slate-600 bg-transparent px-2 flex-1 outline-none font-mono truncate"
                    />
                    <button
                      type="button"
                      onClick={handleCopyUrlOnly}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        copied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 hover:bg-rose-700 text-white'
                      }`}
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Native Device Share Sheet button if supported */}
                  {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <button
                      type="button"
                      onClick={handleNativeShareDirect}
                      className="mt-2 w-full py-1.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      <span>Open Device Native Share Sheet</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions: Quantity + Add to Cart + Buy Now */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Select Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-slate-900 min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    addToCart(product, quantity);
                    setQuickViewProduct(null);
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-3 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleInstantBuy}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm py-3 rounded-2xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>Instant Buy</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* DEDICATED STAR-RATING & CUSTOMER REVIEWS SECTION */}
        <div id="reviews-section" className="border-t border-slate-200/90 bg-slate-50/70 p-6 sm:p-7 rounded-b-3xl">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  Verified Feedback
                </span>
                <span className="text-xs text-slate-500 font-medium">College Road & Bangladesh Shoppers</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
                <span>Customer Reviews & Ratings</span>
                <span className="text-sm font-semibold text-slate-400">({totalReviewsCount})</span>
              </h2>
            </div>

            {/* Toggle Write a Review Button */}
            <button
              onClick={() => setIsWritingReview(!isWritingReview)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                isWritingReview
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
              }`}
            >
              <PenLine className="w-4 h-4" />
              <span>{isWritingReview ? 'Cancel Review' : 'Write a Review'}</span>
            </button>
          </div>

          {/* Rating Summary Card & Distribution */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Big Average Score Display (Left) */}
            <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left justify-center md:pr-6 md:border-r border-slate-100">
              <span className="text-5xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
                {(currentAvgRating ?? 5.0).toFixed(1)}
                <span className="text-lg font-bold text-slate-400">/ 5.0</span>
              </span>

              {/* 5 Stars Visual */}
              <div className="flex items-center gap-1 my-2 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${
                      s <= Math.round(currentAvgRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-slate-200 text-slate-200'
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                Based on <strong className="text-slate-900">{totalReviewsCount}</strong> verified customer reviews
              </p>
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Genuine Reviews from Gaibandha Buyers</span>
              </p>
            </div>

            {/* Rating Breakdown Bar Chart (Right) */}
            <div className="md:col-span-7 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
                <span>Rating Breakdown</span>
                {filterStar !== 'all' && (
                  <button 
                    onClick={() => setFilterStar('all')} 
                    className="text-rose-600 hover:underline text-[11px] cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[star] || 0;
                const percent = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
                const isSelected = filterStar === star;

                return (
                  <div
                    key={star}
                    onClick={() => setFilterStar(isSelected ? 'all' : star)}
                    className={`flex items-center gap-3 p-1.5 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-50 ring-1 ring-amber-300' : 'hover:bg-slate-50'
                    }`}
                    title={`Click to filter by ${star} star reviews`}
                  >
                    <span className="text-xs font-bold text-slate-700 w-12 flex items-center gap-1">
                      {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </span>
                    
                    {/* Progress Bar */}
                    <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSelected ? 'bg-amber-500' : 'bg-amber-400'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="text-right w-16">
                      <span className="text-xs font-semibold text-slate-700">{count}</span>
                      <span className="text-[10px] text-slate-400 ml-1">({percent}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Interactive "Write a Review" Form */}
          {isWritingReview && (
            <div className="bg-white rounded-2xl p-6 border-2 border-rose-200 shadow-md mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                    <PenLine className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Rate & Review "{product.name.slice(0, 36)}..."
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Your honest experience helps shoppers in Gaibandha make confident choices.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsWritingReview(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formError && (
                <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-4">
                
                {/* 1. Star Rating Selector */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                    Overall Rating (স্টার রেটিং নির্বাচন করুন) *
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 p-2 bg-amber-50/70 border border-amber-200/60 rounded-xl">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setNewRating(star)}
                          className="p-1 rounded-lg transition-transform hover:scale-125 cursor-pointer text-amber-400 focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                              star <= activeRatingValue
                                ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                                : 'fill-slate-200 text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <span className="text-xs sm:text-sm font-bold text-amber-800 ml-2">
                      {getRatingLabel(activeRatingValue)}
                    </span>
                  </div>
                </div>

                {/* 2. Quick Highlight Tags */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    What stood out? (দ্রুত ট্যাগ যোগ করুন)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_TAGS.map((tag) => {
                      const isTagSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                            isTagSelected
                              ? 'bg-rose-50 border-rose-400 text-rose-700 font-bold'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {isTagSelected && <Check className="w-3 h-3 text-rose-600" />}
                          <span>{tag}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Review Headline / Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Review Headline (সংক্ষিপ্ত শিরোনাম)
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Excellent build quality & fast delivery to College Road!"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                {/* 4. Text Review Comment */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Detailed Review (বিস্তারিত মতামত লিখুন) *
                  </label>
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="পণ্যটির গুণগত মান, প্যাকেজিং, এবং গাইবান্ধা ডেলিভারি রাইডারের সার্ভিস কেমন ছিল? Share your genuine feedback..."
                    className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    required
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                    <span>Minimum 5 characters</span>
                    <span>{newComment.length} characters</span>
                  </div>
                </div>

                {/* 5. Reviewer Name & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Name (আপনার নাম) *
                    </label>
                    <input
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="e.g. Shabbir Mahamud"
                      required
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Location / Delivery Zone (এলাকা)
                    </label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. College Road, Gaibandha"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsWritingReview(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md shadow-rose-600/30 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Submit Review</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* Reviews Filter & Sort Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                Filter:
              </span>
              <button
                onClick={() => setFilterStar('all')}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  filterStar === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                All ({totalReviewsCount})
              </button>

              {[5, 4, 3, 2, 1].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStar(s)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    filterStar === s
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{s}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-[10px] opacity-80">({distribution[s] || 0})</span>
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-slate-400" />
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1 font-semibold focus:outline-none focus:border-rose-500 cursor-pointer text-xs"
              >
                <option value="recent">Most Recent (নতুন প্রথমে)</option>
                <option value="highest">Highest Rating (সর্বোচ্চ রেটিং)</option>
                <option value="helpful">Most Helpful (সর্বাধিক সহায়ক)</option>
              </select>
            </div>

          </div>

          {/* Customer Reviews List */}
          {loadingReviews ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold">Loading customer reviews...</p>
            </div>
          ) : sortedReviews.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-300 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                {filterStar === 'all' ? 'No reviews yet for this product' : `No ${filterStar}-star reviews found`}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Have you bought this product? Be the first in Gaibandha to leave a star rating and review!
              </p>
              <button
                onClick={() => setIsWritingReview(true)}
                className="mt-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Write First Review
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {sortedReviews.map((rev) => {
                const isHelpfulVoted = votedReviewIds.has(rev.id);
                const initials = rev.userName
                  .split(' ')
                  .map(part => part[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('')
                  .toUpperCase() || 'U';

                return (
                  <div
                    key={rev.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      
                      {/* User Info & Rating */}
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-2xs">
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-none">
                              {rev.userName}
                            </h4>
                            {rev.verifiedPurchase && (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Verified Buyer</span>
                              </span>
                            )}
                          </div>

                          {/* Star Rating & Location */}
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <div className="flex items-center text-amber-400">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= rev.rating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'fill-slate-200 text-slate-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[11px] font-bold text-amber-700">
                              {rev.rating}.0
                            </span>
                            {rev.location && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                                  <MapPin className="w-3 h-3 text-rose-500" />
                                  <span>{rev.location}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Date */}
                      <span className="text-[11px] text-slate-400 whitespace-nowrap font-medium">
                        {new Date(rev.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>

                    </div>

                    {/* Review Title */}
                    {rev.title && (
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 mt-3">
                        {rev.title}
                      </h5>
                    )}

                    {/* Review Body */}
                    <p className="text-xs sm:text-sm text-slate-700 mt-1.5 leading-relaxed whitespace-pre-line">
                      {rev.comment}
                    </p>

                    {/* Review Footer / Helpful Vote */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span className="text-[11px]">Was this review helpful?</span>
                      <button
                        onClick={() => handleVoteHelpful(rev.id)}
                        disabled={isHelpfulVoted}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isHelpfulVoted
                            ? 'bg-rose-50 text-rose-600 font-bold'
                            : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isHelpfulVoted ? 'fill-rose-600 text-rose-600' : ''}`} />
                        <span>Helpful ({rev.helpfulCount || 0})</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
