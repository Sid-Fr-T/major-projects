// server/src/controllers/complaintController.js
// Handles CRUD operations for complaints, role-based visibility, and admin remark/status updates

import mongoose from 'mongoose';
import Complaint from '../models/Complaint.js';

/**
 * @desc    Get complaints (Admin views all complaints; regular user views their own)
 * @route   GET /api/complaints
 * @access  Private
 */
export const getComplaints = async (req, res) => {
  try {
    const query = {};

    // Regular users can only see their own complaints
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    // Optional status filter
    if (req.query.status && ['open', 'in-progress', 'resolved'].includes(req.query.status)) {
      query.status = req.query.status;
    }

    // Optional category filter
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    const complaints = await Complaint.find(query)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json(complaints);
  } catch (error) {
    console.error(`Get Complaints Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving complaints', error: error.message });
  }
};

/**
 * @desc    Get a single complaint by ID
 * @route   GET /api/complaints/:id
 * @access  Private
 */
export const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Complaint not found (invalid ID format)' });
    }

    const complaint = await Complaint.findById(id).populate('user', 'name email role');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Allow access only to admin or the owner
    const isOwner = complaint.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    return res.status(200).json(complaint);
  } catch (error) {
    console.error(`Get Complaint Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving complaint', error: error.message });
  }
};

/**
 * @desc    Raise a new complaint
 * @route   POST /api/complaints
 * @access  Private
 */
export const createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Please provide a complaint title' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Please provide a complaint description' });
    }

    const complaint = await Complaint.create({
      title: title.trim(),
      description: description.trim(),
      category: category && category.trim() ? category.trim() : 'General',
      status: 'open',
      remark: '',
      user: req.user._id,
    });

    const populated = await complaint.populate('user', 'name email role');

    return res.status(201).json(populated);
  } catch (error) {
    console.error(`Create Complaint Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error creating complaint', error: error.message });
  }
};

/**
 * @desc    Update complaint details or status with remark
 *          Admins can update status and remark.
 *          Complaint owners can update title, description, category while open.
 * @route   PUT /api/complaints/:id
 * @access  Private
 */
export const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, status, remark } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Complaint not found (invalid ID format)' });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = complaint.user.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to update this complaint' });
    }

    // Admin updates: status and remark
    if (isAdmin) {
      if (status !== undefined) {
        if (!['open', 'in-progress', 'resolved'].includes(status)) {
          return res.status(400).json({
            message: 'Invalid status value. Must be open, in-progress, or resolved.',
          });
        }
        complaint.status = status;
      }

      if (remark !== undefined) {
        complaint.remark = remark.trim();
      }
    }

    // Owner (or admin) updates: title, description, category
    if (isOwner || isAdmin) {
      if (title !== undefined && title.trim()) {
        complaint.title = title.trim();
      }
      if (description !== undefined && description.trim()) {
        complaint.description = description.trim();
      }
      if (category !== undefined && category.trim()) {
        complaint.category = category.trim();
      }
    }

    const updatedComplaint = await complaint.save();
    const populated = await updatedComplaint.populate('user', 'name email role');

    return res.status(200).json(populated);
  } catch (error) {
    console.error(`Update Complaint Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error updating complaint', error: error.message });
  }
};

/**
 * @desc    Delete a complaint (allowed for admin or the user who created it)
 * @route   DELETE /api/complaints/:id
 * @access  Private
 */
export const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Complaint not found (invalid ID format)' });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = complaint.user.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this complaint' });
    }

    await complaint.deleteOne();

    return res.status(200).json({ message: 'Complaint removed successfully', id });
  } catch (error) {
    console.error(`Delete Complaint Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error deleting complaint', error: error.message });
  }
};

