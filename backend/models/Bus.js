// backend/models/Bus.js
const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
    // Unique Identifier
    busNumber: {
        type: String,
        required: [true, 'Please add a unique bus number (e.g., B-001)'],
        unique: true,
        trim: true
    },
    
    // Vehicle Details
    licensePlate: {
        type: String,
        required: [true, 'Please add the license plate number'],
        unique: true,
        trim: true
    },
    capacity: {
        type: Number,
        required: [true, 'Please add the seating capacity'],
        min: 1
    },

    // Route and Assignment Details
    route: {
        type: String,
        required: [true, 'Please add the bus route name/number'],
        trim: true
    },
    // Reference to the currently assigned driver (from the User model)
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true, // A driver can only be assigned to one bus at a time
        sparse: true  // Allows null values, but ensures uniqueness when present
    },

    // Status
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'TRIP_IN_PROGRESS'],
        default: 'ACTIVE'
    },
    
    // Geographical Data for the Route (e.g., GeoJSON coordinates defining the boundary)
    // This is optional but highly recommended for the routeMonitor service.
    routeBoundary: { 
        type: {
            type: String,
            enum: ['Polygon'],
        },
        coordinates: {
            type: [[[Number]]] // Array of polygons/paths
        }
    },

    // Current location for quick access (denormalization for performance)
    lastKnownLocation: {
        latitude: Number,
        longitude: Number,
        timestamp: Date
    }

}, {
    timestamps: true 
});

module.exports = mongoose.model('Bus', BusSchema);