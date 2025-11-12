// backend/controllers/userController.js

// --- Corrected Imports ---
// 1. JWT is required once
const jwt = require('jsonwebtoken'); 
// 2. User Model is required once (The previous fix)
const User = require('../models/User'); 
// -------------------------

// Function to generate the JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE, // e.g., '30d'
    });
};

// @desc      Register a new user
// @route     POST /api/users/register
// @access    Public (or Admin-only for staff/driver roles)
const registerUser = async (req, res) => {
    // You should use validateRequest.js middleware to ensure fields are clean
    const { name, email, password, role, busId, childBusId } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        // Use the error handling middleware pattern
        res.status(400); 
        throw new Error('User already exists');
    }

    // 2. Create the user (Password hashing is handled by the model's pre-save hook!)
    const user = await User.create({
        name,
        email,
        password,
        role: role || 'PARENT', // Default to PARENT if role not specified
        busId,
        childBusId
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id), // Send JWT to client
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
};


// @desc      Authenticate user & get token
// @route     POST /api/users/login
// @access    Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    // 1. Find user (Note: .select('+password') is needed because 'password' is set to select: false in the model)
    const user = await User.findOne({ email }).select('+password'); 

    // 2. Check user and password match using the custom model method
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401); // Unauthorized
        throw new Error('Invalid email or password');
    }
};

module.exports = {
    generateToken,
    registerUser,
    authUser,
};