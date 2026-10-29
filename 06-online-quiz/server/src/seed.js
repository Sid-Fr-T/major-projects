// server/src/seed.js
// Standalone script to seed sample quizzes into MongoDB

import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Quiz from './models/Quiz.js';
import { sampleQuizzes } from './config/seedData.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    console.log('Clearing existing quizzes...');
    await Quiz.deleteMany({});
    console.log('Seeding 2 sample quizzes with 5 questions each...');
    const createdQuizzes = await Quiz.insertMany(sampleQuizzes);
    console.log(`Successfully seeded ${createdQuizzes.length} quizzes:`);
    createdQuizzes.forEach((q, idx) => {
      console.log(` ${idx + 1}. "${q.title}" (${q.questions.length} questions)`);
    });
    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exit(1);
  }
};

seed();

