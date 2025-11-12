// backend/controllers/emergencyController.js
const asyncHandler = require('express-async-handler');
const Emergency = require('../models/Emergency');
const { sendEmergencyAlert } = require('../services/notification/notificationService'); 

// @desc    Trigger a new emergency alert
// @route   POST /api/emergencies/trigger
// @access  Private/Driver
const triggerEmergency = asyncHandler(async (req, res) => {
    const { busId, latitude, longitude, type, notes } = req.body;
    const reportedBy = req.user._id; 

    // 1. Basic Validation (Bus ID must be present)
    if (!busId) {
        res.status(400);
        throw new Error('Bus ID is required to trigger an emergency.');
    }

    // 2. Create the emergency record in the database
    const newEmergency = await Emergency.create({
        bus: busId,
        reportedBy,
        location: { latitude, longitude },
        type: type || 'SECURITY',
        notes
    });

    // 3. Trigger External Notifications (Service)
    sendEmergencyAlert(newEmergency); 

    // 4. Broadcast Real-Time Alert (Socket)
    if (global.io) {
        const payload = {
            busId,
            type: newEmergency.type,
            location: newEmergency.location,
            timestamp: newEmergency.incidentTime,
            status: newEmergency.status
        };
        // Emit a high-priority event to all connected admin dashboards/clients
        global.io.emit('emergency-broadcast', payload);
        
        // Optional: Also update the bus's last known location status in the Location model
        // This marks the bus as 'EMERGENCY' for live tracking maps.
    }

    res.status(201).json({ 
        success: true, 
        data: newEmergency, 
        message: 'Emergency alert triggered and notifications dispatched.' 
    });
});

// @desc    Update the status of an emergency (e.g., ACKNOWLEDGED, RESOLVED)
// @route   PUT /api/emergencies/:id
// @access  Private/Admin
const updateEmergencyStatus = asyncHandler(async (req, res) => {
    const { status, notes } = req.body;
    const emergency = await Emergency.findById(req.params.id);

    if (!emergency) {
        res.status(404);
        throw new Error('Emergency incident not found.');
    }
    
    // 1. Update fields
    if (status) emergency.status = status;
    if (notes) emergency.notes = notes;

    const updatedEmergency = await emergency.save();

    // 2. Broadcast status update (e.g., to all admins/affected clients)
    if (global.io) {
        global.io.emit(`emergency-status-update-${req.params.id}`, { 
            status: updatedEmergency.status,
            updatedAt: updatedEmergency.updatedAt 
        });
    }

    res.status(200).json({ success: true, data: updatedEmergency });
});


module.exports = {
    triggerEmergency,
    updateEmergencyStatus,
};