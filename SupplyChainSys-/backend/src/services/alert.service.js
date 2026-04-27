const Alert = require('../models/alert.model');
const { getRedisClient, getPublisher } = require('../config/redis');
const { produceMessage } = require('../config/kafka');
const { AppError } = require('../middleware/error.middleware');
const logger = require('../utils/logger');
const {
  CACHE_TTL,
  KAFKA_TOPICS,
  ALERT_SEVERITY,
  ALERT_TYPE,
} = require('../utils/constants');

/**
 * Create and persist a new alert.
 * Also publishes to Redis pub/sub and Kafka for downstream consumers.
 */
const createAlert = async (data) => {
  logger.info(`Creating alert for shipment ${data.shipmentId} — type: ${data.type}`);

  const alert = await Alert.create({
    shipmentId: data.shipmentId,
    type: data.type || ALERT_TYPE.RISK_THRESHOLD,
    severity: data.severity || ALERT_SEVERITY.MEDIUM,
    message: data.message,
    riskScore: data.riskScore,
    metadata: data.metadata || {},
  });

  // ── Bust cache ───────────────────────────────────────────
  const redis = getRedisClient();
  if (redis) {
    await redis.del('alerts:all');
    await redis.del(`alerts:shipment:${data.shipmentId}`);
  }

  // ── Redis pub/sub notification ───────────────────────────
  const publisher = getPublisher();
  if (publisher) {
    await publisher.publish(
      'alert-notifications',
      JSON.stringify({
        alertId: alert._id,
        shipmentId: alert.shipmentId,
        severity: alert.severity,
        message: alert.message,
        timestamp: new Date().toISOString(),
      }),
    );
    logger.info(`Alert published to Redis channel: alert-notifications`);
  }

  // ── Kafka event ──────────────────────────────────────────
  await produceMessage(KAFKA_TOPICS.ALERTS, {
    event: 'ALERT_CREATED',
    alertId: alert._id,
    shipmentId: alert.shipmentId,
    severity: alert.severity,
    timestamp: new Date().toISOString(),
  });

  logger.info(`Alert created: ${alert._id}`);
  return alert;
};

/**
 * Get all alerts, newest first (with cache).
 */
const getAllAlerts = async (filters = {}) => {
  const redis = getRedisClient();
  const cacheKey = 'alerts:all';

  if (redis && Object.keys(filters).length === 0) {
    const cached = await redis.get(cacheKey);
    if (cached) {
      logger.debug('Cache HIT — alerts:all');
      return JSON.parse(cached);
    }
  }

  const query = {};
  if (filters.shipmentId) query.shipmentId = filters.shipmentId;
  if (filters.resolved !== undefined) query.resolved = filters.resolved;
  if (filters.severity) query.severity = filters.severity;

  const alerts = await Alert.find(query)
    .sort({ createdAt: -1 })
    .populate('shipmentId', 'origin destination status')
    .lean();

  if (redis && Object.keys(filters).length === 0) {
    await redis.setEx(cacheKey, CACHE_TTL.ALERT_LIST, JSON.stringify(alerts));
    logger.debug('Cache SET — alerts:all');
  }

  return alerts;
};

/**
 * Get alerts for a specific shipment.
 */
const getAlertsByShipment = async (shipmentId) => {
  const redis = getRedisClient();
  const cacheKey = `alerts:shipment:${shipmentId}`;

  if (redis) {
    const cached = await redis.get(cacheKey);
    if (cached) {
      logger.debug(`Cache HIT — ${cacheKey}`);
      return JSON.parse(cached);
    }
  }

  const alerts = await Alert.find({ shipmentId })
    .sort({ createdAt: -1 })
    .lean();

  if (redis) {
    await redis.setEx(cacheKey, CACHE_TTL.ALERT_LIST, JSON.stringify(alerts));
  }

  return alerts;
};

/**
 * Determine severity from risk score.
 */
const severityFromRisk = (riskScore) => {
  if (riskScore >= 0.9) return ALERT_SEVERITY.CRITICAL;
  if (riskScore >= 0.8) return ALERT_SEVERITY.HIGH;
  if (riskScore >= 0.7) return ALERT_SEVERITY.MEDIUM;
  return ALERT_SEVERITY.LOW;
};

module.exports = {
  createAlert,
  getAllAlerts,
  getAlertsByShipment,
  severityFromRisk,
};
