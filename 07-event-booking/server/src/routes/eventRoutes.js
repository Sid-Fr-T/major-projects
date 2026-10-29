// server/src/routes/eventRoutes.js
// Routes for public event browsing, event creation, registration, and user booking management

import express from 'express';
import {
  getEvents,
  getMyBookings,
  getEventById,
  createEvent,
  registerForEvent,
  cancelBooking,
  deleteEvent,
} from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes: Anyone can view all events or a single event
router.get('/', getEvents);

// Protected routes: Authenticated users can retrieve their personal bookings
router.get('/my-bookings', protect, getMyBookings);

// Public route to view specific event details
router.get('/:id', getEventById);

// Protected route to create a new event
router.post('/', protect, createEvent);

// Protected routes to register and cancel registration for an event
router.post('/:id/register', protect, registerForEvent);
router.post('/:id/cancel', protect, cancelBooking);

// Protected route to delete an event
router.delete('/:id', protect, deleteEvent);

export default router;

