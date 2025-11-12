// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler'); // Simple wrapper for error handling
const User = require('../models/User'); 
// Assuming you have this helper in utils/responseHelper.js
// const { errorResponse } = require('../utils/responseHelper'); 

// @desc    Protect routes by verifying JWT
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Check if token exists in the request headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format: 'Bearer <token>')
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Find user and attach to request object (excluding the password field)
            // .select('-password') ensures password hash is never passed to controllers
            req.user = await User.findById(decoded.id).select('-password'); 

            // If user is found, move to the next middleware/controller
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401); // Unauthorized
            throw new Error('Not authorized, token failed');
        }
    }

    // 4. Handle case where no token is provided
    if (!token) {
        res.status(401); // Unauthorized
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect };