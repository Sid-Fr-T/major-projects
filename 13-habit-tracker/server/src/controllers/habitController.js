// server/src/controllers/habitController.js
// Handles full CRUD operations and completion toggling for habits, scoped to the authenticated user

import mongoose from 'mongoose';
import Habit from '../models/Habit.js';

/**
 * @desc    Get all habits for the logged-in user
 * @route   GET /api/habits
 * @access  Private
 */
export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(habits);
  } catch (error) {
    console.error(`Get Habits Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving habits', error: error.message });
  }
};

/**
 * @desc    Get a single habit by ID (must belong to logged-in user)
 * @route   GET /api/habits/:id
 * @access  Private
 */
export const getHabitById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Habit not found (invalid ID format)' });
    }

    const habit = await Habit.findById(id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this habit' });
    }

    return res.status(200).json(habit);
  } catch (error) {
    console.error(`Get Habit Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving habit', error: error.message });
  }
};

/**
 * @desc    Create a new habit for the logged-in user
 * @route   POST /api/habits
 * @access  Private
 */
export const createHabit = async (req, res) => {
  try {
    const { name, frequency } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Please provide a habit name' });
    }

    const validFrequency = ['daily', 'weekly'].includes(frequency) ? frequency : 'daily';

    const habit = await Habit.create({
      name: name.trim(),
      frequency: validFrequency,
      completedDates: [],
      user: req.user._id,
    });

    return res.status(201).json(habit);
  } catch (error) {
    console.error(`Create Habit Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error creating habit', error: error.message });
  }
};

/**
 * @desc    Update an existing habit by ID (must belong to logged-in user)
 * @route   PUT /api/habits/:id
 * @access  Private
 */
export const updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, frequency, completedDates } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Habit not found (invalid ID format)' });
    }

    const habit = await Habit.findById(id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this habit' });
    }

    if (name !== undefined) habit.name = name.trim();
    if (frequency !== undefined && ['daily', 'weekly'].includes(frequency)) {
      habit.frequency = frequency;
    }
    if (Array.isArray(completedDates)) {
      habit.completedDates = completedDates;
    }

    const updatedHabit = await habit.save();

    return res.status(200).json(updatedHabit);
  } catch (error) {
    console.error(`Update Habit Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error updating habit', error: error.message });
  }
};

/**
 * @desc    Toggle completion for a specific date (defaults to today)
 * @route   POST /api/habits/:id/toggle
 * @access  Private
 */
export const toggleHabitDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Habit not found (invalid ID format)' });
    }

    const habit = await Habit.findById(id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this habit' });
    }

    // Determine target date YYYY-MM-DD
    const targetDateStr = date
      ? (date.includes('T') ? date.split('T')[0] : date)
      : new Date().toISOString().split('T')[0];

    // Check if target date already exists in completedDates
    const existingIndex = habit.completedDates.findIndex((d) => {
      const dStr = new Date(d).toISOString().split('T')[0];
      return dStr === targetDateStr;
    });

    if (existingIndex > -1) {
      // Already completed for this date -> remove it (toggle off)
      habit.completedDates.splice(existingIndex, 1);
    } else {
      // Not completed for this date -> add it (toggle on)
      habit.completedDates.push(new Date(`${targetDateStr}T00:00:00.000Z`));
    }

    const updatedHabit = await habit.save();
    return res.status(200).json(updatedHabit);
  } catch (error) {
    console.error(`Toggle Habit Date Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error toggling habit date', error: error.message });
  }
};

/**
 * @desc    Delete a habit by ID (must belong to logged-in user)
 * @route   DELETE /api/habits/:id
 * @access  Private
 */
export const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Habit not found (invalid ID format)' });
    }

    const habit = await Habit.findById(id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this habit' });
    }

    await habit.deleteOne();

    return res.status(200).json({ message: 'Habit removed successfully', id });
  } catch (error) {
    console.error(`Delete Habit Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error deleting habit', error: error.message });
  }
};

