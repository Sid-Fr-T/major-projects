// server/src/routes/jobRoutes.js
// Protected routes for Job CRUD and applicant applications with role-based authorization

import express from 'express';
import {
  getJobs,
  getMyJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyJob,
} from '../controllers/jobController.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

// Apply auth middleware to protect all job routes
router.use(protect);

// Retrieve all jobs (or query ?my=true)
router.get('/', getJobs);

// Recruiter-specific: view recruiter's own posted jobs with applicant lists
router.get('/my', requireRole('recruiter'), getMyJobs);

// Retrieve single job details
router.get('/:id', getJobById);

// Recruiter-specific: create a new job posting
router.post('/', requireRole('recruiter'), createJob);

// Recruiter-specific: update a job posting
router.put('/:id', requireRole('recruiter'), updateJob);

// Recruiter-specific: delete a job posting
router.delete('/:id', requireRole('recruiter'), deleteJob);

// Applicant-specific: apply once to a job posting
router.post('/:id/apply', requireRole('applicant', 'user'), applyJob);

export default router;

