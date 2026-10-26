// server/src/controllers/taskController.js
// Handles full CRUD operations for tasks, scoped strictly to the authenticated user

import mongoose from 'mongoose';
import Task from '../models/Task.js';

/**
 * @desc    Get all tasks for the logged-in user (optional ?status= query filter)
 * @route   GET /api/tasks
 * @access  Private
 */
export const getTasks = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }

    // Only return tasks belonging to the authenticated user
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error(`Get Tasks Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving tasks', error: error.message });
  }
};

/**
 * @desc    Get a single task by ID (must belong to logged-in user)
 * @route   GET /api/tasks/:id
 * @access  Private
 */
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Task not found (invalid ID format)' });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure the task belongs to the authenticated user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this task' });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error(`Get Task Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving task', error: error.message });
  }
};

/**
 * @desc    Create a new task for the logged-in user
 * @route   POST /api/tasks
 * @access  Private
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Please provide a task title' });
    }

    // Create task associated with the authenticated user ID
    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      user: req.user._id,
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error(`Create Task Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error creating task', error: error.message });
  }
};

/**
 * @desc    Update an existing task by ID (must belong to logged-in user)
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Task not found (invalid ID format)' });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure the task belongs to the authenticated user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this task' });
    }

    // Update fields if provided
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) {
      task.dueDate = dueDate ? new Date(dueDate) : null;
    }

    const updatedTask = await task.save();

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error(`Update Task Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error updating task', error: error.message });
  }
};

/**
 * @desc    Delete a task by ID (must belong to logged-in user)
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Task not found (invalid ID format)' });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure the task belongs to the authenticated user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    return res.status(200).json({ message: 'Task removed successfully', id });
  } catch (error) {
    console.error(`Delete Task Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error deleting task', error: error.message });
  }
};

