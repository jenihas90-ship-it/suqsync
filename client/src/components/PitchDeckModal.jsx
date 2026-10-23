import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  Target, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  Smartphone, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export default function PitchDeckModal({ isOpen, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: "SuqSync (ሱቅሲንክ)",
      subtitle: "Bridging the Digitization Gap for Ethiopian Retail SMEs",
      badge: "Innobiz-K Incubation Pitch • 1.0 MVP",
      content: (
        <div className="space-y-4 text-center py-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl ring-4 ring-emerald-500/20 text-3xl font-black">
            🇪🇹
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Suq<span className="text-emerald-600">Sync</span> Technologies
            </h2>
            <p className="text-sm font-semibold text-slate-600">
              Lightweight, mobile-first inventory & POS tracker tailored for Ethiopian suqs and cafes
            </p>
          </div>
          <div className="max-w-md mx-auto pt-2 grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block">Digital Ethiopia</span>
              <span className="text-[10px] text-slate-400">2025/2030 Strategy</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block">Proclamation</span>
              <span className="text-[10px] text-slate-400">No. 1396/2025</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block">MERN Stack</span>
              <span className="text-[10px] text-slate-400">14-Day Delivery</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "1. The Problem vs. The Solution",
      subtitle: "Unstandardized paper ledgers cost Ethiopian merchants billions of Birr",
      badge: "Core Value Proposition",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-xs">
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2.5">
            <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm">
              <span className="text-base">❌</span>
              <span>The Problem (Status Quo)</span>
            </div>
            <ul className="space-y-2 text-rose-950 font-medium leading-relaxed">
              <li>• Inaccurate daily revenue tracking on loose paper sheets.</li>
              <li>• Difficulty reconciling physical Cash vs. Telebirr/CBE transfers.</li>
              <li>• Stockouts on high-demand essentials (Shiro, Buna, Oil, Teff).</li>
              <li>• Lack of verifiable financial records required for bank micro-loans.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
              <span className="text-base">✓</span>
              <span>The SuqSync Solution</span>
            </div>
            <ul className="space-y-2 text-emerald-950 font-medium leading-relaxed">
              <li>• Accessible in <b>English, Amharic, and Afaan Oromoo</b>.</li>
              <li>• <b>2-Tap POS</b> on ordinary smartphones (no POS terminal hardware).</li>
              <li>• Automated stock deduction & low-stock alerts (&lt;5 units).</li>
              <li>• Real-time payment reconciliation & Phase 3 alternative credit scoring.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "2. Market Traction & Pilot Goals",
      subtitle: "14-Day MVP Incubation Targets for Hub Evaluation",
      badge: "Metrics & Validation",
      content: (
        <div className="space-y-4 py-3 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-2xl font-black text-emerald-700 block">14 Days</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">MVP Launch</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-2xl font-black text-sky-700 block">10 Pilot</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Active Suqs</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-2xl font-black text-amber-700 block">99%</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Target Uptime</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-2xl font-black text-indigo-700 block">&lt;0.5s</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Txn Speed</span>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1.5 text-emerald-950">
            <span className="font-bold block text-sm">Innobiz-K Pilot Footprint:</span>
            <p className="text-[11px] leading-relaxed">
              Pilot deployment concentrated across commercial corridors in Addis Ababa (Bole, Piazza, Merkato) 
              and Oromia (Adama, Bishoftu) capturing grocery kiosks, neighborhood cafes, and spice merchants.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "3. Scalable Freemium Monetization",
      subtitle: "Adapted to the purchasing power of Ethiopian local merchants",
      badge: "SaaS Business Model",
      content: (
        <div className="grid grid-cols-3 gap-2.5 py-4 text-xs text-left">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Basic (Free)</span>
              <span className="text-lg font-black text-slate-800 mt-1 block">0 ETB</span>
              <p className="text-[10px] text-slate-500 mt-1">Drives organic community adoption (Max 50 items).</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 mt-3">Driver of Network Effect</span>
          </div>

          <div className="p-3 bg-emerald-50 border-2 border-emerald-500 rounded-xl flex flex-col justify-between shadow-xs">
            <div>
              <span className="font-extrabold text-emerald-950 block">Pro Shop</span>
              <span className="text-lg font-black text-emerald-800 mt-1 block">~300 ETB<span className="text-[10px] font-normal">/mo</span></span>
              <p className="text-[10px] text-slate-600 mt-1">Automated Telebirr sync, SMS alerts, and credit scoring.</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 mt-3">★ Core Revenue Driver</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Multi-Branch</span>
              <span className="text-lg font-black text-slate-800 mt-1 block">~800 ETB<span className="text-[10px] font-normal">/mo</span></span>
              <p className="text-[10px] text-slate-500 mt-1">For cafe chains and multi-kiosk retailers.</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 mt-3">High-Margin Segment</span>
          </div>
        </div>
      )
    }
  ];

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Pitch Ribbon Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-md">
              🎯
            </span>
            <div>
              <span className="text-[10px] text-amber-300 font-black uppercase tracking-wider block">
                {slide.badge}
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                {slide.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Body */}
        <div className="p-6 flex-1 flex flex-col justify-between bg-slate-50/50">
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1">
              {slide.subtitle}
            </p>
            {slide.content}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
            <button
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="py-2 px-3 rounded-xl bg-slate-200 text-slate-700 font-bold disabled:opacity-40 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentSlide === idx ? 'w-6 bg-emerald-600' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                if (currentSlide < slides.length - 1) {
                  setCurrentSlide(prev => prev + 1);
                } else {
                  onClose();
                }
              }}
              className="py-2 px-3 rounded-xl bg-emerald-600 text-white font-bold flex items-center gap-1 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <span>{currentSlide === slides.length - 1 ? 'Finish Pitch' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
