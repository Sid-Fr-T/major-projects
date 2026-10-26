// server/src/controllers/noteController.js
// Handles full CRUD operations for notes, scoped strictly to the authenticated user

import mongoose from 'mongoose';
import Note from '../models/Note.js';

/**
 * @desc    Get all notes for the logged-in user (pinned notes first, then newest)
 * @route   GET /api/notes
 * @access  Private
 */
export const getNotes = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = { user: req.user._id };

    // Optional query parameter search across title and content
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: searchRegex }, { content: searchRegex }];
    }

    // Sort pinned notes first (true/1 before false/0), then latest created first
    const notes = await Note.find(filter).sort({ pinned: -1, createdAt: -1 });

    return res.status(200).json(notes);
  } catch (error) {
    console.error(`Get Notes Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving notes', error: error.message });
  }
};

/**
 * @desc    Get a single note by ID (must belong to logged-in user)
 * @route   GET /api/notes/:id
 * @access  Private
 */
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Note not found (invalid ID format)' });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Ensure the note belongs to the authenticated user
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this note' });
    }

    return res.status(200).json(note);
  } catch (error) {
    console.error(`Get Note Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving note', error: error.message });
  }
};

/**
 * @desc    Create a new note for the logged-in user
 * @route   POST /api/notes
 * @access  Private
 */
export const createNote = async (req, res) => {
  try {
    const { title, content, color, pinned } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Please provide a note title' });
    }

    // Create note associated with the authenticated user ID
    const note = await Note.create({
      title: title.trim(),
      content: content ? content.trim() : '',
      color: color || '#ffffff',
      pinned: Boolean(pinned),
      user: req.user._id,
    });

    return res.status(201).json(note);
  } catch (error) {
    console.error(`Create Note Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error creating note', error: error.message });
  }
};

/**
 * @desc    Update an existing note by ID (must belong to logged-in user)
 * @route   PUT /api/notes/:id
 * @access  Private
 */
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, color, pinned } = req.body;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Note not found (invalid ID format)' });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Ensure the note belongs to the authenticated user
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this note' });
    }

    // Update fields if provided
    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: 'Note title cannot be empty' });
      }
      note.title = title.trim();
    }
    if (content !== undefined) note.content = content.trim();
    if (color !== undefined) note.color = color;
    if (pinned !== undefined) note.pinned = Boolean(pinned);

    const updatedNote = await note.save();

    return res.status(200).json(updatedNote);
  } catch (error) {
    console.error(`Update Note Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error updating note', error: error.message });
  }
};

/**
 * @desc    Delete a note by ID (must belong to logged-in user)
 * @route   DELETE /api/notes/:id
 * @access  Private
 */
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Note not found (invalid ID format)' });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Ensure the note belongs to the authenticated user
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }

    await note.deleteOne();

    return res.status(200).json({ message: 'Note removed successfully', id });
  } catch (error) {
    console.error(`Delete Note Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error deleting note', error: error.message });
  }
};

