import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Trash2, 
  RefreshCw, 
  ArrowUpRight,
  Sparkles,
  X,
  Layers,
  PackagePlus
} from 'lucide-react';

export default function Inventory({ products, onAddProduct, onUpdateStock, onDeleteProduct, t, isSubmitting }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stockQty: '',
    category: 'Grains & Spices',
    unit: 'pcs',
  });

  const categories = ['All', 'Grains & Spices', 'Beverages', 'Essentials', 'Food', 'Household', 'General'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.price === '') return;

    await onAddProduct({
      name: formData.name,
      price: Number(formData.price),
      stockQty: Number(formData.stockQty || 0),
      category: formData.category,
      unit: formData.unit,
    });

    setFormData({
      name: '',
      price: '',
      stockQty: '',
      category: 'Grains & Spices',
      unit: 'pcs',
    });
    setShowAddModal(false);
  };

  const handleQuickRestock = (product, addAmount) => {
    const newStock = (product.stockQty || 0) + addAmount;
    onUpdateStock(product._id, { stockQty: newStock });
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              <Package className="w-4 h-4" />
            </span>
            {t.inventory.title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.inventory.subtitle}</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.inventory.addNewProduct}</span>
        </button>
      </div>

      {/* Filter and Search toolbar */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={t.inventory.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Empty State when No Products Exist */}
      {products.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-14 text-center border-2 border-dashed border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <PackagePlus className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Your Stock Room is Ready</h3>
          <p className="text-xs text-slate-500 max-w-md mt-1.5 leading-relaxed">
            Register your first item with name (e.g. <i>Shiro 1kg</i>, <i>Coca-Cola</i>, <i>Sugar</i>), selling price in ETB, and available shelf stock.
          </p>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="mt-6 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Product</span>
          </button>
        </div>
      ) : (
        /* Inventory List Table & Mobile Cards */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Desktop View Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">{t.inventory.colItem}</th>
                  <th className="py-3 px-4">{t.inventory.colPrice}</th>
                  <th className="py-3 px-4">{t.inventory.colStock}</th>
                  <th className="py-3 px-4">{t.inventory.colStatus}</th>
                  <th className="py-3 px-4 text-right">{t.inventory.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isOutOfStock = p.stockQty <= 0;
                  const isLowStock = p.stockQty > 0 && p.stockQty < 5;

                  return (
                    <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.category || 'General'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-extrabold text-emerald-700 text-sm">
                          {p.price} <span className="text-xs font-medium text-emerald-600">{t.currency}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800 text-sm">
                          {p.stockQty} <span className="text-xs font-normal text-slate-500">{p.unit || 'pcs'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                            {t.inventory.statusOut}
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 animate-pulse">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            {t.inventory.statusLow}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            {t.inventory.statusHealthy}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleQuickRestock(p, 5)}
                            className="px-2 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded border border-emerald-200 transition-colors cursor-pointer"
                            title="Restock +5 units"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => handleQuickRestock(p, 10)}
                            className="px-2 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded border border-emerald-200 transition-colors cursor-pointer"
                            title="Restock +10 units"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => onDeleteProduct(p._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile View Card List */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredProducts.map((p) => {
              const isOutOfStock = p.stockQty <= 0;
              const isLowStock = p.stockQty > 0 && p.stockQty < 5;

              return (
                <div key={p._id} className="p-3.5 flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">{p.name}</span>
                      <span className="text-[11px] text-slate-400">{p.category || 'General'}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-700 text-base">
                        {p.price} {t.currency}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">
                        {p.stockQty} {p.unit || 'pcs'}
                      </span>
                      {isOutOfStock ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                          {t.inventory.statusOut}
                        </span>
                      ) : isLowStock ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          {t.inventory.statusLow}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleQuickRestock(p, 5)}
                        className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 active:scale-95"
                      >
                        +5 {t.inventory.quickRestock}
                      </button>
                      <button
                        onClick={() => onDeleteProduct(p._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              No products found matching your search.
            </div>
          )}

        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            
            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-300" />
                {t.inventory.addNewProduct}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.inventory.productName} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.inventory.productNamePlaceholder}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.inventory.sellingPrice} *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.5"
                    placeholder="e.g. 150"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.inventory.initialStock} *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 25"
                    value={formData.stockQty}
                    onChange={(e) => setFormData({ ...formData, stockQty: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.inventory.category}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="Grains & Spices">Grains & Spices (ቅመማቅመም)</option>
                    <option value="Beverages">Beverages (መጠጦች)</option>
                    <option value="Essentials">Essentials (አስፈላጊዎች)</option>
                    <option value="Food">Food (ምግቦች)</option>
                    <option value="Household">Household (የጽዳት)</option>
                    <option value="General">General (ጠቅላላ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.inventory.unit}
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="pcs">{t.inventory.units.pcs}</option>
                    <option value="kg">{t.inventory.units.kg}</option>
                    <option value="bottle">{t.inventory.units.bottle}</option>
                    <option value="pack">{t.inventory.units.pack}</option>
                    <option value="bag">{t.inventory.units.bag}</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  {t.inventory.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : t.inventory.saveProduct}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
