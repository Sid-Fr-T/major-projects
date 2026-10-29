// server/src/controllers/scoreController.js
// Handles retrieval and management of user quiz attempt score history

import mongoose from 'mongoose';
import Score from '../models/Score.js';

/**
 * @desc    Get all score records for the authenticated user
 * @route   GET /api/scores
 * @access  Private
 */
export const getMyScores = async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json(scores);
  } catch (error) {
    console.error(`Get Scores Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving scores', error: error.message });
  }
};

/**
 * @desc    Delete a score history record
 * @route   DELETE /api/scores/:id
 * @access  Private
 */
export const deleteScore = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Score record not found (invalid ID format)' });
    }

    const score = await Score.findById(id);

    if (!score) {
      return res.status(404).json({ message: 'Score record not found' });
    }

    if (score.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this score record' });
    }

    await score.deleteOne();

    return res.status(200).json({ message: 'Score record removed successfully', id });
  } catch (error) {
    console.error(`Delete Score Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error deleting score', error: error.message });
  }
};

