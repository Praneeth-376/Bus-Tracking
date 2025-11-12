// backend/middleware/validateRequest.js
const Joi = require('joi');
const { errorResponse } = require('../utils/responseHelper'); // For consistent error formatting

/**
 * Middleware factory to validate request data (body, query, params).
 * @param {object} schema - An object mapping request parts to Joi schemas (e.g., { body: JoiSchema }).
 */
const validate = (schema) => (req, res, next) => {
    // Collect errors across all parts of the request
    const errors = {};
    let hasError = false;

    // Iterate over request parts defined in the schema (body, query, params)
    ['body', 'query', 'params'].forEach(key => {
        if (schema[key]) {
            // Validate the corresponding part of the request
            const { error, value } = schema[key].validate(req[key], {
                abortEarly: false, // Collect all errors, not just the first one
                allowUnknown: false, // Disallow fields not defined in the schema
                stripUnknown: true // Remove fields not defined in the schema (cleaning input)
            });

            if (error) {
                // Map validation errors into a friendlier object
                errors[key] = error.details.map(detail => ({
                    field: detail.context.key,
                    message: detail.message.replace(/['"]+/g, '')
                }));
                hasError = true;
            } else {
                // Replace the original request part with the cleaned/validated value
                req[key] = value;
            }
        }
    });

    if (hasError) {
        // Send a 400 Bad Request response with the consolidated errors
        return errorResponse(res, 400, 'Validation Failed', errors);
    }

    // If no errors, proceed to the next middleware or controller
    next();
};

module.exports = { validate };