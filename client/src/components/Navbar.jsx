import React from 'react';
import { Store, ShoppingBag, Package, BarChart3, Globe, Database, AlertCircle, QrCode, Sparkles, Award, Settings } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  lang, 
  setLang, 
  t, 
  serverStatus, 
  lowStockCount,
  onOpenTelebirrStand,
  onOpenPitchDeck,
  onOpenPricing,
  onOpenSettings,
  storeProfile
}) {
  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'am', label: 'አማርኛ', short: 'አማ' },
    { code: 'om', label: 'Afaan Oromoo', short: 'OM' },
  ];

  const storeName = storeProfile?.storeName || 'SuqSync Pilot Store #01';

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top Banner / Ethiopian Incubation Tag */}
      <div className="bg-gradient-to-r from-emerald-800 via-amber-700 to-rose-800 text-[11px] font-medium py-1 px-4 text-center tracking-wide text-amber-100 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span>🇪🇹 {t.targetPitch}</span>
          <button
            onClick={onOpenPitchDeck}
            className="underline hover:text-white font-bold ml-1 hidden sm:inline cursor-pointer"
          >
            [View Pitch Slides]
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[10px] hidden xs:inline">{serverStatus.online ? `${serverStatus.database?.mode || 'Server Active'}` : t.offline}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
        {/* Brand & Store Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg ring-2 ring-emerald-400/20">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1">
                Suq<span className="text-emerald-400">Sync</span>
              </h1>
              <button
                onClick={onOpenSettings}
                className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 truncate max-w-[130px] sm:max-w-xs transition-colors cursor-pointer"
                title="Edit Store Profile & Location"
              >
                📍 {storeName}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-xs">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Shortcuts: Pricing, Telebirr Stand, Pitch & Language */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Store Settings Gear */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            title="Store Profile & CSV Export"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Pitch Deck Shortcut */}
          <button
            onClick={onOpenPitchDeck}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-lg text-xs font-bold transition-all cursor-pointer"
            title="Innobiz-K Incubation Pitch Slides"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">Pitch</span>
          </button>

          {/* SaaS Pricing Plans Button */}
          <button
            onClick={onOpenPricing}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-lg text-xs font-bold transition-all cursor-pointer"
            title="Freemium SaaS Plans"
          >
            <span className="text-[11px]">💎</span>
            <span className="hidden md:inline">Plans</span>
          </button>

          {/* Quick Telebirr QR Stand Button */}
          <button
            onClick={onOpenTelebirrStand}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 rounded-lg text-xs font-bold transition-all cursor-pointer"
            title="Display Telebirr Merchant Counter Stand QR"
          >
            <QrCode className="w-3.5 h-3.5 text-sky-300" />
            <span className="hidden sm:inline">Telebirr</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 shadow-inner">
            <Globe className="w-3 h-3 text-slate-400 ml-1 mr-0.5" />
            {languages.map((item) => (
              <button
                key={item.code}
                onClick={() => setLang(item.code)}
                className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all ${
                  lang === item.code
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
                title={item.label}
              >
                {item.short}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Primary Tab Navigation */}
      <nav className="max-w-6xl mx-auto px-3 border-t border-slate-800/80 bg-slate-900/95 flex justify-around sm:justify-start sm:gap-4">
        <button
          onClick={() => setActiveTab('pos')}
          className={`flex items-center gap-2 py-2 px-3 sm:px-4 font-semibold text-xs sm:text-sm border-b-2 transition-all relative ${
            activeTab === 'pos'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t.tabs.pos}</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 py-2 px-3 sm:px-4 font-semibold text-xs sm:text-sm border-b-2 transition-all relative ${
            activeTab === 'inventory'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t.tabs.inventory}</span>
          {lowStockCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
              {lowStockCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 py-2 px-3 sm:px-4 font-semibold text-xs sm:text-sm border-b-2 transition-all relative ${
            activeTab === 'dashboard'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{t.tabs.dashboard}</span>
        </button>
      </nav>
    </header>
  );
}
