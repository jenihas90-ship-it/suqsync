import express from 'express';
import { DataStore } from '../config/store.js';

const router = express.Router();

// GET /api/products - Fetch all active inventory items and stock levels
router.get('/', async (req, res) => {
  try {
    const products = await DataStore.getProducts();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/products - Register a new product into the database
router.post('/', async (req, res) => {
  try {
    const { name, price, stockQty, category, unit } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product name and selling price are required'
      });
    }

    const newProduct = await DataStore.createProduct({
      name,
      price: Number(price),
      stockQty: Number(stockQty || 0),
      category: category || 'General',
      unit: unit || 'pcs',
    });

    res.status(201).json({
      success: true,
      message: 'Product registered successfully',
      data: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/products/:id - Update product details or adjust stock
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await DataStore.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DataStore.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted', data: deleted });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
