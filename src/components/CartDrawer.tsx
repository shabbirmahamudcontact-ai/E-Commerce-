import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Tag, 
  Check, 
  Sparkles,
  MapPin
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    cartTotal, 
    cartCount, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    isCartOpen, 
    setIsCartOpen,
    setIsCheckoutOpen,
    selectedLocation
  } = useApp();

  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [voucherError, setVoucherError] = useState('');

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 1500;
  const progressPercent = Math.min(100, (cartTotal / freeDeliveryThreshold) * 100);
  const amountNeeded = Math.max(0, freeDeliveryThreshold - cartTotal);

  const handleApplyVoucher = async (codeToTry?: string) => {
    const code = (codeToTry || voucherCode).trim().toUpperCase();
    if (!code) return;
    setVoucherError('');

    try {
      const res = await fetch('/api/vouchers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: cartTotal })
      }).then(r => r.json());

      if (res.valid) {
        setAppliedVoucher({ code, discount: res.discount });
        setVoucherCode('');
      } else {
        setVoucherError(res.message || 'Invalid voucher');
      }
    } catch {
      setVoucherError('Failed to validate voucher');
    }
  };

  const deliveryFee = cartTotal >= freeDeliveryThreshold || appliedVoucher?.code === 'GAIBANDHA' ? 0 : 60;
  const discount = appliedVoucher?.discount || 0;
  const grandTotal = Math.max(0, cartTotal + deliveryFee - discount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Your Cart ({cartCount})</h2>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-600" />
                  <span>Delivering to: {selectedLocation}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-slate-200/60 text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress in Gaibandha */}
          <div className="p-3 bg-rose-50/60 border-b border-rose-100">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1 text-rose-950">
                <Truck className="w-3.5 h-3.5 text-rose-600" />
                {amountNeeded === 0 ? '🎉 You unlocked FREE Delivery in Gaibandha!' : `Add ৳${amountNeeded.toLocaleString()} more for FREE Delivery!`}
              </span>
              <span className="font-bold text-rose-600">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-rose-200/70 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-rose-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
            {cart.length > 0 ? (
              cart.map(({ product, quantity }) => (
                <div key={product.id} className="py-3.5 flex gap-3 group">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{product.name}</h4>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">{product.brand}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-black text-rose-600">
                        ৳{(product.price * quantity).toLocaleString()}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800 min-w-[24px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Your Kapaly Cart is empty</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">
                  Add exciting Cyclone deals and daily essentials from College Road!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-rose-700 cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* Footer with Voucher & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-3">
              
              {/* Voucher Input */}
              <div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. KAPALY100)"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs uppercase font-bold outline-none focus:border-rose-500"
                    />
                  </div>
                  <button
                    onClick={() => handleApplyVoucher()}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {/* Quick Voucher Chips */}
                <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 text-[10px]">
                  <span className="text-slate-400 font-semibold shrink-0">Try:</span>
                  <button 
                    onClick={() => handleApplyVoucher('KAPALY100')}
                    className="bg-white hover:bg-rose-50 text-rose-600 border border-dashed border-rose-300 font-bold px-2 py-0.5 rounded cursor-pointer shrink-0"
                  >
                    KAPALY100
                  </button>
                  <button 
                    onClick={() => handleApplyVoucher('CYCLONE50')}
                    className="bg-white hover:bg-rose-50 text-rose-600 border border-dashed border-rose-300 font-bold px-2 py-0.5 rounded cursor-pointer shrink-0"
                  >
                    CYCLONE50
                  </button>
                  <button 
                    onClick={() => handleApplyVoucher('GAIBANDHA')}
                    className="bg-white hover:bg-rose-50 text-rose-600 border border-dashed border-rose-300 font-bold px-2 py-0.5 rounded cursor-pointer shrink-0"
                  >
                    GAIBANDHA
                  </button>
                </div>

                {appliedVoucher && (
                  <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied {appliedVoucher.code}: -৳{appliedVoucher.discount}</span>
                  </p>
                )}
                {voucherError && (
                  <p className="text-xs font-semibold text-rose-600 mt-1">{voucherError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">৳{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gaibandha Delivery Fee</span>
                  <span className="font-semibold text-slate-900">
                    {deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `৳${deliveryFee}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Voucher Discount</span>
                    <span>-৳{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="text-rose-600 text-base">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
