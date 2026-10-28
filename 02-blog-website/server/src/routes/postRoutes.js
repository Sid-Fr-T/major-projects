// server/src/routes/postRoutes.js
// Routes for blog post operations: public reading and protected author management

import express from 'express';
import {
  getAllPosts,
  getPostById,
  getMyPosts,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes: anyone can read all posts or a single post
router.get('/', getAllPosts);
router.get('/mine', protect, getMyPosts);
router.get('/:id', getPostById);

// Protected routes: logged-in users can create, edit, and delete their own posts
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

export default router;

