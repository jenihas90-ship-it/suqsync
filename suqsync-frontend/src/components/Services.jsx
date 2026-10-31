import React from 'react';
import { 
  ShoppingBag, 
  Package, 
  BarChart3, 
  QrCode, 
  Smartphone, 
  ShieldCheck, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Download, 
  Zap, 
  FileCheck2, 
  CreditCard,
  Building,
  Sparkles,
  RotateCw
} from 'lucide-react';

export default function Services({ onNavigate, onOpenTelebirrStand, onOpenPricing, onOpenPitchDeck }) {
  const services = [
    {
      id: 'pos',
      title: '1. Touchscreen Point of Sale (POS)',
      amharic: 'የፈጣን ሽያጭ መመዝገቢያ (POS)',
      icon: ShoppingBag,
      color: 'emerald',
      badge: 'High Speed',
      description: 'Lightning-fast checkout interface designed for busy morning and evening rush hours in Ethiopian suqs. No barcode scanner required.',
      features: [
        '2-Tap Sale Completion with visual item tiles',
        'Multi-currency & Ethiopian Birr (ETB) calculation',
        'Automatic printable receipts with merchant till ID',
        'Instant deduction from live inventory stock'
      ],
      ctaText: 'Open POS Register',
      action: () => onNavigate('pos')
    },
    {
      id: 'inventory',
      title: '2. Real-Time Stock Management',
      amharic: 'የእቃ ክምችት ቁጥጥር',
      icon: Package,
      color: 'sky',
      badge: 'Automated',
      description: 'Digitize your entire stockroom. Every item sold deducts units automatically so you always know what you have on your shelves.',
      features: [
        'Automatic Low-Stock Alerts (< 5 units threshold)',
        'One-click restock addition without tedious forms',
        'Categorized tracking: Beverages, Food, Spices & Grains',
        'Exportable CSV inventory ledger for suppliers'
      ],
      ctaText: 'Manage Stockroom',
      action: () => onNavigate('inventory')
    },
    {
      id: 'payments',
      title: '3. Telebirr & Multi-Bank Dynamic QR',
      amharic: 'የቴሌብርና የባንክ ዲጂታል ክፍያ',
      icon: QrCode,
      color: 'blue',
      badge: 'Zero Math Errors',
      description: 'Generate dynamic customer QR codes containing the exact checkout amount, eliminating wrong customer transfers and fraud.',
      features: [
        'Dynamic Telebirr QR codes generated per sale',
        'Printable Merchant Counter Stand QR posters',
        'Multi-bank settlement: CBE, Coopay-Ebirr, Awash, Sinqee, BoA',
        'Immediate customer checkout without cash change hassles'
      ],
      ctaText: 'View Telebirr Stand',
      action: onOpenTelebirrStand
    },
    {
      id: 'dashboard',
      title: '4. End-of-Day Financial Reconciliation',
      amharic: 'የዕለት ገቢና ወጪ ማጠቃለያ',
      icon: BarChart3,
      color: 'amber',
      badge: 'Instant Balancing',
      description: 'Reconcile your physical cash drawer against incoming Telebirr and CBE mobile banking transfers at the tap of a button.',
      features: [
        'Cash Drawer vs. Digital Wallets breakdown',
        'Real-time daily gross revenue & transaction count',
        'Top 3 best-selling products of the day',
        'Audit-ready financial closeout reports'
      ],
      ctaText: 'Open Dashboard',
      action: () => onNavigate('dashboard')
    },
    {
      id: 'credit',
      title: '5. Micro-Loan Qualification & Credit Ledger',
      amharic: 'የባንክ ብድር ማሟያ የግብይት መዝገብ',
      icon: ShieldCheck,
      color: 'purple',
      badge: 'Proclamation 1396',
      description: 'Build a certified digital transaction footprint that formalizes your kiosk and qualifies you for working-capital loans.',
      features: [
        'Unique Innobiz-K Pilot Shop ID certification (SUQ-ETH-xxx)',
        'National ID / Fayda & TIN verification readiness',
        'Clean digital ledger for commercial bank loan officers',
        'Compliant with Ethiopian Startup Proclamation No. 1396/2025'
      ],
      ctaText: 'View Pitch Roadmap',
      action: onOpenPitchDeck
    },
    {
      id: 'sync',
      title: '6. Autonomous Offline Engine & Mobile Sync',
      amharic: 'ያለ ኢንተርኔት የሚሰራና ስልክ ማገናኛ',
      icon: Smartphone,
      color: 'teal',
      badge: '100% Reliable',
      description: 'Runs completely offline inside your browser. Point your Android phone camera at your PC screen to sync your entire store instantly.',
      features: [
        'Operates with zero internet connectivity during network cuts',
        'Instant 1-Click QR camera sync between desktop & Android',
        'Persistent local storage keeps data secure on your device',
        'No monthly server fees or mandatory subscriptions'
      ],
      ctaText: 'Check SaaS Plans',
      action: onOpenPricing
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-slate-800 text-white p-6 sm:p-10 rounded-3xl shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Full Service Suite • ሙሉ አገልግሎቶች</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white max-w-2xl leading-tight">
          Comprehensive Digital Retail Tools Built for <span className="text-emerald-400">Ethiopian Suqs</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          From high-volume morning POS checkout to evening Telebirr reconciliation and credit score generation, SuqSync delivers a full suite of services built specifically for local retail requirements.
        </p>
      </section>

      {/* Services Grid (6 Cards) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <div 
              key={s.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 font-bold">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {s.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{s.title}</h3>
                  <span className="text-[11px] font-semibold text-emerald-700">{s.amharic}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.description}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  {s.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={s.action}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <span>{s.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">Experience All Services in Action</h3>
          <p className="text-xs text-slate-400 max-w-md">
            Test the Quick POS register or explore our freemium SME pricing plans.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('pos')}
            className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
          >
            Launch POS Register
          </button>
          <button
            onClick={onOpenPricing}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
          >
            SaaS Plans
          </button>
        </div>
      </section>

    </div>
  );
}
