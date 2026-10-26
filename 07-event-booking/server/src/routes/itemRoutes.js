// server/src/routes/itemRoutes.js
// Protected routes for CRUD operations on Item resources

import express from 'express';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/itemController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to protect all item routes
router.use(protect);

// GET /api/items - Retrieve all items of authenticated user
// POST /api/items - Create a new item for authenticated user
router.route('/').get(getItems).post(createItem);

// GET /api/items/:id - Retrieve specific item
// PUT /api/items/:id - Update specific item
// DELETE /api/items/:id - Delete specific item
router.route('/:id').get(getItemById).put(updateItem).delete(deleteItem);

export default router;

