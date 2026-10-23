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
  ChevronRight
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
    transactionCount: 0,
    paymentBreakdown: {},
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

  const channelConfig = {
    Cash: { label: t.pos.methods.Cash, icon: DollarSign, color: 'emerald', bar: 'bg-emerald-500' },
    Telebirr: { label: t.pos.methods.Telebirr, icon: Smartphone, color: 'sky', bar: 'bg-sky-500' },
    CBE: { label: t.pos.methods.CBE, icon: Landmark, color: 'purple', bar: 'bg-purple-600' },
    'CBE Birr': { label: t.pos.methods.CBE, icon: Landmark, color: 'purple', bar: 'bg-purple-600' },
    'Coop Bank': { label: t.pos.methods['Coop Bank'], icon: Building, color: 'rose', bar: 'bg-rose-500' },
    'Awash Bank': { label: t.pos.methods['Awash Bank'], icon: Landmark, color: 'blue', bar: 'bg-blue-600' },
    'Sinqee Bank': { label: t.pos.methods['Sinqee Bank'], icon: Building, color: 'amber', bar: 'bg-amber-500' },
    'Abyssinia Bank': { label: t.pos.methods['Abyssinia Bank'], icon: Landmark, color: 'indigo', bar: 'bg-indigo-600' },
    Other: { label: t.pos.methods.Other, icon: CreditCard, color: 'slate', bar: 'bg-slate-500' },
  };

  const breakdown = data.paymentBreakdown || {};
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
    <div className="space-y-4">
      {/* Dashboard Header with 2 Innobiz-K Pitch Buttons */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
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
            className="py-2 px-3 bg-gradient-to-r from-indigo-900 to-slate-900 hover:from-indigo-950 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>SME Credit Score</span>
          </button>

          {/* End-of-Day Closeout Report */}
          <button
            onClick={() => setShowCloseoutModal(true)}
            className="py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <FileCheck className="w-4 h-4 text-emerald-300" />
            <span>ቀን መዝጊያ (Z-Report)</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            title={t.dashboard.refresh}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Today's Revenue */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-4 shadow-md relative overflow-hidden">
          <div className="absolute right-[-10px] bottom-[-10px] w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-100">{t.dashboard.todayRevenue}</span>
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              {totalRev.toLocaleString()} <span className="text-sm font-bold text-emerald-200">{t.currency}</span>
            </div>
            <p className="text-[11px] text-emerald-200 mt-1">
              End-of-day reconciled total
            </p>
          </div>
        </div>

        {/* Transactions Today */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.dashboard.todayTransactions}
            </span>
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {data.transactionCount || 0}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Logged via 2-Tap POS</p>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.dashboard.stockAlerts}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-amber-600">
              {data.lowStockItemsCount || 0}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Units running below threshold (&lt;5)</p>
          </div>
        </div>

      </div>

      {/* Cash Drawer vs Digital Banking Macro Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
              {t.dashboard.reconciliationTitle}
            </h3>
          </div>
          <div className="text-[11px] text-slate-500">
            Total Digital: <span className="font-bold text-slate-900">{digitalAmt.toLocaleString()} {t.currency}</span> ({digitalPct}%)
          </div>
        </div>

        {/* Bi-color Macro Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div 
            className="bg-emerald-500 h-full transition-all duration-500" 
            style={{ width: `${cashPct}%` }}
            title={`Cash: ${cashAmt} ${t.currency} (${cashPct}%)`}
          ></div>
          <div 
            className="bg-sky-500 h-full transition-all duration-500" 
            style={{ width: `${digitalPct}%` }}
            title={`Digital: ${digitalAmt} ${t.currency} (${digitalPct}%)`}
          ></div>
        </div>

        <div className="flex items-center justify-between text-xs pt-0.5">
          <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>{t.dashboard.cashDrawer}: <b>{cashAmt.toLocaleString()} {t.currency}</b> ({cashPct}%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-800 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
            <span>{t.dashboard.digitalWallets}: <b>{digitalAmt.toLocaleString()} {t.currency}</b> ({digitalPct}%)</span>
          </div>
        </div>
      </div>

      {/* Detailed Payment Reconciliation Channels + Top 3 Best-Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Breakdown by Bank / Channel */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
          <div className="border-b border-slate-100 pb-3 mb-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-600" />
              <span>Channel Reconciliation Breakdown</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{t.dashboard.reconciliationDesc}</p>
          </div>

          <div className="space-y-2.5">
            {Object.keys(channelConfig).map((key) => {
              const conf = channelConfig[key];
              const amt = Number(breakdown[key] || (key === 'CBE' ? breakdown['CBE Birr'] : 0) || 0);
              const pct = totalRev > 0 ? Math.round((amt / totalRev) * 100) : 0;
              const IconComp = conf.icon;

              return (
                <div key={key} className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                        <IconComp className="w-3 h-3" />
                      </div>
                      <span className="font-bold text-xs text-slate-800">{conf.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-xs text-slate-900">{amt.toLocaleString()} {t.currency}</span>
                      <span className="text-[11px] text-slate-400 ml-1.5 font-medium">({pct}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className={`${conf.bar} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 3 Best-Selling Items */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                {t.dashboard.topSellingTitle}
              </h3>
            </div>

            {(!data.topThreeItems || data.topThreeItems.length === 0) ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No item sales recorded today yet.
              </div>
            ) : (
              <div className="space-y-3">
                {data.topThreeItems.map((item, idx) => (
                  <div
                    key={item.name + idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{medalEmojis[idx] || '⭐'}</span>
                      <div>
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {item.quantity} {t.dashboard.unitsSold}
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-black text-emerald-700 text-xs sm:text-sm">
                      {item.revenue} {t.currency}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Micro-loan pitch teaser card */}
          <button
            onClick={() => setShowCreditModal(true)}
            className="mt-4 p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-amber-50/60 border border-indigo-200/80 text-left flex items-center justify-between hover:border-indigo-400 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">⭐</span>
              <div>
                <span className="font-bold text-xs text-indigo-950 block">SME Loan Qualification</span>
                <span className="text-[10px] text-slate-500">Pre-approved for working capital micro-loans</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-indigo-600" />
          </button>
        </div>

      </div>

      {/* Recent Transactions Feed */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            {t.dashboard.recentSalesTitle}
          </h3>
          <span className="text-[11px] text-slate-400">
            {data.recentTransactions?.length || 0} entries
          </span>
        </div>

        {(!data.recentTransactions || data.recentTransactions.length === 0) ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            {t.dashboard.noSalesToday}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-4">{t.dashboard.saleId}</th>
                  <th className="py-2.5 px-4">{t.dashboard.item}</th>
                  <th className="py-2.5 px-4">{t.dashboard.quantity}</th>
                  <th className="py-2.5 px-4">{t.dashboard.amount}</th>
                  <th className="py-2.5 px-4">{t.dashboard.method}</th>
                  <th className="py-2.5 px-4 text-right">{t.dashboard.time}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recentTransactions.map((sale) => (
                  <tr key={sale._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">
                      #{sale._id?.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">
                      {sale.productName || 'Item'}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-700">
                      {sale.quantitySold}
                    </td>
                    <td className="py-2.5 px-4 font-black text-emerald-700">
                      {sale.totalAmount} {t.currency}
                    </td>
                    <td className="py-2.5 px-4">
                      {getMethodBadge(sale.paymentMethod)}
                    </td>
                    <td className="py-2.5 px-4 text-right text-slate-400 font-mono text-[11px]">
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
