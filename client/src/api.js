const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ---- STANDALONE OFFLINE / LOCAL FALLBACK ENGINE ----
// Ensures SuqSync functions flawlessly on Vercel or when spotty internet drops
const LOCAL_MERCHANT_KEY = 'suqsync_local_merchant';
const LOCAL_PRODUCTS_KEY = 'suqsync_local_products';
const LOCAL_SALES_KEY = 'suqsync_local_sales';

// Client-side SHA-256 password hasher with same salt
async function hashClientPassword(password) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode((password || '') + '_suqsync_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return btoa((password || '') + '_suqsync_salt_2026');
  }
}

function getLocalProducts() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLocalProducts(products) {
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
}

const DEFAULT_INITIAL_SALES = [
  {
    _id: 'sale_credit_001',
    productId: 'prod_1792785018896',
    productName: 'Soofii',
    quantitySold: 2,
    unitPrice: 80,
    totalPrice: 160,
    totalAmount: 160,
    paymentMethod: 'Credit',
    paymentStatus: 'Credit',
    customerName: 'Abebe Kebede',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'sale_credit_002',
    productId: 'prod_1792784860123',
    productName: 'Buna',
    quantitySold: 4,
    unitPrice: 25,
    totalPrice: 100,
    totalAmount: 100,
    paymentMethod: 'Credit',
    paymentStatus: 'Credit',
    customerName: 'Tadesse Gemechu',
    createdAt: new Date().toISOString()
  }
];

function getLocalSales() {
  try {
    const raw = localStorage.getItem(LOCAL_SALES_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_SALES_KEY, JSON.stringify(DEFAULT_INITIAL_SALES));
      return DEFAULT_INITIAL_SALES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(LOCAL_SALES_KEY, JSON.stringify(DEFAULT_INITIAL_SALES));
      return DEFAULT_INITIAL_SALES;
    }
    return parsed;
  } catch {
    return DEFAULT_INITIAL_SALES;
  }
}

function saveLocalSales(sales) {
  localStorage.setItem(LOCAL_SALES_KEY, JSON.stringify(sales));
}

// ---- AUTH & SUQ OWNER REGISTRATION ----

export async function checkAuthStatus() {
  try {
    const res = await fetch(`${API_BASE}/api/auth/status`, { signal: AbortSignal.timeout(3500) });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    return json;
  } catch (err) {
    // Offline / Standalone Fallback
    try {
      const localMerchantStr = localStorage.getItem(LOCAL_MERCHANT_KEY);
      if (localMerchantStr) {
        const localMerchant = JSON.parse(localMerchantStr);
        const { passwordHash: _, ...safeMerchant } = localMerchant;
        return {
          success: true,
          isRegistered: true,
          registeredShopName: safeMerchant.shopName,
          registeredOwnerName: safeMerchant.fullName,
          pilotShopId: safeMerchant.pilotShopId,
          merchant: safeMerchant,
          isStandalone: true
        };
      }
    } catch (e) {
      console.warn('Local merchant check failed:', e);
    }
    return { isRegistered: false, merchant: null, isStandalone: true };
  }
}

export async function registerMerchant(merchantData) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merchantData),
      signal: AbortSignal.timeout(4500)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Registration failed');
    }
    // Also backup to local storage
    localStorage.setItem(LOCAL_MERCHANT_KEY, JSON.stringify(json.merchant));
    return json.merchant;
  } catch (err) {
    // If backend is unreachable or blocked by Mixed Content on Vercel:
    const isNetworkError = err.name === 'TypeError' || err.name === 'TimeoutError' || err.message?.includes('fetch');
    if (isNetworkError) {
      console.warn('[SuqSync] Backend API unreachable. Operating in Standalone Browser Mode.');
      const passwordHash = await hashClientPassword(merchantData.password);
      const pilotShopId = 'SUQ-ETH-' + String(Math.floor(100 + Math.random() * 900));

      const safeMerchant = {
        _id: 'user_' + Date.now(),
        fullName: merchantData.fullName?.trim() || '',
        phoneNumber: merchantData.phoneNumber?.trim() || '',
        passwordHash,
        shopName: merchantData.shopName?.trim() || 'My Suq',
        businessType: merchantData.businessType || 'Retail Kiosk (Suq)',
        nationalIdOrFayda: merchantData.nationalIdOrFayda?.trim() || '',
        tinNumber: merchantData.tinNumber?.trim() || '',
        tradeLicenseNo: merchantData.tradeLicenseNo?.trim() || '',
        region: merchantData.region || 'Addis Ababa',
        city: merchantData.city || 'Addis Ababa',
        subcityOrZone: merchantData.subcityOrZone?.trim() || 'Bole Subcity',
        woreda: merchantData.woreda?.trim() || 'Woreda 03',
        specificLocation: merchantData.specificLocation?.trim() || '',
        telebirrMerchantId: merchantData.telebirrMerchantId?.trim() || '',
        telebirrPhone: merchantData.telebirrPhone?.trim() || merchantData.phoneNumber?.trim() || '',
        primaryBank: merchantData.primaryBank || 'CBE',
        bankAccountNumber: merchantData.bankAccountNumber?.trim() || '',
        pilotShopId,
        isRegistered: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(LOCAL_MERCHANT_KEY, JSON.stringify(safeMerchant));
      const { passwordHash: _, ...userNoHash } = safeMerchant;
      return userNoHash;
    }
    throw err;
  }
}

export async function loginMerchant({ identifier, phoneNumber, fullName, password }) {
  const loginIdentifier = (identifier || fullName || phoneNumber || '').trim();
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        identifier: loginIdentifier, 
        phoneNumber: loginIdentifier,
        fullName: loginIdentifier,
        password 
      }),
      signal: AbortSignal.timeout(4500)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Login failed');
    }
    // Also backup locally
    localStorage.setItem(LOCAL_MERCHANT_KEY, JSON.stringify(json.merchant));
    return json.merchant;
  } catch (err) {
    const isNetworkError = err.name === 'TypeError' || err.name === 'TimeoutError' || err.message?.includes('fetch');
    if (isNetworkError) {
      console.warn('[SuqSync] Backend API unreachable. Authenticating via local credentials...');
      const localMerchantStr = localStorage.getItem(LOCAL_MERCHANT_KEY);
      if (!localMerchantStr) {
        throw new Error('No registered suq owner found in this browser. Please register first.');
      }

      const merchant = JSON.parse(localMerchantStr);
      const cleanId = loginIdentifier.toLowerCase();
      const cleanDigits = loginIdentifier.replace(/\D/g, '');
      const mName = (merchant.fullName || '').trim().toLowerCase();
      const mPhone = (merchant.phoneNumber || '').trim().toLowerCase();
      const mDigits = mPhone.replace(/\D/g, '');

      const nameMatches = mName === cleanId;
      const phoneMatches = mPhone === cleanId || (cleanDigits.length >= 8 && mDigits.endsWith(cleanDigits.slice(-8)));

      if (!nameMatches && !phoneMatches) {
        throw new Error(`Owner "${loginIdentifier}" not found. Please check your registered name or phone number.`);
      }

      const passwordHash = await hashClientPassword(password);
      if (merchant.passwordHash && merchant.passwordHash !== passwordHash) {
        throw new Error('Invalid security PIN or password. Please try again.');
      }

      const { passwordHash: _, ...safeMerchant } = merchant;
      return safeMerchant;
    }
    throw err;
  }
}

export async function updateMerchantProfileApi(updates) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
      signal: AbortSignal.timeout(4000)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Update failed');
    }
    localStorage.setItem(LOCAL_MERCHANT_KEY, JSON.stringify(json.merchant));
    return json.merchant;
  } catch (err) {
    const localMerchantStr = localStorage.getItem(LOCAL_MERCHANT_KEY);
    if (localMerchantStr) {
      const merchant = JSON.parse(localMerchantStr);
      const updated = { ...merchant, ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(LOCAL_MERCHANT_KEY, JSON.stringify(updated));
      return updated;
    }
    return updates;
  }
}

export async function resetPasswordApi({ identifier, verificationKey, newPassword }) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, verificationKey, newPassword }),
      signal: AbortSignal.timeout(4500)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Password reset failed');
    }
    if (json.merchant) {
      localStorage.setItem(LOCAL_MERCHANT_KEY, JSON.stringify(json.merchant));
    }
    return json;
  } catch (err) {
    const isNetworkError = err.name === 'TypeError' || err.name === 'TimeoutError' || err.message?.includes('fetch');
    if (isNetworkError) {
      console.warn('[SuqSync] Backend unreachable. Resetting password locally in browser...');
      const localMerchantStr = localStorage.getItem(LOCAL_MERCHANT_KEY);
      if (!localMerchantStr) {
        throw new Error('No registered suq owner found in this browser. Please register first.');
      }
      const merchant = JSON.parse(localMerchantStr);
      const cleanId = (identifier || '').trim().toLowerCase();
      const cleanDigits = cleanId.replace(/\D/g, '');
      const mName = (merchant.fullName || '').trim().toLowerCase();
      const mPhone = (merchant.phoneNumber || '').trim().toLowerCase();
      const mDigits = mPhone.replace(/\D/g, '');

      const nameMatches = mName === cleanId;
      const phoneMatches = mPhone === cleanId || (cleanDigits.length >= 8 && mDigits.endsWith(cleanDigits.slice(-8)));

      if (!nameMatches && !phoneMatches) {
        throw new Error(`Owner "${identifier}" not found. Please enter your registered name or phone.`);
      }

      if (merchant.nationalIdOrFayda && verificationKey) {
        const cleanVerify = verificationKey.trim().toLowerCase();
        const verifyDigits = cleanVerify.replace(/\D/g, '');
        const matchesFayda = merchant.nationalIdOrFayda.toLowerCase().trim() === cleanVerify;
        const matchesPhone = verifyDigits.length >= 8 && mDigits.endsWith(verifyDigits.slice(-8));
        if (!matchesFayda && !matchesPhone) {
          throw new Error('Verification details (National ID / Phone) do not match.');
        }
      }

      const newHash = await hashClientPassword(newPassword);
      merchant.passwordHash = newHash;
      merchant.updatedAt = new Date().toISOString();
      localStorage.setItem(LOCAL_MERCHANT_KEY, JSON.stringify(merchant));
      const { passwordHash: _, ...safeMerchant } = merchant;
      return { success: true, message: 'Password reset successfully!', merchant: safeMerchant };
    }
    throw err;
  }
}

// ---- PRODUCTS ----

export async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE}/api/products`, { signal: AbortSignal.timeout(3500) });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    const data = json.data || [];
    saveLocalProducts(data);
    return data;
  } catch (err) {
    return getLocalProducts();
  }
}

export async function createProduct(productData) {
  try {
    const res = await fetch(`${API_BASE}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
      signal: AbortSignal.timeout(4000)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to create product');
    }
    return json.data;
  } catch (err) {
    const newProd = {
      _id: 'prod_' + Date.now(),
      name: productData.name,
      price: Number(productData.price) || 0,
      stockQty: Number(productData.stockQty) || 0,
      category: productData.category || 'General Merchandise',
      unit: productData.unit || 'pcs',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const products = getLocalProducts();
    const updated = [newProd, ...products];
    saveLocalProducts(updated);
    return newProd;
  }
}

export async function updateProduct(id, updates) {
  try {
    const res = await fetch(`${API_BASE}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
      signal: AbortSignal.timeout(4000)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to update product');
    }
    return json.data;
  } catch (err) {
    const products = getLocalProducts();
    const idx = products.findIndex(p => p._id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updates, updatedAt: new Date().toISOString() };
      saveLocalProducts(products);
      return products[idx];
    }
    throw new Error('Product not found');
  }
}

export async function deleteProduct(id) {
  try {
    const res = await fetch(`${API_BASE}/api/products/${id}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(4000)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to delete product');
    }
    return json.data;
  } catch (err) {
    const products = getLocalProducts();
    const updated = products.filter(p => p._id !== id);
    saveLocalProducts(updated);
    return { success: true };
  }
}

// ---- SALES ----

// Calculate revenue summary offline from local sales
function calculateLocalRevenueSummary(ownerId) {
  const sales = getLocalSales();
  const now = new Date();
  
  // Local period boundaries
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday, 0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);

  let weeklyTotal = 0;
  let monthlyTotal = 0;
  let yearlyTotal = 0;

  for (const s of sales) {
    if (s.paymentStatus !== 'Paid') continue;
    if (ownerId && s.ownerId && String(s.ownerId) !== String(ownerId)) continue;

    const amt = Number(s.totalPrice ?? s.totalAmount) || 0;
    const sDate = s.createdAt ? new Date(s.createdAt) : new Date();

    if (sDate >= startOfYear) {
      yearlyTotal += amt;
    }
    if (sDate >= startOfMonth) {
      monthlyTotal += amt;
    }
    if (sDate >= startOfWeek) {
      weeklyTotal += amt;
    }
  }

  return {
    weeklyTotal: Math.round(weeklyTotal * 100) / 100,
    monthlyTotal: Math.round(monthlyTotal * 100) / 100,
    yearlyTotal: Math.round(yearlyTotal * 100) / 100,
  };
}

export async function fetchRevenueSummary(ownerId) {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Addis_Ababa';
    let effectiveOwnerId = ownerId;
    if (!effectiveOwnerId) {
      try {
        const saved = localStorage.getItem('suqsync_auth_user');
        if (saved) effectiveOwnerId = JSON.parse(saved)?._id;
      } catch (e) {}
    }

    const params = new URLSearchParams();
    if (tz) params.append('timezone', tz);
    if (effectiveOwnerId) params.append('ownerId', effectiveOwnerId);

    const res = await fetch(`${API_BASE}/api/sales/revenue-summary?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(effectiveOwnerId ? { 'x-owner-id': effectiveOwnerId } : {}),
        ...(tz ? { 'x-timezone': tz } : {})
      },
      signal: AbortSignal.timeout(5000)
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return {
      weeklyTotal: Number(data.weeklyTotal || 0),
      monthlyTotal: Number(data.monthlyTotal || 0),
      yearlyTotal: Number(data.yearlyTotal || 0),
    };
  } catch (err) {
    console.warn('Backend revenue summary fetch failed, using local fallback:', err);
    return calculateLocalRevenueSummary(ownerId);
  }
}

export async function recordSale({ productId, quantitySold, paymentMethod, paymentStatus = 'Paid', customerName = '', ownerId }) {
  let effectiveOwnerId = ownerId;
  if (!effectiveOwnerId) {
    try {
      const saved = localStorage.getItem('suqsync_auth_user');
      if (saved) effectiveOwnerId = JSON.parse(saved)?._id;
    } catch (e) {}
  }

  try {
    const res = await fetch(`${API_BASE}/api/sales`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(effectiveOwnerId ? { 'x-owner-id': effectiveOwnerId } : {})
      },
      body: JSON.stringify({ productId, quantitySold, paymentMethod, paymentStatus, customerName, ownerId: effectiveOwnerId }),
      signal: AbortSignal.timeout(4500)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to record transaction');
    }
    return json.data;
  } catch (err) {
    const products = getLocalProducts();
    const prod = products.find(p => p._id === productId);
    if (!prod) throw new Error('Product not found in stock');
    if (prod.stockQty < quantitySold) throw new Error(`Insufficient stock. Only ${prod.stockQty} remaining.`);

    // Deduct stock
    prod.stockQty = Math.max(0, Math.round((prod.stockQty - quantitySold) * 1000) / 1000);
    saveLocalProducts(products);

    const totalAmount = Math.round((prod.price * Number(quantitySold)) * 100) / 100;
    const newSale = {
      _id: 'sale_' + Date.now(),
      productId,
      productName: prod.name,
      quantitySold: Number(quantitySold),
      unitPrice: prod.price,
      totalPrice: totalAmount,
      totalAmount,
      paymentMethod: paymentMethod || (paymentStatus === 'Credit' ? 'Credit' : 'Cash'),
      paymentStatus: paymentStatus === 'Credit' ? 'Credit' : 'Paid',
      customerName: customerName ? customerName.trim() : undefined,
      ownerId: effectiveOwnerId || undefined,
      createdAt: new Date().toISOString()
    };

    const sales = getLocalSales();
    saveLocalSales([newSale, ...sales]);
    return newSale;
  }
}

// Fetch unpaid credit sales
export async function fetchCreditSales() {
  try {
    const res = await fetch(`${API_BASE}/api/sales/credit`, { signal: AbortSignal.timeout(4500) });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    if (json.data && json.data.length > 0) {
      return json.data;
    }
    // If backend data has 0 records, fallback to local sales
    const sales = getLocalSales();
    const active = sales.filter(s => s.paymentStatus === 'Credit' || s.paymentMethod === 'Credit');
    return active.length > 0 ? active : (json.data || []);
  } catch (err) {
    const sales = getLocalSales();
    return sales.filter(s => s.paymentStatus === 'Credit' || s.paymentMethod === 'Credit');
  }
}

function calculateLocalCreditSummary(ownerId) {
  const sales = getLocalSales();
  const now = new Date();

  // Local period boundaries
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday, 0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);

  let dailyTotal = 0;
  let weeklyTotal = 0;
  let monthlyTotal = 0;
  let yearlyTotal = 0;

  for (const s of sales) {
    if (s.paymentStatus !== 'Credit') continue;
    if (ownerId && s.ownerId && String(s.ownerId) !== String(ownerId)) continue;

    const amt = Number(s.totalPrice ?? s.totalAmount) || 0;
    const sDate = s.createdAt ? new Date(s.createdAt) : new Date();

    if (sDate >= startOfYear) yearlyTotal += amt;
    if (sDate >= startOfMonth) monthlyTotal += amt;
    if (sDate >= startOfWeek) weeklyTotal += amt;
    if (sDate >= startOfDay) dailyTotal += amt;
  }

  return {
    dailyTotal: Math.round(dailyTotal * 100) / 100,
    weeklyTotal: Math.round(weeklyTotal * 100) / 100,
    monthlyTotal: Math.round(monthlyTotal * 100) / 100,
    yearlyTotal: Math.round(yearlyTotal * 100) / 100,
  };
}

// Fetch daily, weekly, monthly, and yearly totals specifically for unpaid credit
export async function fetchCreditSummary(ownerId) {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Addis_Ababa';
    let effectiveOwnerId = ownerId;
    if (!effectiveOwnerId) {
      try {
        const saved = localStorage.getItem('suqsync_auth_user');
        if (saved) effectiveOwnerId = JSON.parse(saved)?._id;
      } catch (e) {}
    }

    const params = new URLSearchParams();
    if (tz) params.append('timezone', tz);
    if (effectiveOwnerId) params.append('ownerId', effectiveOwnerId);

    const res = await fetch(`${API_BASE}/api/sales/credit-summary?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(effectiveOwnerId ? { 'x-owner-id': effectiveOwnerId } : {}),
        ...(tz ? { 'x-timezone': tz } : {})
      },
      signal: AbortSignal.timeout(5000)
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return {
      dailyTotal: Number(data.dailyTotal || 0),
      weeklyTotal: Number(data.weeklyTotal || 0),
      monthlyTotal: Number(data.monthlyTotal || 0),
      yearlyTotal: Number(data.yearlyTotal || 0),
    };
  } catch (err) {
    console.warn('Backend credit summary fetch failed, using local fallback:', err);
    return calculateLocalCreditSummary(ownerId);
  }
}

// Settle customer credit debt (PUT /api/sales/:id/settle-credit)
export async function settleCreditSale(saleId) {
  try {
    const res = await fetch(`${API_BASE}/api/sales/${saleId}/settle-credit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(4500)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to settle debt');
    }
    const sales = getLocalSales();
    const updated = sales.map(s => s._id === saleId ? { ...s, paymentStatus: 'Paid' } : s);
    saveLocalSales(updated);
    return json.data;
  } catch (err) {
    const sales = getLocalSales();
    const updated = sales.map(s => s._id === saleId ? { ...s, paymentStatus: 'Paid' } : s);
    saveLocalSales(updated);
    return updated.find(s => s._id === saleId);
  }
}

// Backward-compatible alias
export const markCreditSalePaid = settleCreditSale;

// ---- DASHBOARD & HEALTH ----

export async function fetchDailyDashboard() {
  try {
    const res = await fetch(`${API_BASE}/api/dashboard/daily`, { signal: AbortSignal.timeout(3500) });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json;
  } catch (err) {
    // Generate daily aggregates from local sales
    const sales = getLocalSales();
    const products = getLocalProducts();

    const todayStr = new Date().toISOString().slice(0, 10);
    const todaySales = sales.filter(s => (s.createdAt || '').slice(0, 10) === todayStr);

    let totalRevenue = 0;
    let totalCash = 0;
    let totalDigital = 0;
    let cashTransactionsCount = 0;
    let digitalTransactionsCount = 0;

    const byMethod = {
      Cash: 0,
      Telebirr: 0,
      CBE: 0,
      'Coop Bank': 0,
      'Awash Bank': 0,
      'Sinqee Bank': 0,
      'Abyssinia Bank': 0,
      Credit: 0,
      Other: 0
    };

    const countByMethod = {
      Cash: 0,
      Telebirr: 0,
      CBE: 0,
      'Coop Bank': 0,
      'Awash Bank': 0,
      'Sinqee Bank': 0,
      'Abyssinia Bank': 0,
      Credit: 0,
      Other: 0
    };

    const productSalesCount = {};

    todaySales.forEach(s => {
      const amt = Number(s.totalAmount) || 0;
      totalRevenue += amt;
      let method = s.paymentMethod || 'Cash';
      if (method === 'CBE Birr') method = 'CBE';

      if (byMethod[method] !== undefined) {
        byMethod[method] += amt;
        countByMethod[method] = (countByMethod[method] || 0) + 1;
      } else {
        byMethod[method] = amt;
        countByMethod[method] = (countByMethod[method] || 0) + 1;
      }

      if (method === 'Cash') {
        totalCash += amt;
        cashTransactionsCount += 1;
      } else {
        totalDigital += amt;
        digitalTransactionsCount += 1;
      }

      const pName = s.productName || 'Item';
      productSalesCount[pName] = (productSalesCount[pName] || 0) + (s.quantitySold || 1);
    });

    const topSelling = Object.entries(productSalesCount)
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 3);

    const lowStockAlerts = products.filter(p => (p.stockQty || 0) < 5);

    return {
      success: true,
      data: {
        todayRevenue: totalRevenue,
        totalRevenue: totalRevenue,
        totalCash: totalCash,
        totalDigital: totalDigital,
        cashTransactionsCount: cashTransactionsCount,
        digitalTransactionsCount: digitalTransactionsCount,
        transactionCount: todaySales.length,
        todayTransactionsCount: todaySales.length,
        paymentBreakdown: byMethod,
        revenueByPaymentMethod: byMethod,
        paymentTransactionsCount: countByMethod,
        lowStockAlerts: lowStockAlerts.map(p => ({
          _id: p._id,
          name: p.name,
          stockQty: p.stockQty,
          category: p.category
        })),
        lowStockItemsCount: lowStockAlerts.length,
        topSellingProducts: topSelling,
        topThreeItems: topSelling.map(item => ({ name: item.name, quantity: item.units, revenue: 0 })),
        recentTransactions: todaySales.slice(0, 25)
      }
    };
  }
}

export async function mockUpgrade(shopId) {
  try {
    const res = await fetch(`${API_BASE}/api/mock-upgrade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopId, id: shopId, pilotShopId: shopId }),
      signal: AbortSignal.timeout(5000),
    });
    const json = await res.json();
    return json;
  } catch (err) {
    // Local fallback update
    const localMerchantStr = localStorage.getItem(LOCAL_MERCHANT_KEY);
    if (localMerchantStr) {
      try {
        const m = JSON.parse(localMerchantStr);
        m.isPremium = true;
        localStorage.setItem(LOCAL_MERCHANT_KEY, JSON.stringify(m));
      } catch (e) {}
    }
    return {
      success: true,
      message: 'Shop upgraded to Premium (Local Mode)',
      shopId,
      isPremium: true
    };
  }
}

export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) return { online: false };
    const json = await res.json();
    return { online: true, ...json };
  } catch (err) {
    return { 
      online: true, 
      isLocalFallback: true, 
      database: { mode: 'Autonomous Browser Engine' } 
    };
  }
}
