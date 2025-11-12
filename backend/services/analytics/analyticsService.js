// backend/services/analytics/analyticsService.js
const Location = require('../../models/Location');
const Attendance = require('../../models/Attendance');
const { calculateDistance } = require('../../utils/calcDistance'); // Assuming this utility is implemented
const moment = require('moment'); // You'll need to install: npm install moment

/**
 * Calculates the total distance traveled by a bus over a specified date range.
 * This is a highly simplified example. Real-world would involve complex interpolation.
 */
const calculateTotalDistance = async (busId, startDate, endDate) => {
    // 1. Fetch location data within the range, sorted by timestamp
    const locations = await Location.find({
        busId,
        timestamp: {
            $gte: moment(startDate).startOf('day'),
            $lte: moment(endDate).endOf('day')
        }
    }).sort({ timestamp: 1 }); // Sort chronologically

    if (locations.length < 2) {
        return 0; // Need at least two points to calculate distance
    }

    let totalDistanceKm = 0;
    
    // 2. Iterate through points and sum distances
    for (let i = 1; i < locations.length; i++) {
        const point1 = locations[i - 1].coordinates.data; // [lng, lat]
        const point2 = locations[i].coordinates.data;     // [lng, lat]

        // Assuming calculateDistance takes (lat1, lng1, lat2, lng2) and returns km
        const distance = calculateDistance(point1[1], point1[0], point2[1], point2[0]);
        totalDistanceKm += distance;
    }

    // Return distance in kilometers
    return parseFloat(totalDistanceKm.toFixed(2));
};

/**
 * Calculates on-time performance based on attendance records.
 * This function assumes a target drop-off time is known or stored elsewhere.
 */
const calculateOnTimePerformance = async (busId, startDate, endDate, targetTime) => {
    // For a simple example, we'll just count total events and late events.
    const attendanceRecords = await Attendance.find({
        bus: busId,
        eventType: 'DEBOARDED', // Focus on drop-off time
        timestamp: {
            $gte: moment(startDate).startOf('day'),
            $lte: moment(endDate).endOf('day')
        }
    });

    if (attendanceRecords.length === 0) {
        return { onTimeRate: 0, totalEvents: 0 };
    }

    let lateCount = 0;
    const totalEvents = attendanceRecords.length;
    const targetMoment = moment(targetTime, 'HH:mm:ss'); // Assuming targetTime is a string like "16:30:00"

    for (const record of attendanceRecords) {
        const recordTime = moment(record.timestamp);
        
        // Simple logic: If drop-off occurred more than 5 minutes after target, it's late
        if (recordTime.isAfter(targetMoment.clone().add(5, 'minutes'), 'minute')) {
            lateCount++;
        }
    }

    const onTimeRate = (1 - (lateCount / totalEvents)) * 100;

    return {
        onTimeRate: parseFloat(onTimeRate.toFixed(2)),
        totalEvents,
        lateCount
    };
};


module.exports = {
    calculateTotalDistance,
    calculateOnTimePerformance,
};