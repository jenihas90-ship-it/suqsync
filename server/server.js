import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB, getMongoStatus } from './src/config/db.js';
import { DataStore } from './src/config/store.js';
import Shop from './src/models/Shop.js';
import User from './src/models/User.js';
import productsRouter from './src/routes/products.js';
import salesRouter from './src/routes/sales.js';
import dashboardRouter from './src/routes/dashboard.js';
import authRouter from './src/routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/sales', salesRouter);
app.use('/api/dashboard', dashboardRouter);

/**
 * POST /api/mock-upgrade
 * 
 * Mock Telebirr payment upgrade endpoint.
 * Takes a shop ID, finds the shop in MongoDB, updates isPremium to true,
 * and returns a success message.
 */
app.post('/api/mock-upgrade', async (req, res) => {
  try {
    const { shopId, id, pilotShopId, shop_id } = req.body || {};
    const targetShopId = (shopId || id || pilotShopId || shop_id || req.query?.shopId || '').toString().trim();

    if (!targetShopId) {
      return res.status(400).json({
        success: false,
        message: 'Shop ID is required'
      });
    }

    let updatedShop = null;

    // 1. If MongoDB is connected, find and update in MongoDB
    if (mongoose.connection.readyState === 1) {
      try {
        const isObjectId = mongoose.Types.ObjectId.isValid(targetShopId);
        const query = isObjectId
          ? { $or: [{ _id: targetShopId }, { shopId: targetShopId }, { pilotShopId: targetShopId }, { shopName: targetShopId }] }
          : { $or: [{ shopId: targetShopId }, { pilotShopId: targetShopId }, { shopName: targetShopId }] };

        updatedShop = await Shop.findOneAndUpdate(
          query,
          { $set: { isPremium: true } },
          { new: true }
        );
      } catch (e) {
        console.warn('[MockUpgrade] Shop query note:', e.message);
      }

      // 2. Try finding and updating in MongoDB User collection (stores merchant/shop info)
      if (!updatedShop) {
        try {
          const isObjectId = mongoose.Types.ObjectId.isValid(targetShopId);
          const query = isObjectId
            ? { $or: [{ _id: targetShopId }, { pilotShopId: targetShopId }, { shopName: targetShopId }] }
            : { $or: [{ pilotShopId: targetShopId }, { shopName: targetShopId }] };

          updatedShop = await User.findOneAndUpdate(
            query,
            { $set: { isPremium: true } },
            { new: true }
          );
        } catch (e) {
          console.warn('[MockUpgrade] User query note:', e.message);
        }
      }

      // 3. If no document existed in MongoDB, create one so the test record is saved
      if (!updatedShop) {
        try {
          updatedShop = await Shop.create({
            shopId: targetShopId,
            pilotShopId: targetShopId,
            shopName: `SuqSync Shop (${targetShopId})`,
            isPremium: true
          });
        } catch (e) {
          console.warn('[MockUpgrade] Shop creation note:', e.message);
        }
      }
    }

    // 4. Update local fallback data store
    try {
      await DataStore.updateShopPremium(targetShopId);
    } catch (e) {
      // ignore
    }

    return res.status(200).json({
      success: true,
      message: 'Shop successfully upgraded to Premium!',
      shopId: targetShopId,
      isPremium: true,
      shop: updatedShop
    });
  } catch (err) {
    console.error('Mock upgrade error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to upgrade shop'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'SuqSync Backend API',
    version: '1.0.0-MVP',
    target: 'Innobiz-K Incubation Pitch',
    database: getMongoStatus(),
    timestamp: new Date().toISOString()
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.send('SuqSync API Server is running. Access /api/auth, /api/products, /api/sales, and /api/dashboard/daily.');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Initialize database & start server
const startServer = async () => {
  await connectDB();
  await DataStore.seedMongoIfEmpty();

  return app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(` 🇪🇹 SuqSync Backend Server v1.0 (MVP)`);
    console.log(` Running on port: http://localhost:${PORT}`);
    console.log(` Mode: ${getMongoStatus().mode}`);
    console.log(` Endpoints:`);
    console.log(`  - POST /api/mock-upgrade (Telebirr Mock Upgrade)`);
    console.log(`  - POST /api/auth/register (Suq Owner Registration)`);
    console.log(`  - POST /api/auth/login`);
    console.log(`  - GET  /api/auth/status`);
    console.log(`  - GET  /api/products`);
    console.log(`  - POST /api/products`);
    console.log(`  - POST /api/sales`);
    console.log(`  - GET  /api/dashboard/daily`);
    console.log(`=========================================`);
  });
};

// Start server if run directly
const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('server.js') || 
  process.argv[1].endsWith('server')
);
if (isDirectRun && process.env.NODE_ENV !== 'test') {
  startServer();
}

export { app, startServer };
export default app;
