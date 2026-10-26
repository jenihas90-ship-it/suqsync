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

// PUT /api/sales/:id/mark-paid - Mark a specific credit sale as Paid
router.put('/:id/mark-paid', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Sale ID is required' });
    }

    const updatedSale = await DataStore.markSalePaid(id);
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

    const sale = await DataStore.recordSale({
      productId,
      quantitySold: Number(quantitySold),
      paymentMethod: normalizedMethod,
      paymentStatus: isCredit ? 'Credit' : 'Paid',
      customerName: customerName ? customerName.trim() : undefined,
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
