// backend/utils/timeUtils.js

const moment = require('moment'); 

/**
 * Estimates the time of arrival (ETA) to a destination based on distance and average speed.
 * @param {number} distanceKm - Distance remaining to destination in Kilometers.
 * @param {number} currentSpeedKph - Current speed in Kilometers per hour.
 * @returns {string} Estimated time of arrival as a formatted string.
 */
const calculateETA = (distanceKm, currentSpeedKph) => {
    if (distanceKm <= 0 || currentSpeedKph <= 0) {
        return 'Arrived or stationary';
    }

    // Time in hours = Distance / Speed
    const timeInHours = distanceKm / currentSpeedKph;
    
    // Convert to milliseconds and add to current time
    const timeInMilliseconds = timeInHours * 60 * 60 * 1000;
    
    const etaTime = moment().add(timeInMilliseconds, 'milliseconds');
    
    return etaTime.format('HH:mm:ss');
};

module.exports = {
    calculateETA,
};