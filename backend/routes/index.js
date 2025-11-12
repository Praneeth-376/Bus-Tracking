// backend/routes/index.js
const express = require('express');
const userRoutes = require('./userRoutes');
const busRoutes = require('./busRoutes');
const locationRoutes = require('./locationRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const emergencyRoutes = require('./emergencyRoutes');
const analyticsRoutes = require('./analyticsRoutes');

const router = express.Router();

// --- API Versioning/Grouping ---
// Mount all specific route files under their respective paths
router.use('/users', userRoutes);
router.use('/buses', busRoutes);
router.use('/locations', locationRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/emergencies', emergencyRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;