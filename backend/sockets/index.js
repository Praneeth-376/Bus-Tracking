// backend/sockets/index.js
const busSocket = require('./busSocket');
const attendanceSocket = require('./attendanceSocket');
const emergencySocket = require('./emergencySocket');

/**
 * Attaches all specific socket event handlers to a new client connection.
 * @param {object} io - The main Socket.IO server instance.
 * @param {object} socket - The individual client socket connection.
 */
module.exports = (io, socket) => {
    // 1. Core Bus/Location tracking events
    busSocket(io, socket);

    // 2. Attendance/Student status updates
    attendanceSocket(io, socket);

    // 3. Emergency alerts and updates
    emergencySocket(io, socket);

    console.log(`Initialized handlers for socket ID: ${socket.id}`);
};