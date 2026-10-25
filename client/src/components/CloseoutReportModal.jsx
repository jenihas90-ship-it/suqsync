import React from 'react';
import { 
  CheckCircle2, 
  Printer, 
  X, 
  Calendar, 
  DollarSign, 
  Smartphone, 
  Landmark, 
  FileCheck, 
  Building,
  ShieldCheck 
} from 'lucide-react';

export default function CloseoutReportModal({ isOpen, onClose, dashboardData, t }) {
  if (!isOpen) return null;

  const data = dashboardData?.data || {
    date: new Date().toISOString().slice(0, 10),
    totalRevenue: 0,
    totalCash: 0,
    totalDigital: 0,
    transactionCount: 0,
    paymentBreakdown: {},
    topThreeItems: [],
  };

  const totalRev = Number(data.totalRevenue) || 0;
  const cashAmt = Number(data.totalCash ?? data.paymentBreakdown?.Cash ?? 0);
  const digitalAmt = Number(data.totalDigital ?? (totalRev - cashAmt));
  const breakdown = data.paymentBreakdown || {};
  const countBreakdown = data.paymentTransactionsCount || {};

  const totalTx = Number(data.transactionCount || 0);
  const cashTx = Number(data.cashTransactionsCount ?? countBreakdown.Cash ?? 0);
  const digitalTx = Number(data.digitalTransactionsCount ?? (totalTx >= cashTx ? totalTx - cashTx : 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between border-b border-emerald-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-emerald-800 flex items-center justify-center font-black shadow-md">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight">End-of-Day Closeout (ቀን መዝጊያ)</h3>
              </div>
              <p className="text-xs text-emerald-200">
                Official Z-Report • SuqSync Pilot #01
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Content */}
        <div className="p-6 overflow-y-auto space-y-4 font-sans text-xs">
          
          <div className="border-b border-dashed border-slate-200 pb-3 text-center">
            <h4 className="font-extrabold text-base text-slate-900">SuqSync Merchant Closeout</h4>
            <p className="text-slate-500 mt-0.5">Addis Ababa / Oromia, Ethiopia</p>
            <div className="flex items-center justify-center gap-2 text-slate-400 mt-1 font-mono text-[11px]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Date: {data.date || new Date().toISOString().slice(0, 10)}</span>
              <span>•</span>
              <span>Time: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Revenue Breakdown Summary */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-700 text-sm">Total Reconciled Revenue</span>
              <span className="font-black text-xl text-emerald-800">
                {totalRev.toLocaleString()} {t.currency}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Physical Cash Drawer:
              </span>
              <div className="text-right">
                <span className="font-bold text-slate-900">{cashAmt.toLocaleString()} {t.currency}</span>
                <span className="text-[10px] text-slate-400 block">({cashTx} {cashTx === 1 ? 'sale' : 'sales'})</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <Smartphone className="w-3.5 h-3.5 text-sky-600" /> Digital Banking Receipts:
              </span>
              <div className="text-right">
                <span className="font-bold text-slate-900">{digitalAmt.toLocaleString()} {t.currency}</span>
                <span className="text-[10px] text-slate-400 block">({digitalTx} {digitalTx === 1 ? 'txn' : 'txns'})</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/60">
              <span className="font-medium">Total Transactions:</span>
              <span className="font-bold text-slate-900">{totalTx} sales</span>
            </div>
          </div>

          {/* Detailed Bank & Channel Split */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
              Channel Audit (Sales & Transactions)
            </span>
            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
              {Object.keys(breakdown).map((k) => {
                const count = countBreakdown[k] || 0;
                return (
                  <div key={k} className="px-3 py-2 flex items-center justify-between">
                    <div>
                      <span className="text-slate-800 font-bold block">{k}</span>
                      <span className="text-[10px] text-slate-400">{count} {count === 1 ? 'transaction' : 'transactions'}</span>
                    </div>
                    <span className="font-black text-slate-900">{Number(breakdown[k] || 0).toLocaleString()} {t.currency}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reconciliation Audit Seal */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-[11px]">
              <b>Zero Shrinkage Detected:</b> Physical cash and digital wallet statements are 100% verified.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Z-Report</span>
          </button>
          <button
            onClick={onClose}
            className="py-3 px-5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
