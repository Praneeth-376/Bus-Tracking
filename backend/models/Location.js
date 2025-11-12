// backend/models/Location.js
const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    // Reference to the Bus that sent the update
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'Bus', // Uncomment when Bus model is created
        required: true,
        index: true
    },
    
    // Geographical coordinates stored in GeoJSON format
    coordinates: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        // [longitude, latitude] - Must be in this order for '2dsphere' index
        data: { 
            type: [Number],
            required: true,
            index: '2dsphere' 
        }
    },

    speed: {
        type: Number,
        default: 0
    },

    isEmergency: {
        type: Boolean,
        default: false
    },

    // Timestamp when the update was recorded by the server
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Location', LocationSchema);