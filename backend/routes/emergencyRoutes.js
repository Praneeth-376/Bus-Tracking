// backend/routes/emergencyRoutes.js
const express = require('express');
const { triggerEmergency, updateEmergencyStatus } = require('../controllers/emergencyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// POST /api/emergencies/trigger
// Only Drivers or Coordinators can trigger an alert
router.post(
    '/trigger', 
    protect, 
    authorize(['DRIVER', 'COORDINATOR']), 
    triggerEmergency
);

// PUT /api/emergencies/:id
// Only Admins can update the status (e.g., mark as RESOLVED)
router.put(
    '/:id', 
    protect, 
    authorize(['ADMIN']), 
    updateEmergencyStatus
);

module.exports = router;