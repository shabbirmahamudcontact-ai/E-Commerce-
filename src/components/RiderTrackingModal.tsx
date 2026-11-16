import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  X, 
  MapPin, 
  Phone, 
  Navigation, 
  Bike, 
  Star, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Radio, 
  Compass,
  ArrowRight,
  Printer
} from 'lucide-react';

export const RiderTrackingModal: React.FC = () => {
  const { 
    isRiderModalOpen, 
    setIsRiderModalOpen, 
    activeRiderOrder, 
    openInvoice,
    showToast 
  } = useApp();

  const [simulatedProgress, setSimulatedProgress] = useState(65);
  const [liveMinutes, setLiveMinutes] = useState(14);
  const [liveDistance, setLiveDistance] = useState(1.2);

  // Simulate rider moving closer
  useEffect(() => {
    if (!isRiderModalOpen) return;
    const interval = setInterval(() => {
      setSimulatedProgress(prev => {
        if (prev >= 95) return 95;
        return prev + 1;
      });
      setLiveMinutes(prev => Math.max(2, prev - 0.2));
      setLiveDistance(prev => Math.max(0.2, Number((prev - 0.03).toFixed(2))));
    }, 3000);
    return () => clearInterval(interval);
  }, [isRiderModalOpen]);

  if (!isRiderModalOpen || !activeRiderOrder) return null;

  const order = activeRiderOrder;
  const rider = order.rider || {
    id: 'rdr-gb-01',
    name: 'Md. Karim Mia',
    bengaliName: 'মোঃ করিম মিয়া',
    phone: '+880 1719-876543',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    vehicle: 'Hero Splendor Plus 100cc',
    vehiclePlate: 'Gaibandha-Ha-11-2345',
    rating: 4.9,
    completedDeliveries: 342,
    currentLocationName: 'Near Gaibandha Govt. College, College Road',
    distanceKm: 1.2,
    etaMinutes: 14,
    speedKmH: 32,
    lat: 25.3284,
    lng: 89.5407
  };

  const handleCallRider = () => {
    showToast(`Calling Rider ${rider.name} at ${rider.phone}...`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in zoom-in-95 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white">
              <Bike className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-1.5">
                <span>Live Rider GPS Tracker</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Order #{order.id} • Destination: {order.shippingAddress}</p>
            </div>
          </div>

          <button
            onClick={() => setIsRiderModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SIMULATED LIVE MAP VIEW */}
        <div className="relative h-64 bg-slate-900 overflow-hidden flex items-center justify-center select-none">
          {/* Map Grid / Street Vector Styling */}
          <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Roads */}
            <path d="M 0 130 Q 150 110, 300 150 T 600 120" fill="none" stroke="#64748b" strokeWidth="10" strokeLinecap="round" />
            <path d="M 120 0 L 140 260" fill="none" stroke="#475569" strokeWidth="8" />
            <path d="M 380 0 L 360 260" fill="none" stroke="#475569" strokeWidth="8" />
            <path d="M 0 130 Q 150 110, 300 150 T 600 120" fill="none" stroke="#e11d48" strokeWidth="4" strokeDasharray="6 6" />
          </svg>

          {/* Hub Marker */}
          <div className="absolute left-8 top-20 flex flex-col items-center">
            <div className="w-9 h-9 rounded-2xl bg-slate-800 border-2 border-rose-500 flex items-center justify-center shadow-lg text-rose-400 text-xs font-bold">
              HUB
            </div>
            <span className="text-[9px] font-black bg-slate-950/80 text-white px-2 py-0.5 rounded mt-1 border border-slate-700">
              College Road Hub
            </span>
          </div>

          {/* Customer Destination Marker */}
          <div className="absolute right-8 top-16 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center shadow-lg text-white">
              <MapPin className="w-5 h-5 fill-white text-emerald-600" />
            </div>
            <span className="text-[9px] font-black bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded mt-1 border border-emerald-700">
              Your Location
            </span>
          </div>

          {/* Pulsing Moving Rider Marker */}
          <div 
            className="absolute transition-all duration-1000 flex flex-col items-center"
            style={{ 
              left: `${simulatedProgress}%`, 
              top: '52%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative">
              <span className="animate-ping absolute inset-0 rounded-full bg-rose-500 opacity-75" />
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 border-2 border-white flex items-center justify-center shadow-2xl text-white">
                <Bike className="w-6 h-6" />
              </div>
            </div>
            <span className="bg-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-md mt-1 flex items-center gap-1">
              <Radio className="w-3 h-3 text-amber-300 animate-pulse" />
              {rider.name.split(' ')[1] || 'Karim'} ({rider.speedKmH} km/h)
            </span>
          </div>

          {/* Live Radar Overlay Box */}
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md rounded-xl p-2 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-rose-400 animate-spin" />
            <span>GPS Tracking: <strong>Gaibandha Sadar Zone</strong></span>
          </div>

          <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md rounded-xl px-2.5 py-1 border border-slate-800 text-[10px] text-emerald-400 font-bold">
            Live Speed: 32 km/h
          </div>
        </div>

        {/* Rider Profile & Order Info */}
        <div className="p-5 space-y-4">
          
          {/* Progress bar to destination */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-600" />
                Arriving in approx. {Math.round(liveMinutes)} minutes
              </span>
              <span className="font-bold text-rose-600">{liveDistance} km away</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="bg-gradient-to-r from-rose-600 to-emerald-500 h-full rounded-full transition-all duration-700" 
                style={{ width: `${simulatedProgress}%` }}
              />
            </div>
          </div>

          {/* Rider Details Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img 
                src={rider.photo} 
                alt={rider.name} 
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md shrink-0" 
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm text-slate-900">{rider.name}</h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500">{rider.bengaliName} • Gaibandha Hero</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {rider.rating}
                  </span>
                  <span>({rider.completedDeliveries} completed)</span>
                </div>
              </div>
            </div>

            {/* Direct Call Button */}
            <div className="flex sm:flex-col gap-2">
              <button
                onClick={handleCallRider}
                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Rider</span>
              </button>
              <button
                onClick={() => openInvoice(order)}
                className="flex-1 sm:flex-none bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs px-3 py-2 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Invoice</span>
              </button>
            </div>
          </div>

          {/* Vehicle & Verification Card */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-[10px] uppercase font-bold text-slate-400">Delivery Vehicle</p>
              <p className="font-bold text-slate-900 mt-0.5">{rider.vehicle}</p>
              <p className="text-[11px] font-mono font-semibold text-rose-600 mt-0.5">{rider.vehiclePlate}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-[10px] uppercase font-bold text-slate-400">Current Position</p>
              <p className="font-bold text-slate-900 mt-0.5 truncate">{rider.currentLocationName}</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">On Schedule</p>
            </div>
          </div>

          {/* Handover OTP Note */}
          <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl text-xs text-rose-950 flex items-center justify-between">
            <div>
              <p className="font-bold">Delivery Handover PIN: <strong className="text-rose-600 text-sm">4829</strong></p>
              <p className="text-[11px] text-slate-500">Share this code with {rider.name.split(' ')[0]} when receiving your parcel.</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />
          </div>

        </div>

      </div>
    </div>
  );
};
