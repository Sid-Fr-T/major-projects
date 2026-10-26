// server/src/server.js
// Main entry point for the Express backend server

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware: Enable Cross-Origin Resource Sharing
app.use(cors());

// Middleware: Parse incoming JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// Root / Health check route
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
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

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

