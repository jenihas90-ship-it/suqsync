import express from 'express';
import jwt from 'jsonwebtoken';
import { DataStore, getLocalPeriodBoundaries } from '../config/store.js';
import { ALLOWED_PAYMENT_METHODS } from '../models/Sale.js';

const router = express.Router();

// GET /api/sales/revenue-summary - Aggregate weekly, monthly, and yearly revenue
router.get('/revenue-summary', async (req, res) => {
  try {
    // 1. Resolve logged-in ownerId
    let ownerId = req.user?._id || req.user?.id || req.user?.ownerId || req.ownerId || req.query.ownerId || req.headers['x-owner-id'] || req.headers['owner-id'];

    if (!ownerId && req.headers.authorization) {
      try {
        const rawToken = typeof req.headers.authorization === 'string' && req.headers.authorization.startsWith('Bearer ')
          ? req.headers.authorization.slice(7).trim()
          : String(req.headers.authorization).trim();
        const decoded = jwt.decode(rawToken);
        if (decoded) {
          ownerId = decoded.ownerId || decoded._id || decoded.id || decoded.userId || decoded.sub;
        }
      } catch (e) {
        // ignore
      }
    }

    if (!ownerId) {
      const activeMerchant = await DataStore.getRegisteredMerchant();
      if (activeMerchant?._id) {
        ownerId = activeMerchant._id;
      }
    }

    // 2. Resolve client/local timezone
    const clientTz = req.query.timezone || req.headers['x-timezone'] || process.env.TIMEZONE || 'Africa/Addis_Ababa';
    const boundaries = getLocalPeriodBoundaries(clientTz);

    // 3. Compute revenue totals
    const totals = await DataStore.getRevenueSummary({ ownerId, boundaries });

    // Return strictly as { weeklyTotal: Number, monthlyTotal: Number, yearlyTotal: Number }
    return res.json({
      weeklyTotal: Number(totals.weeklyTotal || 0),
      monthlyTotal: Number(totals.monthlyTotal || 0),
      yearlyTotal: Number(totals.yearlyTotal || 0),
    });
  } catch (error) {
    console.error('Error fetching revenue summary:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/sales - List recent sales
router.get('/', async (req, res) => {
  try {
    const sales = await DataStore.getSales();
    res.json({
      success: true,
      count: sales.length,
      data: sales
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/sales/credit-summary - Daily, weekly, monthly, and yearly totals for unpaid credit
router.get('/credit-summary', async (req, res) => {
  try {
    // 1. Resolve logged-in ownerId
    let ownerId = req.user?._id || req.user?.id || req.user?.ownerId || req.ownerId || req.query.ownerId || req.headers['x-owner-id'] || req.headers['owner-id'];

    if (!ownerId && req.headers.authorization) {
      try {
        const rawToken = typeof req.headers.authorization === 'string' && req.headers.authorization.startsWith('Bearer ')
          ? req.headers.authorization.slice(7).trim()
          : String(req.headers.authorization).trim();
        const decoded = jwt.decode(rawToken);
        if (decoded) {
          ownerId = decoded.ownerId || decoded._id || decoded.id || decoded.userId || decoded.sub;
        }
      } catch (e) {
        // ignore
      }
    }

    if (!ownerId) {
      const activeMerchant = await DataStore.getRegisteredMerchant();
      if (activeMerchant?._id) {
        ownerId = activeMerchant._id;
      }
    }

    // 2. Resolve client/local timezone
    const clientTz = req.query.timezone || req.headers['x-timezone'] || process.env.TIMEZONE || 'Africa/Addis_Ababa';
    const boundaries = getLocalPeriodBoundaries(clientTz);

    // 3. Compute credit totals
    const totals = await DataStore.getCreditSummary({ ownerId, boundaries });

    return res.json({
      dailyTotal: Number(totals.dailyTotal || 0),
      weeklyTotal: Number(totals.weeklyTotal || 0),
      monthlyTotal: Number(totals.monthlyTotal || 0),
      yearlyTotal: Number(totals.yearlyTotal || 0),
    });
  } catch (error) {
    console.error('Error fetching credit summary:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/sales/credit - Fetch all unpaid credit sales
router.get('/credit', async (req, res) => {
  try {
    const creditSales = await DataStore.getCreditSales();
    res.json({
      success: true,
      count: creditSales.length,
      data: creditSales
    });
  } catch (error) {
    console.error('Error fetching credit sales:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/sales/:id/settle-credit - Settle a customer credit debt (updates paymentStatus from 'Credit' to 'Paid')
router.put('/:id/settle-credit', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Sale ID is required' });
    }

    const updatedSale = await DataStore.settleCredit(id);
    res.json({
      success: true,
      message: 'Sale debt marked as Paid successfully',
      data: updatedSale
    });
  } catch (error) {
    console.error('Error settling credit debt:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Backward-compatible alias for marking sale as paid
router.put('/:id/mark-paid', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Sale ID is required' });
    }

    const updatedSale = await DataStore.settleCredit(id);
    res.json({
      success: true,
      message: 'Sale debt marked as Paid successfully',
      data: updatedSale
    });
  } catch (error) {
    console.error('Error marking sale as paid:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// POST /api/sales - Log transaction; triggers backend stockQty reduction
router.post('/', async (req, res) => {
  try {
    const { productId, quantitySold, paymentMethod, paymentStatus = 'Paid', customerName } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }
    if (!quantitySold || Number(quantitySold) <= 0) {
      return res.status(400).json({ success: false, message: 'quantitySold must be greater than 0' });
    }

    const isCredit = paymentStatus === 'Credit';
    if (isCredit && (!customerName || !customerName.trim())) {
      return res.status(400).json({ success: false, message: 'Customer name is required for credit sales' });
    }

    // Normalize payment method if alias used (e.g. CBE Birr -> CBE)
    const rawMethod = paymentMethod || (isCredit ? 'Credit' : 'Cash');
    const normalizedMethod = rawMethod === 'CBE Birr' ? 'CBE' : rawMethod;

    if (!normalizedMethod || !ALLOWED_PAYMENT_METHODS.includes(normalizedMethod)) {
      return res.status(400).json({
        success: false,
        message: `paymentMethod must be one of: ${ALLOWED_PAYMENT_METHODS.join(', ')}`
      });
    }

    let ownerId = req.user?._id || req.user?.id || req.user?.ownerId || req.body.ownerId || req.query.ownerId || req.headers['x-owner-id'];
    if (!ownerId && req.headers.authorization) {
      try {
        const rawToken = typeof req.headers.authorization === 'string' && req.headers.authorization.startsWith('Bearer ')
          ? req.headers.authorization.slice(7).trim()
          : String(req.headers.authorization).trim();
        const decoded = jwt.decode(rawToken);
        if (decoded) {
          ownerId = decoded.ownerId || decoded._id || decoded.id || decoded.userId || decoded.sub;
        }
      } catch (err) {}
    }
    if (!ownerId) {
      const activeMerchant = await DataStore.getRegisteredMerchant();
      if (activeMerchant?._id) ownerId = activeMerchant._id;
    }

    const sale = await DataStore.recordSale({
      productId,
      quantitySold: Number(quantitySold),
      paymentMethod: normalizedMethod,
      paymentStatus: isCredit ? 'Credit' : 'Paid',
      customerName: customerName ? customerName.trim() : undefined,
      ownerId: ownerId || undefined,
    });

    res.status(201).json({
      success: true,
      message: isCredit 
        ? 'Credit transaction logged in Credit Book successfully' 
        : 'Transaction logged and inventory updated successfully',
      data: sale
    });
  } catch (error) {
    console.error('Error logging sale:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
