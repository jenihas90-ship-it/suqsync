import React from 'react';
import { 
  CheckCircle2, 
  Smartphone, 
  DollarSign, 
  Building, 
  Printer, 
  ArrowRight, 
  X,
  Landmark,
  CreditCard,
  User 
} from 'lucide-react';

export default function ReceiptModal({ saleData, onClose, storeProfile, t }) {
  if (!saleData) return null;

  const store = storeProfile || {
    storeName: 'SuqSync Pilot Store #01',
    subcity: 'Bole Subcity, Woreda 03',
    city: 'Addis Ababa',
    cashierName: 'Chaltu Desta',
    phone: '+251 91 123 4567'
  };

  const getMethodBadge = (method) => {
    switch (method) {
      case 'Telebirr':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-400 text-sky-700 font-bold text-xs">
            <Smartphone className="w-3.5 h-3.5 text-sky-600" />
            <span>Telebirr (ቴሌብር)</span>
          </div>
        );
      case 'CBE':
      case 'CBE Birr':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-400 text-purple-800 font-bold text-xs">
            <Landmark className="w-3.5 h-3.5 text-purple-600" />
            <span>CBE (ንግድ ባንክ)</span>
          </div>
        );
      case 'Coop Bank':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-400 text-rose-800 font-bold text-xs">
            <Building className="w-3.5 h-3.5 text-rose-600" />
            <span>Coop Bank (የኦሮሚያ ኅብረት)</span>
          </div>
        );
      case 'Awash Bank':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-400 text-blue-800 font-bold text-xs">
            <Landmark className="w-3.5 h-3.5 text-blue-600" />
            <span>Awash Bank (አዋሽ ባንክ)</span>
          </div>
        );
      case 'Sinqee Bank':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-400 text-amber-800 font-bold text-xs">
            <Building className="w-3.5 h-3.5 text-amber-600" />
            <span>Sinqee Bank (ሲንቄ ባንክ)</span>
          </div>
        );
      case 'Abyssinia Bank':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-400 text-indigo-800 font-bold text-xs">
            <Landmark className="w-3.5 h-3.5 text-indigo-600" />
            <span>Bank of Abyssinia (BoA)</span>
          </div>
        );
      case 'Other':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs">
            <CreditCard className="w-3.5 h-3.5 text-slate-600" />
            <span>Other Digital Bank</span>
          </div>
        );
      case 'Cash':
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500 text-emerald-800 font-bold text-xs">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cash (ጥሬ ገንዘብ)</span>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100 flex flex-col">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 bg-white text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-xl font-black">{t.receipt.receiptTitle}</h2>
          <p className="text-xs text-emerald-100 mt-0.5">{t.receipt.transactionVerified}</p>
        </div>

        {/* Receipt Body */}
        <div className="p-5 space-y-4">
          <div className="border-b border-dashed border-slate-200 pb-3 text-center">
            <p className="font-extrabold text-slate-900 text-base">{store.storeName}</p>
            <p className="text-xs text-slate-500">{store.subcity}, {store.city}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Tel: {store.phone}</p>
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 mt-1 font-mono">
              <span>Txn: #{saleData._id?.slice(-8).toUpperCase() || Date.now().toString().slice(-8)}</span>
              <span>•</span>
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Cashier: {store.cashierName}</p>
          </div>

          {/* Item details */}
          <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-slate-900 text-base">{saleData.productName}</span>
                <span className="block text-xs text-slate-500">
                  {saleData.quantitySold} x {saleData.unitPrice || (saleData.totalAmount / saleData.quantitySold)} {t.currency}
                </span>
              </div>
              <div className="text-right">
                <span className="font-black text-lg text-emerald-700">
                  {saleData.totalAmount} {t.currency}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">{t.pos.paymentMethod}:</span>
              {getMethodBadge(saleData.paymentMethod)}
            </div>
          </div>

          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg p-2.5 text-xs text-center font-medium">
            ✓ {t.receipt.stockDeducted}
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <button
              onClick={onClose}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{t.receipt.doneBtn}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => window.print()}
              className="w-full py-2 px-3 text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.receipt.printBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
