import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  X, 
  User as UserIcon, 
  Package, 
  Heart, 
  Wallet, 
  MapPin, 
  Phone, 
  Mail, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Truck, 
  ShoppingBag, 
  Tag, 
  Copy, 
  Check,
  ShieldCheck,
  Building,
  Printer,
  Bike,
  Coins,
  Award,
  Sparkles
} from 'lucide-react';

export const UserPanelModal: React.FC = () => {
  const { 
    user, 
    orders, 
    wishlist, 
    products, 
    addToCart, 
    toggleWishlist, 
    updateProfile, 
    logout, 
    isUserPanelOpen, 
    setIsUserPanelOpen,
    selectedOrderTracking,
    setSelectedOrderTracking,
    openInvoice,
    openRiderTracking,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'wishlist' | 'wallet' | 'points'>('orders');
  
  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || 'College Road, Gaibandha');
  const [city, setCity] = useState(user?.city || 'Gaibandha Sadar');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isUserPanelOpen || !user) return null;

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    await updateProfile({ name, phone, email, address, city });
    setIsSavingProfile(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(text);
    showToast(`Copied code: ${text}`, 'info');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const orderStatuses = [
    { title: 'Order Confirmed', desc: 'Received at Kapaly System', icon: CheckCircle2 },
    { title: 'Processing & Packed', desc: 'Packed with security seal', icon: Package },
    { title: 'Hub Received (Gaibandha)', desc: 'Arrival at College Road Hub', icon: Building },
    { title: 'Out for Delivery', desc: 'Rider is on the way', icon: Truck },
    { title: 'Delivered', desc: 'Handed over to customer', icon: CheckCircle2 }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95"
      >
        {/* Top Header Card */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => {
                logout();
                setIsUserPanelOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer border border-rose-400/40"
              title="Sign out of Fokirer Bajar"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
            <button
              onClick={() => {
                setIsUserPanelOpen(false);
                setSelectedOrderTracking(null);
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white font-black text-2xl flex items-center justify-center shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black">{user.name}</h2>
                  <span className="text-[10px] bg-rose-500/80 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                    Gaibandha VIP
                  </span>
                </div>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>College Road, Gaibandha</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {user.phone} • {user.email}
                </p>
              </div>
            </div>

            {/* Quick Wallet & Points Badges */}
            <div className="flex sm:flex-col gap-2 shrink-0">
              <div 
                onClick={() => setActiveTab('wallet')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl px-3 py-1.5 text-left border border-white/10 cursor-pointer transition-colors"
                title="View Wallet & Vouchers"
              >
                <p className="text-[10px] uppercase font-bold text-rose-300">Fokirer Bajar Wallet</p>
                <p className="text-sm font-black text-white">৳{user.balance.toLocaleString()}</p>
              </div>
              <div 
                onClick={() => setActiveTab('points')}
                className="bg-amber-500/20 hover:bg-amber-500/30 backdrop-blur-md rounded-xl px-3 py-1.5 text-left border border-amber-400/40 cursor-pointer transition-colors shadow-2xs group"
                title="View Loyalty Points & Rewards"
              >
                <p className="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1">
                  <span>Club Points</span>
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                </p>
                <p className="text-sm font-black text-amber-300 group-hover:scale-105 transition-transform">{user.points} pts</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 border-t border-white/10 pt-3 overflow-x-auto">
            <button
              onClick={() => {
                setActiveTab('orders');
                setSelectedOrderTracking(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'orders' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>My Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('points')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'points' ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold' : 'text-amber-300 hover:text-amber-100'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Loyalty Points ({user.points})</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'wishlist' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Wishlist ({wishlist.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'wallet' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Wallet & Vouchers</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'profile' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Profile & Address</span>
            </button>

            <button
              onClick={logout}
              className="ml-auto text-rose-300 hover:text-rose-100 text-xs font-bold flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50">
          
          {/* TAB 1: Orders & Tracking */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* If specific order is selected for live tracking */}
              {selectedOrderTracking ? (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <button
                        onClick={() => setSelectedOrderTracking(null)}
                        className="text-xs font-bold text-rose-600 hover:underline mb-1 cursor-pointer block"
                      >
                        ← Back to all orders
                      </button>
                      <h3 className="text-base font-extrabold text-slate-900">
                        Live Tracking: {selectedOrderTracking.id}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Tracking Number: <strong>{selectedOrderTracking.trackingNumber}</strong>
                      </p>
                    </div>

                    <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full uppercase">
                      {selectedOrderTracking.orderStatus}
                    </span>
                  </div>

                  {/* Status Timeline */}
                  <div className="py-2">
                    <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                      Gaibandha Delivery Timeline:
                    </p>
                    <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {orderStatuses.map((st, i) => {
                        const IconComponent = st.icon;
                        const isDone = i <= 2; // Demo current status index
                        return (
                          <div key={i} className="relative flex items-start gap-3">
                            <div className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isDone ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-500'
                            }`}>
                              ✓
                            </div>
                            <div>
                              <p className={`text-xs font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                                {st.title}
                              </p>
                              <p className="text-[11px] text-slate-500">{st.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Itemized Order Details */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <p className="text-xs font-bold text-slate-700">Purchased Items:</p>
                    {selectedOrderTracking.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                          <span className="font-medium text-slate-800 truncate max-w-[200px]">{item.name} × {item.quantity}</span>
                        </div>
                        <span className="font-bold text-slate-900">৳{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-bold text-slate-900">
                      <span>Total (Paid via {selectedOrderTracking.paymentMethod}):</span>
                      <span className="text-rose-600">৳{selectedOrderTracking.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions inside tracking */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => openInvoice(selectedOrderTracking)}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-amber-400" />
                      <span>Print Tax Invoice 🧾</span>
                    </button>
                    <button
                      onClick={() => openRiderTracking(selectedOrderTracking)}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md shadow-rose-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Bike className="w-4 h-4" />
                      <span>Follow Rider Live 🛵</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Orders List */
                orders.length > 0 ? (
                  orders.map(order => (
                    <div 
                      key={order.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-rose-300 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div>
                          <span className="font-black text-sm text-slate-900">{order.id}</span>
                          <p className="text-[11px] text-slate-400">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="bg-rose-50 text-rose-700 border border-rose-200 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                            {order.orderStatus}
                          </span>
                          <p className="text-xs font-black text-slate-900 mt-1">৳{order.total.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Items preview */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {order.items.map((it, i) => (
                          <div key={i} className="flex items-center gap-1.5 shrink-0 bg-slate-50 p-1.5 rounded-xl border border-slate-100 text-xs">
                            <img src={it.image} alt="" className="w-7 h-7 rounded-lg object-cover" />
                            <span className="text-[11px] font-semibold text-slate-700 max-w-[120px] truncate">{it.name}</span>
                            <span className="text-[10px] text-slate-400">({it.quantity})</span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-slate-500 text-[11px]">
                          Delivery: <strong>{order.city}</strong>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openInvoice(order)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                            title="Print Invoice"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>
                          <button
                            onClick={() => openRiderTracking(order)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                            title="Follow Rider"
                          >
                            <Bike className="w-3.5 h-3.5" />
                            <span>Rider</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 p-6">
                    <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No orders placed yet</p>
                    <p className="text-xs text-slate-400 mt-1">Browse our Cyclone offers and place your first order!</p>
                  </div>
                )
              )}

            </div>
          )}

          {/* TAB 2: Wishlist */}
          {activeTab === 'wishlist' && (
            <div>
              {wishlistedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {wishlistedProducts.map(prod => (
                    <div key={prod.id} className="bg-white rounded-2xl p-3 border border-slate-200 flex gap-3 items-center">
                      <img src={prod.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{prod.name}</h4>
                        <p className="text-sm font-black text-rose-600 mt-0.5">৳{prod.price.toLocaleString()}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => addToCart(prod)}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => toggleWishlist(prod.id)}
                            className="text-[10px] text-slate-400 hover:text-rose-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 p-6">
                  <Heart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">Your wishlist is empty</p>
                  <p className="text-xs text-slate-400 mt-1">Click the heart icon on any product to save it for later.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Wallet & Vouchers */}
          {activeTab === 'wallet' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-rose-600 to-amber-500 rounded-2xl p-5 text-white shadow-md">
                <span className="text-xs font-bold text-rose-100 uppercase tracking-wider">Total Available Balance</span>
                <h3 className="text-3xl font-black mt-1">৳{user.balance.toLocaleString()}</h3>
                <p className="text-xs text-rose-100 mt-1">
                  Ready to spend instantly on any order in Gaibandha with zero deduction fee!
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Available Promo Vouchers</h4>
                <div className="space-y-2.5">
                  {[
                    { code: 'KAPALY100', desc: '৳100 flat discount on orders over ৳1,000', badge: 'Active' },
                    { code: 'CYCLONE50', desc: '15% instant discount on Cyclone deals', badge: 'Active' },
                    { code: 'GAIBANDHA', desc: 'Free Express delivery on College Road orders', badge: 'Active' }
                  ].map(v => (
                    <div key={v.code} className="bg-white rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            {v.code}
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            {v.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{v.desc}</p>
                      </div>

                      <button
                        onClick={() => copyToClipboard(v.code)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {copiedCode === v.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode === v.code ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3.5: Loyalty Club Points & Rewards */}
          {activeTab === 'points' && (
            <div className="space-y-4 animate-in fade-in">
              {/* VIP Member Gold Card */}
              <div className="bg-gradient-to-br from-amber-600 via-amber-500 to-rose-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="absolute right-4 top-4 text-amber-200/40 text-6xl font-black pointer-events-none">
                  ★
                </div>

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 border border-white/20">
                      <Award className="w-3.5 h-3.5 text-amber-200" />
                      {user.points >= 1500 ? 'Platinum VIP' : user.points >= 500 ? 'Gold VIP Member' : 'Silver Member'}
                    </span>
                    <span className="text-xs text-amber-100 font-semibold">Fokirer Bajar Club</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-100">ID: {user.phone}</span>
                </div>

                <div className="relative z-10">
                  <span className="text-xs font-bold text-amber-100 uppercase tracking-wider">Total Available Points</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-4xl sm:text-5xl font-black tracking-tight">{user.points}</h3>
                    <span className="text-lg font-bold text-amber-100">Points</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-amber-200 border border-white/10">
                    <span>Equivalent Cash Value:</span>
                    <strong className="text-white text-sm">৳{user.points} Discount</strong>
                  </div>
                </div>

                {/* VIP Tier Progress */}
                <div className="mt-5 pt-4 border-t border-white/20 relative z-10">
                  <div className="flex justify-between text-xs text-amber-100 font-semibold mb-1.5">
                    <span>Tier Progress ({user.points >= 1500 ? 'Max Level Reached!' : `${1500 - user.points} pts to Next Tier`})</span>
                    <span>{Math.min(100, Math.round((user.points / 1500) * 100))}%</span>
                  </div>
                  <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="bg-white h-full rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${Math.min(100, Math.max(5, (user.points / 1500) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* How points work rule cards */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                  How Points Work (পয়েন্ট অর্জন ও ব্যবহারের নিয়মাবলী)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs text-left">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-2">
                      🛍️
                    </div>
                    <h5 className="text-xs font-extrabold text-slate-900">Earn On Every Order</h5>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      প্রতি ২০ টাকা কেনাকাটায় পাচ্ছেন ১ লয়্যালটি পয়েন্ট। প্রতি অর্ডারে স্বয়ংক্রিয়ভাবে যোগ হয়।
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs text-left">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-2">
                      💸
                    </div>
                    <h5 className="text-xs font-extrabold text-slate-900">1 Point = ৳1 Discount</h5>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      চেকআউট করার সময় সরাসরি পয়েন্ট ব্যবহার করে মোট বিল থেকে নগদ সমপরিমাণ ছাড় নিন!
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs text-left">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-2">
                      🎁
                    </div>
                    <h5 className="text-xs font-extrabold text-slate-900">Welcome & VIP Bonus</h5>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      রেজিস্ট্রেশনে ৫০ ওয়েলকাম পয়েন্ট ও সাইক্লোন মেগা অফারে দ্বিগুণ লয়্যালটি রিওয়ার্ড।
                    </p>
                  </div>
                </div>
              </div>

              {/* Points Activity History / Ledger */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Points Activity History (পয়েন্ট লেনদেনের বিবরণ)
                  </h4>
                  <span className="text-[11px] text-slate-500 font-semibold">{orders.length + 1} transactions</span>
                </div>

                <div className="space-y-2">
                  {/* Order-based transactions */}
                  {orders.map((ord) => (
                    <div key={ord.id} className="bg-white rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
                          <Coins className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            Purchase Reward - Order #{ord.id}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {new Date(ord.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • Paid ৳{ord.total.toLocaleString()}
                          </p>
                          {ord.pointsUsed && ord.pointsUsed > 0 ? (
                            <p className="text-[10px] text-amber-700 font-semibold mt-0.5">
                              Redeemed {ord.pointsUsed} pts for ৳{ord.pointsDiscount} discount
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          +{ord.pointsEarned || Math.max(5, Math.floor(ord.total / 20))} pts
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Sign-up Welcome Bonus Transaction */}
                  <div className="bg-white rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-sm shrink-0">
                        🎁
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Welcome Registration Bonus</p>
                        <p className="text-[11px] text-slate-400">Account Activated with Gaibandha VIP privileges</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        +50 pts
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button to Shop and Earn */}
              <button
                onClick={() => {
                  setIsUserPanelOpen(false);
                  const el = document.getElementById('products-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-extrabold text-xs sm:text-sm py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Shop Products & Earn More Points Now</span>
              </button>
            </div>
          )}

          {/* TAB 4: Profile & Address */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Personal Information & Primary Delivery Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City / Upazila</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-rose-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Detailed Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-rose-500"
                    placeholder="College Road, Gaibandha"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  {isSavingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              {/* Account Session & Direct Logout */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Current Account Session</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Signed in as <strong className="text-slate-800">{user.email || user.phone}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsUserPanelOpen(false);
                    }}
                    className="bg-white hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-300 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out of Account</span>
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
