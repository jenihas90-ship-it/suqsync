const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ---- AUTH & SUQ OWNER REGISTRATION ----

export async function checkAuthStatus() {
  try {
    const res = await fetch(`${API_BASE}/api/auth/status`);
    if (!res.ok) return { isRegistered: false, merchant: null };
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('Failed to check auth status:', err);
    return { isRegistered: false, merchant: null };
  }
}

export async function registerMerchant(merchantData) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(merchantData),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Registration failed');
  }
  return json.merchant;
}

export async function loginMerchant({ phoneNumber, password }) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, password }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Login failed');
  }
  return json.merchant;
}

export async function updateMerchantProfileApi(updates) {
  const res = await fetch(`${API_BASE}/api/auth/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Update failed');
  }
  return json.merchant;
}

// ---- PRODUCTS ----

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = await res.json();
  return json.data || [];
}

export async function createProduct(productData) {
  const res = await fetch(`${API_BASE}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to create product');
  }
  return json.data;
}

export async function updateProduct(id, updates) {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to update product');
  }
  return json.data;
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to delete product');
  }
  return json.data;
}

// ---- SALES ----

export async function recordSale({ productId, quantitySold, paymentMethod }) {
  const res = await fetch(`${API_BASE}/api/sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantitySold, paymentMethod }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to record transaction');
  }
  return json.data;
}

// ---- DASHBOARD & HEALTH ----

export async function fetchDailyDashboard() {
  const res = await fetch(`${API_BASE}/api/dashboard/daily`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = await res.json();
  return json;
}

export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) return { online: false };
    const json = await res.json();
    return { online: true, ...json };
  } catch (err) {
    return { online: false, error: err.message };
  }
}
