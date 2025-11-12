// backend/models/Attendance.js
const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    // Reference to the student (User model) whose attendance is being recorded
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student ID is required.']
    },

    // Reference to the bus (Bus model) involved in the trip
    bus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: [true, 'Bus ID is required.']
    },

    // The type of event (Boarded or Deboarded)
    eventType: {
        type: String,
        enum: ['BOARDED', 'DEBOARDED'],
        required: [true, 'Event type is required.']
    },
    
    // Geographical coordinates where the event was recorded
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

    // A timestamp of when the event occurred
    timestamp: {
        type: Date,
        default: Date.now
    },

    // Optional: Reference to the device/user recording the attendance (e.g., the Driver/Coordinator)
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    // Optional: Trip identification (useful for separating morning vs. afternoon trips)
    tripId: {
        type: String,
        required: false 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Attendance', AttendanceSchema);