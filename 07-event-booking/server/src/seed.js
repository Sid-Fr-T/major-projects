// server/src/seed.js
// Standalone script to seed 5 sample events into MongoDB

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Event from './models/Event.js';
import { seedEvents } from './config/seedData.js';

dotenv.config();

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('Error: MONGO_URI is not defined in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events collection.');

    // Insert seeded events
    const createdEvents = await Event.insertMany(seedEvents);
    console.log(`Successfully seeded ${createdEvents.length} events:`);
    createdEvents.forEach((event, idx) => {
      console.log(` ${idx + 1}. ${event.title} (${event.seats} seats) - ${event.location}`);
    });

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed database:', error);
    process.exit(1);
  }
};

seedDB();

