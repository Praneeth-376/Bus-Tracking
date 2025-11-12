// backend/controllers/attendanceController.js
const asyncHandler = require('express-async-handler');
const Attendance = require('../models/Attendance');
const User = require('../models/User'); // Used to verify student/parent relationship

// @desc    Record a new attendance event (BOARDED or DEBOARDED)
// @route   POST /api/attendance/record
// @access  Private/Driver or Coordinator
const recordAttendance = asyncHandler(async (req, res) => {
    // Requires a secure token, handled by 'protect' and 'authorize' middleware
    const { studentId, busId, eventType, latitude, longitude, tripId } = req.body;
    const recordedBy = req.user._id; // The ID of the authenticated Driver/Coordinator

    // 1. Basic validation
    if (!studentId || !busId || !eventType || !latitude || !longitude) {
        res.status(400);
        throw new Error('Missing required fields: studentId, busId, eventType, location.');
    }

    // 2. Create the attendance record
    const attendanceRecord = await Attendance.create({
        student: studentId,
        bus: busId,
        eventType,
        location: { latitude, longitude },
        recordedBy,
        tripId
    });
    
    // Optional: Emit a real-time update via Socket.IO for parents tracking this student
    if (global.io) {
        const payload = {
            studentId,
            eventType,
            busId,
            timestamp: attendanceRecord.timestamp,
            message: `${studentId} has ${eventType.toLowerCase()} the bus.`
        };
        // Emit only to listeners subscribed to this student's updates
        global.io.emit(`student-status-${studentId}`, payload); 
    }

    res.status(201).json({ success: true, data: attendanceRecord, message: 'Attendance recorded successfully.' });
});


// @desc    Get attendance history for a specific student (Used by Parent/Admin)
// @route   GET /api/attendance/student/:studentId
// @access  Private/Parent or Admin
const getStudentAttendance = asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    const currentUser = req.user;

    // 1. Authorization Check (Best Practice: Parent can ONLY view their own child's data)
    if (currentUser.role === 'PARENT') {
        const student = await User.findById(studentId).select('childBusId'); 
        
        // This is a basic example. In a full system, the parent's account should be linked to the child's/student's account.
        // For simplicity here, we assume the parent can only query their child's ID if authorized by other means.
        // For now, we'll allow the Parent role to query IF they are querying a student ID they are linked to.
        
        // NOTE: Since the User model doesn't explicitly link Parent to Student, we'll rely on Admin/Role check.
        // For a Parent to query, they need specific linking logic. For now, only Admins are fully trusted.
        if (studentId !== currentUser._id.toString() && currentUser.role === 'PARENT') {
            res.status(403);
            throw new Error('Not authorized to view other student\'s attendance.');
        }
    }


    // 2. Fetch records
    const records = await Attendance.find({ student: studentId })
        .sort({ timestamp: -1 }) // Latest records first
        .populate('bus', 'busNumber licensePlate route') // Get bus details
        .limit(50);

    if (!records || records.length === 0) {
        res.status(404);
        return res.json({ success: true, message: 'No attendance records found for this student.', data: [] });
    }

    res.status(200).json({ success: true, count: records.length, data: records });
});


module.exports = {
    recordAttendance,
    getStudentAttendance
};