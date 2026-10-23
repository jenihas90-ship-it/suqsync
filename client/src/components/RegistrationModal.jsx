import React, { useState } from 'react';
import { 
  Store, 
  User, 
  MapPin, 
  Phone, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Lock,
  Building,
  CreditCard,
  FileText,
  Sparkles
} from 'lucide-react';

export default function RegistrationModal({ isOpen, onClose, onRegisterSuccess, t }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '+251 9',
    password: '',
    nationalIdOrFayda: '',
    shopName: '',
    businessType: 'Retail Kiosk (Suq)',
    tinNumber: '',
    tradeLicenseNo: '',
    region: 'Addis Ababa',
    city: 'Addis Ababa',
    subcityOrZone: 'Bole Subcity',
    woreda: 'Woreda 03',
    specificLocation: '',
    telebirrMerchantId: '',
    telebirrPhone: '',
    primaryBank: 'CBE',
    bankAccountNumber: '',
  });

  if (!isOpen) return null;

  const handleNext = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (step === 1) {
      if (!formData.fullName.trim()) {
        setErrorMsg('Please enter the owner full name.');
        return;
      }
      if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
        setErrorMsg('Please enter a valid Ethiopian phone number (+251 9... / 09...).');
        return;
      }
      if (!formData.password || formData.password.length < 4) {
        setErrorMsg('Please create a security PIN or password (at least 4 characters).');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.shopName.trim()) {
        setErrorMsg('Please enter your shop or cafe name.');
        return;
      }
      setStep(3);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      setIsSubmitting(true);
      await onRegisterSuccess(formData);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
                <Store className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 block">
                  Mandatory First-Time Onboarding
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                  Suq Owner Official Registration
                </h2>
                <p className="text-xs text-emerald-200">
                  Ethiopian Startup Proclamation No. 1396/2025 • Innobiz-K Pilot Hub
                </p>
              </div>
            </div>
          </div>

          {/* 3-Step Progress Bar */}
          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
            <div className={`py-1.5 px-2 rounded-lg font-bold transition-all ${
              step === 1 ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-emerald-200'
            }`}>
              1. Owner Details
            </div>
            <div className={`py-1.5 px-2 rounded-lg font-bold transition-all ${
              step === 2 ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-emerald-200'
            }`}>
              2. Shop & Location
            </div>
            <div className={`py-1.5 px-2 rounded-lg font-bold transition-all ${
              step === 3 ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-emerald-200'
            }`}>
              3. Payments & Bank
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4">
          
          {/* STEP 1: OWNER IDENTITY */}
          {step === 1 && (
            <div className="space-y-3.5 animate-in fade-in">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Owner Full Name (የባለቤቱ ሙሉ ስም) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Abebe Kebede Wolde / Chaltu Desta"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Primary Phone Number (ስልክ ቁጥር) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+251 9... / 09..."
                    value={formData.phoneNumber}
                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Used for daily SMS & login</span>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Security PIN / Password (የይለፍ ቃል) *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 4 digits PIN"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Protects end-of-day reports</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  National ID / Fayda / Kebele ID (የፋይዳ ወይም የቀበሌ መታወቂያ)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ETH-FAYDA-892341 / KB-03-492"
                  value={formData.nationalIdOrFayda}
                  onChange={e => setFormData({ ...formData, nationalIdOrFayda: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-medium"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Required for Phase 3 Bank Micro-loan qualification</span>
              </div>
            </div>
          )}

          {/* STEP 2: SHOP & LOCATION */}
          {step === 2 && (
            <div className="space-y-3.5 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Shop / Cafe Name (የሱቁ ስም) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kidus Suq & Grocery"
                    value={formData.shopName}
                    onChange={e => setFormData({ ...formData, shopName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Business Category (የንግድ ዓይነት)
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="Retail Kiosk (Suq)">Retail Kiosk (ኪዮስክ / ሱቅ)</option>
                    <option value="Mini-Mart">Mini-Mart (ሚኒ ማርት)</option>
                    <option value="Cafe / Buna">Cafe / Roastery (ቡና ቤት / ካፌ)</option>
                    <option value="Spices & Grains">Spices & Grains (እህልና ቅመማቅመም)</option>
                    <option value="General Merchandise">General Merchandise (ጠቅላላ ንግድ)</option>
                    <option value="Pharmacy / Cosmetics">Pharmacy / Cosmetics</option>
                    <option value="Other">Other Retail SME</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Region / City</label>
                  <select
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value, region: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="Addis Ababa">Addis Ababa (አዲስ አበባ)</option>
                    <option value="Adama (Oromia)">Adama (አዳማ / Oromia)</option>
                    <option value="Bishoftu (Oromia)">Bishoftu (ቢሾፍቱ)</option>
                    <option value="Hawassa (Sidama)">Hawassa (ሀዋሳ)</option>
                    <option value="Dire Dawa">Dire Dawa (ድሬዳዋ)</option>
                    <option value="Other Region">Other Region</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Subcity / Zone</label>
                  <input
                    type="text"
                    placeholder="e.g. Bole Subcity / Arada"
                    value={formData.subcityOrZone}
                    onChange={e => setFormData({ ...formData, subcityOrZone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Woreda / Kebele</label>
                  <input
                    type="text"
                    placeholder="e.g. Woreda 03"
                    value={formData.woreda}
                    onChange={e => setFormData({ ...formData, woreda: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Specific Landmark</label>
                  <input
                    type="text"
                    placeholder="e.g. Near Edna Mall, Block 12"
                    value={formData.specificLocation}
                    onChange={e => setFormData({ ...formData, specificLocation: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">TIN Number (የግብር ከፋይ ቁጥር)</label>
                  <input
                    type="text"
                    placeholder="10-digit TIN"
                    value={formData.tinNumber}
                    onChange={e => setFormData({ ...formData, tinNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Trade License (የንግድ ፈቃድ)</label>
                  <input
                    type="text"
                    placeholder="e.g. AA/BOL/2026/..."
                    value={formData.tradeLicenseNo}
                    onChange={e => setFormData({ ...formData, tradeLicenseNo: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: FINANCIAL & RECEIVING ACCOUNTS */}
          {step === 3 && (
            <div className="space-y-3.5 animate-in fade-in">
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl flex items-center gap-3">
                <Smartphone className="w-8 h-8 text-sky-600 shrink-0" />
                <div>
                  <span className="font-extrabold text-sky-950 text-xs block">Telebirr Merchant Integration</span>
                  <span className="text-[11px] text-sky-800">
                    Powers automatic dynamic QR codes for in-store customer checkouts.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Telebirr Merchant / Till Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 984321"
                    value={formData.telebirrMerchantId}
                    onChange={e => setFormData({ ...formData, telebirrMerchantId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Telebirr Phone Account
                  </label>
                  <input
                    type="text"
                    placeholder="+251 9..."
                    value={formData.telebirrPhone || formData.phoneNumber}
                    onChange={e => setFormData({ ...formData, telebirrPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Primary Settlement Bank
                  </label>
                  <select
                    value={formData.primaryBank}
                    onChange={e => setFormData({ ...formData, primaryBank: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="CBE">CBE (Commercial Bank of Ethiopia)</option>
                    <option value="Coop Bank">Cooperative Bank of Oromia</option>
                    <option value="Awash Bank">Awash Bank</option>
                    <option value="Sinqee Bank">Sinqee Bank</option>
                    <option value="Abyssinia Bank">Bank of Abyssinia</option>
                    <option value="Other">Other Bank</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Bank Account Number (የባንክ ሂሳብ)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1000123456789"
                    value={formData.bankAccountNumber}
                    onChange={e => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-900 text-[11px]">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  Your registration automatically issues your certified <b>Pilot Shop ID</b> under the Innobiz-K Incubation Program.
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div className="text-slate-400 text-xs font-semibold">
              Step 1 of 3
            </div>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-95 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Registering Shop...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>Complete Suq Registration</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
