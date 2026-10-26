import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  User, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Search, 
  RefreshCw, 
  ShoppingBag, 
  AlertCircle, 
  ArrowRight,
  Calendar,
  Sparkles,
  Phone
} from 'lucide-react';
import { fetchCreditSales, markCreditSalePaid } from '../api';
import { soundFX } from '../utils/audio';

export default function CreditBook({ t, onNavigate, showToast }) {
  const [creditSales, setCreditSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [settlingId, setSettlingId] = useState(null);
  const [filterMode, setFilterMode] = useState('all');

  const loadCredits = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCreditSales();
      setCreditSales(data || []);
    } catch (err) {
      console.error('Failed to load credit book:', err);
      if (showToast) showToast('Failed to load credit sales', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCredits();
  }, []);

  const handleSettle = async (sale) => {
    try {
      setSettlingId(sale._id);
      await markCreditSalePaid(sale._id);
      
      // Play audio notification
      soundFX?.playSaleSuccess?.();

      // Remove from active unpaid list
      setCreditSales(prev => prev.filter(s => s._id !== sale._id));
      
      const customer = sale.customerName || 'Customer';
      if (showToast) {
        showToast(`✓ Debt of ${sale.totalAmount} ETB for ${customer} settled as Paid!`, 'success');
      }
    } catch (err) {
      console.error('Failed to settle debt:', err);
      if (showToast) showToast(err.message || 'Failed to settle debt', 'error');
    } finally {
      setSettlingId(null);
    }
  };

  const filteredSales = creditSales.filter(s => {
    const nameMatch = (s.customerName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const prodMatch = (s.productName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || prodMatch;
  });

  const totalOwed = creditSales.reduce((acc, s) => acc + (Number(s.totalAmount) || 0), 0);
  const customerCount = new Set(creditSales.map(s => (s.customerName || 'Anonymous').trim().toLowerCase())).size;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + 
      ' • ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Digital Debter • የብድር ደብተር</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Credit Book</span>
            <span className="text-amber-400 text-base font-semibold">(የደንበኞች የብድር መዝገብ)</span>
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Track trusted neighborhood customers who take suq goods on credit and settle their accounts when paid.
          </p>
        </div>

        {/* Quick Outstanding Summary */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-amber-500/30 rounded-2xl p-4 shrink-0 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xl shrink-0">
            ETB
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/80 block">
              Total Outstanding Credit
            </span>
            <span className="text-2xl font-black text-white">
              {totalOwed.toLocaleString()} <span className="text-sm font-bold text-amber-400">ETB</span>
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5">
              {creditSales.length} open record(s) across {customerCount} customer(s)
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadCredits}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Refresh Credit List"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => onNavigate?.('pos')}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Open POS Cashier</span>
          </button>
        </div>
      </div>

      {/* Credit Records List */}
      {isLoading ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-500">Loading Credit Ledger...</p>
        </div>
      ) : creditSales.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto text-2xl shadow-inner">
            🎉
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Credit Book is All Settled!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              There are no unpaid credit sales. All customers have cleared their accounts.
            </p>
          </div>
          <button
            onClick={() => onNavigate?.('pos')}
            className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Record New Sale</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : filteredSales.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-500 text-xs">
          No credit records matching "{searchQuery}".
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSales.map((sale) => {
            const isSettling = settlingId === sale._id;
            return (
              <div 
                key={sale._id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-amber-300 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Customer & Item Details */}
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-black text-base shadow-md shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-slate-900 text-base">
                        {sale.customerName || 'Anonymous Customer'}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Unpaid Credit (ያልተከፈለ)</span>
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-800">
                        📦 {sale.productName}
                      </span>
                      <span>•</span>
                      <span>Qty: <strong>{sale.quantitySold}</strong></span>
                      <span>•</span>
                      <span>Unit: {sale.unitPrice} ETB</span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{formatDate(sale.createdAt)}</span>
                      <span>•</span>
                      <span>ID: #{sale._id.slice(-6).toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Amount Owed & Settle Debt Button */}
                <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Amount Owed
                    </span>
                    <span className="text-2xl font-black text-amber-600">
                      {sale.totalAmount} <span className="text-xs font-bold text-slate-700">ETB</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleSettle(sale)}
                    disabled={isSettling}
                    className="py-3 px-5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                    title="Mark debt as paid in full"
                  >
                    {isSettling ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Settle Debt (ዕዳ ክፈል)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Helpful Ethiopian SME Tip */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <span className="text-base shrink-0">💡</span>
        <p className="leading-relaxed">
          <strong>SuqSync Credit Tip:</strong> In Ethiopian retail suqs, giving goods on credit (ደብተር) builds community loyalty. When a customer returns to pay their debt via Cash, Telebirr, or CBE, simply tap <strong>"Settle Debt (ዕዳ ክፈል)"</strong> to mark their record as Paid and update your ledger in real time.
        </p>
      </div>

    </div>
  );
}
