// server/src/routes/complaintRoutes.js
// Protected routes for CRUD operations on Complaint resources

import express from 'express';
import {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint,
} from '../controllers/complaintController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all complaint routes with JWT authentication
router.use(protect);

// GET /api/complaints - Retrieve complaints (admin gets all, user gets own)
// POST /api/complaints - Raise a new complaint
router.route('/').get(getComplaints).post(createComplaint);

// GET /api/complaints/:id - Retrieve specific complaint details
// PUT /api/complaints/:id - Update complaint or update status with remark
// DELETE /api/complaints/:id - Delete complaint
router.route('/:id').get(getComplaintById).put(updateComplaint).delete(deleteComplaint);

export default router;

