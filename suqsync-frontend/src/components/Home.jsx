import React from 'react';
import { 
  ShoppingBag, 
  Package, 
  BarChart3, 
  QrCode, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Store, 
  TrendingUp, 
  Zap, 
  Layers, 
  Globe,
  Coins,
  BadgeCheck,
  Building2,
  PhoneCall
} from 'lucide-react';

export default function Home({ onNavigate, storeProfile, isOwnerRegistered, onOpenPitchDeck, onOpenPricing }) {
  const shopName = storeProfile?.storeName || 'SuqSync Pilot Store';
  const ownerName = storeProfile?.ownerName || 'Merchant';

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 border border-slate-800 text-white p-6 sm:p-10 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-5">
          {/* Incubation & Compliance Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>🇪🇹 Innobiz-K Incubation Pitch • Digital Ethiopia 2025/2030</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Digitizing Ethiopia's Neighborhood <span className="text-emerald-400">Suqs</span> & <span className="text-amber-400">SMEs</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
            Lightweight, offline-first Inventory & POS tracker tailored for Ethiopian kiosks, mini-marts, and buna cafes. 
            Instant touchscreen billing, dynamic Telebirr & CBE banking QR codes, real-time stock deductions, and automated end-of-day reconciliation.
          </p>

          {/* Quick Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('pos')}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Launch Quick POS (ወደ ሽያጭ)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('inventory')}
              className="py-3 px-5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Package className="w-4 h-4 text-emerald-400" />
              <span>Digital Stockroom</span>
            </button>

            <button
              onClick={() => onNavigate('services')}
              className="py-3 px-5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>Explore Services</span>
            </button>
          </div>

          {/* Registered Store Welcome Pill */}
          {isOwnerRegistered && (
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400">● Active Store:</span>
              <span className="font-bold text-white">{shopName}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Owner: {ownerName}</span>
            </div>
          )}
        </div>
      </section>

      {/* Live Impact & Metric Highlights */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-2">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">100k+</div>
            <div className="text-xs text-slate-500 font-medium">Target Ethiopian SMEs</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold mb-2">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">8 Banks & Wallets</div>
            <div className="text-xs text-slate-500 font-medium">Telebirr, CBE, Coop, Awash</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-2">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">100% Offline</div>
            <div className="text-xs text-slate-500 font-medium">Autonomous Local Engine</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-2">
            <BadgeCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">Law No. 1396</div>
            <div className="text-xs text-slate-500 font-medium">Startup Proclamation Ready</div>
          </div>
        </div>
      </section>

      {/* Core Capability Cards */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">Everything Local Shops Need</span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Designed for Daily Ethiopian Commerce</h2>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
            <span>See all services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Rapid POS */}
          <div 
            onClick={() => onNavigate('pos')}
            className="group bg-white p-5 rounded-3xl border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Touchscreen Quick POS</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                2-tap sale logging without barcodes. Tap items, select Cash or Digital Banking, and instantly print or display customer receipts.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
              <span>Open POS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Digital Stockroom */}
          <div 
            onClick={() => onNavigate('inventory')}
            className="group bg-white p-5 rounded-3xl border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Real-Time Stock Room</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deducts inventory units automatically with every sale. Features automatic low-stock alerts below 5 units so you never run out of top sellers.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform">
              <span>Manage Stock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Financial Dashboard */}
          <div 
            onClick={() => onNavigate('dashboard')}
            className="group bg-white p-5 rounded-3xl border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Cash vs. Digital Reconciliation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reconciles cash in drawer against Telebirr & CBE mobile transfers at close of day, eliminating calculation errors and revenue leakage.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
              <span>View Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* Target SME Categories */}
      <section className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-5">
        <div className="max-w-xl">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">Built For Local Businesses</span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
            Tailored for Every Corner Store in Ethiopia
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Whether you run a high-traffic kiosk in Bole or a spice stall in Merkato, SuqSync adjusts to your trade category.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex flex-col items-center text-center">
            <span className="text-2xl mb-1">🏪</span>
            <span className="font-extrabold text-xs text-slate-200">Kiosk / Suq</span>
            <span className="text-[10px] text-slate-400">ኪዮስክ / ሱቅ</span>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex flex-col items-center text-center">
            <span className="text-2xl mb-1">🛒</span>
            <span className="font-extrabold text-xs text-slate-200">Mini-Mart</span>
            <span className="text-[10px] text-slate-400">ሚኒ ማርት</span>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex flex-col items-center text-center">
            <span className="text-2xl mb-1">☕</span>
            <span className="font-extrabold text-xs text-slate-200">Cafe / Buna</span>
            <span className="text-[10px] text-slate-400">ቡና ቤት / ካፌ</span>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex flex-col items-center text-center">
            <span className="text-2xl mb-1">🌾</span>
            <span className="font-extrabold text-xs text-slate-200">Spices & Grains</span>
            <span className="text-[10px] text-slate-400">እህልና ቅመማቅመም</span>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex flex-col items-center text-center col-span-2 sm:col-span-1">
            <span className="text-2xl mb-1">💊</span>
            <span className="font-extrabold text-xs text-slate-200">Pharmacies</span>
            <span className="text-[10px] text-slate-400">የመድኃኒት መደብር</span>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">Ready to Run Your Store Today?</h3>
          <p className="text-xs text-emerald-100 max-w-md">
            Works directly in your phone or PC browser. No expensive POS hardware required.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('pos')}
            className="py-3 px-6 rounded-xl bg-white text-slate-950 font-black text-xs hover:bg-emerald-50 active:scale-95 shadow-lg transition-all cursor-pointer"
          >
            Start Selling Now
          </button>
          <button
            onClick={onOpenPitchDeck}
            className="py-3 px-4 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
          >
            View Pitch Slides
          </button>
        </div>
      </section>

    </div>
  );
}
