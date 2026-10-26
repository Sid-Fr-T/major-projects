// server/src/routes/taskRoutes.js
// Protected routes for CRUD operations on Task resources

import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to protect all task routes
router.use(protect);

// GET /api/tasks - Retrieve all tasks of authenticated user
// POST /api/tasks - Create a new task for authenticated user
router.route('/').get(getTasks).post(createTask);

// GET /api/tasks/:id - Retrieve specific task
// PUT /api/tasks/:id - Update specific task
// DELETE /api/tasks/:id - Delete specific task
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

export default router;

