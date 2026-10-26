// server/src/controllers/itemController.js
// Handles full CRUD operations for items, scoped strictly to the authenticated user

import mongoose from 'mongoose';
import Item from '../models/Item.js';

/**
 * @desc    Get all items for the logged-in user
 * @route   GET /api/items
 * @access  Private
 */
export const getItems = async (req, res) => {
  try {
    // Only return items belonging to the authenticated user
    const items = await Item.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (error) {
    console.error(`Get Items Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving items', error: error.message });
  }
};

/**
 * @desc    Get a single item by ID (must belong to logged-in user)
 * @route   GET /api/items/:id
 * @access  Private
 */
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Item not found (invalid ID format)' });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Ensure the item belongs to the authenticated user
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this item' });
    }

    return res.status(200).json(item);
  } catch (error) {
    console.error(`Get Item Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving item', error: error.message });
  }
};

/**
 * @desc    Create a new item for the logged-in user
 * @route   POST /api/items
 * @access  Private
 */
export const createItem = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Please provide an item title' });
    }

    // Create item associated with the authenticated user ID
    const item = await Item.create({
      title,
      description: description || '',
      status: status || 'pending',
      user: req.user._id,
    });

    return res.status(201).json(item);
  } catch (error) {
    console.error(`Create Item Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error creating item', error: error.message });
  }
};

/**
 * @desc    Update an existing item by ID (must belong to logged-in user)
 * @route   PUT /api/items/:id
 * @access  Private
 */
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Item not found (invalid ID format)' });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Ensure the item belongs to the authenticated user
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this item' });
    }

    // Update fields if provided
    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (status !== undefined) item.status = status;

    const updatedItem = await item.save();

    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error(`Update Item Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error updating item', error: error.message });
  }
};

/**
 * @desc    Delete an item by ID (must belong to logged-in user)
 * @route   DELETE /api/items/:id
 * @access  Private
 */
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Item not found (invalid ID format)' });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Ensure the item belongs to the authenticated user
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();

    return res.status(200).json({ message: 'Item removed successfully', id });
  } catch (error) {
    console.error(`Delete Item Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error deleting item', error: error.message });
  }
};

