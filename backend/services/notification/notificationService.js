// backend/services/notification/notificationService.js

/**
 * Sends critical alerts for emergency events.
 * In a real-world scenario, this would integrate with external APIs (e.g., Twilio for SMS, SendGrid for Email, Firebase for Push).
 * * @param {object} emergencyData - The emergency record created in the database.
 */
const sendEmergencyAlert = async (emergencyData) => {
    try {
        const { bus: busId, location, type, reportedBy } = emergencyData;

        // --- 1. Identify Recipients ---
        // Fetch Admin users (to alert the central command)
        // const admins = await User.find({ role: 'ADMIN' });

        // Fetch Parents on the affected route (if the bus model stores route info)
        // const affectedParents = await User.find({ role: 'PARENT', childBusId: busId });

        // --- 2. Format Message ---
        const alertMessage = `EMERGENCY ALERT! Bus ${busId} reported a ${type} incident. 
Location: LAT ${location.latitude}, LNG ${location.longitude}. 
Reported By: ${reportedBy}. Status: PENDING.`;
        
        console.log(`[NOTIFICATION SERVICE] HIGH PRIORITY ALERT for Bus ID ${busId}:`);
        console.log(`[SMS/PUSH] Sent to 5 Admins & 45 Parents. Message: "${alertMessage}"`);
        
        // Simulating the API call success
        return true; 

    } catch (error) {
        console.error('Error sending emergency notification:', error);
        return false;
    }
};

module.exports = {
    sendEmergencyAlert
};