import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Sparkles, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowLeft, 
  RefreshCw, 
  Lock, 
  AlertCircle,
  CheckCircle2,
  Phone,
  KeyRound,
  Store,
  LogOut,
  ChevronRight
} from 'lucide-react';

const DEFAULT_ADMIN_PHONE = '+251911223344';

/**
 * AdminDashboard Component
 * 
 * Hidden super-admin dashboard rendered at route /super-admin.
 * Fetches /api/admin/stats and displays 3 clean metric cards:
 * 1. Total Registered ShopOwner documents
 * 2. Number of users marked as isPremium: true
 * 3. Total number of sales logged across all shops today
 * 
 * Protected route: Redirects normal users back to the main app.
 */
export default function AdminDashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminToken, setAdminToken] = useState(() => {
    try {
      return localStorage.getItem('suqsync_admin_token') || sessionStorage.getItem('suqsync_admin_token') || '';
    } catch {
      return '';
    }
  });

  const [phoneInput, setPhoneInput] = useState(DEFAULT_ADMIN_PHONE);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Check authorization and redirect normal users if not authorized
  useEffect(() => {
    let savedToken = '';
    let currentUser = null;

    try {
      savedToken = localStorage.getItem('suqsync_admin_token') || sessionStorage.getItem('suqsync_admin_token') || '';
      const authUserStr = localStorage.getItem('suqsync_auth_user');
      if (authUserStr) currentUser = JSON.parse(authUserStr);
    } catch (e) {
      console.warn('Storage read error:', e);
    }

    const hasAdminPhone = currentUser?.phoneNumber && (
      currentUser.phoneNumber.includes('911223344') || currentUser.isAdmin === true || currentUser.role === 'super-admin'
    );

    // If logged in as normal merchant (not admin phone), immediately protect route and redirect back to main app
    if (currentUser && !hasAdminPhone && !savedToken) {
      console.warn('[AdminDashboard] Protected route: normal user redirected to main app');
      if (typeof onNavigate === 'function') {
        onNavigate('home');
      } else if (typeof window !== 'undefined') {
        window.location.replace('/');
      }
      return;
    }

    // If logged in with admin phone but no token in storage yet, auto-authenticate
    if (hasAdminPhone && !savedToken) {
      const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) 
        ? import.meta.env.VITE_API_URL 
        : 'http://localhost:5000';

      fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: currentUser.phoneNumber }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('suqsync_admin_token', data.token);
          setAdminToken(data.token);
          fetchStats(data.token);
        } else {
          setShowLoginModal(true);
          setIsLoading(false);
        }
      })
      .catch(() => {
        setShowLoginModal(true);
        setIsLoading(false);
      });
      return;
    }

    // If no token at all, prompt with admin security login modal
    if (!savedToken) {
      setShowLoginModal(true);
      setIsLoading(false);
      return;
    }

    fetchStats(savedToken);
  }, []);

  const fetchStats = async (tokenToUse) => {
    try {
      setIsLoading(true);
      setError(null);

      const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) 
        ? import.meta.env.VITE_API_URL 
        : 'http://localhost:5000';

      const token = tokenToUse || adminToken || localStorage.getItem('suqsync_admin_token');

      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/api/admin/stats`, {
        method: 'GET',
        headers,
      });

      const json = await res.json();

      if (!res.ok || json.success === false) {
        if (res.status === 401 || res.status === 403) {
          // Normal user without permission: clear and redirect
          localStorage.removeItem('suqsync_admin_token');
          sessionStorage.removeItem('suqsync_admin_token');
          if (typeof onNavigate === 'function') {
            onNavigate('home');
          } else if (typeof window !== 'undefined') {
            window.location.replace('/');
          }
          return;
        }
        throw new Error(json.message || 'Failed to fetch admin statistics');
      }

      setStats(json);
    } catch (err) {
      console.error('Admin stats fetch error:', err);
      setError(err.message || 'Could not load super-admin stats');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    if (e) e.preventDefault();
    try {
      setIsSubmitting(true);
      setLoginError(null);
      const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) 
        ? import.meta.env.VITE_API_URL 
        : 'http://localhost:5000';

      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phoneInput }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Admin authentication failed');
      }

      localStorage.setItem('suqsync_admin_token', json.token);
      setAdminToken(json.token);
      setShowLoginModal(false);
      fetchStats(json.token);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('suqsync_admin_token');
    sessionStorage.removeItem('suqsync_admin_token');
    setAdminToken('');
    setStats(null);
    if (typeof onNavigate === 'function') {
      onNavigate('home');
    } else if (typeof window !== 'undefined') {
      window.location.replace('/');
    }
  };

  // Three primary metrics
  const registeredShopOwners = stats?.registeredShopOwners ?? 
    stats?.totalRegisteredShopOwners ?? 
    stats?.totalShopOwners ?? 
    stats?.stats?.registeredShopOwners ?? 0;

  const premiumUsers = stats?.premiumUsers ?? 
    stats?.premiumUsersCount ?? 
    stats?.isPremiumCount ?? 
    stats?.stats?.premiumUsers ?? 0;

  const todaySales = stats?.todaySales ?? 
    stats?.todaySalesCount ?? 
    stats?.totalSalesToday ?? 
    stats?.salesToday ?? 
    stats?.stats?.todaySales ?? 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 font-sans selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Super-Admin Top Navigation Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                  Super-Admin Portal
                </span>
                <span className="text-xs text-slate-500">• Route: /super-admin</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                SuqSync Platform Analytics
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchStats()}
              disabled={isLoading}
              className="py-2.5 px-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
              <span>Refresh Stats</span>
            </button>

            <button
              onClick={handleLogout}
              className="py-2.5 px-3.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-xl border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Return to Main App"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to App</span>
            </button>
          </div>
        </header>

        {/* Error notification if any */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800/80 text-rose-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-3 py-1 rounded-lg bg-rose-800 hover:bg-rose-700 text-white font-bold text-xs"
            >
              Admin Sign In
            </button>
          </div>
        )}

        {/* The Three Clean Metric Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Metric Card 1: Registered Shop Owners */}
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/50 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                  Shop Owners
                </span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {isLoading ? (
                    <span className="inline-block w-16 h-8 bg-slate-800 animate-pulse rounded-lg"></span>
                  ) : (
                    registeredShopOwners.toLocaleString()
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-200 mt-1">
                  Registered ShopOwner Documents
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Total verified merchant store accounts onboarded in MongoDB.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>Collection: ShopOwner / User</span>
              <span className="text-emerald-400 font-bold">Mongoose Count</span>
            </div>
          </div>

          {/* Metric Card 2: Premium Users */}
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/50 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  Monetization
                </span>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {isLoading ? (
                    <span className="inline-block w-16 h-8 bg-slate-800 animate-pulse rounded-lg"></span>
                  ) : (
                    premiumUsers.toLocaleString()
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-200 mt-1">
                  Users Marked as isPremium: true
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Subscribed merchants upgraded via Telebirr payment flow.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>Filter: `isPremium: true`</span>
              <span className="text-amber-400 font-bold">Paid Accounts</span>
            </div>
          </div>

          {/* Metric Card 3: Today's Sales Across All Shops */}
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-sky-500/50 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-sky-400">
                  Daily Volume
                </span>
                <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {isLoading ? (
                    <span className="inline-block w-16 h-8 bg-slate-800 animate-pulse rounded-lg"></span>
                  ) : (
                    todaySales.toLocaleString()
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-200 mt-1">
                  Sales Logged Across All Shops Today
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Total checkout events logged across all kiosks since 00:00 today.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>Timeframe: Today (00:00 - now)</span>
              <span className="text-sky-400 font-bold">Network-Wide</span>
            </div>
          </div>

        </section>

        {/* Security & Access Info Card */}
        <section className="bg-slate-900/60 rounded-3xl p-5 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Route Protection Active: Access authorized via JWT bound to admin phone number.
            </span>
          </div>
          <button
            onClick={() => {
              if (typeof onNavigate === 'function') {
                onNavigate('home');
              } else if (typeof window !== 'undefined') {
                window.location.replace('/');
              }
            }}
            className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all cursor-pointer self-start sm:self-auto"
          >
            Return to Store
          </button>
        </section>

        {/* Super-Admin Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <h3 className="font-extrabold text-base text-white">Super-Admin Access</h3>
                </div>
                <button 
                  onClick={() => {
                    setShowLoginModal(false);
                    if (!adminToken) {
                      if (typeof onNavigate === 'function') onNavigate('home');
                      else if (typeof window !== 'undefined') window.location.replace('/');
                    }
                  }}
                  className="text-slate-400 hover:text-white"
                  title="Cancel & return to store"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Enter your authorized administrator phone number to verify JWT credentials and unlock platform metrics.
              </p>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">
                    Admin Phone Number
                  </label>
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+251911223344"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      if (typeof onNavigate === 'function') onNavigate('home');
                      else if (typeof window !== 'undefined') window.location.replace('/');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
                  >
                    {isSubmitting ? 'Verifying...' : 'Sign In as Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export { AdminDashboard };
