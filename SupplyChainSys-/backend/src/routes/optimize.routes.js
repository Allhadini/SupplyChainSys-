const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { authMiddleware } = require('../middleware/auth.middleware');
const optimizeController = require('../controllers/optimize.controller');

/**
 * Optimization Routes
 *
 * POST /api/optimize-route — Optimize a shipment route
 */

router.post('/', authMiddleware, asyncHandler(optimizeController.optimizeRoute));

module.exports = router;
