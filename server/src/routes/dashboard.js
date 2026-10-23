import express from 'express';
import { DataStore } from '../config/store.js';
import { getMongoStatus } from '../config/db.js';

const router = express.Router();

// GET /api/dashboard/daily - Aggregate total revenue by payment method for today
router.get('/daily', async (req, res) => {
  try {
    const dashboardData = await DataStore.getDailyDashboard();
    res.json({
      success: true,
      storageStatus: getMongoStatus(),
      data: dashboardData
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
