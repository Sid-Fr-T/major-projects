// server/src/routes/portfolioRoutes.js
// Routes for portfolio profile data (about text and skills)

import express from 'express';
import { getPortfolio, updatePortfolio } from '../controllers/portfolioController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/portfolio - Public: Fetch full portfolio content (about, skills, projects)
router.get('/', getPortfolio);

// PUT /api/portfolio - Private (Admin only): Update about text and skills
router.put('/', protect, adminOnly, updatePortfolio);

export default router;

