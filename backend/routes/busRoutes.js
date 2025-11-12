// backend/routes/busRoutes.js
const express = require('express');
const { 
    getBuses, 
    getBusById, 
    createBus, 
    updateBus, 
    deleteBus 
} = require('../controllers/busController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Base route for GET (All) and POST (Create)
// Requires authentication and ADMIN role
router.route('/')
    .get(protect, authorize(['ADMIN']), getBuses)
    .post(protect, authorize(['ADMIN']), createBus);

// Specific routes for GET (Single), PUT (Update), and DELETE (Delete)
// Requires authentication and ADMIN role
router.route('/:id')
    .get(protect, authorize(['ADMIN']), getBusById)
    .put(protect, authorize(['ADMIN']), updateBus)
    .delete(protect, authorize(['ADMIN']), deleteBus);

module.exports = router;