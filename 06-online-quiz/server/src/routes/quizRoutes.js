// server/src/routes/quizRoutes.js
// Protected routes for viewing, taking, submitting, and creating quizzes

import express from 'express';
import {
  getQuizzes,
  getQuizById,
  submitQuiz,
  createQuiz,
  deleteQuiz,
} from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All quiz routes require authentication
router.use(protect);

// GET /api/quizzes - List all available quizzes
// POST /api/quizzes - Create a new quiz
router.route('/').get(getQuizzes).post(createQuiz);

// GET /api/quizzes/:id - Get quiz questions (answers stripped)
// DELETE /api/quizzes/:id - Delete a quiz
router.route('/:id').get(getQuizById).delete(deleteQuiz);

// POST /api/quizzes/:id/submit - Submit answers and calculate score
router.route('/:id/submit').post(submitQuiz);

export default router;

