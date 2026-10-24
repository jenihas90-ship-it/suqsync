import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import POS from './components/POS';
import Inventory from './components/Inventory';
import Dashboard from './components/Dashboard';
import ReceiptModal from './components/ReceiptModal';
import TelebirrQRModal from './components/TelebirrQRModal';
import PricingModal from './components/PricingModal';
import PitchDeckModal from './components/PitchDeckModal';
import StoreSettingsModal from './components/StoreSettingsModal';
import RegistrationModal from './components/RegistrationModal';
import { translations } from './translations';
import { soundFX } from './utils/audio';
import { 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  recordSale, 
  fetchDailyDashboard,
  checkServerHealth,
  checkAuthStatus,
  registerMerchant,
  loginMerchant,
  resetPasswordApi,
  updateMerchantProfileApi
} from './api';

const DEFAULT_STORE_PROFILE = {
  storeName: '',
  ownerName: '',
  cashierName: '',
  phone: '',
  telebirrMerchantId: '',
  cbeAccount: '',
  city: 'Addis Ababa',
  subcity: '',
  pilotShopId: '',
  isRegistered: false,
};

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('suqsync_lang') || 'en');
  const [activeTab, setActiveTab] = useState('home');
  const [products, setProducts] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [serverStatus, setServerStatus] = useState({ online: true, database: { mode: 'Initializing...' } });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCompletedSale, setLastCompletedSale] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Store Profile & Registered Owner Metadata
  const [storeProfile, setStoreProfile] = useState(DEFAULT_STORE_PROFILE);
  const [isOwnerRegistered, setIsOwnerRegistered] = useState(false);
  const [registeredMerchantMeta, setRegisteredMerchantMeta] = useState(null);

  // Authentication & Session State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('suqsync_auth_user');
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('suqsync_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  // Active SaaS tier
  const [currentPlan, setCurrentPlan] = useState('Basic');
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showPitchDeckModal, setShowPitchDeckModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Telebirr QR State
  const [telebirrModal, setTelebirrModal] = useState({
    isOpen: false,
    isStandMode: false,
    amount: 0,
    productName: '',
    quantity: 1,
    selectedProduct: null
  });

  const t = translations[lang] || translations.en;

  const handleSetLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('suqsync_lang', newLang);
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load products, dashboard metrics, and backend auth status
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [prods, dash, health, auth] = await Promise.all([
        fetchProducts().catch(err => { console.error('Products error', err); return []; }),
        fetchDailyDashboard().catch(err => { console.error('Dashboard error', err); return null; }),
        checkServerHealth().catch(err => ({ online: false })),
        checkAuthStatus().catch(err => ({ isRegistered: false, merchant: null }))
      ]);

      setProducts(prods);
      setDashboardData(dash);
      setServerStatus(health);

      const hasRegistered = !!(auth && auth.isRegistered);
      setIsOwnerRegistered(hasRegistered);
      if (auth && auth.merchant) {
        setRegisteredMerchantMeta(auth.merchant);
      }

      // Check current browser local session
      const savedUserStr = localStorage.getItem('suqsync_auth_user');
      let sessionUser = null;
      if (savedUserStr) {
        try {
          sessionUser = JSON.parse(savedUserStr);
        } catch {
          sessionUser = null;
        }
      }

      if (!hasRegistered) {
        // First-time installation: Owner has NEVER registered yet!
        setIsAuthenticated(false);
        setCurrentUser(null);
        localStorage.removeItem('suqsync_auth_user');
        setStoreProfile(DEFAULT_STORE_PROFILE);
        setAuthMode('register');
      } else {
        // Owner has ALREADY registered in backend!
        if (sessionUser) {
          // Has active authenticated session
          setIsAuthenticated(true);
          setCurrentUser(sessionUser);
          setShowAuthModal(false);
          setStoreProfile({
            storeName: sessionUser.shopName || auth.merchant?.shopName || 'SuqSync Store',
            ownerName: sessionUser.fullName || auth.merchant?.fullName || 'Owner',
            cashierName: (sessionUser.fullName || auth.merchant?.fullName || 'Cashier').split(' ')[0],
            phone: sessionUser.phoneNumber || auth.merchant?.phoneNumber,
            telebirrMerchantId: sessionUser.telebirrMerchantId || auth.merchant?.telebirrMerchantId || '984321',
            cbeAccount: sessionUser.bankAccountNumber || auth.merchant?.bankAccountNumber || '1000123456789',
            city: sessionUser.city || auth.merchant?.city || 'Addis Ababa',
            subcity: `${sessionUser.subcityOrZone || 'Bole'}, ${sessionUser.woreda || 'Woreda 03'}`,
            pilotShopId: sessionUser.pilotShopId || auth.merchant?.pilotShopId || 'SUQ-ETH-001',
            isRegistered: true,
          });
        } else {
          // Owner is registered, but NO active signed-in session in this browser!
          // They DO NOT have to register again! They must SIGN IN with their name and password!
          setIsAuthenticated(false);
          setCurrentUser(null);
          setAuthMode('login');
          if (auth.merchant) {
            setStoreProfile({
              storeName: auth.merchant.shopName,
              ownerName: auth.merchant.fullName,
              cashierName: auth.merchant.fullName.split(' ')[0] || 'Cashier',
              phone: auth.merchant.phoneNumber,
              telebirrMerchantId: auth.merchant.telebirrMerchantId || '984321',
              cbeAccount: auth.merchant.bankAccountNumber || '1000123456789',
              city: auth.merchant.city || 'Addis Ababa',
              subcity: `${auth.merchant.subcityOrZone || 'Bole'}, ${auth.merchant.woreda || 'Woreda 03'}`,
              pilotShopId: auth.merchant.pilotShopId || 'SUQ-ETH-001',
              isRegistered: true,
            });
          }
        }
      }
    } catch (err) {
      console.error('Data load error:', err);
      showToast('Could not reach backend server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if mobile device opened via sync link (#sync=...)
    const checkMobileSync = () => {
      try {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#sync=')) {
          const encoded = hash.replace('#sync=', '');
          const decoded = decodeURIComponent(atob(encoded));
          const syncData = JSON.parse(decoded);
          if (syncData && syncData.merchant) {
            const m = syncData.merchant;
            localStorage.setItem('suqsync_local_merchant', JSON.stringify(m));
            localStorage.setItem('suqsync_auth_user', JSON.stringify(m));
            if (syncData.products && Array.isArray(syncData.products)) {
              localStorage.setItem('suqsync_local_products', JSON.stringify(syncData.products));
              setProducts(syncData.products);
            }
            setCurrentUser(m);
            setIsAuthenticated(true);
            setIsOwnerRegistered(true);
            setRegisteredMerchantMeta(m);
            setShowAuthModal(false);
            setStoreProfile({
              storeName: m.shopName,
              ownerName: m.fullName,
              cashierName: (m.fullName || 'Cashier').split(' ')[0],
              phone: m.phoneNumber,
              telebirrMerchantId: m.telebirrMerchantId || '984321',
              cbeAccount: m.bankAccountNumber || '1000123456789',
              city: m.city || 'Addis Ababa',
              subcity: `${m.subcityOrZone || 'Bole'}, ${m.woreda || 'Woreda 03'}`,
              pilotShopId: m.pilotShopId || 'SUQ-ETH-001',
              isRegistered: true,
            });
            window.location.hash = '';
            showToast(`🎉 Connected to ${m.shopName}! Welcome, ${m.fullName}!`);
            return true;
          }
        }
      } catch (err) {
        console.error('Failed to parse mobile sync hash:', err);
      }
      return false;
    };

    const synced = checkMobileSync();
    if (!synced) {
      loadData();
    }
    const interval = setInterval(loadData, 25000);
    return () => clearInterval(interval);
  }, []);

  // Handler: Returning Owner Sign In with Name & Password
  const handleLoginOwner = async ({ identifier, password }) => {
    const loggedIn = await loginMerchant({ identifier, password });
    localStorage.setItem('suqsync_auth_user', JSON.stringify(loggedIn));
    setCurrentUser(loggedIn);
    setIsAuthenticated(true);
    setIsOwnerRegistered(true);
    setRegisteredMerchantMeta(loggedIn);
    setShowAuthModal(false);
    setStoreProfile({
      storeName: loggedIn.shopName,
      ownerName: loggedIn.fullName,
      cashierName: loggedIn.fullName.split(' ')[0] || 'Cashier',
      phone: loggedIn.phoneNumber,
      telebirrMerchantId: loggedIn.telebirrMerchantId || '984321',
      cbeAccount: loggedIn.bankAccountNumber || '1000123456789',
      city: loggedIn.city || 'Addis Ababa',
      subcity: `${loggedIn.subcityOrZone || 'Bole'}, ${loggedIn.woreda || 'Woreda 03'}`,
      pilotShopId: loggedIn.pilotShopId || 'SUQ-ETH-001',
      isRegistered: true,
    });
    showToast(`👋 Welcome back, ${loggedIn.fullName}!`);
  };

  // Handler: First-time Suq Owner Registration
  const handleRegisterOwner = async (registrationPayload) => {
    const registered = await registerMerchant(registrationPayload);
    localStorage.setItem('suqsync_auth_user', JSON.stringify(registered));
    setCurrentUser(registered);
    setIsAuthenticated(true);
    setIsOwnerRegistered(true);
    setRegisteredMerchantMeta(registered);
    setShowAuthModal(false);
    setStoreProfile({
      storeName: registered.shopName,
      ownerName: registered.fullName,
      cashierName: registered.fullName.split(' ')[0] || 'Cashier',
      phone: registered.phoneNumber,
      telebirrMerchantId: registered.telebirrMerchantId || '984321',
      cbeAccount: registered.bankAccountNumber || '1000123456789',
      city: registered.city || 'Addis Ababa',
      subcity: `${registered.subcityOrZone || 'Bole'}, ${registered.woreda || 'Woreda 03'}`,
      pilotShopId: registered.pilotShopId || 'SUQ-ETH-001',
      isRegistered: true,
    });
    showToast(`🎉 Registration Complete! Pilot ID: ${registered.pilotShopId}`);
    setActiveTab('inventory'); // Navigate owner directly to add their first product!
  };

  // Handler: Reset Security PIN / Password
  const handleResetPassword = async ({ identifier, verificationKey, newPassword }) => {
    const result = await resetPasswordApi({ identifier, verificationKey, newPassword });
    if (result && result.merchant) {
      setRegisteredMerchantMeta(result.merchant);
      showToast('🎉 Password reset successfully! You can now sign in.');
    }
    return result;
  };

  // Handler: Sign Out / Lock Store
  const handleLogout = () => {
    localStorage.removeItem('suqsync_auth_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthMode('login');
    setShowAuthModal(true);
    showToast('Signed out safely. Please sign in to resume.', 'info');
  };

  const handleSaveProfile = async (newProfile) => {
    try {
      await updateMerchantProfileApi({
        shopName: newProfile.storeName,
        fullName: newProfile.ownerName,
        phoneNumber: newProfile.phone,
        telebirrMerchantId: newProfile.telebirrMerchantId,
        bankAccountNumber: newProfile.cbeAccount,
        city: newProfile.city,
      });
      setStoreProfile(newProfile);
      showToast('Store profile & cashier updated in backend');
    } catch (err) {
      setStoreProfile(newProfile);
      showToast('Profile updated locally');
    }
  };

  // Handler: Reset App Data to Day 1 Fresh State
  const handleResetData = async () => {
    if (!window.confirm('Are you sure you want to reset SuqSync? All products, sales, and merchant records will be cleared back to Day 1 fresh state.')) {
      return;
    }
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${API_BASE}/api/auth/reset`, { method: 'POST' });
      localStorage.removeItem('suqsync_store_profile');
      localStorage.removeItem('suqsync_auth_user');
      setIsAuthenticated(false);
      setCurrentUser(null);
      setProducts([]);
      setDashboardData(null);
      setStoreProfile(DEFAULT_STORE_PROFILE);
      setIsOwnerRegistered(false);
      setRegisteredMerchantMeta(null);
      setShowSettingsModal(false);
      setAuthMode('register');
      setShowAuthModal(true);
      setActiveTab('pos');
      showToast('SuqSync reset to fresh Day 1 state');
    } catch (err) {
      console.error('Reset error:', err);
      showToast('Failed to reset data', 'error');
    }
  };

  // Complete POS Sale
  const handleCompleteSale = async (salePayload) => {
    try {
      setIsSubmitting(true);
      const result = await recordSale({
        productId: salePayload.productId,
        quantitySold: salePayload.quantitySold,
        paymentMethod: salePayload.paymentMethod,
      });

      soundFX.playSaleSuccess();

      // Update inventory locally
      setProducts(prev => prev.map(p => {
        if (p._id === salePayload.productId) {
          return { ...p, stockQty: Math.max(0, p.stockQty - salePayload.quantitySold) };
        }
        return p;
      }));

      // Show receipt modal
      setLastCompletedSale({
        ...result,
        productName: salePayload.productName,
        unitPrice: salePayload.unitPrice,
        totalAmount: salePayload.totalAmount,
        paymentMethod: salePayload.paymentMethod,
      });

      showToast(t.pos.saleSuccess);
      fetchDailyDashboard().then(dash => setDashboardData(dash)).catch(() => {});
    } catch (err) {
      console.error('Sale submission failed:', err);
      showToast(err.message || t.pos.saleError, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open dynamic Telebirr QR from POS
  const handleOpenTelebirrQR = ({ amount, productName, quantity, selectedProduct }) => {
    setTelebirrModal({
      isOpen: true,
      isStandMode: false,
      amount,
      productName,
      quantity,
      selectedProduct
    });
  };

  // Open counter stand QR from Navbar
  const handleOpenTelebirrStand = () => {
    setTelebirrModal({
      isOpen: true,
      isStandMode: true,
      amount: 0,
      productName: '',
      quantity: 1,
      selectedProduct: null
    });
  };

  // Confirm payment via QR modal
  const handleConfirmTelebirrPayment = (details) => {
    if (!telebirrModal.selectedProduct) return;
    handleCompleteSale({
      productId: telebirrModal.selectedProduct._id,
      productName: telebirrModal.productName,
      quantitySold: telebirrModal.quantity,
      unitPrice: telebirrModal.selectedProduct.price,
      totalAmount: telebirrModal.amount,
      paymentMethod: 'Telebirr',
    });
  };

  // Select new plan
  const handleSelectPlan = (planId) => {
    setCurrentPlan(planId);
    showToast(`Upgraded to ${planId} Tier! Telebirr webhook active.`);
  };

  // Add product
  const handleAddProduct = async (productData) => {
    try {
      setIsSubmitting(true);
      const created = await createProduct(productData);
      setProducts(prev => [created, ...prev]);
      showToast(t.inventory.addSuccess);
    } catch (err) {
      console.error('Product add failed:', err);
      showToast(err.message || 'Failed to add product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stock update
  const handleUpdateStock = async (id, updates) => {
    try {
      const updated = await updateProduct(id, updates);
      setProducts(prev => prev.map(p => p._id === id ? updated : p));
      showToast(t.inventory.restockSuccess);
    } catch (err) {
      console.error('Stock update failed:', err);
      showToast(err.message || 'Failed to update stock', 'error');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm(t.inventory.deleteConfirm)) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      showToast('Product removed');
    } catch (err) {
      console.error('Delete failed:', err);
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const lowStockCount = products.filter(p => (p.stockQty || 0) < 5).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 animate-in slide-in-from-top-3">
          <div className={`px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 border ${
            toastMessage.type === 'error'
              ? 'bg-rose-600 text-white border-rose-700'
              : 'bg-emerald-600 text-white border-emerald-700'
          }`}>
            <span>{toastMessage.type === 'error' ? '⚠️' : '✓'}</span>
            <span>{toastMessage.msg}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={handleSetLang}
        t={t}
        serverStatus={serverStatus}
        lowStockCount={lowStockCount}
        onOpenTelebirrStand={handleOpenTelebirrStand}
        onOpenPitchDeck={() => setShowPitchDeckModal(true)}
        onOpenPricing={() => setShowPricingModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenAuth={() => {
          setAuthMode(isOwnerRegistered ? 'login' : 'register');
          setShowAuthModal(true);
        }}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
        storeProfile={storeProfile}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-4 md:p-6 pb-20">
        {activeTab === 'home' && (
          <Home
            onNavigate={(tab) => {
              setActiveTab(tab);
              if (['pos', 'inventory', 'dashboard'].includes(tab) && !isAuthenticated) {
                setAuthMode(isOwnerRegistered ? 'login' : 'register');
                setShowAuthModal(true);
              }
            }}
            storeProfile={storeProfile}
            isOwnerRegistered={isOwnerRegistered}
            onOpenPitchDeck={() => setShowPitchDeckModal(true)}
            onOpenPricing={() => setShowPricingModal(true)}
          />
        )}

        {activeTab === 'services' && (
          <Services
            onNavigate={(tab) => {
              setActiveTab(tab);
              if (['pos', 'inventory', 'dashboard'].includes(tab) && !isAuthenticated) {
                setAuthMode(isOwnerRegistered ? 'login' : 'register');
                setShowAuthModal(true);
              }
            }}
            onOpenTelebirrStand={handleOpenTelebirrStand}
            onOpenPricing={() => setShowPricingModal(true)}
            onOpenPitchDeck={() => setShowPitchDeckModal(true)}
          />
        )}

        {activeTab === 'about' && (
          <About
            onNavigate={(tab) => {
              setActiveTab(tab);
              if (['pos', 'inventory', 'dashboard'].includes(tab) && !isAuthenticated) {
                setAuthMode(isOwnerRegistered ? 'login' : 'register');
                setShowAuthModal(true);
              }
            }}
            onOpenPitchDeck={() => setShowPitchDeckModal(true)}
          />
        )}

        {['pos', 'inventory', 'dashboard'].includes(activeTab) && (
          !isAuthenticated ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 mb-4 shadow-xl">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-slate-800">
                {isOwnerRegistered ? 'SuqSync Store is Locked' : 'SuqSync Setup Required'}
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                {isOwnerRegistered 
                  ? 'Please sign in with your registered Name and Password to access your POS, stock, and daily sales.'
                  : 'Please complete the first-time owner registration to launch your digital store.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                <button
                  onClick={() => {
                    setAuthMode(isOwnerRegistered ? 'login' : 'register');
                    setShowAuthModal(true);
                  }}
                  className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  {isOwnerRegistered ? 'Sign In to Store (ይግቡ)' : 'Register Shop Owner'}
                </button>
                <button
                  onClick={() => setActiveTab('home')}
                  className="py-2.5 px-5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  Back to Home
                </button>
              </div>
            </div>
          ) : isLoading && products.length === 0 && !dashboardData ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
              <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-medium tracking-wide">Connecting to SuqSync Local Engine...</p>
            </div>
          ) : (
            <>
              {activeTab === 'pos' && (
                <POS
                  products={products}
                  onCompleteSale={handleCompleteSale}
                  t={t}
                  isSubmitting={isSubmitting}
                  onOpenTelebirrQR={handleOpenTelebirrQR}
                  onGoToInventory={() => setActiveTab('inventory')}
                />
              )}

              {activeTab === 'inventory' && (
                <Inventory
                  products={products}
                  onAddProduct={handleAddProduct}
                  onUpdateStock={handleUpdateStock}
                  onDeleteProduct={handleDeleteProduct}
                  t={t}
                  isSubmitting={isSubmitting}
                />
              )}

              {activeTab === 'dashboard' && (
                <Dashboard
                  dashboardData={dashboardData}
                  onRefresh={loadData}
                  t={t}
                  isLoading={isLoading}
                />
              )}
            </>
          )
        )}
      </main>

      {/* Sale Confirmation Modal (Receipt) */}
      <ReceiptModal
        saleData={lastCompletedSale}
        onClose={() => setLastCompletedSale(null)}
        storeProfile={storeProfile}
        t={t}
      />

      {/* Telebirr QR Modal (Dynamic Order QR or Counter Stand QR) */}
      <TelebirrQRModal
        isOpen={telebirrModal.isOpen}
        onClose={() => setTelebirrModal({ ...telebirrModal, isOpen: false })}
        amount={telebirrModal.amount}
        productName={telebirrModal.productName}
        quantity={telebirrModal.quantity}
        onConfirmPayment={handleConfirmTelebirrPayment}
        t={t}
        isStandMode={telebirrModal.isStandMode}
      />

      {/* Freemium SaaS Pricing Plans Modal */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        currentPlan={currentPlan}
        onSelectPlan={handleSelectPlan}
        t={t}
      />

      {/* Innobiz-K Incubation Pitch Deck Modal */}
      <PitchDeckModal
        isOpen={showPitchDeckModal}
        onClose={() => setShowPitchDeckModal(false)}
      />

      {/* Store Profile & CSV Export Settings Modal */}
      <StoreSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        storeProfile={storeProfile}
        onSaveProfile={handleSaveProfile}
        onResetData={handleResetData}
        onLogout={handleLogout}
        products={products}
        sales={dashboardData?.data?.recentTransactions || []}
        t={t}
      />

      {/* Suq Owner Authentication & Registration Modal */}
      <RegistrationModal
        isOpen={showAuthModal}
        onClose={() => {
          if (isAuthenticated) setShowAuthModal(false);
        }}
        initialMode={authMode}
        isOwnerRegistered={isOwnerRegistered}
        registeredOwnerInfo={registeredMerchantMeta}
        isAuthenticated={isAuthenticated}
        onRegisterSuccess={handleRegisterOwner}
        onLoginSuccess={handleLoginOwner}
        onResetPasswordSuccess={handleResetPassword}
        t={t}
      />

      {/* Footer & Incubation Pitch Note */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-4 px-4 text-center text-xs mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">SuqSync v1.0 MVP</span>
            <span className="text-slate-600">•</span>
            {isOwnerRegistered ? (
              <span className="text-emerald-400 font-bold">{storeProfile.storeName} ({storeProfile.pilotShopId})</span>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('register');
                  setShowAuthModal(true);
                }}
                className="text-amber-400 hover:underline font-bold cursor-pointer"
              >
                ⚠️ First-Time Setup Required
              </button>
            )}
            <span className="text-slate-600">•</span>
            <button
              onClick={() => setShowPricingModal(true)}
              className="text-emerald-400 hover:underline font-bold cursor-pointer"
            >
              Plan: {currentPlan}
            </button>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-2">
            <span>Compliant with Ethiopian Startup Proclamation No. 1396/2025</span>
            <span>•</span>
            <button
              onClick={() => {
                setAuthMode(isAuthenticated ? 'login' : (isOwnerRegistered ? 'login' : 'register'));
                setShowAuthModal(true);
              }}
              className="text-sky-400 hover:underline font-bold cursor-pointer"
            >
              {isAuthenticated ? `👤 ${storeProfile.ownerName || 'Owner'}` : (isOwnerRegistered ? 'Sign In' : 'Register Suq')}
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
