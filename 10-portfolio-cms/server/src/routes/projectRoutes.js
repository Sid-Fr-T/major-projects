// server/src/routes/projectRoutes.js
// Routes for portfolio projects CRUD

import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/projects - Public: View all projects
router.get('/', getProjects);

// GET /api/projects/:id - Public: View single project details
router.get('/:id', getProjectById);

// POST /api/projects - Private (Admin only): Add new project
router.post('/', protect, adminOnly, createProject);

// PUT /api/projects/:id - Private (Admin only): Update existing project
router.put('/:id', protect, adminOnly, updateProject);

// DELETE /api/projects/:id - Private (Admin only): Remove project
router.delete('/:id', protect, adminOnly, deleteProject);

export default router;

