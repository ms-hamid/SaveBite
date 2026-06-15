import './config/env.js';

import express from 'express';
import cors from 'cors';
import auth_route from './routes/auth.route.js';
import listing_route from './routes/merchant/listing.route.js';
import order_route from './routes/consumer/order.route.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { orderTimeoutJob } from './jobs/orderTimeout.job.js';


const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'SaveBite API is running 🚀', status: 'ok' });
});

app.use('/auth', auth_route);
app.use('/listing', listing_route);
app.use('/order', order_route);

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ─── 404 fallback ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global error handler (MUST be last) ─────────────────────────────────────
app.use(globalErrorHandler);


// ─── Listen ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);

  // ─── Background Jobs ────────────────────────────────────────────────────────
  // Initialise persistent cron jobs AFTER server is ready.
  // These require a 24/7 container host (Railway, Render, VPS) — they CANNOT
  // run on Vercel serverless functions which are stateless and ephemeral.
  orderTimeoutJob(); // FR-S-02: auto-cancel PENDING_PAYMENT orders > 15 min
  console.log('⏰ Background jobs initialised (orderTimeoutJob)');
});

export default app;
