// backend/utils/calcDistance.js

// Earth's radius in Kilometers (mean radius)
const R = 6371; 

/**
 * Converts degrees to radians.
 * @param {number} deg - Value in degrees.
 * @returns {number} Value in radians.
 */
function degToRad(deg) {
    return deg * (Math.PI / 180);
}

/**
 * Calculates the distance between two geographical points using the Haversine formula.
 * @param {number} lat1 - Latitude of the first point.
 * @param {number} lon1 - Longitude of the first point.
 * @param {number} lat2 - Latitude of the second point.
 * @param {number} lon2 - Longitude of the second point.
 * @returns {number} Distance in Kilometers (KM).
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // 1. Convert latitude and longitude to radians
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    // 2. Haversine formula calculation
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // 3. Final distance calculation
    const distance = R * c; // Distance in KM

    return distance; // Returns distance in Kilometers
};

module.exports = { 
    calculateDistance 
};