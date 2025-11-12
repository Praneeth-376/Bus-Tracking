// backend/models/Emergency.js
const mongoose = require('mongoose');

const EmergencySchema = new mongoose.Schema({
    // Reference to the bus involved in the emergency
    bus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: [true, 'Bus ID is required.']
    },

    // Reference to the user who reported the emergency (likely the Driver)
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Reporter ID is required.']
    },

    // Geographical coordinates of the emergency location
    location: {
        latitude: {
            type: Number,
            required: [true, 'Latitude is required.']
        },
        longitude: {
            type: Number,
            required: [true, 'Longitude is required.']
        }
    },

    // Brief description or type of emergency
    type: {
        type: String,
        enum: ['MEDICAL', 'ACCIDENT', 'MECHANICAL', 'SECURITY', 'OTHER'],
        default: 'OTHER'
    },

    // Current status of the incident
    status: {
        type: String,
        enum: ['PENDING', 'ACKNOWLEDGED', 'RESOLVED', 'CLOSED'],
        default: 'PENDING'
    },
    
    // Detailed notes provided by the reporter
    notes: {
        type: String,
        maxlength: 500
    },

    // Timestamp when the alert was first raised
    incidentTime: {
        type: Date,
        default: Date.now,
        required: true
    }

}, { 
    timestamps: true // Tracks createdAt and updatedAt
});

module.exports = mongoose.model('Emergency', EmergencySchema);