// server/src/routes/expenseRoutes.js
// Protected routes for CRUD operations on Expense resources

import express from 'express';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to protect all expense routes
router.use(protect);

// GET /api/expenses - Retrieve all expenses/incomes of authenticated user
// POST /api/expenses - Create a new expense/income for authenticated user
router.route('/').get(getExpenses).post(createExpense);

// GET /api/expenses/:id - Retrieve specific expense
// PUT /api/expenses/:id - Update specific expense
// DELETE /api/expenses/:id - Delete specific expense
router.route('/:id').get(getExpenseById).put(updateExpense).delete(deleteExpense);

export default router;

