// server/src/controllers/orderController.js
// Handles order creation, fetching customer orders, and processing dummy payment

import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * @desc    Create a new order from checkout
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (total === undefined || isNaN(total) || total < 0) {
      return res.status(400).json({ message: 'A valid order total is required' });
    }

    // Process items and optionally adjust product stock
    const sanitizedItems = [];
    for (const item of items) {
      const quantity = Number(item.quantity) || 1;
      const price = Number(item.price);

      sanitizedItems.push({
        product: item._id || item.product || null,
        name: item.name,
        price,
        quantity,
        imageUrl: item.imageUrl || '',
      });

      // If item has a valid product ID, decrement its stock
      const productId = item._id || item.product;
      if (productId && mongoose.Types.ObjectId.isValid(productId)) {
        await Product.findByIdAndUpdate(productId, {
          $inc: { stock: -quantity },
        }).catch((err) => {
          console.warn(`Could not decrement stock for product ${productId}:`, err.message);
        });
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items: sanitizedItems,
      total: Number(total),
      status: 'pending',
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error(`Create Order Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error creating order', error: error.message });
  }
};

/**
 * @desc    Get all orders for the authenticated user
 * @route   GET /api/orders
 * @access  Private
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error(`Get Orders Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving orders', error: error.message });
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Order not found (invalid ID format)' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error(`Get Order Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving order', error: error.message });
  }
};

/**
 * @desc    Mark order as paid (Dummy Pay Now)
 * @route   PUT /api/orders/:id/pay
 * @access  Private
 */
export const payOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Order not found (invalid ID format)' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.status = 'paid';
    const updatedOrder = await order.save();

    return res.status(200).json({
      message: 'Payment received successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error(`Pay Order Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error processing payment', error: error.message });
  }
};

