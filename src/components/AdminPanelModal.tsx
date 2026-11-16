import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  X, 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Bike, 
  Tag, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Printer, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Search, 
  TrendingUp, 
  DollarSign, 
  ShieldAlert, 
  RefreshCcw,
  Sparkles,
  ExternalLink,
  Lock,
  KeyRound
} from 'lucide-react';
import { Product, Order } from '../types.ts';

export const AdminPanelModal: React.FC = () => {
  const { 
    user,
    isAdminOpen, 
    setIsAdminOpen, 
    adminLogin,
    exitAdminMode,
    products, 
    orders, 
    categories, 
    updateOrderStatusAdmin, 
    addProductAdmin, 
    deleteProductAdmin, 
    openInvoice, 
    openRiderTracking,
    showToast
  } = useApp();

  const [adminPasscodeInput, setAdminPasscodeInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'riders' | 'vouchers'>('overview');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [searchOrderQuery, setSearchOrderQuery] = useState('');
  const [searchProductQuery, setSearchProductQuery] = useState('');
  
  // Add Product form state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdBengali, setNewProdBengali] = useState('');
  const [newProdCat, setNewProdCat] = useState('smartphones-gadgets');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdOrigPrice, setNewProdOrigPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('20');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80');
  const [newProdBrand, setNewProdBrand] = useState('KAPALY Official');
  const [newProdBadge, setNewProdBadge] = useState('Cyclone Deal ⚡');
  const [newProdIsCyclone, setNewProdIsCyclone] = useState(true);

  if (!isAdminOpen) return null;

  const handleVerifyPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPasscodeInput.trim()) {
      setAuthError('দয়া করে এডমিন পাসকোড লিখুন');
      return;
    }
    setIsVerifying(true);
    setAuthError('');
    const res = await adminLogin(adminPasscodeInput.trim());
    setIsVerifying(false);
    if (!res.success) {
      setAuthError(res.message || 'ভুল এডমিন পাসকোড! শুধুমাত্র অনুমোদিত কর্মকর্তা প্রবেশ করতে পারবেন।');
    } else {
      setAdminPasscodeInput('');
    }
  };

  // STRICT ACCESS CONTROL: If the current user is not an admin, render the locked security gate
  if (!user || user.role !== 'admin') {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
        <div 
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl border border-rose-200/80 max-w-md w-full p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden animate-in zoom-in-95"
        >
          {/* Top Decorative Warning Header */}
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>সংরক্ষিত এডমিন পোর্টাল (Restricted)</span>
          </div>

          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            প্রশাসনিক অনুমোদন আবশ্যক
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            সাধারণ গ্রাহকদের জন্য এই প্যানেল দেখা বা ডেটা অ্যাক্সেস করা সম্পূর্ণরূপে সংরক্ষিত। এটি শুধুমাত্র <strong>ফকিরের বাজার</strong> এর কলেজ রোড, গাইবান্ধা কেন্দ্রীয় ম্যানেজমেন্টের জন্য।
          </p>

          <form onSubmit={handleVerifyPasscode} className="w-full mt-6 space-y-3.5">
            <div className="text-left">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>এডমিন সিক্রেট পাসকোড</span>
                <span className="text-[10px] text-slate-400 font-normal">ডিফল্ট: admin2026</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={adminPasscodeInput}
                  onChange={(e) => {
                    setAdminPasscodeInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="এডমিন পাসকোড লিখুন..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white transition-all"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
              {authError && (
                <p className="text-xs text-rose-600 font-semibold mt-1.5 text-left flex items-center gap-1">
                  <span>⚠️</span> {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <RefreshCcw className="w-4 h-4 animate-spin text-amber-300" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
              )}
              <span>{isVerifying ? 'যাচাই করা হচ্ছে...' : 'যাচাই করুন ও এডমিন আনলক করুন'}</span>
            </button>
          </form>

          <div className="w-full pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setAuthError('');
                setIsAdminOpen(false);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>⬅️ কেনাকাটায় ফিরে যান</span>
            </button>
            <span className="text-[10px] text-slate-400">
              📍 Hub: College Road, Gaibandha
            </span>
          </div>
        </div>
      </div>
    );
  }
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
  const totalItemsSold = products.reduce((sum, p) => sum + p.soldCount, 0);
  const lowStockCount = products.filter(p => p.stock <= 10).length;

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesFilter = orderFilter === 'all' || o.orderStatus === orderFilter;
    const matchesSearch = searchOrderQuery === '' || 
      o.id.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
      o.phone.includes(searchOrderQuery);
    return matchesFilter && matchesSearch;
  });

  // Filtered Products
  const filteredProducts = products.filter(p => {
    return searchProductQuery === '' ||
      p.name.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
      p.bengaliName.includes(searchProductQuery) ||
      p.brand.toLowerCase().includes(searchProductQuery.toLowerCase());
  });

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(newProdPrice);
    const origPriceNum = Number(newProdOrigPrice) || priceNum;
    if (!newProdName || !priceNum) {
      showToast('Please fill required product name and price', 'error');
      return;
    }

    const discount = origPriceNum > priceNum 
      ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) 
      : 0;

    const selectedCategoryObj = categories.find(c => c.slug === newProdCat);

    const payload: Omit<Product, 'id'> = {
      name: newProdName,
      bengaliName: newProdBengali || newProdName,
      category: selectedCategoryObj?.name || 'Smartphones & Gadgets',
      categorySlug: newProdCat,
      price: priceNum,
      originalPrice: origPriceNum,
      discountPercent: discount,
      stock: Number(newProdStock) || 20,
      soldCount: 0,
      rating: 5.0,
      reviewsCount: 1,
      image: newProdImage,
      images: [newProdImage],
      description: `${newProdName} - Guaranteed official brand warranty with express doorstep delivery from College Road, Gaibandha hub.`,
      features: ['Official 1 Year Warranty', 'Express 2-Hour Gaibandha Dispatch', 'Genuine Product Seal'],
      brand: newProdBrand,
      isCyclone: newProdIsCyclone,
      isExpress: true,
      badge: newProdBadge,
      seller: 'Fokirer Bajar Gaibandha Hub'
    };

    const ok = await addProductAdmin(payload);
    if (ok) {
      setShowAddProductModal(false);
      // Reset form
      setNewProdName('');
      setNewProdBengali('');
      setNewProdPrice('');
      setNewProdOrigPrice('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-6xl w-full h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95"
      >
        {/* Top Navbar of Admin */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white font-black text-xl flex items-center justify-center shadow-md">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  Fokirer Bajar Admin Control Center
                </h2>
                <span className="hidden sm:inline-block bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ● Hub Live (College Road, 5700)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Gaibandha E-Commerce Headquarters • Full Merchant Administration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exitAdminMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-all border border-amber-400/30 cursor-pointer shadow-xs"
              title="Return to customer mode (Hide admin panel)"
            >
              <span>👤</span>
              <span className="hidden sm:inline">গ্রাহক মোডে যান</span>
            </button>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
              title="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 border-b border-slate-200 text-xs font-bold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === 'overview' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === 'orders' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders Management ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === 'products' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Products & Stock ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('riders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === 'riders' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Rider Fleet (Gaibandha)</span>
          </button>

          <button
            onClick={() => setActiveTab('vouchers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === 'vouchers' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Promo Vouchers</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Metric KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Sales</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    ৳{totalRevenue.toLocaleString()}
                  </h3>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+24.5% this week in Gaibandha</span>
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
                    <Package className="w-4 h-4 text-rose-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {orders.length} Orders
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold mt-1">
                    College Road Hub active
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Live Catalog</span>
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {products.length} Products
                  </h3>
                  <p className="text-[11px] text-blue-600 font-semibold mt-1">
                    {totalItemsSold} items dispatched
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock Alert</span>
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-amber-600">
                    {lowStockCount} Items
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold mt-1">
                    Restock advised at Gaibandha Hub
                  </p>
                </div>
              </div>

              {/* Hub Operations & Fast Action */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* Recent Orders in Gaibandha */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <h4 className="text-sm font-extrabold text-slate-900">Recent Customer Orders</h4>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      View All Orders →
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {orders.slice(0, 4).map(o => (
                      <div key={o.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-slate-900 font-bold">{o.id}</strong>
                            <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                              {o.orderStatus}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] mt-0.5">{o.customerName} • {o.shippingAddress}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-black text-rose-600">৳{o.total.toLocaleString()}</span>
                          <button
                            onClick={() => openInvoice(o)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                            title="Print Invoice"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hub Quick Info */}
                <div className="bg-gradient-to-br from-slate-900 to-rose-950 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Distribution Hub
                    </span>
                    <h4 className="text-base font-extrabold mt-2">College Road Central Hub</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      All orders for Gaibandha Sadar, Sundarganj, Gobindaganj and nearby upazilas are packaged and dispatched from here.
                    </p>

                    <div className="mt-4 space-y-2 text-xs text-slate-300">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span>College Road, Gaibandha - 5700</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Hotline: 09638-FOKIR (36547)</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('products');
                      setShowAddProductModal(true);
                    }}
                    className="mt-5 w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product to Store</span>
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, Customer name or phone..."
                    value={searchOrderQuery}
                    onChange={(e) => setSearchOrderQuery(e.target.value)}
                    className="w-full bg-transparent outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto">
                  {['all', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered'].map(st => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                        orderFilter === st
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st === 'all' ? 'All Orders' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Order ID & Date</th>
                        <th className="py-3 px-4">Customer Details</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Amount & Payment</th>
                        <th className="py-3 px-4">Current Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-black text-slate-900 font-mono">{order.id}</span>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </td>

                          <td className="py-3.5 px-4">
                            <strong className="text-slate-900 block">{order.customerName}</strong>
                            <span className="text-[11px] text-slate-500">{order.phone}</span>
                            <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{order.shippingAddress}</p>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-800">{order.items.length} item(s)</span>
                            <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                              {order.items.map(it => it.name).join(', ')}
                            </p>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-black text-rose-600 block">৳{order.total.toLocaleString()}</span>
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              {order.paymentMethod} ({order.paymentStatus})
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => updateOrderStatusAdmin(order.id, e.target.value as any)}
                              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 outline-none cursor-pointer focus:border-rose-500"
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Hub Received (Gaibandha)">Hub Received</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openInvoice(order)}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                                title="Print Invoice"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Invoice</span>
                              </button>
                              <button
                                onClick={() => openRiderTracking(order)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                                title="Follow Rider"
                              >
                                <Bike className="w-3.5 h-3.5" />
                                <span>Rider</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: PRODUCTS & INVENTORY */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              
              {/* Product Top Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search products by title, Bengali name, brand..."
                    value={searchProductQuery}
                    onChange={(e) => setSearchProductQuery(e.target.value)}
                    className="w-full bg-transparent outline-none"
                  />
                </div>

                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Item & Thumbnail</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Price (৳ BDT)</th>
                        <th className="py-3 px-4">Stock In Hub</th>
                        <th className="py-3 px-4">Sold</th>
                        <th className="py-3 px-4 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map(prod => (
                        <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img src={prod.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200" />
                              <div className="min-w-0">
                                <strong className="text-slate-900 block truncate max-w-[200px]">{prod.name}</strong>
                                <span className="text-[11px] text-slate-400 font-medium">{prod.bengaliName} • {prod.brand}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[11px]">
                              {prod.category}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900">৳{prod.price.toLocaleString()}</span>
                            {prod.originalPrice > prod.price && (
                              <span className="text-[10px] text-slate-400 line-through block">
                                ৳{prod.originalPrice.toLocaleString()} (-{prod.discountPercent}%)
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <span className={`font-bold ${prod.stock <= 10 ? 'text-rose-600' : 'text-slate-800'}`}>
                              {prod.stock} units
                            </span>
                          </td>

                          <td className="py-3 px-4 font-semibold text-emerald-600">
                            {prod.soldCount}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => deleteProductAdmin(prod.id)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: RIDER FLEET & DISPATCH */}
          {activeTab === 'riders' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200">
                <h4 className="text-sm font-extrabold text-slate-900 mb-1">
                  Active Express Riders (Gaibandha Central Hub)
                </h4>
                <p className="text-xs text-slate-500">
                  Riders operating on 2-hour doorstep delivery covering College Road, Gaibandha Sadar, and Sundarganj.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Md. Karim Mia',
                    bengali: 'মোঃ করিম মিয়া',
                    phone: '+880 1719-876543',
                    bike: 'Hero Splendor Plus (Gaibandha-Ha-11-2345)',
                    location: 'Near Govt. College, College Road',
                    rating: 4.9,
                    deliveries: 342,
                    status: 'Active on delivery',
                    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
                  },
                  {
                    name: 'Tanvir Hossain',
                    bengali: 'তানভীর হোসেন',
                    phone: '+880 1718-443322',
                    bike: 'Bajaj Discover 125 (Gaibandha-La-14-8891)',
                    location: 'College Road Distribution Hub',
                    rating: 4.8,
                    deliveries: 215,
                    status: 'Available at Hub',
                    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
                  },
                  {
                    name: 'Rakibul Islam',
                    bengali: 'রকিবুল ইসলাম',
                    phone: '+880 1716-990011',
                    bike: 'TVS Metro Plus (Gaibandha-Ha-12-5502)',
                    location: 'Sundarganj Road Junction',
                    rating: 4.9,
                    deliveries: 480,
                    status: 'Active on delivery',
                    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'
                  }
                ].map((rider, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={rider.image} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                      <div>
                        <strong className="text-sm text-slate-900 block">{rider.name}</strong>
                        <p className="text-[11px] text-slate-400">{rider.bengali}</p>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                          {rider.status}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                      <p className="flex items-center gap-1.5">
                        <Bike className="w-3.5 h-3.5 text-rose-600" />
                        <span>{rider.bike}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{rider.location}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{rider.phone}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: VOUCHERS */}
          {activeTab === 'vouchers' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200">
                <h4 className="text-sm font-extrabold text-slate-900 mb-1">
                  Active Store Vouchers
                </h4>
                <p className="text-xs text-slate-500">
                  Manage promotional discount codes for Fokirer Bajar customers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { code: 'FOKIR100', type: 'Fixed ৳100', minOrder: '৳1,000', desc: 'Flat ৳100 discount on shopping', status: 'Active' },
                  { code: 'CYCLONE50', type: '15% Percent', minOrder: '৳3,000', desc: '15% instant savings on Cyclone deals', status: 'Active' },
                  { code: 'GAIBANDHA', type: 'Free Shipping (৳60)', minOrder: '৳500', desc: 'Free express shipping on College Road', status: 'Active' }
                ].map(v => (
                  <div key={v.code} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {v.code}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        {v.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900">{v.type}</p>
                    <p className="text-[11px] text-slate-500">{v.desc}</p>
                    <p className="text-[10px] text-slate-400">Min Order: {v.minOrder}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* SUB-MODAL: Add New Product */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <form 
            onSubmit={handleCreateProduct}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Add Product to Fokirer Bajar</h3>
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="E.g. Walton Inverter Smart TV 55 inch"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Bengali Title (বাংলা নাম)</label>
                <input
                  type="text"
                  value={newProdBengali}
                  onChange={(e) => setNewProdBengali(e.target.value)}
                  placeholder="যেমন: ওয়ালটন স্মার্ট টিভি ৫৫ ইঞ্চি"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newProdCat}
                    onChange={(e) => setNewProdCat(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-rose-500 bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="2500"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Original Price (৳)</label>
                  <input
                    type="number"
                    value={newProdOrigPrice}
                    onChange={(e) => setNewProdOrigPrice(e.target.value)}
                    placeholder="3500"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={newProdIsCyclone}
                    onChange={(e) => setNewProdIsCyclone(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span>Featured Cyclone Mega Deal ⚡</span>
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md cursor-pointer"
              >
                Publish Product
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
