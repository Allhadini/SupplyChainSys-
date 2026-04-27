const axios = require('axios');
const { getRedisClient } = require('../config/redis');
const logger = require('../utils/logger');
const { CACHE_TTL } = require('../utils/constants');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Call the external Python AI service to compute a risk score.
 *
 * If the external service is unreachable, falls back to a deterministic
 * mock so the rest of the pipeline keeps working during local dev.
 *
 * @param {Object} params
 * @param {Object} params.location   — { lat, long }
 * @param {Array}  params.route      — route nodes
 * @param {Object} params.conditions — external conditions (weather, traffic, etc.)
 * @returns {{ riskScore: number, reason: string }}
 */
const computeRiskScore = async ({ location, route, conditions = {} }) => {
  const redis = getRedisClient();
  const cacheKey = `risk:${location.lat}:${location.long}`;

  // ── Check cache ──────────────────────────────────────────
  if (redis) {
    const cached = await redis.get(cacheKey);
    if (cached) {
      logger.debug(`Cache HIT — ${cacheKey}`);
      return JSON.parse(cached);
    }
  }

  let result;

  try {
    logger.info(`Calling AI Risk service: ${AI_SERVICE_URL}/api/risk-score`);
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/risk-score`,
      { location, route, conditions },
      { timeout: 5000 },
    );
    result = response.data;
    logger.info(`AI Risk service responded — score: ${result.riskScore}`);
  } catch (error) {
    logger.warn(`AI service unreachable, using mock risk engine: ${error.message}`);
    result = generateMockRiskScore(location, route);
  }

  // ── Populate cache ───────────────────────────────────────
  if (redis) {
    await redis.setEx(cacheKey, CACHE_TTL.RISK_SCORE, JSON.stringify(result));
    logger.debug(`Cache SET — ${cacheKey}`);
  }

  return result;
};

/**
 * Deterministic mock risk engine for local development.
 * Uses lat/long hashing to produce a repeatable score.
 */
const generateMockRiskScore = (location, route = []) => {
  // Simple hash-based risk — deterministic for same inputs
  const seed = Math.abs(
    Math.sin(location.lat * 12.9898 + location.long * 78.233) * 43758.5453,
  );
  const baseRisk = seed - Math.floor(seed); // 0..1

  // Route complexity adds some risk
  const routeComplexity = Math.min(route.length * 0.03, 0.15);

  const riskScore = parseFloat(Math.min(baseRisk + routeComplexity, 1).toFixed(2));

  const reasons = [
    'Weather disruption + congestion detected',
    'Port congestion at destination hub',
    'Geopolitical risk in transit corridor',
    'Seasonal demand surge causing delays',
    'Carrier capacity constraints observed',
    'Low risk — smooth transit expected',
  ];

  // Pick reason based on score
  let reason;
  if (riskScore > 0.8) reason = reasons[0];
  else if (riskScore > 0.7) reason = reasons[1];
  else if (riskScore > 0.5) reason = reasons[2];
  else if (riskScore > 0.3) reason = reasons[3];
  else if (riskScore > 0.15) reason = reasons[4];
  else reason = reasons[5];

  return { riskScore, reason };
};

module.exports = { computeRiskScore };
