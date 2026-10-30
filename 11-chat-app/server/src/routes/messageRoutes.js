// server/src/routes/messageRoutes.js
// Protected routes for messages in the global chat room

import express from 'express';
import { getMessages, createMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware so only authenticated users can access messages
router.use(protect);

router.route('/').get(getMessages).post(createMessage);

export default router;

