// server/src/controllers/linkController.js
// Handles link creation, listing, deletion, and public short link redirection

import crypto from 'crypto';
import mongoose from 'mongoose';
import Link from '../models/Link.js';

// Character set for generating random 6-character short codes
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Helper to generate a random 6-character alphanumeric string
 */
const generateRandomCode = (length = 6) => {
  const bytes = crypto.randomBytes(length);
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CHARS[bytes[i] % CHARS.length];
  }
  return code;
};

/**
 * @desc    Get all links for the logged-in user
 * @route   GET /api/links
 * @access  Private
 */
export const getLinks = async (req, res) => {
  try {
    const links = await Link.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(links);
  } catch (error) {
    console.error(`Get Links Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving links', error: error.message });
  }
};

/**
 * @desc    Create a new shortened link for the logged-in user
 * @route   POST /api/links
 * @access  Private
 */
export const createLink = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl || !originalUrl.trim()) {
      return res.status(400).json({ message: 'Please provide a valid original URL' });
    }

    let normalizedUrl = originalUrl.trim();

    // Ensure URL has a valid protocol for redirects
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // Validate URL syntax
    try {
      new URL(normalizedUrl);
    } catch {
      return res.status(400).json({ message: 'Invalid URL format. Please include a valid web address.' });
    }

    // Generate a unique 6-character shortCode
    let shortCode = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      shortCode = generateRandomCode(6);
      const existing = await Link.findOne({ shortCode });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ message: 'Could not generate unique short code. Please try again.' });
    }

    // Create the new link associated with the authenticated user
    const link = await Link.create({
      originalUrl: normalizedUrl,
      shortCode,
      clicks: 0,
      user: req.user._id,
    });

    return res.status(201).json(link);
  } catch (error) {
    console.error(`Create Link Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error creating shortened link', error: error.message });
  }
};

/**
 * @desc    Delete a link by ID (must belong to logged-in user)
 * @route   DELETE /api/links/:id
 * @access  Private
 */
export const deleteLink = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Link not found (invalid ID format)' });
    }

    const link = await Link.findById(id);

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    // Ensure the link belongs to the authenticated user
    if (link.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this link' });
    }

    await link.deleteOne();

    return res.status(200).json({ message: 'Link removed successfully', id });
  } catch (error) {
    console.error(`Delete Link Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error deleting link', error: error.message });
  }
};

/**
 * @desc    Public redirect route: increments click count and redirects to original URL
 * @route   GET /s/:shortCode
 * @access  Public
 */
export const redirectShortCode = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Atomically increment clicks and retrieve updated link
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
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>404 - Link Not Found</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #f8fafc;
                color: #0f172a;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 20px;
                text-align: center;
              }
              .box {
                background: white;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                max-width: 440px;
              }
              h1 { color: #ef4444; margin-bottom: 12px; font-size: 2rem; }
              p { color: #64748b; margin-bottom: 24px; font-size: 1rem; }
              a {
                display: inline-block;
                background: #4f46e5;
                color: white;
                padding: 10px 20px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 500;
              }
              a:hover { background: #4338ca; }
            </style>
          </head>
          <body>
            <div class="box">
              <h1>404</h1>
              <h2>Link Not Found</h2>
              <p>The shortened link you are trying to visit does not exist or has been deleted.</p>
              <a href="/">Go to Home</a>
            </div>
          </body>
        </html>
      `);
    }

    return res.redirect(link.originalUrl);
  } catch (error) {
    console.error(`Redirect Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error redirecting link', error: error.message });
  }
};

