// backend/controllers/analyticsController.js
const asyncHandler = require('express-async-handler');
const { 
    calculateTotalDistance, 
    calculateOnTimePerformance 
} = require('../services/analytics/analyticsService');

// @desc    Get total distance traveled by a bus in a date range
// @route   GET /api/analytics/distance/:busId
// @access  Private/Admin
const getDistanceAnalytics = asyncHandler(async (req, res) => {
    const { busId } = req.params;
    const { startDate, endDate } = req.query; // e.g., ?startDate=2025-10-01&endDate=2025-10-31

    if (!startDate || !endDate) {
        res.status(400);
        throw new Error('startDate and endDate query parameters are required.');
    }

    const totalDistance = await calculateTotalDistance(busId, startDate, endDate);

    res.status(200).json({
        success: true,
        busId,
        startDate,
        endDate,
        totalDistanceKm: totalDistance
    });
});

// @desc    Get on-time performance for a bus in a date range
// @route   GET /api/analytics/performance/:busId
// @access  Private/Admin
const getPerformanceAnalytics = asyncHandler(async (req, res) => {
    const { busId } = req.params;
    // Assuming targetTime is also passed as a query param (e.g., ?targetTime=16:30:00)
    const { startDate, endDate, targetTime } = req.query; 

    if (!startDate || !endDate || !targetTime) {
        res.status(400);
        throw new Error('startDate, endDate, and targetTime query parameters are required.');
    }

    const performance = await calculateOnTimePerformance(busId, startDate, endDate, targetTime);

    res.status(200).json({
        success: true,
        busId,
        startDate,
        endDate,
        performance
    });
});

module.exports = {
    getDistanceAnalytics,
    getPerformanceAnalytics,
};