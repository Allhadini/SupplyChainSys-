const Shipment = require('../models/shipment.model');
const { getRedisClient } = require('../config/redis');
const { produceMessage } = require('../config/kafka');
const { AppError } = require('../middleware/error.middleware');
const logger = require('../utils/logger');
const { CACHE_TTL, KAFKA_TOPICS, SHIPMENT_STATUS } = require('../utils/constants');

/**
 * Create a new shipment and persist it to MongoDB.
 */
const createShipment = async (data) => {
  logger.info(`Creating shipment: ${data.origin} → ${data.destination}`);

  const shipment = await Shipment.create({
    origin: data.origin,
    destination: data.destination,
    currentLocation: data.currentLocation,
    route: data.route || [],
    status: data.status || SHIPMENT_STATUS.PENDING,
  });

  // Invalidate list cache
  const redis = getRedisClient();
  if (redis) {
    await redis.del('shipments:all');
  }

  // Publish to Kafka
  await produceMessage(KAFKA_TOPICS.SHIPMENT_UPDATES, {
    event: 'SHIPMENT_CREATED',
    shipmentId: shipment._id,
    timestamp: new Date().toISOString(),
  });

  logger.info(`Shipment created: ${shipment._id}`);
  return shipment;
};

/**
 * Get all shipments (with optional Redis cache).
 */
const getAllShipments = async () => {
  const redis = getRedisClient();

  // Try cache first
  if (redis) {
    const cached = await redis.get('shipments:all');
    if (cached) {
      logger.debug('Cache HIT — shipments:all');
      return JSON.parse(cached);
    }
  }

  const shipments = await Shipment.find().sort({ createdAt: -1 }).lean();

  // Populate cache
  if (redis) {
    await redis.setEx('shipments:all', CACHE_TTL.SHIPMENT, JSON.stringify(shipments));
    logger.debug('Cache SET — shipments:all');
  }

  return shipments;
};

/**
 * Get a single shipment by ID.
 */
const getShipmentById = async (id) => {
  const redis = getRedisClient();
  const cacheKey = `shipment:${id}`;

  if (redis) {
    const cached = await redis.get(cacheKey);
    if (cached) {
      logger.debug(`Cache HIT — ${cacheKey}`);
      return JSON.parse(cached);
    }
  }

  const shipment = await Shipment.findById(id).lean();
  if (!shipment) {
    throw new AppError(`Shipment not found: ${id}`, 404);
  }

  if (redis) {
    await redis.setEx(cacheKey, CACHE_TTL.SHIPMENT, JSON.stringify(shipment));
  }

  return shipment;
};

/**
 * Update shipment fields and bust relevant caches.
 */
const updateShipment = async (id, updates) => {
  const shipment = await Shipment.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).lean();

  if (!shipment) {
    throw new AppError(`Shipment not found: ${id}`, 404);
  }

  // Bust caches
  const redis = getRedisClient();
  if (redis) {
    await redis.del(`shipment:${id}`);
    await redis.del('shipments:all');
  }

  logger.info(`Shipment updated: ${id}`);
  return shipment;
};

module.exports = {
  createShipment,
  getAllShipments,
  getShipmentById,
  updateShipment,
};
