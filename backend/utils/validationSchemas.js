// backend/utils/validationSchemas.js
const Joi = require('joi');

// Joi schema for validating the Driver's real-time location update POST request
const locationUpdateSchema = {
    body: Joi.object({
        // busId: Must be a valid MongoDB ObjectId string
        busId: Joi.string().hex().length(24).required().messages({
            'string.hex': 'Bus ID must be a valid MongoDB ID.',
            'string.length': 'Bus ID must be 24 characters long.',
            'any.required': 'Bus ID is required.'
        }),
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required(),
        speed: Joi.number().min(0).default(0).optional(),
        isEmergency: Joi.boolean().default(false).optional(),
    })
};

// Joi schema for validating User Registration POST request
const registerSchema = {
    body: Joi.object({
        name: Joi.string().trim().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('ADMIN', 'DRIVER', 'PARENT', 'COORDINATOR').default('PARENT').optional(),
        // Conditional requirement: busId is required if role is DRIVER
        busId: Joi.string().hex().length(24).when('role', { 
            is: 'DRIVER', 
            then: Joi.required() 
        }).optional(),
        childBusId: Joi.string().hex().length(24).optional(),
    })
};

module.exports = {
    locationUpdateSchema,
    registerSchema,
    // Add schemas for Login, Bus Creation, Attendance Record, etc. here
};