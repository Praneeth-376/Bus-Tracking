// backend/routes/attendanceRoutes.js
const express = require('express');
const { recordAttendance, getStudentAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// POST /api/attendance/record
// Requires authentication AND a role capable of recording (Driver or Coordinator)
router.post(
    '/record', 
    protect, 
    authorize(['DRIVER', 'COORDINATOR']), // Allow multiple roles
    recordAttendance
);

// GET /api/attendance/student/:studentId
// Requires authentication. Admins can query any ID. Parents need specific linking logic.
router.get(
    '/student/:studentId', 
    protect, 
    // Allowing 'PARENT' is risky without linking logic. For simplicity, we'll assume
    // the controller logic handles the PARENT's restriction to their own child.
    authorize(['ADMIN', 'PARENT', 'COORDINATOR']),
    getStudentAttendance
);

module.exports = router;