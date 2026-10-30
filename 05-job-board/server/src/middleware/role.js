// server/src/middleware/role.js
// Middleware to verify that the authenticated user possesses the required role(s)

/**
 * Role-based authorization middleware
 * @param  {...string} roles - Permitted roles (e.g. 'recruiter', 'applicant')
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, please log in' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: role '${req.user.role}' does not have permission for this action`,
      });
    }

    next();
  };
};

export default requireRole;

