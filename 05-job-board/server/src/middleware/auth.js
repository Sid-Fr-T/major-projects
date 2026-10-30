// server/src/middleware/auth.js
// Middleware to verify JWT from the Authorization: Bearer header and protect routes

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireRole } from './role.js';

/**
 * Protect routes by verifying JWT in the Authorization header.
 * Attaches the authenticated user document (without password) to req.user.
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for 'Bearer <token>' format in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // Extract token from header string "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by id stored in JWT payload, excluding the password field
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found, authorization denied' });
      }

      next();
    } catch (error) {
      console.error(`Auth Middleware Error: ${error.message}`);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export { requireRole };
export default protect;
