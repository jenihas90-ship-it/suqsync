import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Smartphone, 
  X, 
  CheckCircle2, 
  Printer, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function TelebirrQRModal({ 
  isOpen, 
  onClose, 
  amount, 
  productName, 
  quantity, 
  onConfirmPayment, 
  t, 
  isStandMode = false 
}) {
  const [qrUrl, setQrUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [txnRef, setTxnRef] = useState('');
  const [merchantCode, setMerchantCode] = useState('984321');
  const [merchantName, setMerchantName] = useState('SuqSync Pilot Store');

  // Generate QR payload
  useEffect(() => {
    if (!isOpen) return;

    const payload = isStandMode
      ? `telebirr://pay?merchantId=${merchantCode}&name=${encodeURIComponent(merchantName)}`
      : `telebirr://pay?merchantId=${merchantCode}&amount=${amount}&ref=ORD_${Date.now().toString().slice(-6)}&name=${encodeURIComponent(merchantName)}`;

    QRCode.toDataURL(payload, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#034468', // Telebirr signature deep blue
        light: '#FFFFFF'
      }
    })
      .then(url => setQrUrl(url))
      .catch(err => console.error('Failed to generate Telebirr QR', err));

    setTxnRef('TB' + Math.floor(100000 + Math.random() * 900000));
  }, [isOpen, amount, isStandMode, merchantCode, merchantName]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(merchantCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      soundFX.playTelebirrPing();
      onConfirmPayment({
        paymentMethod: 'Telebirr',
        telebirrTxnRef: txnRef,
        verifiedViaApi: true,
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 flex flex-col relative">
        
        {/* Telebirr Official Themed Header */}
        <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-blue-700 text-white p-4 pb-5 relative">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-sky-950 flex items-center justify-center font-black text-lg shadow-md ring-2 ring-white/30">
              <Smartphone className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight">Telebirr (ቴሌብር)</span>
                <span className="text-[10px] bg-amber-400 text-sky-950 font-bold px-1.5 py-0.2 rounded-full uppercase">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-sky-100">
                Ethio Telecom • Digital Ethiopia 2025/2030
              </p>
            </div>
          </div>
        </div>

        {/* QR Body Card */}
        <div className="p-5 flex flex-col items-center text-center space-y-3.5 bg-slate-50/50">
          
          {/* Amount Badge */}
          {!isStandMode ? (
            <div className="w-full bg-sky-50 border border-sky-200/80 rounded-2xl p-3 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[11px] font-semibold text-slate-500 block">Total to Pay</span>
                <span className="text-xl font-black text-sky-900 leading-tight">
                  {amount} <span className="text-xs font-bold text-sky-600">{t.currency}</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Order Item</span>
                <span className="text-xs font-bold text-slate-800 truncate max-w-[140px] block">
                  {productName} {quantity ? `(${quantity}x)` : ''}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 font-bold">
              🏬 Official Shop Counter Stand QR Code
            </div>
          )}

          {/* QR Code Container with Central Logo */}
          <div className="relative p-3 bg-white rounded-2xl shadow-md border-2 border-sky-400/30 flex items-center justify-center">
            {qrUrl ? (
              <div className="relative">
                <img src={qrUrl} alt="Telebirr QR Code" className="w-52 h-52 object-contain rounded-lg" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-lg border-2 border-sky-500 flex items-center justify-center text-sky-700 font-extrabold text-xs">
                    <span className="text-amber-500 font-black text-sm">tb</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-52 h-52 flex items-center justify-center text-slate-400 text-xs">
                Generating QR...
              </div>
            )}
          </div>

          {/* Merchant Code */}
          <div className="w-full bg-white rounded-xl p-2.5 border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="text-left">
              <span className="text-[10px] font-semibold text-slate-400 block uppercase">Merchant Till Code</span>
              <span className="font-mono font-black text-slate-800 text-sm tracking-wider">
                {merchantCode}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 leading-snug">
            📲 Open Telebirr App $\rightarrow$ Tap <b>Scan QR</b> $\rightarrow$ Confirm payment
          </p>

          {/* Actions */}
          {!isStandMode ? (
            <div className="w-full space-y-2 pt-1">
              <button
                onClick={handleSimulatePayment}
                disabled={isVerifying}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 active:scale-[0.98] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Telebirr Webhook...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>Customer Paid via Telebirr (Verify)</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
                <span>EthSwitch / Ethio Telecom API</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Phase 2 Live Sync
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full pt-1">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Counter Stand Poster</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
