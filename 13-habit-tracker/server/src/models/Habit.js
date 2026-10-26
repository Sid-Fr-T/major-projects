// server/src/models/Habit.js
// Defines the Habit schema and model, associating each habit with a specific user

import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a habit name'],
      trim: true,
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly'],
      default: 'daily',
    },
    completedDates: {
      type: [Date],
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Habit must belong to a user'],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

const Habit = mongoose.model('Habit', habitSchema);

export default Habit;

