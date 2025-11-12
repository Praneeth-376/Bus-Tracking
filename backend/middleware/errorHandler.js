// backend/middleware/errorHandler.js

// 1. Not Found (404) Handler
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass the error to the main error handler
};

// 2. Main Error Handler
// Note: Express requires four arguments (err, req, res, next) for error handling middleware
const errorHandler = (err, req, res, next) => {
    // Determine the status code (default to 500 if the existing status is 200)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    res.json({
        message: err.message,
        // Only show stack trace in development mode for security
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, 
    });
};

// EXPORT THE FUNCTIONS BY NAME (Crucial Step!)
module.exports = {
    notFound,
    errorHandler,
};