import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  X, 
  MapPin, 
  Phone, 
  User as UserIcon, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Printer, 
  Bike, 
  MessageSquare,
  Lock,
  Sparkles,
  Coins,
  Award
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { 
    cart, 
    cartTotal, 
    user, 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    placeOrder,
    openInvoice,
    openRiderTracking,
    showToast,
    selectedLocation
  } = useApp();

  const [step, setStep] = useState<'details' | 'payment_process' | 'confirmed'>('details');
  const [formData, setFormData] = useState({
    customerName: user?.name || 'Shabbir Mahamud',
    phone: user?.phone || '01712345678',
    shippingAddress: user?.address || 'College Road, Near Govt. Boys High School',
    city: user?.city || 'Gaibandha Sadar',
    notes: 'Please call before arrival at College Road.',
    deliverySpeed: 'express'
  });

  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Card' | 'COD'>('bKash');
  
  // OTP-only payment state (NO PIN REQUIRED!)
  const [mfsPhone, setMfsPhone] = useState(user?.phone || '01712345678');
  const [mfsOtp, setMfsOtp] = useState('');
  const [receivedSmsOtp, setReceivedSmsOtp] = useState<string | null>(null);
  const [mfsStep, setMfsStep] = useState<'enter_phone' | 'enter_otp'>('enter_phone');
  const [isProcessingOtp, setIsProcessingOtp] = useState(false);
  const [placedOrderResult, setPlacedOrderResult] = useState<any>(null);

  // Loyalty Points state MUST be declared before any early return (Rules of Hooks)
  const userPoints = user?.points || 0;
  const [usePoints, setUsePoints] = useState(false);
  const maxRedeemablePoints = Math.min(userPoints, cartTotal);
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);

  // Sync customer info & reset step when modal opens
  useEffect(() => {
    if (isCheckoutOpen) {
      setStep('details');
      setPlacedOrderResult(null);
      setUsePoints(false);
      setPointsToRedeem(0);
      setFormData(prev => ({
        ...prev,
        customerName: user?.name || prev.customerName || 'Customer',
        phone: user?.phone || prev.phone || '01712345678',
        shippingAddress: user?.address || prev.shippingAddress || 'College Road, Gaibandha',
        city: user?.city || prev.city || 'Gaibandha Sadar'
      }));
      if (user?.phone) {
        setMfsPhone(user.phone);
      }
    }
  }, [isCheckoutOpen, user]);

  if (!isCheckoutOpen) return null;

  const handleTogglePoints = (checked: boolean) => {
    setUsePoints(checked);
    if (checked) {
      const defaultAmount = Math.min(maxRedeemablePoints, userPoints > 100 ? 100 : userPoints);
      setPointsToRedeem(defaultAmount);
    } else {
      setPointsToRedeem(0);
    }
  };

  const pointsDiscount = usePoints ? Math.min(pointsToRedeem, maxRedeemablePoints) : 0;
  const deliveryFee = cartTotal >= 1500 ? 0 : 60;
  const grandTotal = Math.max(0, cartTotal - pointsDiscount) + deliveryFee;
  const projectedPointsEarned = Math.max(5, Math.floor(grandTotal / 20));

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'COD') {
      completeOrder('COD');
    } else {
      setStep('payment_process');
      setMfsStep('enter_phone');
      setReceivedSmsOtp(null);
      setMfsOtp('');
    }
  };

  const handleSendOtp = async () => {
    if (!mfsPhone) {
      showToast('Please enter your mobile number', 'error');
      return;
    }
    setIsProcessingOtp(true);
    try {
      const res = await fetch('/api/payment/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: mfsPhone, method: paymentMethod, amount: grandTotal })
      });
      const data = await res.json();
      if (data.success && data.otp) {
        setReceivedSmsOtp(data.otp);
        setMfsOtp(data.otp); // Pre-fill for convenience
        setMfsStep('enter_otp');
        showToast(`SMS sent to ${mfsPhone}! OTP is ${data.otp}`, 'success');
      } else {
        showToast('Failed to send OTP. Try again.', 'error');
      }
    } catch {
      showToast('Error requesting OTP from server', 'error');
    } finally {
      setIsProcessingOtp(false);
    }
  };

  const handleVerifyOtpAndPay = async () => {
    if (!mfsOtp || mfsOtp.length < 4) {
      showToast('Please enter the verification OTP sent to your phone', 'error');
      return;
    }
    setIsProcessingOtp(true);
    try {
      const res = await fetch('/api/payment/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: mfsPhone, otp: mfsOtp, method: paymentMethod, amount: grandTotal })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`${paymentMethod} payment verified via SMS OTP!`, 'success');
        await completeOrder(paymentMethod);
      } else {
        showToast(data.error || 'OTP verification failed', 'error');
      }
    } catch {
      showToast('Payment verification network error', 'error');
    } finally {
      setIsProcessingOtp(false);
    }
  };

  const completeOrder = async (method: 'bKash' | 'Nagad' | 'Rocket' | 'Card' | 'COD') => {
    const payload = {
      userId: user?.id || 'guest_user',
      customerName: formData.customerName,
      phone: formData.phone,
      shippingAddress: formData.shippingAddress,
      city: formData.city,
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      subtotal: cartTotal,
      deliveryFee,
      discount: pointsDiscount,
      total: grandTotal,
      paymentMethod: method,
      notes: formData.notes,
      pointsUsed: usePoints ? pointsToRedeem : 0,
      pointsDiscount
    };

    const res = await placeOrder(payload);
    if (res.success && res.order) {
      setPlacedOrderResult(res.order);
      setStep('confirmed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md">
              FB
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                {step === 'details' && 'Fokirer Bajar - Secure Checkout'}
                {step === 'payment_process' && `${paymentMethod} OTP Payment (No PIN Required)`}
                {step === 'confirmed' && 'Order Confirmed! 🎉'}
              </h2>
              <p className="text-[11px] text-slate-500">
                Hub: College Road, Gaibandha Sadar • 2-Hour Express Delivery
              </p>
            </div>
          </div>

          {step !== 'confirmed' && (
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STEP 1: Details & Payment Selection */}
        {step === 'details' && cart.length === 0 && (
          <div className="p-8 text-center space-y-3">
            <p className="text-sm font-extrabold text-slate-900">Your cart is currently empty</p>
            <p className="text-xs text-slate-500">Add products to your cart before proceeding to checkout.</p>
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
            >
              Browse Marketplace
            </button>
          </div>
        )}

        {step === 'details' && cart.length > 0 && (
          <form onSubmit={handleStartPayment} className="p-5 sm:p-6 space-y-5">
            
            {/* Delivery Details */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  1. Delivery Details (Gaibandha)
                </span>
                <span className="text-[11px] text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded">
                  Doorstep Rider Service
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 mb-1 block">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-semibold outline-none focus:border-rose-500 focus:bg-white"
                      placeholder="Receiver's name"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 mb-1 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-semibold outline-none focus:border-rose-500 focus:bg-white"
                      placeholder="017xxxxxxxx"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 mb-1 block">Detailed Address</label>
                  <input
                    type="text"
                    required
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-rose-500 focus:bg-white"
                    placeholder="House/Holding number, Road, Landmark (e.g. College Road, Gaibandha)"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 mb-1 block">City / Upazila</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 mb-1 block">Delivery Instructions</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-rose-500 focus:bg-white"
                    placeholder="E.g. Call before delivery"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <CreditCard className="w-4 h-4 text-rose-600" />
                2. Select Payment Method
              </span>
              <p className="text-[11px] text-slate-500 mb-3">
                🔒 Safe MFS verification: Only phone SMS OTP is required. No PIN needed!
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* bKash */}
                <div
                  onClick={() => setPaymentMethod('bKash')}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'bKash'
                      ? 'border-[#e2136e] bg-pink-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#e2136e] text-xs">bKash (বিকাশ)</span>
                    {paymentMethod === 'bKash' && <CheckCircle2 className="w-4 h-4 text-[#e2136e]" />}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">SMS OTP Verification</p>
                </div>

                {/* Nagad */}
                <div
                  onClick={() => setPaymentMethod('Nagad')}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'Nagad'
                      ? 'border-[#f7941d] bg-orange-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#d85e05] text-xs">Nagad (নগদ)</span>
                    {paymentMethod === 'Nagad' && <CheckCircle2 className="w-4 h-4 text-[#d85e05]" />}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">Post Office Digital</p>
                </div>

                {/* Rocket */}
                <div
                  onClick={() => setPaymentMethod('Rocket')}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'Rocket'
                      ? 'border-[#8c3589] bg-purple-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#8c3589] text-xs">Rocket (রকেট)</span>
                    {paymentMethod === 'Rocket' && <CheckCircle2 className="w-4 h-4 text-[#8c3589]" />}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">Dutch-Bangla Bank</p>
                </div>

                {/* Debit/Credit Card */}
                <div
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'Card'
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-indigo-700 text-xs">Card / Visa</span>
                    {paymentMethod === 'Card' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">Visa / Mastercard</p>
                </div>

                {/* Cash on Delivery (COD) */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between sm:col-span-2 ${
                    paymentMethod === 'COD'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-700 text-xs">Cash on Delivery (ক্যাশ অন ডেলিভারি)</span>
                    {paymentMethod === 'COD' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">Pay cash when package arrives at College Road</p>
                </div>
              </div>
            </div>

            {/* Loyalty Points Redemption Box */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-rose-500/10 rounded-2xl p-4 border border-amber-300/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    <Coins className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-slate-900">Fokirer Bajar Club Points</span>
                      <span className="bg-amber-400/90 text-slate-900 font-black text-[10px] px-2 py-0.2 rounded-full">
                        {userPoints} pts
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {userPoints > 0 
                        ? `Available balance: ${userPoints} pts (worth ৳${userPoints} discount)`
                        : 'Earn 1 point per ৳20 spent on this order!'}
                    </p>
                  </div>
                </div>

                {userPoints > 0 && (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={usePoints}
                      onChange={(e) => handleTogglePoints(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                )}
              </div>

              {/* Points Adjustment Controls when active */}
              {usePoints && userPoints > 0 && (
                <div className="mt-3 pt-3 border-t border-amber-200/70 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-semibold">Redeem Points (১ পয়েন্ট = ১ টাকা):</span>
                    <span className="font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-300">
                      {pointsToRedeem} pts = ৳{pointsDiscount} off
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max={maxRedeemablePoints}
                    value={pointsToRedeem}
                    onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-1.5 bg-amber-200 rounded-lg"
                  />

                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[50, 100, 250, 500].filter(pts => pts <= maxRedeemablePoints).map(pts => (
                      <button
                        key={pts}
                        type="button"
                        onClick={() => setPointsToRedeem(pts)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                          pointsToRedeem === pts
                            ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                        }`}
                      >
                        {pts} pts (৳{pts})
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPointsToRedeem(maxRedeemablePoints)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        pointsToRedeem === maxRedeemablePoints
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                          : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-50'
                      }`}
                    >
                      Use Max ({maxRedeemablePoints} pts)
                    </button>
                  </div>
                </div>
              )}

              {/* Projected Points to Earn */}
              <div className="mt-2.5 pt-2 border-t border-amber-200/50 flex items-center justify-between text-[11px] text-amber-900 font-semibold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Loyalty Reward for this purchase:</span>
                </span>
                <span className="bg-white/90 border border-amber-200 px-2 py-0.5 rounded-full font-bold text-amber-700">
                  +{projectedPointsEarned} pts to earn
                </span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items ({cart.length})</span>
                <span className="font-semibold text-slate-900">৳{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Gaibandha Local Delivery Fee</span>
                <span className="font-semibold text-slate-900">
                  {deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `৳${deliveryFee}`}
                </span>
              </div>
              {pointsDiscount > 0 && (
                <div className="flex justify-between text-amber-600 font-bold">
                  <span>Loyalty Points Discount ({pointsToRedeem} pts):</span>
                  <span>-৳{pointsDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount to Pay</span>
                <span className="text-rose-600 text-base">৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{paymentMethod === 'COD' ? 'Confirm Cash on Delivery Order' : `Continue to ${paymentMethod} (OTP on Phone)`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Realistic Bangladeshi OTP Gateway (NO PIN NEEDED!) */}
        {step === 'payment_process' && (
          <div className="p-6 text-center space-y-4">
            
            {/* Incoming Simulated SMS Banner when OTP is sent */}
            {receivedSmsOtp && (
              <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-2xl text-left shadow-md flex items-start gap-3 animate-in slide-in-from-top-2">
                <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[11px] text-amber-950 uppercase">📲 SMS from FOKIRER-BAJAR</span>
                    <span className="text-[10px] text-amber-700 font-bold">Just Now</span>
                  </div>
                  <p className="text-xs text-slate-800 font-medium mt-1 leading-snug">
                    Your {paymentMethod} payment verification OTP is <strong className="text-rose-600 text-sm font-mono tracking-wider font-black">{receivedSmsOtp}</strong>. Valid for 5 minutes. DO NOT SHARE.
                  </p>
                </div>
              </div>
            )}

            <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white text-lg font-black shadow-lg ${
              paymentMethod === 'bKash' ? 'bg-[#e2136e]' : paymentMethod === 'Nagad' ? 'bg-[#f7941d]' : 'bg-indigo-600'
            }`}>
              {paymentMethod}
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                {paymentMethod} Secure Payment
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Merchant: <strong>Fokirer Bajar (College Road, Gaibandha)</strong>
              </p>
              <p className="text-sm font-black text-rose-600 mt-1">
                Payable Amount: ৳{grandTotal.toLocaleString()}
              </p>
            </div>

            {/* MFS Phone input */}
            {mfsStep === 'enter_phone' && (
              <div className="max-w-xs mx-auto space-y-3">
                <label className="text-xs font-bold text-slate-700 block text-left">
                  Enter your {paymentMethod} Mobile Number:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={mfsPhone}
                    onChange={(e) => setMfsPhone(e.target.value)}
                    className="w-full border-2 border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-center font-bold text-slate-900 tracking-wider outline-none focus:border-rose-500"
                    placeholder="017XXXXXXXX"
                  />
                </div>
                <button
                  type="button"
                  disabled={isProcessingOtp}
                  onClick={handleSendOtp}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-rose-600/20"
                >
                  {isProcessingOtp ? 'Sending OTP via SMS...' : 'Send OTP to Phone (ওটিপি পাঠান)'}
                </button>
              </div>
            )}

            {/* MFS OTP input (NO PIN!) */}
            {mfsStep === 'enter_otp' && (
              <div className="max-w-xs mx-auto space-y-3">
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-semibold">
                  ✓ OTP code has been sent to {mfsPhone}
                </div>
                <label className="text-xs font-bold text-slate-700 block text-left">
                  Enter 6-digit OTP (কোনো পিন নম্বর লাগবে না):
                </label>
                <input
                  type="text"
                  value={mfsOtp}
                  onChange={(e) => setMfsOtp(e.target.value)}
                  className="w-full border-2 border-rose-400 rounded-xl px-4 py-2.5 text-center font-mono text-xl font-black text-slate-900 tracking-widest outline-none focus:ring-2 focus:ring-rose-200"
                  maxLength={6}
                  placeholder="------"
                />
                
                <button
                  type="button"
                  disabled={isProcessingOtp}
                  onClick={handleVerifyOtpAndPay}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  {isProcessingOtp ? (
                    <span>Verifying OTP & Processing...</span>
                  ) : (
                    <span>Verify OTP & Confirm Payment ৳{grandTotal.toLocaleString()}</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-[11px] text-slate-500 hover:text-slate-800 underline block mx-auto cursor-pointer"
                >
                  Resend OTP Code
                </button>
              </div>
            )}

            <button
              onClick={() => setStep('details')}
              className="text-xs text-slate-500 hover:text-slate-800 underline block mx-auto cursor-pointer pt-2"
            >
              Back to Checkout Details
            </button>
          </div>
        )}

        {/* STEP 3: Order Confirmed Screen with Invoice & Follow Rider */}
        {step === 'confirmed' && placedOrderResult && (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="bg-rose-100 text-rose-700 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                Order Confirmed on Fokirer Bajar
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                ধন্যবাদ, {placedOrderResult.customerName}!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your order is dispatched from our College Road, Gaibandha Hub.
              </p>
            </div>

            {/* Tracking & Receipt Summary */}
            <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Order ID:</span>
                <strong className="text-rose-600 font-mono font-black">{placedOrderResult.id}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Invoice Number:</span>
                <strong className="font-mono text-slate-800">{placedOrderResult.invoiceNumber}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Delivery Hub:</span>
                <span className="font-medium text-slate-800">College Road, Gaibandha</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Assigned Rider:</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Bike className="w-3.5 h-3.5 text-rose-600" />
                  Md. Karim Mia (Hero Splendor)
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-700">Total Paid ({placedOrderResult.paymentMethod}):</span>
                <span className="text-base font-black text-rose-600">৳{placedOrderResult.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Loyalty Points Rewards Earned Banner */}
            {placedOrderResult.pointsEarned && placedOrderResult.pointsEarned > 0 && (
              <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border-2 border-amber-300 rounded-2xl p-4 text-left flex items-center justify-between gap-3 shadow-xs animate-in zoom-in-95">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-sm">
                    🏆
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-black text-amber-950">
                        +{placedOrderResult.pointsEarned} Club Points Credited!
                      </p>
                      <span className="text-[10px] bg-amber-400 text-slate-900 font-extrabold px-2 py-0.2 rounded-full uppercase">
                        Loyalty Reward
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {placedOrderResult.pointsUsed > 0 
                        ? `You saved ৳${placedOrderResult.pointsDiscount} by redeeming ${placedOrderResult.pointsUsed} points. Remaining & new points are ready in your profile!`
                        : `Points added to your Fokirer Bajar account. Redeem them as cash discounts on your next purchase!`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS: Print Invoice & Follow Rider! */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => openInvoice(placedOrderResult)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print Official Invoice 🧾</span>
              </button>

              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  openRiderTracking(placedOrderResult);
                }}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bike className="w-4 h-4 animate-bounce" />
                <span>Follow Rider Live 🛵</span>
              </button>
            </div>

            <button
              onClick={() => {
                setIsCheckoutOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline block mx-auto cursor-pointer mt-2"
            >
              Continue Shopping on Fokirer Bajar
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
