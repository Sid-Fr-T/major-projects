// server/src/models/Score.js
// Stores quiz attempt scores and performance history for authenticated users

import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Score must belong to a user'],
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'Score must be associated with a quiz'],
    },
    quizTitle: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
    },
    score: {
      type: Number,
      required: [true, 'Score count is required'],
    },
    totalQuestions: {
      type: Number,
      required: [true, 'Total questions count is required'],
    },
    percentage: {
      type: Number,
      required: [true, 'Percentage is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Score = mongoose.model('Score', scoreSchema);

export default Score;

