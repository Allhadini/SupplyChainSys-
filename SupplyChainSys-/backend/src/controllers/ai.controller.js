const aiService = require('../services/ai.service');
const logger = require('../utils/logger');

/**
 * POST /api/ai/risk-score
 *
 * Standalone endpoint to compute a risk score for arbitrary inputs.
 * Useful for dashboards and ad-hoc analysis.
 */
const computeRiskScore = async (req, res) => {
  const { location, route, conditions } = req.body;

  if (!location || typeof location.lat !== 'number' || typeof location.long !== 'number') {
    return res.status(400).json({
      success: false,
      error: 'location with numeric lat and long is required.',
    });
  }

  logger.info(`[AI Controller] Risk score requested for (${location.lat}, ${location.long})`);

  const result = await aiService.computeRiskScore({
    location,
    route: route || [],
    conditions: conditions || {},
  });

  res.status(200).json({
    success: true,
    data: {
      riskScore: result.riskScore,
      reason: result.reason,
    },
  });
};

module.exports = { computeRiskScore };
