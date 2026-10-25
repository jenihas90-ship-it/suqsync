import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import Sale, { ALLOWED_PAYMENT_METHODS } from '../models/Sale.js';
import User from '../models/User.js';
import Shop from '../models/Shop.js';
import { getMongoStatus } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// Helper to hash password/PIN with salt
export function hashPassword(password) {
  return crypto.createHash('sha256').update(password + '_suqsync_salt_2026').digest('hex');
}

// SuqSync starts 100% clean and empty for the merchant
const INITIAL_PRODUCTS = [];
const INITIAL_SALES = [];

function loadLocalData() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initial = { products: [], sales: [], merchant: null };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(content);
    if (!parsed.products) parsed.products = [];
    if (!parsed.sales) parsed.sales = [];
    if (!parsed.merchant) parsed.merchant = null;
    return parsed;
  } catch (err) {
    console.error('[Store] Error reading local data file:', err);
    return { products: [], sales: [], merchant: null };
  }
}

function saveLocalData(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[Store] Error writing local data file:', err);
  }
}

export const DataStore = {
  // ---- RESET ALL DATA TO FRESH STATE ----
  async resetAllData() {
    if (getMongoStatus().connected) {
      await Product.deleteMany({});
      await Sale.deleteMany({});
      await User.deleteMany({});
      console.log('[SuqSync] MongoDB wiped to clean empty state.');
    }
    const freshData = { products: [], sales: [], merchant: null };
    saveLocalData(freshData);
    console.log('[SuqSync] Local database wiped to clean empty state.');
    return freshData;
  },

  // ---- SUQ OWNER REGISTRATION & AUTH ----

  async updateShopPremium(shopId) {
    const targetId = (shopId || '').trim();
    if (getMongoStatus().connected) {
      if (Shop) {
        await Shop.updateMany(
          { $or: [{ _id: targetId }, { shopId: targetId }, { pilotShopId: targetId }, { shopName: targetId }] },
          { $set: { isPremium: true } }
        );
      }
      if (User) {
        await User.updateMany(
          { $or: [{ _id: targetId }, { pilotShopId: targetId }, { shopName: targetId }] },
          { $set: { isPremium: true } }
        );
      }
    }
    const data = loadLocalData();
    if (data.merchant) {
      data.merchant.isPremium = true;
      data.merchant.updatedAt = new Date().toISOString();
      saveLocalData(data);
    }
    return { shopId: targetId, isPremium: true };
  },

  async getRegisteredMerchant() {
    if (getMongoStatus().connected) {
      const user = await User.findOne().sort({ createdAt: -1 });
      if (!user) return null;
      const { passwordHash, ...safe } = user.toObject();
      return safe;
    }
    const data = loadLocalData();
    if (!data.merchant) return null;
    const { passwordHash, ...safe } = data.merchant;
    return safe;
  },

  async registerMerchant(merchantData) {
    const {
      fullName,
      phoneNumber,
      password,
      nationalIdOrFayda,
      shopName,
      businessType,
      tinNumber,
      tradeLicenseNo,
      region,
      city,
      subcityOrZone,
      woreda,
      specificLocation,
      telebirrMerchantId,
      telebirrPhone,
      primaryBank,
      bankAccountNumber
    } = merchantData;

    if (!fullName || !phoneNumber || !shopName || !password) {
      throw new Error('Full Name, Phone Number, Shop Name, and PIN/Password are required');
    }

    const passwordHash = hashPassword(password);
    const pilotShopId = 'SUQ-ETH-' + String(Math.floor(100 + Math.random() * 900));

    if (getMongoStatus().connected) {
      const existing = await User.findOne({ phoneNumber: phoneNumber.trim() });
      if (existing) {
        throw new Error(`Merchant with phone ${phoneNumber} is already registered. Please log in.`);
      }

      const user = new User({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        passwordHash,
        nationalIdOrFayda: nationalIdOrFayda?.trim() || '',
        shopName: shopName.trim(),
        businessType: businessType || 'Retail Kiosk (Suq)',
        tinNumber: tinNumber?.trim() || '',
        tradeLicenseNo: tradeLicenseNo?.trim() || '',
        region: region?.trim() || 'Addis Ababa',
        city: city?.trim() || 'Addis Ababa',
        subcityOrZone: subcityOrZone?.trim() || 'Bole Subcity',
        woreda: woreda?.trim() || 'Woreda 03',
        specificLocation: specificLocation?.trim() || '',
        telebirrMerchantId: telebirrMerchantId?.trim() || '',
        telebirrPhone: telebirrPhone?.trim() || phoneNumber.trim(),
        primaryBank: primaryBank || 'CBE',
        bankAccountNumber: bankAccountNumber?.trim() || '',
        pilotShopId,
        isRegistered: true,
      });

      const saved = await user.save();
      const { passwordHash: _, ...safeUser } = saved.toObject();
      return safeUser;
    }

    // Local Store Logic
    const data = loadLocalData();
    const newMerchant = {
      _id: 'user_' + Date.now(),
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      passwordHash,
      nationalIdOrFayda: nationalIdOrFayda?.trim() || '',
      shopName: shopName.trim(),
      businessType: businessType || 'Retail Kiosk (Suq)',
      tinNumber: tinNumber?.trim() || '',
      tradeLicenseNo: tradeLicenseNo?.trim() || '',
      region: region?.trim() || 'Addis Ababa',
      city: city?.trim() || 'Addis Ababa',
      subcityOrZone: subcityOrZone?.trim() || 'Bole Subcity',
      woreda: woreda?.trim() || 'Woreda 03',
      specificLocation: specificLocation?.trim() || '',
      telebirrMerchantId: telebirrMerchantId?.trim() || '',
      telebirrPhone: telebirrPhone?.trim() || phoneNumber.trim(),
      primaryBank: primaryBank || 'CBE',
      bankAccountNumber: bankAccountNumber?.trim() || '',
      pilotShopId,
      isRegistered: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.merchant = newMerchant;
    saveLocalData(data);

    const { passwordHash: _, ...safeUser } = newMerchant;
    return safeUser;
  },

  async loginMerchant({ identifier, phoneNumber, fullName, password }) {
    const rawId = (identifier || fullName || phoneNumber || '').trim();
    if (!rawId || !password) {
      throw new Error('Owner name or phone number and PIN/password are required');
    }

    const passwordHash = hashPassword(password);
    const cleanId = rawId.toLowerCase();
    const cleanDigits = rawId.replace(/\D/g, '');

    if (getMongoStatus().connected) {
      const escapedQuery = cleanId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const conditions = [
        { fullName: { $regex: new RegExp(`^${escapedQuery}$`, 'i') } },
        { phoneNumber: rawId },
        { phoneNumber: cleanId }
      ];

      if (cleanDigits.length >= 8) {
        const last8 = cleanDigits.slice(-8);
        conditions.push({ phoneNumber: { $regex: new RegExp(`${last8}$`) } });
      }

      const user = await User.findOne({ $or: conditions });
      if (!user) {
        throw new Error(`No registered owner found matching "${rawId}". Please check your name or phone number.`);
      }
      if (user.passwordHash !== passwordHash) {
        throw new Error('Invalid security PIN or password. Please try again.');
      }
      const { passwordHash: _, ...safeUser } = user.toObject();
      return safeUser;
    }

    const data = loadLocalData();
    if (!data.merchant) {
      throw new Error('No registered suq owner found. Please register first.');
    }

    const m = data.merchant;
    const mName = (m.fullName || '').trim().toLowerCase();
    const mPhone = (m.phoneNumber || '').trim().toLowerCase();
    const mDigits = mPhone.replace(/\D/g, '');

    const nameMatches = mName === cleanId;
    const phoneMatches = mPhone === cleanId ||
                         (cleanDigits.length >= 8 && mDigits.endsWith(cleanDigits.slice(-8)));

    if (!nameMatches && !phoneMatches) {
      throw new Error(`Owner "${rawId}" not found. Please check your registered name or phone number.`);
    }

    if (m.passwordHash !== passwordHash) {
      throw new Error('Invalid security PIN or password. Please try again.');
    }

    const { passwordHash: _, ...safeUser } = m;
    return safeUser;
  },

  async resetMerchantPassword({ identifier, verificationKey, newPassword }) {
    const rawId = (identifier || '').trim();
    if (!rawId) throw new Error('Owner name or phone number is required');
    if (!newPassword || newPassword.length < 4) throw new Error('New password must be at least 4 digits');

    const cleanId = rawId.toLowerCase();
    const cleanDigits = rawId.replace(/\D/g, '');
    const cleanVerify = (verificationKey || '').trim().toLowerCase();
    const newHash = hashPassword(newPassword);

    if (getMongoStatus().connected) {
      const escapedQuery = cleanId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const conditions = [
        { fullName: { $regex: new RegExp(`^${escapedQuery}$`, 'i') } },
        { phoneNumber: rawId },
        { phoneNumber: cleanId }
      ];
      if (cleanDigits.length >= 8) {
        conditions.push({ phoneNumber: { $regex: new RegExp(`${cleanDigits.slice(-8)}$`) } });
      }

      const user = await User.findOne({ $or: conditions });
      if (!user) {
        throw new Error(`Owner "${rawId}" not found. Please enter your registered name or phone.`);
      }

      if (user.nationalIdOrFayda && cleanVerify) {
        const verifyDigits = cleanVerify.replace(/\D/g, '');
        const matchesFayda = user.nationalIdOrFayda.toLowerCase() === cleanVerify;
        const matchesPhone = verifyDigits.length >= 8 && user.phoneNumber.replace(/\D/g, '').endsWith(verifyDigits.slice(-8));
        if (!matchesFayda && !matchesPhone) {
          throw new Error('Verification details (National ID / Phone) do not match our records.');
        }
      }

      user.passwordHash = newHash;
      user.updatedAt = new Date();
      await user.save();

      const { passwordHash: _, ...safeUser } = user.toObject();
      return safeUser;
    }

    const data = loadLocalData();
    if (!data.merchant) {
      throw new Error('No registered owner found in system');
    }

    const m = data.merchant;
    const mName = (m.fullName || '').trim().toLowerCase();
    const mPhone = (m.phoneNumber || '').trim().toLowerCase();
    const mDigits = mPhone.replace(/\D/g, '');

    const nameMatches = mName === cleanId;
    const phoneMatches = mPhone === cleanId || (cleanDigits.length >= 8 && mDigits.endsWith(cleanDigits.slice(-8)));

    if (!nameMatches && !phoneMatches) {
      throw new Error(`Owner "${rawId}" not found. Please check your registered name or phone number.`);
    }

    if (m.nationalIdOrFayda && cleanVerify) {
      const verifyDigits = cleanVerify.replace(/\D/g, '');
      const matchesFayda = m.nationalIdOrFayda.toLowerCase().trim() === cleanVerify;
      const matchesPhone = verifyDigits.length >= 8 && mDigits.endsWith(verifyDigits.slice(-8));
      if (!matchesFayda && !matchesPhone) {
        throw new Error('Verification details (National ID / Phone) do not match our records.');
      }
    }

    m.passwordHash = newHash;
    m.updatedAt = new Date().toISOString();
    saveLocalData(data);

    const { passwordHash: _, ...safeUser } = m;
    return safeUser;
  },

  async updateMerchantProfile(updates) {
    if (getMongoStatus().connected) {
      const user = await User.findOne().sort({ createdAt: -1 });
      if (!user) throw new Error('No registered merchant to update');
      Object.assign(user, updates);
      await user.save();
      const { passwordHash: _, ...safeUser } = user.toObject();
      return safeUser;
    }

    const data = loadLocalData();
    if (!data.merchant) throw new Error('No registered merchant to update');
    data.merchant = {
      ...data.merchant,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveLocalData(data);
    const { passwordHash: _, ...safeUser } = data.merchant;
    return safeUser;
  },

  // ---- PRODUCTS & INVENTORY ----

  async getProducts() {
    if (getMongoStatus().connected) {
      return await Product.find().sort({ createdAt: -1 });
    }
    const data = loadLocalData();
    return data.products;
  },

  async getProductById(id) {
    if (getMongoStatus().connected) {
      return await Product.findById(id);
    }
    const data = loadLocalData();
    return data.products.find(p => p._id === id || p.id === id) || null;
  },

  async createProduct({ name, price, stockQty, category, unit }) {
    if (getMongoStatus().connected) {
      const prod = new Product({
        name,
        price: Number(price),
        stockQty: Number(stockQty || 0),
        category: category || 'General',
        unit: unit || 'pcs',
      });
      return await prod.save();
    }
    const data = loadLocalData();
    const newProduct = {
      _id: 'prod_' + Date.now(),
      name: name.trim(),
      price: Number(price),
      stockQty: Number(stockQty || 0),
      category: category || 'General',
      unit: unit || 'pcs',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.products.unshift(newProduct);
    saveLocalData(data);
    return newProduct;
  },

  async updateProduct(id, updates) {
    if (getMongoStatus().connected) {
      return await Product.findByIdAndUpdate(id, updates, { new: true });
    }
    const data = loadLocalData();
    const idx = data.products.findIndex(p => p._id === id || p.id === id);
    if (idx === -1) return null;
    data.products[idx] = {
      ...data.products[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveLocalData(data);
    return data.products[idx];
  },

  async deleteProduct(id) {
    if (getMongoStatus().connected) {
      return await Product.findByIdAndDelete(id);
    }
    const data = loadLocalData();
    const idx = data.products.findIndex(p => p._id === id || p.id === id);
    if (idx === -1) return null;
    const removed = data.products.splice(idx, 1)[0];
    saveLocalData(data);
    return removed;
  },

  // ---- SALES & POS ----

  async recordSale({ productId, quantitySold, paymentMethod }) {
    const qty = Number(quantitySold);
    if (!qty || qty <= 0) {
      throw new Error('Quantity sold must be greater than 0');
    }

    const method = paymentMethod === 'CBE Birr' ? 'CBE' : paymentMethod;

    if (getMongoStatus().connected) {
      const product = await Product.findById(productId);
      if (!product) throw new Error('Product not found');
      if (product.stockQty < qty) {
        throw new Error(`Insufficient stock. Available: ${product.stockQty}, Requested: ${qty}`);
      }
      product.stockQty -= qty;
      await product.save();

      const totalAmount = product.price * qty;
      const sale = new Sale({
        productId: product._id,
        productName: product.name,
        quantitySold: qty,
        unitPrice: product.price,
        totalAmount,
        paymentMethod: method,
      });
      return await sale.save();
    }

    const data = loadLocalData();
    const product = data.products.find(p => p._id === productId || p.id === productId);
    if (!product) throw new Error('Product not found');
    if (product.stockQty < qty) {
      throw new Error(`Insufficient stock. Available: ${product.stockQty}, Requested: ${qty}`);
    }

    product.stockQty -= qty;
    product.updatedAt = new Date().toISOString();

    const totalAmount = product.price * qty;
    const newSale = {
      _id: 'sale_' + Date.now(),
      productId: product._id,
      productName: product.name,
      quantitySold: qty,
      unitPrice: product.price,
      totalAmount,
      paymentMethod: method,
      createdAt: new Date().toISOString()
    };
    data.sales.unshift(newSale);
    saveLocalData(data);
    return newSale;
  },

  async getSales() {
    if (getMongoStatus().connected) {
      return await Sale.find().sort({ createdAt: -1 });
    }
    const data = loadLocalData();
    return data.sales;
  },

  // ---- DASHBOARD & RECONCILIATION ----

  async getDailyDashboard() {
    let sales = [];
    let products = [];

    if (getMongoStatus().connected) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      sales = await Sale.find({
        createdAt: { $gte: startOfDay }
      }).sort({ createdAt: -1 });

      products = await Product.find();
    } else {
      const data = loadLocalData();
      const todayStr = new Date().toISOString().slice(0, 10);
      sales = (data.sales || []).filter(s => {
        const d = (s.createdAt ? new Date(s.createdAt) : new Date()).toISOString().slice(0, 10);
        return d === todayStr;
      });
      products = data.products || [];
    }

    let totalRevenue = 0;
    let totalCash = 0;
    let totalDigital = 0;

    const paymentBreakdown = {
      Cash: 0,
      Telebirr: 0,
      CBE: 0,
      'Coop Bank': 0,
      'Awash Bank': 0,
      'Sinqee Bank': 0,
      'Abyssinia Bank': 0,
      Other: 0,
    };

    const itemSalesMap = {};

    for (const sale of sales) {
      const amt = Number(sale.totalAmount) || 0;
      totalRevenue += amt;

      let method = sale.paymentMethod || 'Cash';
      if (method === 'CBE Birr') method = 'CBE';

      if (paymentBreakdown[method] !== undefined) {
        paymentBreakdown[method] += amt;
      } else {
        paymentBreakdown[method] = amt;
      }

      if (method === 'Cash') {
        totalCash += amt;
      } else {
        totalDigital += amt;
      }

      const pName = sale.productName || 'Unknown Product';
      if (!itemSalesMap[pName]) {
        itemSalesMap[pName] = { name: pName, quantity: 0, revenue: 0 };
      }
      itemSalesMap[pName].quantity += Number(sale.quantitySold) || 0;
      itemSalesMap[pName].revenue += amt;
    }

    const topThreeItems = Object.values(itemSalesMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 3);

    const lowStockItems = products.filter(p => (Number(p.stockQty) || 0) < 5);

    return {
      date: new Date().toISOString().slice(0, 10),
      totalRevenue,
      totalCash,
      totalDigital,
      transactionCount: sales.length,
      paymentBreakdown,
      topThreeItems,
      lowStockItemsCount: lowStockItems.length,
      lowStockItems: lowStockItems.map(p => ({
        _id: p._id,
        name: p.name,
        stockQty: p.stockQty,
        price: p.price
      })),
      recentTransactions: sales.slice(0, 15)
    };
  },

  async seedMongoIfEmpty() {
    // Intentionally empty: starts fresh with user input
  }
};
