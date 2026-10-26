// server/src/models/Note.js
// Defines the Note schema and model, associating each note with a specific user

import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a note title'],
      trim: true,
    },
    content: {
      type: String,
      trim: true,
      default: '',
    },
    color: {
      type: String,
      default: '#ffffff',
      trim: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Note must belong to a user'],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

const Note = mongoose.model('Note', noteSchema);

export default Note;

