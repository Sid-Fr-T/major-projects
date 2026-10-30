// server/src/controllers/portfolioController.js
// Handles fetching and updating portfolio details (about text, skills, title, projects)

import Portfolio from '../models/Portfolio.js';
import Project from '../models/Project.js';

// Seed sample projects if none exist
const seedInitialProjects = async () => {
  const count = await Project.countDocuments();
  if (count === 0) {
    await Project.insertMany([
      {
        title: 'E-Commerce Storefront',
        description: 'A responsive full-stack online store with shopping cart, filterable product catalog, and checkout flow.',
        link: 'https://github.com',
        imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Task & Workflow Manager',
        description: 'Collaborative productivity dashboard with drag-and-drop task boards, real-time status updates, and team analytics.',
        link: 'https://github.com',
        imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Cloud Analytics Platform',
        description: 'Modern data visualization dashboard showcasing interactive charts, usage metrics, and automated reporting.',
        link: 'https://github.com',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      },
    ]);
  }
};

/**
 * @desc    Get full portfolio content (about, skills, and projects)
 * @route   GET /api/portfolio
 * @access  Public
 */
export const getPortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();

    if (!portfolio) {
      portfolio = await Portfolio.create({});
      await seedInitialProjects();
    }

    const projects = await Project.find().sort({ createdAt: -1 });

    return res.status(200).json({
      _id: portfolio._id,
      name: portfolio.name,
      title: portfolio.title,
      about: portfolio.about,
      skills: portfolio.skills,
      projects,
      updatedAt: portfolio.updatedAt,
    });
  } catch (error) {
    console.error(`Get Portfolio Error: ${error.message}`);
    return res.status(500).json({ message: 'Failed to retrieve portfolio data', error: error.message });
  }
};

/**
 * @desc    Update portfolio details (about text, skills, title, name)
 * @route   PUT /api/portfolio
 * @access  Private (Admin only)
 */
export const updatePortfolio = async (req, res) => {
  try {
    const { name, title, about, skills } = req.body;

    let portfolio = await Portfolio.findOne();

    if (!portfolio) {
      portfolio = new Portfolio();
    }

    if (name !== undefined) portfolio.name = name;
    if (title !== undefined) portfolio.title = title;
    if (about !== undefined) portfolio.about = about;

    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        portfolio.skills = skills.map((s) => String(s).trim()).filter(Boolean);
      } else if (typeof skills === 'string') {
        portfolio.skills = skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    await portfolio.save();

    return res.status(200).json({
      message: 'Portfolio details updated successfully',
      portfolio,
    });
  } catch (error) {
    console.error(`Update Portfolio Error: ${error.message}`);
    return res.status(500).json({ message: 'Failed to update portfolio data', error: error.message });
  }
};

