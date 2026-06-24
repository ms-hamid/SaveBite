import './config/env.js';

import express from 'express';
import cors from 'cors';
import auth_route from './routes/auth.route.js';
import listing_route from './routes/merchant/listing.route.js';
import order_route from './routes/consumer/order.route.js';
import user_route from './routes/user.route.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import payment_route from './routes/payment.route.js';
import withdrawal_route from './routes/merchant/withdrawal.route.js';
import cookieParser from 'cookie-parser';
import { startCronJobs } from './cron/index.js';
import notification_route from './routes/notification.route.js';

const app = express();
const PORT = process.env.PORT || 5000;

startCronJobs();


// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', "http://192.168.100.135:3000", "https://backtalk-tapered-slightly.ngrok-free.dev"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'SaveBite API is running 🚀', status: 'ok' });
});

app.use('/auth', auth_route);
app.use('/listing', listing_route);
app.use('/order', order_route);
app.use('/api/users', user_route);
app.use('/payment', payment_route);
app.use('/withdrawal', withdrawal_route);
app.use('/api/notifications', notification_route);



// Notifications are handled under /api/notifications using PostgreSQL database token storage


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
});

export default app;
