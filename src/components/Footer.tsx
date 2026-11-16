import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  MapPin, 
  PhoneCall, 
  Mail, 
  ShieldCheck, 
  Truck, 
  RefreshCcw, 
  HelpCircle, 
  Zap, 
  ExternalLink 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setIsAdminOpen } = useApp();
  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-24 md:pb-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                <span className="font-black text-xl">FB</span>
              </div>
              <span className="font-black text-2xl tracking-tight text-white">
                FOKIRER BAJAR<span className="text-rose-500">.</span>
              </span>
              <span className="bg-rose-500/20 text-rose-400 font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                ফকিরের বাজার
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs">
              Fokirer Bajar (ফকিরের বাজার) is Bangladesh’s premier mega e-commerce marketplace located at College Road, Gaibandha. Connecting thousands of customers with authentic brands, revolutionary Cyclone mega discounts, live rider tracking, printable invoices, and fast 2-hour doorstep delivery.
            </p>

            <div className="pt-2 space-y-1.5 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Headquarters & Central Hub:</strong> College Road, Gaibandha Sadar, Rangpur Division - 5700</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hotline: <strong>09638-FOKIR (36547)</strong> / +880 1712-345678</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Email: support@fokirerbajar.com.bd</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Marketplace
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#products-section" className="hover:text-white transition-colors">Mega Cyclone Deals</a></li>
              <li><a href="#products-section" className="hover:text-white transition-colors">Smartphones & Gadgets</a></li>
              <li><a href="#products-section" className="hover:text-white transition-colors">Bikes & Motor Vehicles</a></li>
              <li><a href="#products-section" className="hover:text-white transition-colors">Fashion & Lifestyle</a></li>
              <li><a href="#products-section" className="hover:text-white transition-colors">Daily Groceries Express</a></li>
              <li><a href="#products-section" className="hover:text-white transition-colors">Home & Kitchen Appliances</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Customer Care
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><span className="hover:text-white cursor-pointer">Track Your Gaibandha Order</span></li>
              <li><span className="hover:text-white cursor-pointer">7-Day Replacement Policy</span></li>
              <li><span className="hover:text-white cursor-pointer">bKash & Nagad Payment Guide</span></li>
              <li><span className="hover:text-white cursor-pointer">Terms & Conditions</span></li>
              <li><span className="hover:text-white cursor-pointer">Privacy & Data Security</span></li>
              <li><span className="hover:text-white cursor-pointer">Kapaly Wallet & Vouchers</span></li>
            </ul>
          </div>

          {/* Delivery Coverage */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Gaibandha Delivery
            </h4>
            <p className="text-slate-400 mb-2">
              Express 2-hour doorstep rider network operating at:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['College Road', 'Gaibandha Sadar', 'Govt. College Zone', 'Sundarganj', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Saghata', 'Phulchhari'].map((upazila) => (
                <span key={upazila} className="bg-slate-900 border border-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-md">
                  {upazila}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Payment Partners & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            <p>© {new Date().getFullYear()} <strong>Fokirer Bajar Mega E-Commerce</strong> (ফকিরের বাজার). All rights reserved.</p>
            <p className="mt-0.5 flex flex-wrap items-center gap-2">
              <span>College Road, Gaibandha • Trade License: TRAD/GBND/2026/0411</span>
              <span>•</span>
              <button 
                onClick={() => setIsAdminOpen(true)}
                className="text-slate-600 hover:text-slate-400 text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                title="Staff Portal (Restricted to authorized managers)"
              >
                <span>🔒</span>
                <span>Staff Portal</span>
              </button>
            </p>
          </div>

          {/* Simulated Payment Badges */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Authorized Payments:</span>
            <span className="bg-[#e2136e] text-white font-extrabold px-2 py-0.5 rounded text-[10px]">bKash</span>
            <span className="bg-[#f7941d] text-white font-extrabold px-2 py-0.5 rounded text-[10px]">Nagad</span>
            <span className="bg-[#8c3589] text-white font-extrabold px-2 py-0.5 rounded text-[10px]">Rocket</span>
            <span className="bg-blue-600 text-white font-extrabold px-2 py-0.5 rounded text-[10px]">VISA</span>
            <span className="bg-emerald-700 text-white font-extrabold px-2 py-0.5 rounded text-[10px]">COD</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
