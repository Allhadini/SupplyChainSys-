const User = require('../models/user.model');
const { generateToken } = require('../middleware/auth.middleware');
const { AppError } = require('../middleware/error.middleware');
const logger = require('../utils/logger');

/**
 * Register a new user
 * @param {Object} userData
 * @returns {Object} User and Token
 */
const registerUser = async (userData) => {
  logger.info(`Attempting to register user: ${userData.email}`);

  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError('Email is already registered.', 400);
  }

  // Create user
  const user = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'operator',
    company: userData.company,
  });

  // Generate JWT
  const token = generateToken({ id: user._id, role: user.role, name: user.name });

  logger.info(`User registered successfully: ${user._id}`);

  // Remove password from output (even though transform handles it, good practice)
  const userObj = user.toJSON();

  return { user: userObj, token };
};

/**
 * Login user
 * @param {String} email
 * @param {String} password
 * @returns {Object} User and Token
 */
const loginUser = async (email, password) => {
  logger.info(`Attempting login for: ${email}`);

  // Find user and explicitly select password field (as it's select: false in schema)
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    logger.warn(`Login failed: Invalid email (${email})`);
    throw new AppError('Invalid email or password.', 401);
  }

  // Check if active
  if (!user.isActive) {
    logger.warn(`Login failed: User account is inactive (${email})`);
    throw new AppError('Your account has been deactivated. Please contact support.', 403);
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    logger.warn(`Login failed: Invalid password (${email})`);
    throw new AppError('Invalid email or password.', 401);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate JWT
  const token = generateToken({ id: user._id, role: user.role, name: user.name });

  logger.info(`User logged in successfully: ${user._id}`);

  const userObj = user.toJSON();

  return { user: userObj, token };
};

/**
 * Get user profile by ID
 * @param {String} userId
 * @returns {Object} User profile
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
