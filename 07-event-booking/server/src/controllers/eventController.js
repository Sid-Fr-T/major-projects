// server/src/controllers/eventController.js
// Handles CRUD operations, public event viewing, user registrations, and cancellations

import mongoose from 'mongoose';
import Event from '../models/Event.js';

/**
 * @desc    Get all events (public access)
 * @route   GET /api/events
 * @access  Public
 */
export const getEvents = async (req, res) => {
  try {
    // Sort upcoming events chronologically by date
    const events = await Event.find().sort({ date: 1 });
    return res.status(200).json(events);
  } catch (error) {
    console.error(`Get Events Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving events', error: error.message });
  }
};

/**
 * @desc    Get events registered by the authenticated user ("My Bookings")
 * @route   GET /api/events/my-bookings
 * @access  Private
 */
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Event.find({ registeredUsers: req.user._id }).sort({ date: 1 });
    return res.status(200).json(bookings);
  } catch (error) {
    console.error(`Get My Bookings Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving your bookings', error: error.message });
  }
};

/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Event not found (invalid ID format)' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error(`Get Event Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving event', error: error.message });
  }
};

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private
 */
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, seats } = req.body;

    if (!title || !date || !location || seats === undefined) {
      return res.status(400).json({ message: 'Please provide title, date, location, and seats' });
    }

    const numericSeats = parseInt(seats, 10);
    if (isNaN(numericSeats) || numericSeats < 0) {
      return res.status(400).json({ message: 'Seats must be a non-negative number' });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Please provide a valid date' });
    }

    const event = await Event.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      date: parsedDate,
      location: location.trim(),
      seats: numericSeats,
      registeredUsers: [],
      createdBy: req.user._id,
    });

    return res.status(201).json(event);
  } catch (error) {
    console.error(`Create Event Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error creating event', error: error.message });
  }
};

/**
 * @desc    Register (book) for an event (seats decrease, duplicate check)
 * @route   POST /api/events/:id/register
 * @access  Private
 */
export const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Event not found (invalid ID format)' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is already registered (prevent duplicates)
    const alreadyRegistered = event.registeredUsers.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Check seat availability
    if (event.seats <= 0) {
      return res.status(400).json({ message: 'Sorry, this event is fully booked' });
    }

    // Deduct one seat and add user to registeredUsers list
    event.seats -= 1;
    event.registeredUsers.push(req.user._id);
    await event.save();

    return res.status(200).json({
      message: 'Successfully registered for the event!',
      event,
    });
  } catch (error) {
    console.error(`Register Event Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error registering for event', error: error.message });
  }
};

/**
 * @desc    Cancel an existing booking (seats increase, removed from registeredUsers)
 * @route   POST /api/events/:id/cancel
 * @access  Private
 */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Event not found (invalid ID format)' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user has an active booking for this event
    const registeredIndex = event.registeredUsers.findIndex(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (registeredIndex === -1) {
      return res.status(400).json({ message: 'You have not booked this event' });
    }

    // Remove user and return 1 seat to availability
    event.registeredUsers.splice(registeredIndex, 1);
    event.seats += 1;
    await event.save();

    return res.status(200).json({
      message: 'Booking cancelled successfully',
      event,
    });
  } catch (error) {
    console.error(`Cancel Booking Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error cancelling booking', error: error.message });
  }
};

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Private
 */
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Event not found (invalid ID format)' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.deleteOne();
    return res.status(200).json({ message: 'Event deleted successfully', id });
  } catch (error) {
    console.error(`Delete Event Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error deleting event', error: error.message });
  }
};

