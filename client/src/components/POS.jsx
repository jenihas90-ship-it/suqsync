import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Smartphone, 
  DollarSign, 
  Building, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  AlertTriangle,
  Sparkles,
  Search,
  CheckCircle2,
  Landmark,
  CreditCard,
  QrCode,
  PackagePlus,
  ArrowRight
} from 'lucide-react';

export default function POS({ 
  products, 
  onCompleteSale, 
  t, 
  isSubmitting,
  onOpenTelebirrQR,
  onGoToInventory 
}) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [isCredit, setIsCredit] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [creditError, setCreditError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Payment methods list with distinctive brand styling
  const paymentMethodsList = [
    {
      id: 'Cash',
      name: t.pos.methods.Cash,
      icon: DollarSign,
      color: 'emerald',
      activeClass: 'border-emerald-600 bg-emerald-50/90 text-emerald-950 ring-2 ring-emerald-500/40 shadow-sm',
      dotColor: 'bg-emerald-500',
    },
    {
      id: 'Telebirr',
      name: t.pos.methods.Telebirr,
      icon: Smartphone,
      color: 'sky',
      activeClass: 'border-sky-500 bg-sky-50/90 text-sky-950 ring-2 ring-sky-500/40 shadow-sm',
      dotColor: 'bg-sky-500',
    },
    {
      id: 'CBE',
      name: t.pos.methods.CBE,
      icon: Landmark,
      color: 'purple',
      activeClass: 'border-purple-600 bg-purple-50/90 text-purple-950 ring-2 ring-purple-500/40 shadow-sm',
      dotColor: 'bg-purple-600',
    },
    {
      id: 'Coop Bank',
      name: t.pos.methods['Coop Bank'],
      icon: Building,
      color: 'rose',
      activeClass: 'border-rose-600 bg-rose-50/90 text-rose-950 ring-2 ring-rose-500/40 shadow-sm',
      dotColor: 'bg-rose-600',
    },
    {
      id: 'Awash Bank',
      name: t.pos.methods['Awash Bank'],
      icon: Landmark,
      color: 'blue',
      activeClass: 'border-blue-600 bg-blue-50/90 text-blue-950 ring-2 ring-blue-500/40 shadow-sm',
      dotColor: 'bg-blue-600',
    },
    {
      id: 'Sinqee Bank',
      name: t.pos.methods['Sinqee Bank'],
      icon: Building,
      color: 'amber',
      activeClass: 'border-amber-600 bg-amber-50/90 text-amber-950 ring-2 ring-amber-500/40 shadow-sm',
      dotColor: 'bg-amber-500',
    },
    {
      id: 'Abyssinia Bank',
      name: t.pos.methods['Abyssinia Bank'],
      icon: Landmark,
      color: 'indigo',
      activeClass: 'border-indigo-600 bg-indigo-50/90 text-indigo-950 ring-2 ring-indigo-500/40 shadow-sm',
      dotColor: 'bg-indigo-600',
    },
    {
      id: 'Other',
      name: t.pos.methods.Other,
      icon: CreditCard,
      color: 'slate',
      activeClass: 'border-slate-600 bg-slate-100 text-slate-900 ring-2 ring-slate-400 shadow-sm',
      dotColor: 'bg-slate-500',
    },
  ];

  const categories = [
    { id: 'all', label: t.pos.categories.all },
    { id: 'beverages', label: t.pos.categories.beverages },
    { id: 'grains', label: t.pos.categories.grains },
    { id: 'essentials', label: t.pos.categories.essentials },
    { id: 'food', label: t.pos.categories.food },
    { id: 'household', label: t.pos.categories.household },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'all' || 
      p.category?.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectProduct = (product) => {
    if (product.stockQty <= 0) return;
    if (selectedProduct?._id === product._id) {
      if (quantity < product.stockQty) {
        setQuantity(prev => prev + 1);
      }
    } else {
      setSelectedProduct(product);
      setQuantity(1);
    }
  };

  const handleIncrement = () => {
    if (!selectedProduct) return;
    const current = Number(quantity) || 0;
    if (current < selectedProduct.stockQty) {
      if (current < 1) {
        setQuantity(Math.min(selectedProduct.stockQty, Math.round((current + 0.1) * 10) / 10));
      } else {
        setQuantity(Math.min(selectedProduct.stockQty, Math.round((current + 1) * 10) / 10));
      }
    }
  };

  const handleDecrement = () => {
    if (!selectedProduct) return;
    const current = Number(quantity) || 0.1;
    if (current <= 0.1) return;
    if (current <= 1) {
      setQuantity(Math.max(0.1, Math.round((current - 0.1) * 10) / 10));
    } else {
      setQuantity(Math.max(0.1, Math.round((current - 1) * 10) / 10));
    }
  };

  const handleQuickAdd = (amount) => {
    if (!selectedProduct) return;
    const current = Number(quantity) || 0;
    const newQty = Math.round((current + amount) * 10) / 10;
    if (newQty <= selectedProduct.stockQty) {
      setQuantity(newQty);
    } else {
      setQuantity(selectedProduct.stockQty);
    }
  };

  const numericQty = Number(quantity) || 0;
  const totalAmount = selectedProduct 
    ? Math.round((selectedProduct.price * numericQty) * 100) / 100 
    : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct || numericQty <= 0) return;

    if (isCredit && !customerName.trim()) {
      setCreditError('Customer Name is required when giving on credit (የደንበኛ ስም ያስገቡ)');
      return;
    }
    setCreditError('');

    onCompleteSale({
      productId: selectedProduct._id,
      productName: selectedProduct.name,
      quantitySold: numericQty,
      unitPrice: selectedProduct.price,
      totalAmount,
      paymentMethod: isCredit ? 'Credit' : paymentMethod,
      paymentStatus: isCredit ? 'Credit' : 'Paid',
      customerName: isCredit ? customerName.trim() : undefined,
    });

    setCustomerName('');
  };

  const currentMethodObj = paymentMethodsList.find(m => m.id === paymentMethod) || paymentMethodsList[0];

  const handleLaunchTelebirrQR = () => {
    if (!selectedProduct) return;
    onOpenTelebirrQR({
      amount: totalAmount,
      productName: selectedProduct.name,
      quantity: numericQty,
      selectedProduct
    });
  };

  return (
    <div className="space-y-4">
      {/* Title & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
              ⚡
            </span>
            {t.pos.title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.pos.subtitle}</p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={t.inventory.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Main Grid: Products on Left, Quick Order on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Product Grid */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3">
          
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Clean Empty State when No Products Exist */}
          {products.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border-2 border-dashed border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <PackagePlus className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Your POS is Ready to Start</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
                You don't have any items in your inventory yet. Add your suq products to start recording sales with two taps.
              </p>
              <button
                type="button"
                onClick={onGoToInventory}
                className="mt-5 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Product in Inventory</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {filteredProducts.map((product) => {
                const isSelected = selectedProduct?._id === product._id;
                const isOutOfStock = product.stockQty <= 0;
                const isLowStock = product.stockQty > 0 && product.stockQty < 5;

                return (
                  <button
                    key={product._id}
                    disabled={isOutOfStock}
                    onClick={() => handleSelectProduct(product)}
                    className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all relative flex flex-col justify-between min-h-[110px] cursor-pointer ${
                      isOutOfStock
                        ? 'bg-slate-100/80 border border-dashed border-slate-200 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'bg-emerald-50/90 border-2 border-emerald-500 shadow-md ring-2 ring-emerald-500/20 transform scale-[1.01]'
                        : 'bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md active:scale-[0.98]'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full gap-1 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 truncate max-w-[80px]">
                        {product.category || 'Item'}
                      </span>
                      {isOutOfStock ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                          {t.pos.outOfStock}
                        </span>
                      ) : isLowStock ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-0.5 animate-pulse">
                          ⚠️ {product.stockQty} {t.pos.stockLeft}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-500">
                          {product.stockQty} {product.unit || 'pcs'}
                        </span>
                      )}
                    </div>

                    <div className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 my-auto">
                      {product.name}
                    </div>

                    <div className="flex items-end justify-between w-full mt-2 pt-2 border-t border-slate-100">
                      <div className="font-black text-emerald-700 text-base sm:text-lg">
                        {product.price} <span className="text-xs font-semibold text-emerald-600">{t.currency}</span>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {products.length > 0 && filteredProducts.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
              <p className="text-sm font-medium">No products match your filter search.</p>
            </div>
          )}
        </div>

        {/* Right Column: Checkout Drawer / Active Sale Card */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200 sticky top-24">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">{t.pos.currentSale}</h3>
              </div>
              {selectedProduct && (
                <button
                  onClick={() => { setSelectedProduct(null); setQuantity(1); }}
                  className="text-xs text-rose-500 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t.pos.clearCart}</span>
                </button>
              )}
            </div>

            {!selectedProduct ? (
              <div className="py-12 px-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-700">{t.pos.emptyCart}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {products.length === 0 
                    ? "Add items in the Inventory tab first." 
                    : "Tap any item from the inventory grid to begin."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Selected Item Summary */}
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5">
                  <div className="font-bold text-slate-900 text-base">{selectedProduct.name}</div>
                  <div className="text-xs text-slate-600 mt-0.5 flex items-center justify-between flex-wrap gap-1">
                    <span>
                      {t.inventory.sellingPrice}: <span className="font-bold text-emerald-700">{selectedProduct.price} {t.currency}</span> / {selectedProduct.unit || 'Kg'}
                    </span>
                    {numericQty > 0 && (
                      <span className="font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full text-[11px]">
                        {numericQty} {selectedProduct.unit || 'Kg'} = {totalAmount} {t.currency}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <span>{t.inventory.colStock}:</span>
                    <span className="font-semibold text-slate-700">{selectedProduct.stockQty} {selectedProduct.unit || 'Kg'}</span>
                  </div>
                </div>

                {/* Quantity Controls & Decimal Units */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t.pos.itemQty}
                    </label>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {numericQty < 1 ? 'Fractional / Decimal Unit' : 'Standard Units'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={numericQty <= 0.1}
                      className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 font-bold flex items-center justify-center transition-all cursor-pointer"
                      title="Decrease quantity (-0.1 or -1)"
                    >
                      <Minus className="w-5 h-5" />
                    </button>

                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl h-12 flex items-center justify-center font-extrabold text-xl text-slate-900 px-2 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                      <input
                        type="number"
                        step="0.1"
                        min="0.01"
                        max={selectedProduct.stockQty}
                        value={quantity}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            setQuantity('');
                          } else {
                            const num = parseFloat(val);
                            if (!isNaN(num) && num >= 0) {
                              setQuantity(num <= selectedProduct.stockQty ? num : selectedProduct.stockQty);
                            }
                          }
                        }}
                        onBlur={() => {
                          if (!quantity || Number(quantity) <= 0) {
                            setQuantity(0.1);
                          }
                        }}
                        className="w-full text-center font-black text-xl text-slate-900 bg-transparent focus:outline-none"
                        aria-label="Quantity"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleIncrement}
                      disabled={numericQty >= selectedProduct.stockQty}
                      className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 font-bold flex items-center justify-center transition-all cursor-pointer"
                      title="Increase quantity (+0.1 or +1)"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Decimal Units (< 1 Unit): 0.1 to 0.9 with Live Price Calculation */}
                  <div className="mt-3 p-2.5 bg-slate-50/90 border border-slate-200/90 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                        <span className="text-emerald-600">⚖️</span>
                        <span>Less than 1 {selectedProduct.unit || 'Kg'} (Decimal):</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Auto-Calculated</span>
                    </div>

                    {/* Decimal Buttons: 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9 */}
                    <div className="grid grid-cols-5 sm:grid-cols-9 gap-1">
                      {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((dec) => {
                        const isCurrent = numericQty === dec;
                        const decPrice = Math.round((selectedProduct.price * dec) * 100) / 100;
                        return (
                          <button
                            key={dec}
                            type="button"
                            onClick={() => setQuantity(dec)}
                            disabled={dec > selectedProduct.stockQty}
                            className={`py-1.5 px-0.5 rounded-lg text-center font-bold text-xs transition-all cursor-pointer border flex flex-col items-center justify-center ${
                              isCurrent
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-400/40'
                                : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-200 hover:border-emerald-300'
                            }`}
                            title={`${dec} ${selectedProduct.unit || 'Kg'} = ${decPrice} ${t.currency}`}
                          >
                            <span className="text-xs font-black">{dec}</span>
                            <span className={`text-[9px] font-semibold leading-none mt-0.5 ${isCurrent ? 'text-emerald-100' : 'text-emerald-600'}`}>
                              {decPrice}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Common Ethiopian Suq Fractions (1/4 kg = 0.25, 1/2 kg = 0.5, 3/4 kg = 0.75) */}
                    <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                      {[
                        { val: 0.25, label: '0.25 (1/4 - ሩብ)' },
                        { val: 0.5, label: '0.5 (1/2 - ግማሽ)' },
                        { val: 0.75, label: '0.75 (3/4 - ሶስት ሩብ)' },
                      ].map((frac) => {
                        const isCurrent = numericQty === frac.val;
                        const fracPrice = Math.round((selectedProduct.price * frac.val) * 100) / 100;
                        return (
                          <button
                            key={frac.val}
                            type="button"
                            onClick={() => setQuantity(frac.val)}
                            disabled={frac.val > selectedProduct.stockQty}
                            className={`py-1 px-1.5 rounded-lg font-bold text-[10px] sm:text-xs transition-all cursor-pointer border flex items-center justify-between ${
                              isCurrent
                                ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                                : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border-slate-200'
                            }`}
                          >
                            <span className="truncate">{frac.label}</span>
                            <span className={`font-black shrink-0 ml-1 ${isCurrent ? 'text-amber-200' : 'text-emerald-700'}`}>
                              {fracPrice}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Whole Unit Chips (1, 2, 5, 10) */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                      Whole:
                    </span>
                    {[1, 2, 5, 10].map((amt) => {
                      const isCurrent = numericQty === amt;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setQuantity(amt)}
                          disabled={amt > selectedProduct.stockQty}
                          className={`flex-1 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-slate-800 text-white border-slate-900 shadow-xs'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {amt} {selectedProduct.unit || ''}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Mode Toggle: Pay Now vs Give on Credit */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Payment Terms (የክፍያ ሁኔታ)
                    </label>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {isCredit ? '📋 Credit Ledger' : '💵 Immediate Settlement'}
                    </span>
                  </div>

                  <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => { setIsCredit(false); setCreditError(''); }}
                      className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        !isCredit
                          ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/80 font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>💵</span>
                      <span>Pay Now (ወዲያውኑ ክፈል)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsCredit(true); setCreditError(''); }}
                      className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isCredit
                          ? 'bg-amber-500 text-white shadow-sm font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>📋</span>
                      <span>Give on Credit (በብድር ስጥ)</span>
                    </button>
                  </div>
                </div>

                {/* Conditional: Give on Credit Required Customer Name Input */}
                {isCredit ? (
                  <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-3.5 space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black text-amber-950 uppercase tracking-wider">
                        Customer Name (የደንበኛ ስም) <span className="text-rose-600">*</span>
                      </label>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                        ደብተር / Credit Book
                      </span>
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="e.g. Ato Abebe, Weizero Almaz, etc."
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (creditError) setCreditError('');
                      }}
                      className="w-full px-3 py-2.5 rounded-lg bg-white border border-amber-300 text-slate-900 placeholder-slate-400 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-xs"
                    />

                    {creditError && (
                      <p className="text-xs font-bold text-rose-600 flex items-center gap-1">
                        <span>⚠️</span>
                        <span>{creditError}</span>
                      </p>
                    )}

                    <p className="text-[11px] text-amber-900 leading-tight">
                      ℹ️ This sale will be saved to your <strong>Credit Book</strong> as an unpaid debt. Customer owes <strong>{totalAmount} {t.currency}</strong>.
                    </p>
                  </div>
                ) : (
                  /* Expanded Payment Methods (Pay Now Mode) */
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {t.pos.paymentMethod}
                      </label>
                      <span className="text-[11px] font-semibold text-slate-500">
                        Selected: <span className="font-bold text-slate-800">{currentMethodObj.name}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {paymentMethodsList.map((m) => {
                        const IconComponent = m.icon;
                        const isSelected = paymentMethod === m.id;

                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setPaymentMethod(m.id)}
                            className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[58px] ${
                              isSelected
                                ? m.activeClass
                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <IconComponent className={`w-4 h-4 ${isSelected ? 'stroke-[2.5]' : 'text-slate-400'}`} />
                              {isSelected && (
                                <span className={`w-2 h-2 rounded-full ${m.dotColor}`}></span>
                              )}
                            </div>
                            <div className="font-bold text-xs mt-1 leading-tight truncate">
                              {m.name}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {paymentMethod === 'Telebirr' && (
                      <div className="mt-2.5 p-2.5 bg-sky-50 border border-sky-300/80 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <QrCode className="w-5 h-5 text-sky-600" />
                          <div>
                            <span className="text-xs font-bold text-sky-900 block leading-tight">Telebirr Dynamic QR</span>
                            <span className="text-[10px] text-sky-700">Display QR code for customer to scan & pay</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleLaunchTelebirrQR}
                          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
                        >
                          Show QR
                        </button>
                      </div>
                    )}

                    <p className="text-[10px] text-slate-400 mt-1.5 italic">
                      {t.pos.methodSubtitles[paymentMethod] || 'Select merchant receiving method'}
                    </p>
                  </div>
                )}

                {/* Subtotal & 2-Tap Complete Sale Button */}
                <div className="pt-2 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-600">{t.pos.subtotal}:</span>
                    <span className="text-2xl font-black text-slate-900">
                      {totalAmount} <span className="text-sm font-bold text-emerald-600">{t.currency}</span>
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {!isCredit && paymentMethod === 'Telebirr' && (
                      <button
                        type="button"
                        onClick={handleLaunchTelebirrQR}
                        className="py-4 px-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        title="Open Telebirr QR for customer to scan"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Scan QR</span>
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting || quantity <= 0}
                      className={`flex-1 py-4 px-4 active:scale-[0.98] text-white font-extrabold text-base rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
                        isCredit
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-amber-600/30'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-emerald-700/25'
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : isCredit ? (
                        <>
                          <span>📋</span>
                          <span>Record Credit Sale ({totalAmount} {t.currency})</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>{t.pos.completeBtn} ({totalAmount} {t.currency})</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[10px] text-center text-slate-400 font-medium">
                    {isCredit
                      ? `⚡ Deducts ${quantity} unit(s) & registers debt in Credit Book under "${customerName || 'Customer'}".`
                      : `⚡ 2-Tap POS: Automatically deducts ${quantity} unit(s) & registers in ${currentMethodObj.name}.`}
                  </p>
                </div>

              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
