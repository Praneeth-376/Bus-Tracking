// backend/sockets/busSocket.js

/**
 * Handles real-time bus tracking related socket events.
 * @param {object} io - The main Socket.IO server instance.
 * @param {object} socket - The individual client socket connection.
 */
module.exports = (io, socket) => {
    // Client subscribes to real-time location updates for a specific bus
    socket.on('joinBus', (busId) => {
        socket.join(busId); // Joins a room named after the busId
        console.log(`Socket ${socket.id} joined bus room: ${busId}`);
        // This room is where locationController will emit updates to!
    });

    socket.on('leaveBus', (busId) => {
        socket.leave(busId);
        console.log(`Socket ${socket.id} left bus room: ${busId}`);
    });

    // You would add similar logic for attendanceSocket.js and emergencySocket.js
};