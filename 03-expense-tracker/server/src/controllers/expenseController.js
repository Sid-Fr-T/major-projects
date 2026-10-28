// server/src/controllers/expenseController.js
// Handles full CRUD operations for expenses, scoped strictly to the authenticated user

import mongoose from 'mongoose';
import Expense from '../models/Expense.js';

/**
 * @desc    Get all expenses/incomes for the logged-in user
 * @route   GET /api/expenses
 * @access  Private
 */
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 });
    return res.status(200).json(expenses);
  } catch (error) {
    console.error(`Get Expenses Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving expenses', error: error.message });
  }
};

/**
 * @desc    Get a single expense by ID (must belong to logged-in user)
 * @route   GET /api/expenses/:id
 * @access  Private
 */
export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Expense not found (invalid ID format)' });
    }

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this expense' });
    }

    return res.status(200).json(expense);
  } catch (error) {
    console.error(`Get Expense Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving expense', error: error.message });
  }
};

/**
 * @desc    Create a new expense/income for the logged-in user
 * @route   POST /api/expenses
 * @access  Private
 */
export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, type, date } = req.body;

    if (!title || amount === undefined || amount === null || !category || !type) {
      return res.status(400).json({ message: 'Please provide title, amount, category, and type' });
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return res.status(400).json({ message: 'Amount must be a non-negative number' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either income or expense' });
    }

    const expense = await Expense.create({
      title: title.trim(),
      amount: parsedAmount,
      category: category.trim(),
      type,
      date: date ? new Date(date) : new Date(),
      user: req.user._id,
    });

    return res.status(201).json(expense);
  } catch (error) {
    console.error(`Create Expense Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error creating expense', error: error.message });
  }
};

/**
 * @desc    Update an existing expense by ID (must belong to logged-in user)
 * @route   PUT /api/expenses/:id
 * @access  Private
 */
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, type, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Expense not found (invalid ID format)' });
    }

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this expense' });
    }

    if (title !== undefined) expense.title = title.trim();
    if (amount !== undefined) {
      const parsedAmount = Number(amount);
      if (isNaN(parsedAmount) || parsedAmount < 0) {
        return res.status(400).json({ message: 'Amount must be a non-negative number' });
      }
      expense.amount = parsedAmount;
    }
    if (category !== undefined) expense.category = category.trim();
    if (type !== undefined) {
      if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ message: 'Type must be either income or expense' });
      }
      expense.type = type;
    }
    if (date !== undefined) {
      expense.date = new Date(date);
    }

    const updatedExpense = await expense.save();
    return res.status(200).json(updatedExpense);
  } catch (error) {
    console.error(`Update Expense Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error updating expense', error: error.message });
  }
};

/**
 * @desc    Delete an expense by ID (must belong to logged-in user)
 * @route   DELETE /api/expenses/:id
 * @access  Private
 */
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Expense not found (invalid ID format)' });
    }

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }

    await expense.deleteOne();

    return res.status(200).json({ message: 'Expense removed successfully', id });
  } catch (error) {
    console.error(`Delete Expense Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error deleting expense', error: error.message });
  }
};

