const winston = require('winston');

const { combine, timestamp, printf, colorize, errors } = winston.format;

/**
 * Custom log format:
 *   2026-04-20 12:34:56 [INFO] : MongoDB connected
 */
const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level.toUpperCase()}] : ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat,
  ),
  defaultMeta: { service: 'atlas-logix' },
  transports: [
    // Console — always
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
    // File — errors only
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5 * 1024 * 1024, // 5 MB
      maxFiles: 5,
    }),
    // File — combined
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 5,
    }),
  ],
});

module.exports = logger;
