import React from 'react';
import { 
  Building2, 
  Target, 
  Award, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  TrendingUp, 
  FileText,
  HeartHandshake,
  Lightbulb,
  Globe2
} from 'lucide-react';

export default function About({ onNavigate, onOpenPitchDeck }) {
  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-slate-800 text-white p-6 sm:p-10 rounded-3xl shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Story & Mission • ስለ ሱቅሲንክ</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white max-w-2xl leading-tight">
          Empowering Ethiopia's Informal Retailers to Flourish in the <span className="text-emerald-400">Digital Age</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          SuqSync (ሱቅሲንክ) was born in Addis Ababa out of a simple observation: neighborhood shops drive everyday life in Ethiopia, yet remain excluded from modern software and formal financial credit. We are building the operating system that bridges micro-merchants with Digital Ethiopia 2025/2030.
        </p>
      </section>

      {/* The 3 Core Challenges We Solve */}
      <section className="space-y-4">
        <div className="max-w-xl">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">The Problem in Ethiopian Retail</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Why Traditional Kiosks Struggle
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <span className="text-lg">📒</span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Paper Ledgers & Lost Stock</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Over 95% of small kiosks in Addis Ababa rely on memory or battered exercise books. As a result, shopkeepers lose 8%–15% of monthly revenue to untracked stock leakage and forgotten debts.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <span className="text-lg">⚖️</span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">The Cash vs. Telebirr Headache</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              With customers paying via Telebirr, CBE Birr, and physical cash notes simultaneously, owners spend exhausting hours every night manually matching SMS notifications to their cash drawers.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <span className="text-lg">🏦</span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Credit Invisibility for Bank Loans</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Commercial banks require formal books to approve working-capital loans. Despite generating millions of Birr annually, informal suq owners remain locked out of formal micro-credit.
            </p>
          </div>

        </div>
      </section>

      {/* Alignment with National Frameworks */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">National Strategic Alignment</span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Anchored in Ethiopian Policy & Incubation Priorities
            </h3>
          </div>
          <button
            onClick={onOpenPitchDeck}
            className="self-start sm:self-auto py-2 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Read Pitch Slides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                🇪🇹
              </div>
              <h4 className="font-bold text-xs text-slate-900">Digital Ethiopia 2025 / 2030</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              SuqSync directly advances the digital financial inclusion pillar of Digital Ethiopia by digitizing micro-merchant checkouts, promoting cashless transactions, and formalizing local trade records.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
                📜
              </div>
              <h4 className="font-bold text-xs text-slate-900">Startup Proclamation No. 1396/2025</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complies with the newly enacted Ethiopian Startup Proclamation, creating certified pilot merchant IDs (`SUQ-ETH-xxx`) that enable underwriting for micro-loans and SME tax transparency.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-emerald-900 text-white p-6 rounded-3xl space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-emerald-300 flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="font-black text-base">Our Mission</h3>
            <p className="text-xs text-emerald-200 leading-relaxed">
              To place a zero-cost, intuitive POS and stock management engine into the hands of every shopkeeper across all regional cities in Ethiopia.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-amber-300 flex items-center justify-center font-bold">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="font-black text-base">Our Vision</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              To become Ethiopia’s most trusted retail operating system, connecting over 500,000 neighborhood merchants with digital suppliers and working capital.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h3 className="font-black text-base text-slate-900">Merchant-First Values</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Simplicity over complexity. Offline resilience over internet dependence. Full support for local languages (Amharic & Afaan Oromoo).
            </p>
          </div>
        </div>

      </section>

      {/* Navigation Footer CTA */}
      <section className="bg-slate-100 p-6 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-slate-900">Explore SuqSync in Action</h4>
          <p className="text-xs text-slate-500">Discover our 6 core services or test our high-speed POS register.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('services')}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-all cursor-pointer"
          >
            Explore Services
          </button>
          <button
            onClick={() => onNavigate('pos')}
            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer"
          >
            Launch POS
          </button>
        </div>
      </section>

    </div>
  );
}
