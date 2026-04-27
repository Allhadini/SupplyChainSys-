const mongoose = require('mongoose');
const logger = require('../utils/logger');
let MongoMemoryServer;
try {
  MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
} catch (e) {
  MongoMemoryServer = null;
}

/**
 * Connect to MongoDB with retry logic.
 * Mongoose buffers commands so the app can start before the DB is fully ready,
 * but we still want visibility into connection state.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 8 defaults are sane; override only when needed
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB runtime error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected — will attempt reconnect automatically');
    });

    return conn;
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    if (MongoMemoryServer) {
      logger.info('Falling back to in-memory MongoDB...');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      logger.info(`MongoDB connected (In-Memory): ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } else {
      // Allow the process to crash so orchestrators (PM2, Docker, k8s) can restart
      process.exit(1);
    }
  }
};

module.exports = connectDB;
