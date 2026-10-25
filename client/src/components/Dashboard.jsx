import React, { useState } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  Smartphone, 
  Building, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  RefreshCw, 
  ShoppingBag, 
  Clock, 
  Landmark, 
  CreditCard, 
  PieChart, 
  FileCheck, 
  ShieldCheck, 
  ChevronRight,
  Wallet,
  ArrowUpRight
} from 'lucide-react';
import CreditScoreModal from './CreditScoreModal';
import CloseoutReportModal from './CloseoutReportModal';

export default function Dashboard({ dashboardData, onRefresh, t, isLoading }) {
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showCloseoutModal, setShowCloseoutModal] = useState(false);

  const data = dashboardData?.data || {
    totalRevenue: 0,
    totalCash: 0,
    totalDigital: 0,
    cashTransactionsCount: 0,
    digitalTransactionsCount: 0,
    transactionCount: 0,
    paymentBreakdown: {},
    paymentTransactionsCount: {},
    topThreeItems: [],
    lowStockItems: [],
    lowStockItemsCount: 0,
    recentTransactions: [],
  };

  const totalRev = Number(data.totalRevenue) || 0;
  const cashAmt = Number(data.totalCash ?? data.paymentBreakdown?.Cash ?? 0);
  const digitalAmt = Number(data.totalDigital ?? (totalRev - cashAmt));

  const cashPct = totalRev > 0 ? Math.round((cashAmt / totalRev) * 100) : 0;
  const digitalPct = totalRev > 0 ? Math.round((digitalAmt / totalRev) * 100) : 0;

  const breakdown = data.paymentBreakdown || {};
  const recentTxns = data.recentTransactions || [];

  // Derive counts per payment method (from backend payload or fallback to analyzing recentTransactions)
  const countBreakdown = { ...(data.paymentTransactionsCount || {}) };
  if (Object.keys(countBreakdown).length === 0 && recentTxns.length > 0) {
    recentTxns.forEach(sale => {
      let m = sale.paymentMethod || 'Cash';
      if (m === 'CBE Birr') m = 'CBE';
      countBreakdown[m] = (countBreakdown[m] || 0) + 1;
    });
  }

  const totalTxCount = Number(data.transactionCount || data.todayTransactionsCount || recentTxns.length || 0);
  const cashTxCount = Number(
    data.cashTransactionsCount ?? 
    countBreakdown.Cash ?? 
    recentTxns.filter(s => (s.paymentMethod || 'Cash') === 'Cash').length
  );
  const digitalTxCount = Number(
    data.digitalTransactionsCount ?? 
    (totalTxCount >= cashTxCount ? totalTxCount - cashTxCount : 0)
  );

  const channels = [
    {
      key: 'Cash',
      label: t.pos?.methods?.Cash || 'Cash',
      localLabel: 'ጥሬ ገንዘብ',
      category: 'Cash',
      badge: 'Physical Cash',
      icon: DollarSign,
      color: 'emerald',
      bar: 'bg-emerald-500',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      key: 'Telebirr',
      label: t.pos?.methods?.Telebirr || 'Telebirr',
      localLabel: 'ቴሌብር QR',
      category: 'Transaction',
      badge: 'Mobile Wallet',
      icon: Smartphone,
      color: 'sky',
      bar: 'bg-sky-500',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
    },
    {
      key: 'CBE',
      altKey: 'CBE Birr',
      label: t.pos?.methods?.CBE || 'CBE (Commercial Bank)',
      localLabel: 'የኢትዮጵያ ንግድ ባንክ',
      category: 'Transaction',
      badge: 'Mobile Banking',
      icon: Landmark,
      color: 'purple',
      bar: 'bg-purple-600',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    {
      key: 'Coop Bank',
      label: t.pos?.methods?.['Coop Bank'] || 'Cooperative Bank',
      localLabel: 'ኮኦፕ ባንክ / Coopay',
      category: 'Transaction',
      badge: 'Coopay-Ebirr',
      icon: Building,
      color: 'rose',
      bar: 'bg-rose-500',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    {
      key: 'Awash Bank',
      label: t.pos?.methods?.['Awash Bank'] || 'Awash Bank',
      localLabel: 'አዋሽ ባንክ',
      category: 'Transaction',
      badge: 'Awash Birr',
      icon: Landmark,
      color: 'blue',
      bar: 'bg-blue-600',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      key: 'Sinqee Bank',
      label: t.pos?.methods?.['Sinqee Bank'] || 'Siinqee Bank',
      localLabel: 'ሲንቄ ባንክ',
      category: 'Transaction',
      badge: 'Siinqee Mobile',
      icon: Building,
      color: 'amber',
      bar: 'bg-amber-500',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      key: 'Abyssinia Bank',
      label: t.pos?.methods?.['Abyssinia Bank'] || 'Bank of Abyssinia',
      localLabel: 'አቢሲኒያ ባንክ (BoA)',
      category: 'Transaction',
      badge: 'BoA Mobile',
      icon: Landmark,
      color: 'indigo',
      bar: 'bg-indigo-600',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    },
    {
      key: 'Other',
      label: t.pos?.methods?.Other || 'Other Banks / Digital',
      localLabel: 'ሌሎች ባንኮች',
      category: 'Transaction',
      badge: 'Other Transfer',
      icon: CreditCard,
      color: 'slate',
      bar: 'bg-slate-500',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
    },
  ];

  const medalEmojis = ['🥇', '🥈', '🥉'];

  const getMethodBadge = (method) => {
    switch (method) {
      case 'Telebirr':
        return <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">Telebirr</span>;
      case 'CBE':
      case 'CBE Birr':
        return <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">CBE</span>;
      case 'Coop Bank':
        return <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">Coop Bank</span>;
      case 'Awash Bank':
        return <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Awash</span>;
      case 'Sinqee Bank':
        return <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Sinqee</span>;
      case 'Abyssinia Bank':
        return <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">BoA</span>;
      case 'Cash':
        return <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Cash</span>;
      default:
        return <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">{method}</span>;
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Dashboard Top Header & Z-Report Action Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shadow-xs">
              <BarChart3 className="w-4 h-4" />
            </span>
            {t.dashboard.title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.dashboard.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Phase 3 Credit Score Button */}
          <button
            onClick={() => setShowCreditModal(true)}
            className="py-2.5 px-3 bg-gradient-to-r from-indigo-900 to-slate-900 hover:from-indigo-950 text-amber-300 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>SME Credit Score</span>
          </button>

          {/* End-of-Day Closeout Report */}
          <button
            onClick={() => setShowCloseoutModal(true)}
            className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <FileCheck className="w-4 h-4 text-emerald-300" />
            <span>ቀን መዝጊያ (Z-Report)</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            title={t.dashboard.refresh}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4 Summary Cards: Total Sales, Cash Sales, Digital Transactions, Stock Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Today's Total Sales */}
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-5 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-[-15px] bottom-[-15px] w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">{t.dashboard.todayRevenue}</span>
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black tracking-tight">
                {totalRev.toLocaleString()} <span className="text-sm font-bold text-emerald-200">{t.currency}</span>
              </div>
              <p className="text-[11px] text-emerald-200/90 mt-1">
                Gross daily retail volume
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-semibold text-emerald-100">
            <span>All Channels</span>
            <span className="font-extrabold bg-white/20 px-2 py-0.5 rounded-full text-[11px]">
              {totalTxCount} {t.dashboard.transactions || 'Transactions'}
            </span>
          </div>
        </div>

        {/* Card 2: Today's Total Cash Sales */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                {t.dashboard.cashSales || 'Cash Sales'}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {cashAmt.toLocaleString()} <span className="text-xs font-bold text-slate-500">{t.currency}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {t.dashboard.cashDesc || 'Physical cash in drawer'}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-extrabold">{cashPct}% of total</span>
            <span className="font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded-full text-[11px]">
              {cashTxCount} {cashTxCount === 1 ? 'Cash Sale' : 'Cash Sales'}
            </span>
          </div>
        </div>

        {/* Card 3: Today's Total Digital / Bank Transactions */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider truncate max-w-[170px]">
                {t.dashboard.digitalSales || 'Digital Transactions'}
              </span>
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <Smartphone className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {digitalAmt.toLocaleString()} <span className="text-xs font-bold text-slate-500">{t.currency}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 truncate">
                {t.dashboard.digitalDesc || 'Telebirr, CBE & bank wallets'}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-sky-700 font-extrabold">{digitalPct}% of total</span>
            <span className="font-bold bg-sky-50 text-sky-800 border border-sky-200/60 px-2 py-0.5 rounded-full text-[11px]">
              {digitalTxCount} {digitalTxCount === 1 ? 'Transaction' : 'Transactions'}
            </span>
          </div>
        </div>

        {/* Card 4: Stock Alerts */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                {t.dashboard.stockAlerts}
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-amber-600">
                {data.lowStockItemsCount || 0}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Units running below threshold (&lt;5)</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Inventory Health</span>
            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-[11px]">
              {(data.lowStockItemsCount || 0) === 0 ? 'Optimal Stock' : 'Restock Needed'}
            </span>
          </div>
        </div>

      </div>

      {/* Cash Drawer vs Digital Banking Macro Reconciliation Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-600 shrink-0" />
            <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">
              {t.dashboard.reconciliationTitle}
            </h3>
          </div>
          <div className="text-xs text-slate-500">
            Total Reconciled: <span className="font-bold text-slate-900">{totalRev.toLocaleString()} {t.currency}</span> across <span className="font-bold text-slate-900">{totalTxCount} transactions</span>
          </div>
        </div>

        {/* Bi-color Macro Progress Bar */}
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div 
            className="bg-emerald-500 h-full transition-all duration-500" 
            style={{ width: `${cashPct}%` }}
            title={`Cash: ${cashAmt.toLocaleString()} ${t.currency} (${cashTxCount} sales, ${cashPct}%)`}
          ></div>
          <div 
            className="bg-sky-500 h-full transition-all duration-500" 
            style={{ width: `${digitalPct}%` }}
            title={`Digital Transactions: ${digitalAmt.toLocaleString()} ${t.currency} (${digitalTxCount} txns, ${digitalPct}%)`}
          ></div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2 text-emerald-800 font-bold">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shrink-0"></span>
            <span>
              {t.dashboard.cashDrawer}: <b>{cashAmt.toLocaleString()} {t.currency}</b> 
              <span className="text-slate-500 font-semibold ml-1.5">({cashTxCount} {cashTxCount === 1 ? 'sale' : 'sales'} • {cashPct}%)</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-sky-800 font-bold">
            <span className="w-3 h-3 rounded-full bg-sky-500 inline-block shrink-0"></span>
            <span>
              {t.dashboard.digitalWallets}: <b>{digitalAmt.toLocaleString()} {t.currency}</b> 
              <span className="text-slate-500 font-semibold ml-1.5">({digitalTxCount} {digitalTxCount === 1 ? 'transaction' : 'transactions'} • {digitalPct}%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Section: Today's Sales Separated by Payment Method (In Cash and Transactions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Detailed Channel List (Cash vs Telebirr vs Banks) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-600" />
                <span>{t.dashboard.salesByMethodTitle || "Today's Sales by Payment Method"}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.dashboard.salesByMethodSubtitle || "Separated by physical cash drawer and electronic bank transactions"}
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto">
              8 Payment Channels
            </span>
          </div>

          {/* Channel Cards Grid */}
          <div className="space-y-3">
            {channels.map((ch) => {
              const amt = Number(breakdown[ch.key] || 0) + (ch.altKey ? Number(breakdown[ch.altKey] || 0) : 0);
              const txCount = Number(countBreakdown[ch.key] || 0) + (ch.altKey ? Number(countBreakdown[ch.altKey] || 0) : 0);
              const pct = totalRev > 0 ? Math.round((amt / totalRev) * 100) : 0;
              const IconComp = ch.icon;

              return (
                <div 
                  key={ch.key} 
                  className="bg-slate-50/80 hover:bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 transition-all flex flex-col justify-between gap-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    {/* Method Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-xs shrink-0">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                            {ch.label}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${ch.badgeBg}`}>
                            {ch.category === 'Cash' ? '💵 Cash' : '📱 Transaction'}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {ch.localLabel}
                        </span>
                      </div>
                    </div>

                    {/* Sales in Cash/ETB & Transaction Count */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-12 sm:pl-0">
                      <div className="text-left sm:text-right">
                        <div className="font-black text-xs sm:text-sm text-slate-900">
                          {amt.toLocaleString()} <span className="text-[10px] font-bold text-slate-500">{t.currency}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-semibold">
                          {pct}% of sales
                        </div>
                      </div>

                      {/* Transaction Count Pill */}
                      <div className="bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-center min-w-[75px] shadow-xs">
                        <span className="block text-xs font-black text-slate-900">{txCount}</span>
                        <span className="block text-[10px] text-slate-500 font-medium leading-none">
                          {txCount === 1 ? 'transaction' : 'transactions'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Channel Percentage Bar */}
                  <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`${ch.bar} h-1.5 rounded-full transition-all duration-500`} 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Top 3 Best-Sellers & SME Credit Score Teaser */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                {t.dashboard.topSellingTitle}
              </h3>
              <span className="text-[11px] font-bold text-slate-400">Best Movers</span>
            </div>

            {(!data.topThreeItems || data.topThreeItems.length === 0) ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No item sales recorded today yet.
              </div>
            ) : (
              <div className="space-y-3">
                {data.topThreeItems.map((item, idx) => (
                  <div
                    key={item.name + idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{medalEmojis[idx] || '⭐'}</span>
                      <div>
                        <div className="font-black text-slate-900 text-xs sm:text-sm">{item.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {item.quantity} {t.dashboard.unitsSold}
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-black text-emerald-700 text-xs sm:text-sm">
                      {item.revenue ? `${item.revenue} ${t.currency}` : `${item.quantity} sold`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Micro-Loan Qualification Card */}
          <button
            onClick={() => setShowCreditModal(true)}
            className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-amber-50/60 border border-indigo-200 text-left flex items-center justify-between hover:border-indigo-400 transition-all cursor-pointer shadow-xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-amber-300 flex items-center justify-center font-bold text-lg shadow-sm">
                ⭐
              </div>
              <div>
                <span className="font-black text-xs text-indigo-950 block">SME Alternative Credit Ledger</span>
                <span className="text-[11px] text-slate-600">Reconciled cash & bank transactions qualify for working capital loans</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* Recent Transactions Feed */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <h3 className="font-black text-slate-900 text-sm">
              {t.dashboard.recentSalesTitle}
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {recentTxns.length} entries
          </span>
        </div>

        {(!recentTxns || recentTxns.length === 0) ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            {t.dashboard.noSalesToday}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">{t.dashboard.saleId}</th>
                  <th className="py-3 px-4">{t.dashboard.item}</th>
                  <th className="py-3 px-4">{t.dashboard.quantity}</th>
                  <th className="py-3 px-4">{t.dashboard.amount}</th>
                  <th className="py-3 px-4">{t.dashboard.method}</th>
                  <th className="py-3 px-4 text-right">{t.dashboard.time}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTxns.map((sale) => (
                  <tr key={sale._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      #{sale._id?.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">
                      {sale.productName || 'Item'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {sale.quantitySold}
                    </td>
                    <td className="py-3 px-4 font-black text-emerald-700">
                      {sale.totalAmount} {t.currency}
                    </td>
                    <td className="py-3 px-4">
                      {getMethodBadge(sale.paymentMethod)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px]">
                      {sale.createdAt ? new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Credit Scoring Modal */}
      <CreditScoreModal
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
        dashboardData={dashboardData}
        t={t}
      />

      {/* End-of-Day Closeout Z-Report Modal */}
      <CloseoutReportModal
        isOpen={showCloseoutModal}
        onClose={() => setShowCloseoutModal(false)}
        dashboardData={dashboardData}
        t={t}
      />

    </div>
  );
}
