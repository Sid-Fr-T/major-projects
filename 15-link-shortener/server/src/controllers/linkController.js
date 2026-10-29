// server/src/controllers/linkController.js
// Handles CRUD operations for Links and public short URL redirection with click tracking

import crypto from 'crypto';
import Link from '../models/Link.js';

/**
 * Generate a random 6-character alphanumeric string.
 */
const generateShortCode = (length = 6) => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randomBytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters[randomBytes[i] % characters.length];
  }
  return result;
};

/**
 * Normalizes a URL: trims whitespace and prepends 'https://' if no protocol is present.
 */
const normalizeUrl = (url) => {
  let trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }
  return trimmed;
};

/**
 * @desc    Get all links belonging to the authenticated user
 * @route   GET /api/links
 * @access  Private
 */
export const getLinks = async (req, res) => {
  try {
    const links = await Link.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(links);
  } catch (error) {
    console.error(`Get Links Error: ${error.message}`);
    res.status(500).json({ message: 'Failed to retrieve links' });
  }
};

/**
 * @desc    Create a new shortened link
 * @route   POST /api/links
 * @access  Private
 */
export const createLink = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl || !originalUrl.trim()) {
      return res.status(400).json({ message: 'Original URL is required' });
    }

    const formattedUrl = normalizeUrl(originalUrl);

    // Validate URL syntax
    try {
      new URL(formattedUrl);
    } catch {
      return res.status(400).json({ message: 'Please provide a valid URL' });
    }

    // Generate unique 6-character code
    let shortCode = generateShortCode();
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const existing = await Link.findOne({ shortCode });
      if (!existing) {
        isUnique = true;
      } else {
        shortCode = generateShortCode();
        attempts++;
      }
    }

    if (!isUnique) {
      return res.status(500).json({ message: 'Failed to generate a unique short code, please try again' });
    }

    const link = await Link.create({
      originalUrl: formattedUrl,
      shortCode,
      clicks: 0,
      user: req.user._id,
    });

    res.status(201).json(link);
  } catch (error) {
    console.error(`Create Link Error: ${error.message}`);
    res.status(500).json({ message: 'Failed to create short link' });
  }
};

/**
 * @desc    Delete a link owned by the authenticated user
 * @route   DELETE /api/links/:id
 * @access  Private
 */
export const deleteLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    // Ensure the authenticated user owns this link
    if (link.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this link' });
    }

    await Link.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Link deleted successfully', id: req.params.id });
  } catch (error) {
    console.error(`Delete Link Error: ${error.message}`);
    res.status(500).json({ message: 'Failed to delete link' });
  }
};

/**
 * @desc    Redirect short code to original URL and increment clicks
 * @route   GET /s/:shortCode
 * @access  Public
 */
export const redirectLink = async (req, res) => {
  try {
    const { shortCode } = req.params;

    if (!shortCode) {
      return res.status(400).json({ message: 'Short code is required' });
    }

    // Find link by shortCode and atomically increment click count
    const link = await Link.findOneAndUpdate(
      { shortCode },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!link) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>404 - Link Not Found</title>
            <style>
              body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; color: #0f172a; }
              .card { background: white; padding: 32px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
              h1 { margin-top: 0; color: #ef4444; font-size: 24px; }
              p { color: #64748b; margin-bottom: 24px; }
              a { display: inline-block; padding: 8px 16px; background: #4f46e5; color: white; text-decoration: none; border-radius: 6px; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Link Not Found</h1>
              <p>The shortened link you are trying to visit does not exist or has been removed.</p>
              <a href="http://localhost:5173/">Go to Link Shortener</a>
            </div>
          </body>
        </html>
      `);
    }

    return res.redirect(link.originalUrl);
  } catch (error) {
    console.error(`Redirect Link Error: ${error.message}`);
    res.status(500).json({ message: 'Server error processing redirect' });
  }
};

