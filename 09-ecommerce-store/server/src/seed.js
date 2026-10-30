// server/src/seed.js
// Standalone script to populate the database with the 8 initial products

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import seedProducts from './data/seedProducts.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing products and re-seed
    await Product.deleteMany({});
    console.log('Existing products cleared.');

    const createdProducts = await Product.insertMany(seedProducts);
    console.log(`Successfully seeded ${createdProducts.length} products!`);

    await mongoose.disconnect();
    console.log('MongoDB disconnected. Seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedDB();

