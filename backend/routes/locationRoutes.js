// backend/routes/locationRoutes.js
const express = require('express');
const { updateLocation, getBusLocation } = require('../controllers/locationController');
const { protect } = require('../middleware/authMiddleware'); 
const { authorize } = require('../middleware/roleMiddleware'); 
const { validate } = require('../middleware/validateRequest'); // <--- NEW IMPORT
const { locationUpdateSchema } = require('../utils/validationSchemas'); // <--- NEW IMPORT

const router = express.Router();

// POST /api/locations/update
router.post(
    '/update', 
    protect, 
    authorize(['DRIVER']), 
    validate(locationUpdateSchema), // <--- VALIDATION APPLIED HERE!
    updateLocation
);

// GET /api/locations/:busId (Need a schema for params validation too, for completeness)
router.get(
    '/:busId', 
    protect, 
    getBusLocation
);

module.exports = router;