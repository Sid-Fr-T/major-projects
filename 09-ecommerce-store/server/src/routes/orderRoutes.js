// server/src/routes/orderRoutes.js
// Protected routes for Order creation, order history, and payment

import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  payOrder,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All order routes are protected by authentication
router.use(protect);

router.route('/')
  .get(getMyOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrderById);

router.route('/:id/pay')
  .put(payOrder);

export default router;

