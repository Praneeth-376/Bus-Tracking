// backend/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// Import Routes
const apiRouter = require('./routes/index');
// Import Middleware
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors());

// Body Parsers
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', apiRouter);
// Simple health check endpoint
app.get('/', (req, res) => {
    res.send('Bus Tracking API is running...');
});

// Custom Error Middleware (Must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;