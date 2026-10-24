import React, { useState, useEffect } from 'react';
import { 
  Store, 
  User, 
  MapPin, 
  Phone, 
  Smartphone, 
  Save, 
  X, 
  Download, 
  Upload, 
  Check, 
  ShieldCheck,
  RefreshCw,
  RotateCcw,
  LogOut
} from 'lucide-react';

export default function StoreSettingsModal({ 
  isOpen, 
  onClose, 
  storeProfile, 
  onSaveProfile, 
  onResetData,
  onLogout,
  products, 
  sales, 
  t 
}) {
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    cashierName: '',
    phone: '',
    telebirrMerchantId: '',
    cbeAccount: '',
    city: 'Addis Ababa',
    subcity: '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (storeProfile) {
      setFormData(storeProfile);
    }
  }, [storeProfile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleExportSalesCSV = () => {
    if (!sales || sales.length === 0) {
      alert('No sales recorded to export yet.');
      return;
    }
    const headers = ['Sale ID', 'Product', 'Quantity', 'Total ETB', 'Payment Method', 'Date Time'];
    const rows = sales.map(s => [
      s._id,
      `"${s.productName || 'Item'}"`,
      s.quantitySold,
      s.totalAmount,
      s.paymentMethod,
      s.createdAt || new Date().toISOString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SuqSync_Sales_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportInventoryCSV = () => {
    if (!products || products.length === 0) {
      alert('Your inventory is empty. No products to export.');
      return;
    }
    const headers = ['Product ID', 'Name', 'Selling Price ETB', 'Current Stock Units', 'Unit Type', 'Category'];
    const rows = products.map(p => [
      p._id,
      `"${p.name}"`,
      p.price,
      p.stockQty,
      p.unit || 'pcs',
      p.category || 'General'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SuqSync_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-emerald-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-md">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Pilot Store Profile & Settings</h3>
              <p className="text-xs text-slate-400">
                Customizes store receipts, Telebirr merchant till, and cashier shift
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Store Identification */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              <span>Store Information</span>
            </h4>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Shop / Cafe Name *</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
                placeholder="e.g. Kidus Suq & Cafe, Bole"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">City / Region</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  placeholder="e.g. Addis Ababa / Adama"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Subcity / Neighborhood</label>
                <input
                  type="text"
                  value={formData.subcity}
                  onChange={e => setFormData({ ...formData, subcity: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  placeholder="e.g. Bole Subcity, Woreda 03"
                />
              </div>
            </div>
          </div>

          {/* Personnel & Contact */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-600" />
              <span>Owner & Active Cashier</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Owner Name</label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Active Cashier on Duty</label>
                <input
                  type="text"
                  value={formData.cashierName}
                  onChange={e => setFormData({ ...formData, cashierName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Merchant Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                placeholder="+251 9..."
              />
            </div>
          </div>

          {/* Payment Integrations */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-amber-600" />
              <span>Payment Details for Receipts</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Telebirr Till / Merchant ID</label>
                <input
                  type="text"
                  value={formData.telebirrMerchantId}
                  onChange={e => setFormData({ ...formData, telebirrMerchantId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                  placeholder="e.g. 984321"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">CBE Account Number</label>
                <input
                  type="text"
                  value={formData.cbeAccount}
                  onChange={e => setFormData({ ...formData, cbeAccount: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                  placeholder="e.g. 1000..."
                />
              </div>
            </div>
          </div>

          {/* Export Ledger Data Buttons */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
              Accounting & Export (CSV)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleExportSalesCSV}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Export Sales CSV</span>
              </button>

              <button
                type="button"
                onClick={handleExportInventoryCSV}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Export Stock CSV</span>
              </button>
            </div>
          </div>

          {/* Save Profile Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>Profile Saved Successfully!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Store Profile</span>
                </>
              )}
            </button>
          </div>

          {/* Sign Out / Lock Store */}
          {onLogout && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign Out / Lock Store (መውጫ)</span>
              </button>
            </div>
          )}

          {/* Reset App Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onResetData}
              className="w-full py-2.5 px-3 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset SuqSync to Brand New Empty State</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
