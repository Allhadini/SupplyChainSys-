const { createClient } = require('redis');
const logger = require('../utils/logger');

let redisClient = null;
let publisher = null;
let subscriber = null;

/**
 * Initialise the main Redis client plus dedicated pub/sub clients.
 * Redis v4 client uses lazy-connect — we must explicitly call .connect().
 */
const connectRedis = async () => {
  try {
    // ── Main client (caching) ──────────────────────────────
    redisClient = createClient({ url: process.env.REDIS_URL });

    redisClient.on('error', (err) => logger.error(`Redis client error: ${err.message}`));
    redisClient.on('reconnecting', () => logger.warn('Redis client reconnecting…'));

    await redisClient.connect();
    logger.info('Redis main client connected');

    // ── Publisher ──────────────────────────────────────────
    publisher = redisClient.duplicate();
    await publisher.connect();
    logger.info('Redis publisher connected');

    // ── Subscriber ─────────────────────────────────────────
    subscriber = redisClient.duplicate();
    await subscriber.connect();
    logger.info('Redis subscriber connected');

    return { redisClient, publisher, subscriber };
  } catch (error) {
    logger.warn(`Redis connection failed: ${error.message} - Running in fallback mode`);
    // Stop reconnecting to prevent log spam
    if (redisClient) await redisClient.disconnect().catch(()=>{});
    if (publisher) await publisher.disconnect().catch(()=>{});
    if (subscriber) await subscriber.disconnect().catch(()=>{});
    
    // Redis is non-critical — we log and continue (graceful degradation)
    return { redisClient: null, publisher: null, subscriber: null };
  }
};

/**
 * Retrieve the singleton clients.  Returns nulls if Redis is unavailable.
 */
const getRedisClient = () => redisClient;
const getPublisher = () => publisher;
const getSubscriber = () => subscriber;

module.exports = {
  connectRedis,
  getRedisClient,
  getPublisher,
  getSubscriber,
};
