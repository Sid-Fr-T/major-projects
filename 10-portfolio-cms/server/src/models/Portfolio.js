// server/src/models/Portfolio.js
// Defines the schema and model for portfolio profile data (about text, skills, title)

import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Developer Portfolio',
      trim: true,
    },
    title: {
      type: String,
      default: 'Full Stack Web Developer',
      trim: true,
    },
    about: {
      type: String,
      default:
        'Hello! I am a passionate full-stack developer with expertise in building modern, scalable web applications using the MERN stack. I love turning complex problems into elegant, user-friendly solutions.',
    },
    skills: {
      type: [String],
      default: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'HTML & CSS', 'Git'],
    },
  },
  {
    timestamps: true,
  }
);

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;

