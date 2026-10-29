// server/src/models/Link.js
// Defines the Link schema with original URL, random 6-character shortCode, click counter, and user reference

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
      minlength: 6,
      maxlength: 6,
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Link = mongoose.model('Link', linkSchema);

export default Link;

