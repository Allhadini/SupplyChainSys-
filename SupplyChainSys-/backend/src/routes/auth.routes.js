const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const authController = require('../controllers/auth.controller');

const { authMiddleware } = require('../middleware/auth.middleware');

/**
 * Auth Routes
 */
router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.get('/profile', authMiddleware, asyncHandler(authController.getProfile));


// OAuth mock routes
router.get('/google', asyncHandler(authController.googleAuth));
router.get('/github', asyncHandler(authController.githubAuth));

module.exports = router;
