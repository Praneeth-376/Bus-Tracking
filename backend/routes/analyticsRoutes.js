// backend/routes/analyticsRoutes.js
const express = require('express');
const { getDistanceAnalytics, getPerformanceAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// All analytics routes require authentication and must be accessed by an ADMIN
router.route('/distance/:busId')
    .get(protect, authorize(['ADMIN']), getDistanceAnalytics);

router.route('/performance/:busId')
    .get(protect, authorize(['ADMIN']), getPerformanceAnalytics);

module.exports = router;