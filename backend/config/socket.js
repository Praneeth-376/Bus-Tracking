// backend/config/socket.js (Updated)
const { Server } = require('socket.io');
const socketHandlers = require('../sockets/index'); // <--- NEW IMPORT

// Function to initialize Socket.IO
const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.NODE_ENV === 'development' ? '*' : 'YOUR_FRONTEND_URL',
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        
        // Call the index file to attach all modular handlers to the new socket
        socketHandlers(io, socket); // <--- HANDLERS ARE NOW ATTACHED

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    // Global reference for access in controllers/services
    global.io = io; // Setting it globally here is cleaner

    return io;
};

// Removed getIO() since we set io globally in server.js/config/socket.js
module.exports = {
    initSocket,
    // getIO: () => global.io // This is now redundant if using global.io
};