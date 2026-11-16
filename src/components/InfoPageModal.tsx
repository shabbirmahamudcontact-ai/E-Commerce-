import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  RefreshCcw,
  CreditCard,
  FileText,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  PhoneCall,
  Sparkles,
  Lock
} from 'lucide-react';

const INFO_PAGES = {
  replacement: {
    title: '7-Day Hassle-Free Replacement Policy',
    subtitle: '৭ দিনের সহজ রিপ্লেসমেন্ট ও অফিসিয়াল ওয়ারেন্টি নীতিমালা',
    icon: RefreshCcw,
    badge: 'Buyer Protection',
    sections: [
      {
        heading: '1. Eligible Products & 7-Day Window',
        body: 'All smartphones, gadgets, electronics, home appliances, and fashion items purchased from Fokirer Bajar are eligible for a 7-day replacement guarantee from the date of delivery at Gaibandha or nationwide.'
      },
      {
        heading: '2. Instant Exchange at College Road Hub',
        body: 'Customers in Gaibandha Sadar can drop off or request a free rider pickup from College Road Central Distribution Hub if a product arrives damaged, defective, or incorrect.'
      },
      {
        heading: '3. Conditions for Smooth Replacement',
        body: 'Please retain the original brand box, accessories, security seal, and your printable Fokirer Bajar Tax Invoice.'
      }
    ]
  },
  payment: {
    title: 'bKash, Nagad & Rocket Payment Guide',
    subtitle: 'কোনো পিন নম্বর ছাড়াই নিরাপদ এসএমএস ওটিপি পেমেন্ট',
    icon: CreditCard,
    badge: '100% Secure Checkout',
    sections: [
      {
        heading: '1. SMS OTP Verification (No PIN Needed)',
        body: 'Fokirer Bajar never asks for your confidential bKash, Nagad, or Rocket PIN. During checkout, simply enter your wallet mobile number and confirm using the 6-digit SMS OTP sent to your phone.'
      },
      {
        heading: '2. Instant Cash on Delivery (COD)',
        body: 'Prefer paying in person? Select Cash on Delivery at checkout and pay our verified Gaibandha rider upon receiving and inspecting your package at your doorstep.'
      },
      {
        heading: '3. Loyalty Points + Voucher Stacking',
        body: 'Apply promo codes like FOKIR100 or GAIBANDHA in your cart and toggle Club Loyalty Points (1 pt = ৳1) during checkout to lower your payable amount.'
      }
    ]
  },
  terms: {
    title: 'Terms & Conditions',
    subtitle: 'ফকিরের বাজার ব্যবহারের শর্তাবলী ও নীতিমালা',
    icon: FileText,
    badge: 'Official Policy',
    sections: [
      {
        heading: '1. Marketplace Orders & Pricing',
        body: 'All prices are listed in Bangladeshi Taka (৳ BDT). Cyclone Mega Deals and flash discounts apply while promotional stock remains available at our College Road, Gaibandha hub.'
      },
      {
        heading: '2. Express 2-Hour Delivery Coverage',
        body: '2-hour express rider dispatch applies to College Road, Govt. College Zone, and Gaibandha Sadar. Nearby upazilas (Sundarganj, Gobindaganj, Palashbari, Sadullapur, Saghata, Phulchhari) receive same-day or 24-hour doorstep delivery.'
      },
      {
        heading: '3. Loyalty Club Membership',
        body: 'Customers earn 1 Loyalty Point per ৳20 spent. Points have no hidden fees and can be redeemed at checkout at a rate of 1 point = ৳1 instant discount.'
      }
    ]
  },
  privacy: {
    title: 'Privacy & Data Security',
    subtitle: 'গ্রাহকের তথ্য সুরক্ষা এবং গোপনীয়তা নীতি',
    icon: ShieldCheck,
    badge: 'Data Protected',
    sections: [
      {
        heading: '1. Information We Collect',
        body: 'We only collect essential delivery information (name, mobile number, email, and Gaibandha/Bangladesh shipping address) to dispatch orders, issue official tax invoices, and credit loyalty points.'
      },
      {
        heading: '2. Zero Financial Credential Storage',
        body: 'Fokirer Bajar does not store MFS PINs or card CVV numbers. All digital payments use one-time verification codes.'
      },
      {
        heading: '3. Account Control & Support',
        body: 'You can update your profile, manage your saved addresses, or log out at any time from your Account Panel or contact our Gaibandha hotline at 09638-FOKIR (36547).'
      }
    ]
  }
} as const;

export const InfoPageModal: React.FC = () => {
  const { activeInfoPage, setActiveInfoPage } = useApp();

  if (!activeInfoPage) return null;

  const page = INFO_PAGES[activeInfoPage];
  const Icon = page.icon;

  return (
    <div
      onClick={() => setActiveInfoPage(null)}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]"
      >
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white relative">
          <button
            onClick={() => setActiveInfoPage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 pr-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-lg shrink-0">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-white/15 text-amber-300 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" />
                {page.badge}
              </span>
              <h2 className="text-lg sm:text-xl font-black mt-1">{page.title}</h2>
              <p className="text-xs text-slate-300">{page.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 bg-slate-50 flex-1">
          {page.sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-1.5"
            >
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{section.heading}</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                {section.body}
              </p>
            </div>
          ))}

          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>College Road Central Hub, Gaibandha - 5700</span>
              </p>
              <p className="text-slate-600 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                <span>Support Hotline: <strong>09638-FOKIR (36547)</strong></span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
              <Lock className="w-3.5 h-3.5" />
              <span>Verified Store Policy</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            {(['replacement', 'payment', 'terms', 'privacy'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActiveInfoPage(key)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize cursor-pointer transition-colors ${
                  activeInfoPage === key
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {key === 'replacement' ? 'Replacement' : key === 'payment' ? 'Payment Guide' : key}
              </button>
            ))}
          </div>
          <button
            onClick={() => setActiveInfoPage(null)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors"
          >
            Back to Store
          </button>
        </div>
      </div>
    </div>
  );
};
