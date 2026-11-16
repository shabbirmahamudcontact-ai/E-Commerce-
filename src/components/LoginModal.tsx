import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, User, Phone, Mail, MapPin, Sparkles, ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register, setIsAdminOpen } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login form
  const [identifier, setIdentifier] = useState('shabbirmahamudcontact@gmail.com');
  const [isLoading, setIsLoading] = useState(false);

  // Register form
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('College Road, Gaibandha');

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    setIsLoading(true);
    await login(identifier);
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || (!regPhone && !regEmail)) return;
    setIsLoading(true);
    await register({
      name: regName,
      phone: regPhone,
      email: regEmail,
      address: regAddress
    });
    setIsLoading(false);
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    await login('shabbirmahamudcontact@gmail.com');
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in zoom-in-95"
      >
        {/* Top Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white relative text-center">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white font-black text-2xl flex items-center justify-center mx-auto mb-2 shadow-lg">
            FB
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Fokirer Bajar (ফকিরের বাজার)</h2>
          <p className="text-xs text-rose-200 mt-0.5">
            College Road, Gaibandha • Customer Portal
          </p>

          {/* Welcome Promo Badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>৳100 Welcome Bonus in Fokirer Bajar Wallet!</span>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              tab === 'login' ? 'bg-white text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Customer Sign In (গ্রাহক লগইন)
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              tab === 'register' ? 'bg-white text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Register (নতুন একাউন্ট)
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="E.g. 01712345678 or email@fokirerbajar.com"
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isLoading ? 'Signing in...' : 'Sign In with OTP / Password'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 1-Click Demo Login */}
              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-400 mb-2">Want to test instantly?</p>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>1-Click Gaibandha Demo Login</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Your name"
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Email (Optional)</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Delivery Address (Gaibandha)</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="College Road, Gaibandha"
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{isLoading ? 'Creating Account...' : 'Register & Claim ৳100 Bonus'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Customer Safe Account</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsAuthModalOpen(false);
                setIsAdminOpen(true);
              }}
              className="text-slate-500 hover:text-slate-900 font-semibold cursor-pointer transition-colors flex items-center gap-1"
              title="Restricted management access"
            >
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
