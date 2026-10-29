// server/src/models/Event.js
// Defines the Event schema and model for event booking management

import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Please provide an event date'],
    },
    location: {
      type: String,
      required: [true, 'Please provide an event location'],
      trim: true,
    },
    seats: {
      type: Number,
      required: [true, 'Please provide the number of available seats'],
      min: [0, 'Seats cannot be negative'],
      default: 0,
    },
    registeredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);

export default Event;

