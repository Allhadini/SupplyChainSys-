const optimizationService = require('../services/optimization.service');
const logger = require('../utils/logger');

/**
 * POST /api/optimize-route
 *
 * Standalone route optimization endpoint.
 * Accepts origin, destination, current route, and location.
 */
const optimizeRoute = async (req, res) => {
  const { origin, destination, currentRoute, currentLocation } = req.body;

  if (!origin || !destination) {
    return res.status(400).json({
      success: false,
      error: 'origin and destination are required.',
    });
  }

  logger.info(`[Optimize Controller] Route optimization: ${origin} → ${destination}`);

  const result = await optimizationService.optimizeRoute({
    origin,
    destination,
    currentRoute: currentRoute || [],
    currentLocation: currentLocation || {},
  });

  res.status(200).json({
    success: true,
    data: {
      newRoute: result.newRoute,
      cost: result.cost,
      delaySaved: result.delaySaved,
    },
  });
};

module.exports = { optimizeRoute };
