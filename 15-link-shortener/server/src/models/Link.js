// server/src/models/Link.js
// Defines the Link schema and model for shortened URLs

import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, 'Please provide the original URL'],
      trim: true,
    },
    shortCode: {
      type: String,
      required: [true, 'Short code is required'],
      unique: true,
      trim: true,
      index: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Link must belong to a user'],
    },
  },
  {
    timestamps: true,
  }
);

const Link = mongoose.model('Link', linkSchema);

export default Link;

