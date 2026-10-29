// server/src/routes/scoreRoutes.js
// Protected routes for viewing and managing user score history

import express from 'express';
import { getMyScores, deleteScore } from '../controllers/scoreController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All score routes require authentication
router.use(protect);

// GET /api/scores - Get all score records of authenticated user
router.route('/').get(getMyScores);

// DELETE /api/scores/:id - Delete a score record
router.route('/:id').delete(deleteScore);

export default router;

