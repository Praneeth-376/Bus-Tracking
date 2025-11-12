// backend/controllers/busController.js
const asyncHandler = require('express-async-handler');
const Bus = require('../models/Bus');
const User = require('../models/User'); 

// @desc    Get all buses
// @route   GET /api/buses
// @access  Private/Admin
const getBuses = asyncHandler(async (req, res) => {
    // Optionally populate the driver field to show who is assigned
    const buses = await Bus.find({}).populate('driver', 'name email'); 
    res.status(200).json({ success: true, count: buses.length, data: buses });
});

// @desc    Get single bus by ID
// @route   GET /api/buses/:id
// @access  Private/Admin
const getBusById = asyncHandler(async (req, res) => {
    const bus = await Bus.findById(req.params.id).populate('driver', 'name email');

    if (!bus) {
        res.status(404);
        throw new Error('Bus not found');
    }
    res.status(200).json({ success: true, data: bus });
});

// @desc    Create new bus
// @route   POST /api/buses
// @access  Private/Admin
const createBus = asyncHandler(async (req, res) => {
    // Input validation should ideally be handled by validateRequest middleware
    const { busNumber, licensePlate, capacity, route, driver } = req.body;

    // Check for existing bus number or license plate
    const busExists = await Bus.findOne({ $or: [{ busNumber }, { licensePlate }] });
    if (busExists) {
        res.status(400);
        throw new Error('Bus number or license plate already exists');
    }

    // Optional: Check if the provided driver ID exists and has the 'DRIVER' role
    if (driver) {
        const driverUser = await User.findById(driver);
        if (!driverUser || driverUser.role !== 'DRIVER') {
            res.status(400);
            throw new Error('Invalid or non-driver user ID provided for driver assignment');
        }
        // Optional: Ensure the driver is not already assigned to another bus
        const driverAssigned = await Bus.findOne({ driver });
        if (driverAssigned) {
             res.status(400);
            throw new Error(`Driver is already assigned to bus ${driverAssigned.busNumber}`);
        }
    }

    const bus = await Bus.create(req.body);

    res.status(201).json({ success: true, data: bus });
});

// @desc    Update bus
// @route   PUT /api/buses/:id
// @access  Private/Admin
const updateBus = asyncHandler(async (req, res) => {
    const busId = req.params.id;
    let bus = await Bus.findById(busId);

    if (!bus) {
        res.status(404);
        throw new Error('Bus not found');
    }

    // Check logic if driver is being changed (similar to createBus logic)
    if (req.body.driver) {
        const driverUser = await User.findById(req.body.driver);
        if (!driverUser || driverUser.role !== 'DRIVER') {
            res.status(400);
            throw new Error('Invalid or non-driver user ID provided for driver assignment');
        }
        // Check if the new driver is assigned to a different bus (and it's not the current one)
        const driverAssigned = await Bus.findOne({ driver: req.body.driver, _id: { $ne: busId } });
        if (driverAssigned) {
             res.status(400);
            throw new Error(`Driver is already assigned to bus ${driverAssigned.busNumber}`);
        }
    }

    bus = await Bus.findByIdAndUpdate(busId, req.body, {
        new: true, // Return the updated document
        runValidators: true // Run schema validators
    });

    res.status(200).json({ success: true, data: bus });
});

// @desc    Delete bus
// @route   DELETE /api/buses/:id
// @access  Private/Admin
const deleteBus = asyncHandler(async (req, res) => {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
        res.status(404);
        throw new Error('Bus not found');
    }

    // Optional: Add logic to remove the bus reference from the assigned driver's user document
    await Bus.deleteOne({ _id: req.params.id });

    res.status(200).json({ success: true, data: {} });
});


module.exports = {
    getBuses,
    getBusById,
    createBus,
    updateBus,
    deleteBus
};