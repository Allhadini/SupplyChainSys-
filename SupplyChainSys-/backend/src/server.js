require('dotenv').config();

const express = require('express');
const logger = require('./utils/logger');
const connectDB = require('./config/db');
const { connectRedis, getSubscriber } = require('./config/redis');
const { connectProducer, connectConsumer } = require('./config/kafka');
const { errorMiddleware } = require('./middleware/error.middleware');
const { generateToken } = require('./middleware/auth.middleware');
const { startStreamConsumer } = require('./services/stream.service');

// ── Route imports ──────────────────────────────────────────
const shipmentRoutes = require('./routes/shipment.routes');
const aiRoutes = require('./routes/ai.routes');
const alertRoutes = require('./routes/alert.routes');
const optimizeRoutes = require('./routes/optimize.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Global middleware ──────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, _res, next) => {
  logger.info(`→ ${req.method} ${req.originalUrl}`);
  next();
});

// CORS (permissive for development)
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

// ── Health check ───────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    service: 'Atlas-Logix API Gateway',
    status: 'operational',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

/**
 * GET /api/auth/token
 *
 * Development-only convenience endpoint to generate a JWT.
 * In production this would be replaced by a proper auth flow.
 */
app.get('/api/auth/token', (req, res) => {
  const payload = {
    id: 'dev-user-001',
    role: 'admin',
    name: 'Atlas Dev',
  };
  const token = generateToken(payload);
  logger.info('[Auth] Dev token generated');
  res.status(200).json({ success: true, token });
});

const authRoutes = require('./routes/auth.routes');
const auditLogRoutes = require('./routes/auditLog.routes');

// ── API routes ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/optimize-route', optimizeRoutes);
app.use('/api/logs', auditLogRoutes);

// ── 404 handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ── Centralised error handler (must be last) ───────────────
app.use(errorMiddleware);

// ── Bootstrap ──────────────────────────────────────────────
const bootstrap = async () => {
  try {
    // 1. MongoDB
    await connectDB();

    // 2. Redis (non-critical — app works without it)
    const { subscriber } = await connectRedis();

    // Set up Redis pub/sub listener for alerts
    if (subscriber) {
      await subscriber.subscribe('alert-notifications', (message) => {
        const alert = JSON.parse(message);
        logger.info(`🔔 Redis Alert Notification: [${alert.severity}] ${alert.message}`);
      });
      logger.info('Redis subscriber listening on channel: alert-notifications');
    }

    // 3. Kafka (non-critical — graceful fallback)
    await connectProducer();
    await connectConsumer();

    // 4. Stream consumer (event-driven pipeline)
    await startStreamConsumer();

    // 5. Start HTTP server
    app.listen(PORT, () => {
      logger.info('═══════════════════════════════════════════════');
      logger.info(`  🚀 Atlas-Logix API Gateway`);
      logger.info(`  🌐 http://localhost:${PORT}`);
      logger.info(`  📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`  🔑 Dev token:   GET /api/auth/token`);
      logger.info(`  💚 Health:      GET /api/health`);
      logger.info('═══════════════════════════════════════════════');
    });
  } catch (error) {
    logger.error(`Bootstrap failed: ${error.message}`);
    process.exit(1);
  }
};

// ── Graceful shutdown ──────────────────────────────────────
const shutdown = async (signal) => {
  logger.info(`${signal} received — shutting down gracefully…`);
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled rejection: ${err.message}`);
});

bootstrap();

module.exports = app; // For testing
