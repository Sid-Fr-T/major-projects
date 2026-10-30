// server/src/models/Message.js
// Defines the Message schema and model for real-time global chat

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Message must have a sender'],
    },
    text: {
      type: String,
      required: [true, 'Message text cannot be empty'],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically provides createdAt and updatedAt
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;

