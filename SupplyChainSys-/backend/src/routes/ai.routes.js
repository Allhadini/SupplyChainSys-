const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { authMiddleware } = require('../middleware/auth.middleware');
const aiController = require('../controllers/ai.controller');

/**
 * AI Routes
 *
 * POST /api/ai/risk-score — Compute risk score for a location/route
 */

router.post('/risk-score', authMiddleware, asyncHandler(aiController.computeRiskScore));

module.exports = router;
