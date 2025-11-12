// backend/middleware/roleMiddleware.js

/**
 * Middleware factory that returns a middleware function.
 * @param {string[]} allowedRoles - An array of roles (e.g., ['ADMIN', 'DRIVER']) 
 * that are permitted to access the route.
 */
const authorize = (allowedRoles) => (req, res, next) => {
    // 1. Ensure user is available on the request object
    // The 'protect' middleware ensures req.user is set.
    if (!req.user || !req.user.role) {
        // This shouldn't happen if 'protect' runs first, but is a safe guard.
        res.status(401); 
        return next(new Error('Not authorized to access this route. User role missing.'));
    }

    const userRole = req.user.role.toUpperCase();

    // 2. Check if the user's role is included in the allowedRoles array
    if (allowedRoles.includes(userRole)) {
        // Role is authorized, proceed to the next handler
        next();
    } else {
        // Role is forbidden
        res.status(403); // Forbidden HTTP Status Code
        return next(new Error(`Role ${userRole} is not authorized to access this resource.`));
    }
};

module.exports = { authorize };