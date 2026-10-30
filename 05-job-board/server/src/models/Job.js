// server/src/models/Job.js
// Defines the Job schema and model, associating each job with its recruiter creator and applicants

import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please provide a company name'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide a job location'],
      trim: true,
    },
    salary: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description'],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Job must belong to a recruiter'],
    },
    applicants: [applicantSchema],
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;

