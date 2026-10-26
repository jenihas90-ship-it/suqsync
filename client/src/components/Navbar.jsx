import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  ShoppingBag, 
  Package, 
  BarChart3, 
  Globe, 
  Settings, 
  User, 
  LogOut, 
  LogIn, 
  Home, 
  Layers, 
  Info, 
  Sparkles, 
  QrCode, 
  X 
} from 'lucide-react';

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
  onOpenAuth,
  onLogout,
  isAuthenticated,
  storeProfile
}) {
  // Step 1: Manage toggle state using React useState
  const [isOpen, setIsOpen] = useState(false);

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
          <span>🇪🇹 {t?.targetPitch || 'Innobiz-K Incubation Pitch (Digital Ethiopia 2025)'}</span>
          <button
            onClick={onOpenPitchDeck}
            className="underline hover:text-white font-bold ml-1 hidden sm:inline cursor-pointer"
          >
            [View Pitch Slides]
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[10px] hidden xs:inline">
            {serverStatus?.online ? `${serverStatus?.database?.mode || 'Server Active'}` : (t?.offline || 'Offline')}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
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
                className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 truncate max-w-[120px] sm:max-w-xs transition-colors cursor-pointer"
                title="Edit Store Profile & Location"
              >
                📍 {storeName}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-xs">
              {t?.appSubtitle || 'Ethiopian SME Inventory & Sales Tracker'}
            </p>
          </div>
        </div>

        {/* Action Shortcuts & Hamburger Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Store Settings Gear (Desktop/Tablet) */}
          <button
            onClick={onOpenSettings}
            className="hidden sm:inline-flex p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            title="Store Profile & CSV Export"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Pitch Deck Shortcut */}
          <button
            onClick={onOpenPitchDeck}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-lg text-xs font-bold transition-all cursor-pointer"
            title="Innobiz-K Incubation Pitch Slides"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Pitch</span>
          </button>

          {/* SaaS Pricing Plans Button */}
          <button
            onClick={onOpenPricing}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-lg text-xs font-bold transition-all cursor-pointer"
            title="Freemium SaaS Plans"
          >
            <span className="text-[11px]">💎</span>
            <span className="hidden md:inline">Plans</span>
          </button>

          {/* Quick Telebirr QR Stand Button */}
          <button
            onClick={onOpenTelebirrStand}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 rounded-lg text-xs font-bold transition-all cursor-pointer"
            title="Display Telebirr Merchant Counter Stand QR"
          >
            <QrCode className="w-3.5 h-3.5 text-sky-300" />
            <span className="hidden md:inline">Telebirr</span>
          </button>

          {/* Owner Account & Sign Out / Sign In Pill */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1 bg-slate-800/90 rounded-lg py-1 px-1.5 border border-slate-700 shadow-inner">
              <span 
                className="text-[11px] font-bold text-emerald-300 flex items-center gap-1 max-w-[85px] sm:max-w-[120px] truncate"
                title={`Signed in as: ${storeProfile?.ownerName || 'Owner'}`}
              >
                <User className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{storeProfile?.ownerName?.split(' ')[0] || 'Owner'}</span>
              </span>
              <button
                onClick={onLogout}
                className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 rounded transition-colors cursor-pointer"
                title="Sign Out / Lock Store (መውጫ)"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              title="Sign In with your registered Name & Password"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Sign In</span>
            </button>
          )}

          {/* Language Selector */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 shadow-inner">
            <Globe className="w-3 h-3 text-slate-400 ml-1 mr-0.5" />
            {languages.map((item) => (
              <button
                key={item.code}
                onClick={() => setLang(item.code)}
                className={`px-1.5 sm:px-2 py-1 text-[11px] font-semibold rounded-md transition-all ${
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

          {/* Step 2: Hamburger Icon (3 horizontal lines) using SVG to toggle menu */}
          <button
            onClick={() => setIsOpen(prev => !prev)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="w-5 h-5 text-emerald-400" />
            ) : (
              <svg 
                className="w-5 h-5 text-slate-200" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

        </div>
      </div>

      {/* Step 3: Hidden menu that drops down cleanly on mobile screens with React Router <Link> components */}
      {isOpen && (
        <div className="bg-slate-900/95 border-t border-slate-800 backdrop-blur-md px-4 py-3 shadow-xl transition-all duration-200">
          <div className="max-w-6xl mx-auto space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
              Menu Navigation
            </p>

            {/* React Router <Link> for Home (/) */}
            <Link
              to="/"
              onClick={() => {
                setActiveTab?.('home');
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'home'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-200 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4 text-emerald-400" />
              <span>{t?.tabs?.home || 'Home'}</span>
            </Link>

            {/* React Router <Link> for About (/about) */}
            <Link
              to="/about"
              onClick={() => {
                setActiveTab?.('about');
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'about'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-200 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Info className="w-4 h-4 text-emerald-400" />
              <span>{t?.tabs?.about || 'About'}</span>
            </Link>

            {/* React Router <Link> for Services (/services) */}
            <Link
              to="/services"
              onClick={() => {
                setActiveTab?.('services');
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'services'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-200 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>{t?.tabs?.services || 'Services'}</span>
            </Link>

            {/* Operational Store Tabs in Mobile Drawer */}
            <div className="pt-2 mt-2 border-t border-slate-800 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
                Store Operations
              </p>

              <button
                onClick={() => {
                  setActiveTab?.('pos');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === 'pos'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t?.tabs?.pos || 'Point of Sale'}</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Cashier
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab?.('inventory');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === 'inventory'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  <span>{t?.tabs?.inventory || 'Inventory'}</span>
                </div>
                {lowStockCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white animate-pulse">
                    {lowStockCount} low
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab?.('dashboard');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4" />
                  <span>{t?.tabs?.dashboard || 'Dashboard'}</span>
                </div>
              </button>
            </div>

            {/* Mobile Actions Grid */}
            <div className="pt-2 mt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onOpenTelebirrStand?.();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Telebirr QR</span>
              </button>

              <button
                onClick={() => {
                  onOpenPricing?.();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <span>💎 Plans</span>
              </button>

              <button
                onClick={() => {
                  onOpenPitchDeck?.();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pitch</span>
              </button>

              <button
                onClick={() => {
                  onOpenSettings?.();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Tab Navigation Bar */}
      <nav className="hidden md:flex max-w-6xl mx-auto px-4 border-t border-slate-800/80 bg-slate-900/95 items-center overflow-x-auto no-scrollbar gap-1 sm:gap-2">
        <Link
          to="/"
          onClick={() => setActiveTab?.('home')}
          className={`flex items-center gap-1.5 py-2 px-3 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>{t?.tabs?.home || 'Home'}</span>
        </Link>

        <Link
          to="/services"
          onClick={() => setActiveTab?.('services')}
          className={`flex items-center gap-1.5 py-2 px-3 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'services'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t?.tabs?.services || 'Services'}</span>
        </Link>

        <Link
          to="/about"
          onClick={() => setActiveTab?.('about')}
          className={`flex items-center gap-1.5 py-2 px-3 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'about'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>{t?.tabs?.about || 'About'}</span>
        </Link>

        <div className="h-4 w-px bg-slate-800 shrink-0 mx-1"></div>

        <button
          onClick={() => setActiveTab?.('pos')}
          className={`flex items-center gap-1.5 py-2 px-3 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'pos'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{t?.tabs?.pos || 'POS'}</span>
        </button>

        <button
          onClick={() => setActiveTab?.('inventory')}
          className={`flex items-center gap-1.5 py-2 px-3 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-all cursor-pointer relative ${
            activeTab === 'inventory'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>{t?.tabs?.inventory || 'Inventory'}</span>
          {lowStockCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
              {lowStockCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab?.('dashboard')}
          className={`flex items-center gap-1.5 py-2 px-3 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{t?.tabs?.dashboard || 'Dashboard'}</span>
        </button>
      </nav>
    </header>
  );
}
