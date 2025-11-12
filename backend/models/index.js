// backend/models/index.js
const User = require('./User');
const Bus = require('./Bus');
const Location = require('./Location');
const Attendance = require('./Attendance');
const Emergency = require('./Emergency');

// Export all models in a single object
module.exports = {
    User,
    Bus,
    Location,
    Attendance,
    Emergency,
};

// Usage Example in a controller: 
// const { User, Location } = require('../models');