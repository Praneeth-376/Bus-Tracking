// backend/utils/logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Define custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    // Show stack trace only for error level if present
    return `${timestamp} [${level}]: ${message}${stack ? '\n' + stack : ''}`;
});

// Create the logger instance
const logger = createLogger({
    // Only log messages with severity 'info' and below (debug, warn, error, info)
    level: 'info', 
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        // 1. Console Transport (for development/debugging)
        new transports.Console({
            format: combine(
                colorize(), // Add colors to the console output
                logFormat
            )
        }),
        
        // 2. File Transport (for persistent logging in production)
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' })
    ],
    // Exit after logging an uncaught exception
    exceptionHandlers: [
        new transports.File({ filename: 'exceptions.log' })
    ],
    // Exit after logging a rejected promise
    rejectionHandlers: [
        new transports.File({ filename: 'rejections.log' })
    ]
});

// Only change logging level to 'debug' in development environment
if (process.env.NODE_ENV !== 'production') {
    logger.level = 'debug';
}

module.exports = logger;