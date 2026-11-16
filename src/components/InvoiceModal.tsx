import React, { useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Printer, Download, CheckCircle2, MapPin, Phone, Mail, QrCode, FileText } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { isInvoiceModalOpen, setIsInvoiceModalOpen, activeInvoiceOrder } = useApp();
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!isInvoiceModalOpen || !activeInvoiceOrder) return null;

  const order = activeInvoiceOrder;
  const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const invoiceTime = new Date(order.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[95vh]"
      >
        {/* Modal Top Control Bar (Hidden during print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-500" />
            <span className="font-extrabold text-sm sm:text-base">Official Tax Invoice - Fokirer Bajar</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={() => setIsInvoiceModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE BODY */}
        <div 
          ref={invoiceRef}
          className="p-6 sm:p-8 overflow-y-auto bg-white text-slate-900 text-xs font-sans print:p-0 print:m-0 print:shadow-none"
        >
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white font-black text-2xl flex items-center justify-center">
                  FB
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
                    FOKIRER BAJAR<span className="text-rose-600">.</span>
                  </h1>
                  <p className="text-[11px] font-bold text-slate-500 -mt-0.5">ফকিরের বাজার • Gaibandha Central Hub</p>
                </div>
              </div>
              <p className="mt-2 text-slate-600 leading-tight">
                College Road, Gaibandha Sadar, Rangpur Division - 5700<br />
                Hotline: 09638-FOKIR (36547) | Email: billing@fokirerbajar.com.bd<br />
                Trade License: TRAD/GBND/2026/0411 | BIN: 004829104-0102
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="inline-block bg-slate-900 text-white text-[11px] font-black uppercase px-2.5 py-1 rounded tracking-wider mb-2">
                RETAIL TAX INVOICE
              </span>
              <p className="text-xs text-slate-500">Invoice No: <strong className="text-slate-950">{order.invoiceNumber || `INV-${order.id}`}</strong></p>
              <p className="text-xs text-slate-500">Order ID: <strong className="text-rose-600 font-mono">{order.id}</strong></p>
              <p className="text-xs text-slate-500">Date: <strong className="text-slate-950">{invoiceDate} ({invoiceTime})</strong></p>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-2 gap-4 my-5 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Billed & Delivered To:</p>
              <p className="font-extrabold text-sm text-slate-950">{order.customerName}</p>
              <p className="text-slate-700 mt-0.5 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span>{order.shippingAddress}, {order.city}</span>
              </p>
              <p className="text-slate-700 mt-0.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Phone: {order.phone}</span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Payment & Dispatch:</p>
              <p className="font-bold text-slate-950">Payment Method: <span className="text-rose-600">{order.paymentMethod}</span></p>
              <div className="mt-1 flex justify-end">
                <span className={`inline-block font-black text-[10px] uppercase px-2.5 py-0.5 rounded border ${
                  order.paymentStatus === 'Paid' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}>
                  {order.paymentStatus === 'Paid' ? 'PAID IN FULL (VERIFIED)' : 'CASH ON DELIVERY'}
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1">Tracking Code: <strong>{order.trackingNumber}</strong></p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden my-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] font-bold">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {item.name}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right font-mono">৳{item.price.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-black font-mono">৳{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & QR / Barcode Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3">
            {/* Left: Barcode simulation & terms */}
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center gap-3">
                <QrCode className="w-12 h-12 text-slate-800 shrink-0" />
                <div className="text-[10px] text-slate-500 leading-tight">
                  <p className="font-bold text-slate-800">Verified Fokirer Bajar Dispatch</p>
                  <p>College Road Central Distribution Hub</p>
                  <p className="font-mono mt-0.5 text-slate-400">{order.trackingNumber}</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                * Goods received in good condition. 7-day hassle-free replacement with official invoice at College Road Hub.
              </p>
            </div>

            {/* Right: Subtotal, Discount & Total */}
            <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900">৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Gaibandha Delivery Fee:</span>
                <span className="font-bold text-slate-900">
                  {order.deliveryFee === 0 ? 'FREE (৳0)' : `৳${order.deliveryFee}`}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Special Voucher Discount:</span>
                  <span>-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              {order.pointsDiscount && order.pointsDiscount > 0 ? (
                <div className="flex justify-between text-amber-600 font-bold">
                  <span>Loyalty Points Discount ({order.pointsUsed || 0} pts):</span>
                  <span>-৳{order.pointsDiscount.toLocaleString()}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t-2 border-slate-900">
                <span>Total Amount:</span>
                <span className="text-rose-600 text-base">৳{order.total.toLocaleString()}</span>
              </div>
              {order.pointsEarned && order.pointsEarned > 0 ? (
                <div className="flex items-center justify-between text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 mt-1 font-semibold">
                  <span>⭐ Club Points Earned:</span>
                  <span className="font-bold">+{order.pointsEarned} pts</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Authorized Signature Block */}
          <div className="pt-8 mt-6 border-t border-slate-200 flex items-end justify-between text-[11px] text-slate-500">
            <div>
              <p className="font-bold text-slate-900">Fokirer Bajar E-Commerce</p>
              <p>Gaibandha, Bangladesh</p>
            </div>
            <div className="text-center">
              <div className="w-36 border-b border-slate-400 mb-1" />
              <p className="font-bold text-slate-800">Authorized Signature</p>
              <p className="text-[9px] text-slate-400">College Road Operations Hub</p>
            </div>
          </div>
        </div>

        {/* Footer actions for screen */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={() => setIsInvoiceModalOpen(false)}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold text-xs cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice Now</span>
          </button>
        </div>

      </div>
    </div>
  );
};
