import React, { useState, useEffect } from 'react';
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
  Sparkles,
  LogIn,
  Eye,
  EyeOff,
  KeyRound,
  X
} from 'lucide-react';

export default function RegistrationModal({ 
  isOpen, 
  onClose, 
  onRegisterSuccess, 
  onLoginSuccess,
  initialMode = 'login',
  isOwnerRegistered = false,
  registeredOwnerInfo = null,
  isAuthenticated = false,
  t 
}) {
  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
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

  // Sync mode and prefill owner name when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg('');
      if (initialMode === 'login' && registeredOwnerInfo?.fullName) {
        setLoginIdentifier(registeredOwnerInfo.fullName);
      }
    }
  }, [isOpen, initialMode, registeredOwnerInfo]);

  if (!isOpen) return null;

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginIdentifier.trim()) {
      setErrorMsg('Please enter your registered Owner Name or Phone Number.');
      return;
    }
    if (!loginPassword.trim()) {
      setErrorMsg('Please enter your security PIN or password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onLoginSuccess({
        identifier: loginIdentifier.trim(),
        password: loginPassword.trim()
      });
      setLoginPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Register step navigation
  const handleRegisterNext = (e) => {
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

  // Handle final registration submission
  const handleRegisterFinalSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      setIsSubmitting(true);
      await onRegisterSuccess(formData);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        // Only allow closing by clicking backdrop if already authenticated
        if (isAuthenticated && e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        
        {/* Header Ribbon */}
        <div className={`p-5 sm:p-6 text-white transition-colors duration-300 ${
          mode === 'login'
            ? 'bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900'
            : 'bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shrink-0">
                {mode === 'login' ? (
                  <LogIn className="w-6 h-6 stroke-[2.5]" />
                ) : (
                  <Store className="w-6 h-6 stroke-[2.5]" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 block">
                  {mode === 'login' 
                    ? 'ሱቅሲንክ • Suq Owner Access' 
                    : 'Mandatory First-Time Onboarding'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                  {mode === 'login' ? 'Suq Owner Sign In (ይግቡ)' : 'Suq Owner Official Registration'}
                </h2>
                <p className="text-xs text-emerald-200">
                  {mode === 'login'
                    ? 'Sign in with the Name or Phone Number and Password you registered with'
                    : 'Ethiopian Startup Proclamation No. 1396/2025 • Innobiz-K Pilot Hub'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Optional Close Button if already authenticated */}
              {isAuthenticated && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  title="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Mode Switcher Tabs (if an owner is already registered) */}
          {isOwnerRegistered && (
            <div className="mt-4 flex bg-slate-950/50 p-1 rounded-xl border border-white/15 max-w-sm">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In (መግቢያ)</span>
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(''); setStep(1); }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'register'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Register New (ምዝገባ)</span>
              </button>
            </div>
          )}

          {/* 3-Step Progress Bar (only shown in register mode) */}
          {mode === 'register' && (
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
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
          )}
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <span className="text-base">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODE 1: RETURNING OWNER SIGN IN (ይግቡ) */}
        {/* ============================================================== */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="p-6 overflow-y-auto flex-1 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              
              {/* Registered Store Profile Banner */}
              {registeredOwnerInfo && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Store className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        Registered Shop
                      </span>
                      {registeredOwnerInfo.pilotShopId && (
                        <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {registeredOwnerInfo.pilotShopId}
                        </span>
                      )}
                    </div>
                    <p className="font-extrabold text-sm text-slate-900 truncate mt-0.5">
                      {registeredOwnerInfo.shopName}
                    </p>
                    <p className="text-[11px] text-slate-600 truncate">
                      Owner: <b>{registeredOwnerInfo.fullName}</b>
                    </p>
                  </div>
                </div>
              )}

              {/* Owner Identifier: Name or Phone */}
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1.5 flex items-center justify-between">
                  <span>Owner Name or Phone Number (የባለቤቱ ስም ወይም ስልክ ቁጥር) *</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter registered Name (e.g. Ayisha) or Phone"
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900 text-xs shadow-inner"
                    autoFocus
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  You can sign in with your registered legal name or your mobile number.
                </span>
              </div>

              {/* Security PIN / Password */}
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1.5 flex items-center justify-between">
                  <span>Security PIN / Password (የይለፍ ቃል / ፒን) *</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your security PIN or password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900 text-xs shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Protects your sales ledger, cash reconciliation, and inventory adjustments.
                </span>
              </div>

              {/* Informative Security Callout */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-slate-600 text-[11px]">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Once signed in, you will stay logged into your shop on this device until you explicitly sign out.
                </span>
              </div>

            </div>

            {/* Login Action Controls */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 text-center sm:text-left">
                {!isOwnerRegistered ? (
                  <span>
                    New owner?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('register'); setErrorMsg(''); }}
                      className="text-emerald-600 hover:underline font-bold cursor-pointer"
                    >
                      Register here
                    </button>
                  </span>
                ) : (
                  <span>
                    Setting up a different shop?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('register'); setErrorMsg(''); setStep(1); }}
                      className="text-emerald-600 hover:underline font-bold cursor-pointer"
                    >
                      Register New Suq
                    </button>
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto py-3 px-7 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-amber-300" />
                    <span>Sign In to SuqSync (ይግቡ)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (

        /* ============================================================== */
        /* MODE 2: FIRST-TIME OWNER REGISTRATION (አዲስ ምዝገባ) */
        /* ============================================================== */
          <div className="flex flex-col flex-1 overflow-hidden">
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
                      placeholder="e.g. Abebe Kebede Wolde / Ayisha Mohammed"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      This is the name you will use to sign in next time.
                    </span>
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
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Used for login & daily reports</span>
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
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Protects your store records</span>
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

            {/* Registration Modal Controls */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
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
                  isOwnerRegistered && (
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setErrorMsg(''); }}
                      className="py-2.5 px-3 rounded-xl text-emerald-700 hover:bg-emerald-50 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Already Registered? Sign In</span>
                    </button>
                  )
                )}
              </div>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleRegisterNext}
                  className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleRegisterFinalSubmit}
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
        )}

      </div>
    </div>
  );
}
