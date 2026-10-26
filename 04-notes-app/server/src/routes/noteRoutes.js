// server/src/routes/noteRoutes.js
// Protected routes for CRUD operations on Note resources

import express from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/noteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to protect all note routes
router.use(protect);

// GET /api/notes - Retrieve all notes of authenticated user (pinned first)
// POST /api/notes - Create a new note for authenticated user
router.route('/').get(getNotes).post(createNote);

// GET /api/notes/:id - Retrieve specific note
// PUT /api/notes/:id - Update specific note (including pin toggle)
// DELETE /api/notes/:id - Delete specific note
router.route('/:id').get(getNoteById).put(updateNote).delete(deleteNote);

export default router;

