// server/src/controllers/projectController.js
// Handles CRUD operations for portfolio projects

import Project from '../models/Project.js';

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Public
 */
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json(projects);
  } catch (error) {
    console.error(`Get Projects Error: ${error.message}`);
    return res.status(500).json({ message: 'Failed to retrieve projects', error: error.message });
  }
};

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/:id
 * @access  Public
 */
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error(`Get Project Error: ${error.message}`);
    return res.status(500).json({ message: 'Failed to retrieve project', error: error.message });
  }
};

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (Admin only)
 */
export const createProject = async (req, res) => {
  try {
    const { title, description, link, imageUrl } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Project title is required' });
    }

    const project = await Project.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      link: link ? link.trim() : '',
      imageUrl: imageUrl ? imageUrl.trim() : '',
      user: req.user._id,
    });

    return res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    console.error(`Create Project Error: ${error.message}`);
    return res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
};

/**
 * @desc    Update project by ID
 * @route   PUT /api/projects/:id
 * @access  Private (Admin only)
 */
export const updateProject = async (req, res) => {
  try {
    const { title, description, link, imageUrl } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (title !== undefined) project.title = title.trim();
    if (description !== undefined) project.description = description.trim();
    if (link !== undefined) project.link = link.trim();
    if (imageUrl !== undefined) project.imageUrl = imageUrl.trim();

    const updatedProject = await project.save();

    return res.status(200).json({
      message: 'Project updated successfully',
      project: updatedProject,
    });
  } catch (error) {
    console.error(`Update Project Error: ${error.message}`);
    return res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
};

/**
 * @desc    Delete project by ID
 * @route   DELETE /api/projects/:id
 * @access  Private (Admin only)
 */
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: 'Project deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    console.error(`Delete Project Error: ${error.message}`);
    return res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
};

