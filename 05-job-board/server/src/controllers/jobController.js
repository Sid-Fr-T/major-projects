// server/src/controllers/jobController.js
// Handles full CRUD operations for Job postings and applicant applications

import mongoose from 'mongoose';
import Job from '../models/Job.js';

/**
 * Helper to format job response based on requesting user's identity and role
 */
const formatJobForUser = (job, user) => {
  const isOwner = job.createdBy.toString() === user._id.toString();
  const hasApplied = job.applicants.some(
    (app) => app.user.toString() === user._id.toString()
  );

  return {
    _id: job._id,
    title: job.title,
    company: job.company,
    location: job.location,
    salary: job.salary,
    description: job.description,
    createdBy: job.createdBy,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    applicantCount: job.applicants.length,
    hasApplied,
    // Only disclose applicant details to the job owner recruiter
    applicants: isOwner ? job.applicants : undefined,
  };
};

/**
 * @desc    Get all jobs (or only current recruiter's jobs if ?my=true)
 * @route   GET /api/jobs
 * @access  Private (Applicants & Recruiters)
 */
export const getJobs = async (req, res) => {
  try {
    const filter = req.query.my === 'true' ? { createdBy: req.user._id } : {};
    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    const formatted = jobs.map((job) => formatJobForUser(job, req.user));
    return res.status(200).json(formatted);
  } catch (error) {
    console.error(`Get Jobs Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving jobs', error: error.message });
  }
};

/**
 * @desc    Get recruiter's own posted jobs with applicant lists
 * @route   GET /api/jobs/my
 * @access  Private (Recruiters only)
 */
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    const formatted = jobs.map((job) => formatJobForUser(job, req.user));
    return res.status(200).json(formatted);
  } catch (error) {
    console.error(`Get My Jobs Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving recruiter jobs', error: error.message });
  }
};

/**
 * @desc    Get single job by ID
 * @route   GET /api/jobs/:id
 * @access  Private
 */
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Job not found (invalid ID format)' });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    return res.status(200).json(formatJobForUser(job, req.user));
  } catch (error) {
    console.error(`Get Job Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving job', error: error.message });
  }
};

/**
 * @desc    Create a new job posting
 * @route   POST /api/jobs
 * @access  Private (Recruiters only)
 */
export const createJob = async (req, res) => {
  try {
    const { title, company, location, salary, description } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({
        message: 'Please provide title, company, location, and description',
      });
    }

    const job = await Job.create({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      salary: salary ? salary.trim() : '',
      description: description.trim(),
      createdBy: req.user._id,
      applicants: [],
    });

    return res.status(201).json(formatJobForUser(job, req.user));
  } catch (error) {
    console.error(`Create Job Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error creating job', error: error.message });
  }
};

/**
 * @desc    Update an existing job posting (owner recruiter only)
 * @route   PUT /api/jobs/:id
 * @access  Private (Recruiters only)
 */
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, location, salary, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Job not found (invalid ID format)' });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Ensure the job belongs to the authenticated recruiter
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this job posting' });
    }

    if (title !== undefined) job.title = title.trim();
    if (company !== undefined) job.company = company.trim();
    if (location !== undefined) job.location = location.trim();
    if (salary !== undefined) job.salary = salary.trim();
    if (description !== undefined) job.description = description.trim();

    const updatedJob = await job.save();
    return res.status(200).json(formatJobForUser(updatedJob, req.user));
  } catch (error) {
    console.error(`Update Job Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error updating job', error: error.message });
  }
};

/**
 * @desc    Delete a job posting (owner recruiter only)
 * @route   DELETE /api/jobs/:id
 * @access  Private (Recruiters only)
 */
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Job not found (invalid ID format)' });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Ensure the job belongs to the authenticated recruiter
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job posting' });
    }

    await job.deleteOne();
    return res.status(200).json({ message: 'Job posting deleted successfully', id });
  } catch (error) {
    console.error(`Delete Job Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error deleting job', error: error.message });
  }
};

/**
 * @desc    Apply to a job posting (applicant can apply once per job)
 * @route   POST /api/jobs/:id/apply
 * @access  Private (Applicants only)
 */
export const applyJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Job not found (invalid ID format)' });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the applicant has already applied
    const alreadyApplied = job.applicants.some(
      (app) => app.user.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Record the application
    job.applicants.push({
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      appliedAt: new Date(),
    });

    await job.save();

    return res.status(200).json({
      message: 'Application submitted successfully',
      jobId: job._id,
      hasApplied: true,
      applicantCount: job.applicants.length,
    });
  } catch (error) {
    console.error(`Apply Job Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error applying to job', error: error.message });
  }
};

