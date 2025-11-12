// backend/controllers/locationController.js
const Location = require('../models/Location');
// const { routeMonitor } = require('../services/tracking/routeMonitor'); // Placeholder
// const { notifyParents } = require('../services/notification/notificationService'); // Placeholder
// const { responseHelper } = require('../utils/responseHelper'); // Placeholder

// @desc    Handle real-time bus location updates
// @route   POST /api/locations/update
// @access  Private (Driver only)
const updateLocation = async (req, res) => {
    // In a real app, middleware like 'validateRequest' would ensure these fields exist and are clean
    const { busId, latitude, longitude, speed = 0, isEmergency = false } = req.body;

    // 1. Validate Input (Basic check)
    if (!busId || !latitude || !longitude) {
        return res.status(400).json({ message: 'Missing busId, latitude, or longitude.' });
    }

    try {
        // 2. Format data for GeoJSON storage
        const locationData = {
            busId,
            coordinates: {
                // GeoJSON format is [longitude, latitude]
                data: [longitude, latitude]
            },
            speed,
            isEmergency
        };

        // 3. Save to Database
        const newLocation = await Location.create(locationData);

        // 4. Trigger Real-Time Update
        // Emitting the update through the global Socket.IO instance
        if (global.io) {
            const payload = { 
                busId, 
                latitude, 
                longitude, 
                speed,
                timestamp: newLocation.timestamp 
            };
            
            // Emit the location update only to clients 'listening' for this specific bus
            global.io.emit(`bus-location-${busId}`, payload);
            
            // Optional: Emit a general broadcast for admin dashboards
            global.io.emit('location-update', payload); 
        }

        // 5. Run Service Logic (Placeholders for future implementation)
        // await routeMonitor.checkDeviation(busId, latitude, longitude);
        // await notifyParents.checkArrival(busId, latitude, longitude);
        
        // 6. Send Response
        res.status(201).json({ 
            success: true, 
            message: 'Location updated successfully and broadcasted.',
            data: newLocation
        });

    } catch (error) {
        console.error('Location Update Error:', error);
        // This should be handled by your errorHandler.js middleware
        res.status(500).json({ message: 'Server Error during location update.' });
    }
};

// @desc    Get the last known location of a bus
// @route   GET /api/locations/:busId
// @access  Private (Parent/Admin)
const getBusLocation = async (req, res) => {
    try {
        const { busId } = req.params;
        
        // Find the single latest location entry for the specified busId
        const lastLocation = await Location.findOne({ busId })
            .sort({ timestamp: -1 }) // Sort by timestamp descending
            .limit(1);

        if (!lastLocation) {
            return res.status(404).json({ message: `No location data found for bus ID ${busId}.` });
        }

        // Return a cleaner object (converting GeoJSON coordinates back to lat/lng)
        const [longitude, latitude] = lastLocation.coordinates.data;

        res.status(200).json({
            success: true,
            data: {
                busId: lastLocation.busId,
                latitude,
                longitude,
                speed: lastLocation.speed,
                timestamp: lastLocation.timestamp
            }
        });

    } catch (error) {
        console.error('Get Location Error:', error);
        res.status(500).json({ message: 'Server Error fetching location.' });
    }
};


module.exports = {
    updateLocation,
    getBusLocation
};