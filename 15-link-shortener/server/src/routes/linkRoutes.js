// server/src/routes/linkRoutes.js
// Protected routes for CRUD operations on Link resources

import express from 'express';
import {
  getLinks,
  createLink,
  deleteLink,
} from '../controllers/linkController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to protect all user link routes
router.use(protect);

// GET /api/links - Retrieve all links created by the authenticated user
// POST /api/links - Create a new shortened link for the authenticated user
router.route('/').get(getLinks).post(createLink);

// DELETE /api/links/:id - Delete a link belonging to the authenticated user
router.route('/:id').delete(deleteLink);

export default router;

