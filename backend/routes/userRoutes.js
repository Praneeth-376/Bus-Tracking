// backend/routes/userRoutes.js
const express = require('express');
const { registerUser, authUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // For protected routes

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', authUser);

// Example of a protected route (e.g., fetching own profile)
// router.route('/profile').get(protect, getUserProfile); 

module.exports = router;