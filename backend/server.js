// backend/server.js
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

// Start HTTP Server
const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Start Socket.IO Server
const io = initSocket(server);
global.io = io; // Make the IO instance globally available (for controllers/services)

// Graceful shutdown
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});