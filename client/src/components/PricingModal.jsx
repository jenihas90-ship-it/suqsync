import React, { useState } from 'react';
import UpgradeButton from './UpgradeButton';
import { 
  Check, 
  Sparkles, 
  Smartphone, 
  Building, 
  Store, 
  X, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function PricingModal({ isOpen, onClose, currentPlan = 'Basic', onSelectPlan, t }) {
  const [selectedTier, setSelectedTier] = useState(currentPlan);

  if (!isOpen) return null;

  const tiers = [
    {
      id: 'Basic',
      name: 'Basic (Pilot)',
      amharicName: 'መሰረታዊ (ነፃ)',
      oromoName: "Bu'uuraa (Bilaasha)",
      price: '0 ETB',
      billing: '/ Month',
      popular: false,
      tag: 'Current Active Tier',
      description: 'Ideal for neighborhood kiosks & suqs onboarding in the 14-day beta pilot.',
      features: [
        'Up to 50 active inventory items',
        '2-Tap Quick POS mobile interface',
        'Daily cash vs digital reconciliation',
        'Telebirr & 7 Ethiopian banks tracking',
        'Amharic, Afaan Oromoo & English localization',
        'Local persistent offline resilience'
      ],
      buttonText: 'Current Plan',
      buttonClass: 'bg-slate-200 text-slate-800 cursor-default'
    },
    {
      id: 'Pro',
      name: 'Pro Shop',
      amharicName: 'ፕሮ ሱቅ',
      oromoName: 'Pro Suuqii',
      price: '300 ETB',
      billing: '/ Month',
      popular: true,
      tag: 'Most Popular for Cafes & Mini-Marts',
      description: 'Automated webhook sync, automated Telebirr API, and low-stock SMS alerts.',
      features: [
        'Unlimited inventory catalog',
        'Automated Telebirr QR Webhook sync',
        'Low-stock SMS alerts to merchant phone',
        'Phase 3 SME Alternative Credit Scoring',
        'Exportable Bank Audit Statements',
        'Priority local merchant support'
      ],
      buttonText: 'Upgrade with Telebirr',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30'
    },
    {
      id: 'Multi-Branch',
      name: 'Multi-Branch',
      amharicName: 'ባለ ብዙ ቅርንጫፍ',
      oromoName: "Damee Baay'ee",
      price: '800 ETB',
      billing: '/ Month',
      popular: false,
      tag: 'For Chain Owners & Roasteries',
      description: 'Multi-location real-time syncing and employee cashier shift management.',
      features: [
        'Unlimited shops / cafes / kiosks',
        'Multi-location real-time stock transfer',
        'Cashier shift tracking & shrinkage detection',
        'Centralized executive dashboard',
        'Direct EthSwitch settlement reporting',
        'Dedicated account manager in Addis Ababa'
      ],
      buttonText: 'Contact for Enterprise',
      buttonClass: 'bg-slate-900 hover:bg-slate-950 text-white'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-black text-sm uppercase tracking-wider">
                Section 9 • Business Model & Monetization
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              Freemium SaaS adapted for Ethiopian SMEs
            </h2>
            <p className="text-xs text-emerald-200 mt-0.5">
              Target: Innobiz-K Incubation Pitch & Ministry of Innovation and Technology (MInT)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all relative border ${
                  tier.popular
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-lg ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Innobiz-K Target</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{tier.name}</h3>
                      <span className="text-[11px] text-slate-500">{tier.amharicName} • {tier.oromoName}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">{tier.price}</span>
                    <span className="text-xs text-slate-500">{tier.billing}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {tier.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-2.5">
                    {tier.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-2">
                  {tier.id === 'Pro' ? (
                    <UpgradeButton
                      className="w-full text-xs py-2.5"
                      onSuccess={() => {
                        onSelectPlan('Pro');
                        setTimeout(() => onClose(), 1200);
                      }}
                    >
                      {tier.buttonText}
                    </UpgradeButton>
                  ) : (
                    <button
                      onClick={() => {
                        if (tier.id !== 'Basic') {
                          onSelectPlan(tier.id);
                          onClose();
                        }
                      }}
                      className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${tier.buttonClass}`}
                    >
                      <span>{tier.buttonText}</span>
                      {tier.id !== 'Basic' && <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Incubation Pitch Readiness Callout */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black shrink-0">
                🇪🇹
              </div>
              <div>
                <span className="font-bold text-slate-900 block">
                  Ethiopian Startup Proclamation No. 1396/2025 Incentives
                </span>
                <span className="text-slate-500">
                  Qualifies for 3-year income tax holiday, preferential government innovation grants, and duty-free hardware import.
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs whitespace-nowrap cursor-pointer hover:bg-slate-800"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
