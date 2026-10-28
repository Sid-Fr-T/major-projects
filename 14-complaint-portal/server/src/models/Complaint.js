// server/src/models/Complaint.js
// Defines the Complaint schema and model for tracking issues, categories, status, and admin remarks

import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a complaint title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a complaint description'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a complaint category'],
      trim: true,
      default: 'General',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved'],
      default: 'open',
    },
    remark: {
      type: String,
      trim: true,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Complaint must belong to a user'],
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;

