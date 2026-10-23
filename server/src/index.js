import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getMongoStatus } from './config/db.js';
import { DataStore } from './config/store.js';
import productsRouter from './routes/products.js';
import salesRouter from './routes/sales.js';
import dashboardRouter from './routes/dashboard.js';
import authRouter from './routes/auth.js';

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

// Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/sales', salesRouter);
app.use('/api/dashboard', dashboardRouter);

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

  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(` 🇪🇹 SuqSync Backend Server v1.0 (MVP)`);
    console.log(` Running on port: http://localhost:${PORT}`);
    console.log(` Mode: ${getMongoStatus().mode}`);
    console.log(` Endpoints:`);
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

startServer();
