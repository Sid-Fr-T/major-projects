// server/src/config/db.js
// Handles database connection to MongoDB using Mongoose

import mongoose from 'mongoose';

/**
 * Connect to MongoDB database using URI from environment variables
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

