import express from 'express';
import { DataStore } from '../config/store.js';
import { ALLOWED_PAYMENT_METHODS } from '../models/Sale.js';

const router = express.Router();

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

// POST /api/sales - Log transaction; triggers backend stockQty reduction
router.post('/', async (req, res) => {
  try {
    const { productId, quantitySold, paymentMethod } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }
    if (!quantitySold || Number(quantitySold) <= 0) {
      return res.status(400).json({ success: false, message: 'quantitySold must be at least 1' });
    }

    // Normalize payment method if alias used (e.g. CBE Birr -> CBE)
    const normalizedMethod = paymentMethod === 'CBE Birr' ? 'CBE' : paymentMethod;

    if (!normalizedMethod || !ALLOWED_PAYMENT_METHODS.includes(normalizedMethod)) {
      return res.status(400).json({
        success: false,
        message: `paymentMethod must be one of: ${ALLOWED_PAYMENT_METHODS.join(', ')}`
      });
    }

    const sale = await DataStore.recordSale({
      productId,
      quantitySold: Number(quantitySold),
      paymentMethod: normalizedMethod,
    });

    res.status(201).json({
      success: true,
      message: 'Transaction logged and inventory updated successfully',
      data: sale
    });
  } catch (error) {
    console.error('Error logging sale:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
