// server/src/controllers/messageController.js
// Handles message retrieval and creation for the global chat room

import Message from '../models/Message.js';

/**
 * @desc    Get all messages in the global chat room
 * @route   GET /api/messages
 * @access  Private
 */
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error(`Get Messages Error: ${error.message}`);
    return res.status(500).json({
      message: 'Server error retrieving messages',
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new message (REST endpoint backup for socket)
 * @route   POST /api/messages
 * @access  Private
 */
export const createMessage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text cannot be empty' });
    }

    const message = await Message.create({
      text: text.trim(),
      sender: req.user._id,
    });

    const populatedMessage = await message.populate('sender', 'name email');

    // If io is accessible via app, broadcast to connected sockets
    const io = req.app.get('io');
    if (io) {
      io.emit('receiveMessage', populatedMessage);
    }

    return res.status(201).json(populatedMessage);
  } catch (error) {
    console.error(`Create Message Error: ${error.message}`);
    return res.status(500).json({
      message: 'Server error creating message',
      error: error.message,
    });
  }
};

