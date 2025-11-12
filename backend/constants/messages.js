// backend/constants/messages.js

const MESSAGES = {
    // Success Messages
    SUCCESS: 'Operation completed successfully.',
    CREATED: 'Resource created successfully.',
    UPDATED: 'Resource updated successfully.',
    DELETED: 'Resource deleted successfully.',

    // Error Messages
    NOT_FOUND: 'Resource not found.',
    UNAUTHORIZED: 'Authentication required or invalid token.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    VALIDATION_FAILED: 'Request validation failed. Check input data.',
    SERVER_ERROR: 'An unexpected error occurred on the server.',
    BUS_ASSIGNED: 'Driver is already assigned to another bus.',
};

module.exports = MESSAGES;