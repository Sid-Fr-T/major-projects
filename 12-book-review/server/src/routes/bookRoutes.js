// server/src/routes/bookRoutes.js
// Protected routes for Books and Reviews operations

import express from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  deleteBook,
  addReview,
  deleteReview,
} from '../controllers/bookController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to protect all book routes
router.use(protect);

// Books endpoints
router.route('/').get(getBooks).post(createBook);
router.route('/:id').get(getBookById).delete(deleteBook);

// Reviews endpoints
router.route('/:id/reviews').post(addReview);
router.route('/:bookId/reviews/:reviewId').delete(deleteReview);

export default router;

