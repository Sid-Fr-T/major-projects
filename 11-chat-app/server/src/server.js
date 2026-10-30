// server/src/server.js
// Main entry point for the Express backend server with Socket.IO real-time chat

import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import User from './models/User.js';
import Message from './models/Message.js';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS settings
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Attach io instance to express app so routes/controllers can access it
app.set('io', io);

// Middleware: Enable Cross-Origin Resource Sharing
app.use(cors());

// Middleware: Parse incoming JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Root / Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Chat API is running...' });
});

// 404 Not Found handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(`Unhandled Error: ${err.stack || err.message}`);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Track online users: Map socket.id -> userId
const onlineUsers = new Map();

const getOnlineCount = () => {
  const uniqueUsers = new Set();
  let anonymousSockets = 0;
  for (const userId of onlineUsers.values()) {
    if (userId) {
      uniqueUsers.add(userId.toString());
    } else {
      anonymousSockets++;
    }
  }
  // If authenticated users exist, count unique users; otherwise fallback to socket count
  const count = uniqueUsers.size + anonymousSockets;
  return Math.max(count, 0);
};

const broadcastOnlineCount = () => {
  const count = getOnlineCount();
  io.emit('onlineCount', count);
};

// Authenticate socket connections using JWT if provided in handshake
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        socket.user = user;
      }
    } catch (err) {
      console.warn('Socket authentication warning:', err.message);
    }
  }
  next();
});

// Socket.IO event handlers
io.on('connection', (socket) => {
  const userId = socket.user ? socket.user._id : null;
  onlineUsers.set(socket.id, userId);

  // Send current online count immediately to newly connected client and broadcast to all
  broadcastOnlineCount();

  // Allow client to authenticate after connecting if token wasn't ready
  socket.on('authenticate', async (token) => {
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          socket.user = user;
          onlineUsers.set(socket.id, user._id);
          broadcastOnlineCount();
        }
      }
    } catch (err) {
      console.warn('Socket late authenticate error:', err.message);
    }
  });

  // Handle new incoming chat message
  socket.on('sendMessage', async (data) => {
    try {
      const text = typeof data === 'string' ? data : data?.text;
      if (!text || !text.trim()) return;

      let senderId = socket.user?._id;

      // Fallback: check if token was supplied with the payload
      if (!senderId && data?.token) {
        try {
          const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
          senderId = decoded.id;
        } catch {
          // Token invalid
        }
      }

      if (!senderId) {
        socket.emit('chatError', { message: 'Authentication required to send messages.' });
        return;
      }

      // Save message in MongoDB
      const message = await Message.create({
        text: text.trim(),
        sender: senderId,
      });

      // Populate sender details (name, email)
      const populatedMessage = await message.populate('sender', 'name email');

      // Broadcast message instantly to all connected clients
      io.emit('receiveMessage', populatedMessage);
    } catch (error) {
      console.error(`Socket sendMessage Error: ${error.message}`);
      socket.emit('chatError', { message: 'Failed to send message.' });
    }
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);
    broadcastOnlineCount();
  });
});

// Start the HTTP & Socket.IO server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
