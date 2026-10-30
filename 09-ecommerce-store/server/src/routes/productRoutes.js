// server/src/routes/productRoutes.js
// Routes for Product operations

import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products - Get all products (with optional ?search=)
// POST /api/products - Create a new product (Protected)
router.route('/')
  .get(getProducts)
  .post(protect, createProduct);

// GET /api/products/:id - Get single product
// PUT /api/products/:id - Update product (Protected)
// DELETE /api/products/:id - Delete product (Protected)
router.route('/:id')
  .get(getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

export default router;

