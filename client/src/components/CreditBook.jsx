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
  TrendingUp,
  Award
} from 'lucide-react';
import { fetchCreditSales, settleCreditSale, fetchCreditSummary } from '../api';
import { soundFX } from '../utils/audio';

export default function CreditBook({ t = { currency: 'ETB' }, onNavigate, showToast }) {
  const [creditSales, setCreditSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [creditSummary, setCreditSummary] = useState({
    dailyTotal: 0,
    weeklyTotal: 0,
    monthlyTotal: 0,
    yearlyTotal: 0,
  });
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [settlingId, setSettlingId] = useState(null);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'unpaid', 'settled'

  const loadCreditsAndSummary = async () => {
    try {
      setIsLoading(true);
      setSummaryLoading(true);
      const [salesData, summaryData] = await Promise.all([
        fetchCreditSales(),
        fetchCreditSummary()
      ]);
      setCreditSales(salesData || []);
      if (summaryData) {
        setCreditSummary(summaryData);
      }
    } catch (err) {
      console.error('Failed to load credit book data:', err);
      if (showToast) showToast('Failed to load credit sales', 'error');
    } finally {
      setIsLoading(false);
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    loadCreditsAndSummary();
  }, []);

  const handleSettle = async (sale) => {
    try {
      setSettlingId(sale._id);
      await settleCreditSale(sale._id);
      
      // Play audio notification
      soundFX?.playSaleSuccess?.();

      // Instantly change the UI status next to their name to 'Paid'
      setCreditSales(prev => prev.map(s => (s._id === sale._id ? { ...s, paymentStatus: 'Paid' } : s)));

      // Refresh daily, weekly, monthly, and yearly credit summary cards so settled amount is deducted
      try {
        const updatedSummary = await fetchCreditSummary();
        if (updatedSummary) {
          setCreditSummary(updatedSummary);
        }
      } catch (err) {
        console.error('Failed to refresh credit summary:', err);
      }

      const customer = sale.customerName || 'Customer';
      const amt = Number(sale.totalAmount ?? sale.totalPrice) || 0;
      if (showToast) {
        showToast(`✓ Debt of ${amt.toLocaleString()} ETB for ${customer} settled as Paid!`, 'success');
      }
    } catch (err) {
      console.error('Failed to settle debt:', err);
      if (showToast) showToast(err.message || 'Failed to settle debt', 'error');
    } finally {
      setSettlingId(null);
    }
  };

  const activeCredits = creditSales.filter(s => s.paymentStatus !== 'Paid');
  const settledCredits = creditSales.filter(s => s.paymentStatus === 'Paid');

  const filteredSales = creditSales.filter(s => {
    if (filterMode === 'unpaid' && s.paymentStatus === 'Paid') return false;
    if (filterMode === 'settled' && s.paymentStatus !== 'Paid') return false;

    const nameMatch = (s.customerName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const prodMatch = (s.productName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || prodMatch;
  });

  const totalOutstandingOwed = activeCredits.reduce((acc, s) => acc + (Number(s.totalAmount ?? s.totalPrice) || 0), 0);
  const customerCount = new Set(activeCredits.map(s => (s.customerName || 'Anonymous').trim().toLowerCase())).size;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + 
      ' • ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Digital Debter • የብድር ደብተር</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2 flex-wrap">
            <span>Credit Book</span>
            <span className="text-amber-400 text-base font-semibold">(የደንበኞች የብድር መዝገብ)</span>
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Track trusted neighborhood customers who take goods on credit and settle their accounts in real time when paid.
          </p>
        </div>

        {/* Quick Outstanding Summary */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-amber-500/30 rounded-2xl p-4 shrink-0 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xl shrink-0">
            ETB
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/80 block">
              Total Outstanding Debt
            </span>
            <span className="text-2xl font-black text-white">
              {totalOutstandingOwed.toLocaleString()} <span className="text-sm font-bold text-amber-400">ETB</span>
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5">
              {activeCredits.length} open record(s) across {customerCount} customer(s)
            </span>
          </div>
        </div>
      </div>

      {/* Credit Summary Cards: Daily, Weekly, Monthly, and Yearly Unpaid Credit */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Unpaid Credit Summary • ያልተከፈለ የብድር ማጠቃለያ</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Excludes settled/paid sales</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card 1: Daily Unpaid Credit */}
          <div className="bg-gradient-to-br from-amber-50/40 via-white to-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between relative group">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">
                  Today
                </span>
                <h4 className="text-sm font-bold text-slate-800 mt-0.5">Daily Credit</h4>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="my-3">
              {summaryLoading ? (
                <div className="space-y-2 py-1">
                  <div className="h-8 bg-slate-200/70 rounded-xl animate-pulse w-24"></div>
                  <div className="h-3 bg-slate-100 rounded-md animate-pulse w-20"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl sm:text-3xl font-black text-amber-700 tracking-tight flex items-baseline gap-1.5">
                    {creditSummary.dailyTotal.toLocaleString()}
                    <span className="text-xs font-bold text-amber-600 uppercase">{t.currency}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Current calendar day
                  </p>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium text-[11px]">Unpaid today</span>
              <span className="font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[10px]">
                Active Debt
              </span>
            </div>
          </div>

          {/* Card 2: Weekly Unpaid Credit */}
          <div className="bg-gradient-to-br from-orange-50/40 via-white to-white rounded-2xl p-4 sm:p-5 border border-orange-200/80 hover:border-orange-400 hover:shadow-md transition-all flex flex-col justify-between relative group">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">
                  Current Week
                </span>
                <h4 className="text-sm font-bold text-slate-800 mt-0.5">Weekly Credit</h4>
              </div>
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <Calendar className="w-4 h-4" />
              </div>
            </div>

            <div className="my-3">
              {summaryLoading ? (
                <div className="space-y-2 py-1">
                  <div className="h-8 bg-slate-200/70 rounded-xl animate-pulse w-24"></div>
                  <div className="h-3 bg-slate-100 rounded-md animate-pulse w-20"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl sm:text-3xl font-black text-orange-700 tracking-tight flex items-baseline gap-1.5">
                    {creditSummary.weeklyTotal.toLocaleString()}
                    <span className="text-xs font-bold text-orange-600 uppercase">{t.currency}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    Current calendar week
                  </p>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium text-[11px]">Unpaid this week</span>
              <span className="font-extrabold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full text-[10px]">
                Active Debt
              </span>
            </div>
          </div>

          {/* Card 3: Monthly Unpaid Credit */}
          <div className="bg-gradient-to-br from-rose-50/40 via-white to-white rounded-2xl p-4 sm:p-5 border border-rose-200/80 hover:border-rose-400 hover:shadow-md transition-all flex flex-col justify-between relative group">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600">
                  Current Month
                </span>
                <h4 className="text-sm font-bold text-slate-800 mt-0.5">Monthly Credit</h4>
              </div>
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            <div className="my-3">
              {summaryLoading ? (
                <div className="space-y-2 py-1">
                  <div className="h-8 bg-slate-200/70 rounded-xl animate-pulse w-24"></div>
                  <div className="h-3 bg-slate-100 rounded-md animate-pulse w-20"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl sm:text-3xl font-black text-rose-700 tracking-tight flex items-baseline gap-1.5">
                    {creditSummary.monthlyTotal.toLocaleString()}
                    <span className="text-xs font-bold text-rose-600 uppercase">{t.currency}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    Current calendar month
                  </p>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium text-[11px]">Unpaid this month</span>
              <span className="font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full text-[10px]">
                Active Debt
              </span>
            </div>
          </div>

          {/* Card 4: Yearly Unpaid Credit */}
          <div className="bg-gradient-to-br from-red-50/40 via-white to-white rounded-2xl p-4 sm:p-5 border border-red-200/80 hover:border-red-400 hover:shadow-md transition-all flex flex-col justify-between relative group">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
                  Current Year
                </span>
                <h4 className="text-sm font-bold text-slate-800 mt-0.5">Yearly Credit</h4>
              </div>
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <Award className="w-4 h-4" />
              </div>
            </div>

            <div className="my-3">
              {summaryLoading ? (
                <div className="space-y-2 py-1">
                  <div className="h-8 bg-slate-200/70 rounded-xl animate-pulse w-24"></div>
                  <div className="h-3 bg-slate-100 rounded-md animate-pulse w-20"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl sm:text-3xl font-black text-red-700 tracking-tight flex items-baseline gap-1.5">
                    {creditSummary.yearlyTotal.toLocaleString()}
                    <span className="text-xs font-bold text-red-600 uppercase">{t.currency}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Current calendar year
                  </p>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium text-[11px]">Unpaid this year</span>
              <span className="font-extrabold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full text-[10px]">
                Active Debt
              </span>
            </div>
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

        {/* Filter Pills & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterMode === 'all' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({creditSales.length})
            </button>
            <button
              onClick={() => setFilterMode('unpaid')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterMode === 'unpaid' 
                  ? 'bg-amber-500 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active ({activeCredits.length})
            </button>
            <button
              onClick={() => setFilterMode('settled')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterMode === 'settled' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Settled ({settledCredits.length})
            </button>
          </div>

          <button
            onClick={loadCreditsAndSummary}
            disabled={isLoading || summaryLoading}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Refresh Credit List and Summary"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading || summaryLoading ? 'animate-spin' : ''}`} />
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
          <p className="text-xs font-bold text-slate-500">Loading Credit Ledger & Summaries...</p>
        </div>
      ) : creditSales.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto text-2xl shadow-inner">
            🎉
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Credit Book is All Settled!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              There are no unpaid credit sales. All customer debts are currently cleared.
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
          No records matching the current filter "{filterMode}" or search term "{searchQuery}".
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSales.map((sale) => {
            const isSettling = settlingId === sale._id;
            const isPaid = sale.paymentStatus === 'Paid';
            const saleAmount = Number(sale.totalAmount ?? sale.totalPrice) || 0;

            return (
              <div 
                key={sale._id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isPaid 
                    ? 'border-emerald-200/80 bg-emerald-50/20' 
                    : 'border-slate-200 hover:border-amber-300 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Customer & Item Details */}
                <div className="flex items-start gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base shadow-md shrink-0 ${
                    isPaid 
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white' 
                      : 'bg-gradient-to-br from-amber-500 to-amber-700 text-white'
                  }`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    {/* Customer Name & Under-Name Paid Status */}
                    <div>
                      <h4 className="font-black text-slate-900 text-base leading-snug">
                        {sale.customerName || 'Anonymous Customer'}
                      </h4>

                      {/* Displayed directly under the name who took credit */}
                      <div className="mt-1">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Paid</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Active Credit</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap pt-0.5">
                      <span className="font-bold text-slate-800">
                        📦 {sale.productName || 'Item'}
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
                      <span>ID: #{String(sale._id).slice(-6).toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Amount Owed & Pay Now Button */}
                <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      {isPaid ? 'Amount Paid' : 'Amount Owed'}
                    </span>
                    <span className={`text-2xl font-black ${isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {saleAmount.toLocaleString()} <span className="text-xs font-bold text-slate-700">ETB</span>
                    </span>
                  </div>

                  {isPaid ? (
                    <div className="py-2.5 px-5 bg-emerald-100/90 text-emerald-800 border border-emerald-300 font-black text-xs sm:text-sm rounded-xl flex items-center gap-2 shrink-0 select-none shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Paid</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSettle(sale)}
                      disabled={isSettling}
                      className="py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                      title="Pay credit debt now"
                    >
                      {isSettling ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Pay Now</span>
                        </>
                      )}
                    </button>
                  )}
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
          <strong>SuqSync Credit Tip:</strong> In Ethiopian retail suqs, giving goods on credit (ደብተር) builds community loyalty. When a customer returns to pay their debt via Cash, Telebirr, or CBE, tap <strong>"Pay Now"</strong> to mark their record as <strong>Paid</strong> and automatically remove the settled amount from your daily, weekly, monthly, and yearly unpaid totals in real time.
        </p>
      </div>

    </div>
  );
}
