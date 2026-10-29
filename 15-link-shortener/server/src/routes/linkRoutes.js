// server/src/routes/linkRoutes.js
// Protected routes for managing shortened links

import express from 'express';
import {
  getLinks,
  createLink,
  deleteLink,
} from '../controllers/linkController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to protect link management endpoints
router.use(protect);

// GET /api/links - Retrieve all links for authenticated user
// POST /api/links - Create a new shortened link
router.route('/').get(getLinks).post(createLink);

// DELETE /api/links/:id - Delete a specific link
router.route('/:id').delete(deleteLink);

export default router;

