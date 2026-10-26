// server/src/routes/habitRoutes.js
// Protected routes for CRUD operations and completion toggling on Habit resources

import express from 'express';
import {
  getHabits,
  getHabitById,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitDate,
} from '../controllers/habitController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to protect all habit routes
router.use(protect);

// GET /api/habits - Retrieve all habits of authenticated user
// POST /api/habits - Create a new habit for authenticated user
router.route('/').get(getHabits).post(createHabit);

// POST /api/habits/:id/toggle - Toggle completion status for today or specific date
router.route('/:id/toggle').post(toggleHabitDate).put(toggleHabitDate);

// GET /api/habits/:id - Retrieve specific habit
// PUT /api/habits/:id - Update specific habit
// DELETE /api/habits/:id - Delete specific habit
router.route('/:id').get(getHabitById).put(updateHabit).delete(deleteHabit);

export default router;

