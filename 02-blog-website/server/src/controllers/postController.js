// server/src/controllers/postController.js
// Handles CRUD operations for blog posts: public read access and author-scoped write access

import mongoose from 'mongoose';
import Post from '../models/Post.js';

/**
 * @desc    Get all blog posts (public feed)
 * @route   GET /api/posts
 * @access  Public
 */
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    console.error(`Get All Posts Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving posts', error: error.message });
  }
};

/**
 * @desc    Get a single post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Post not found (invalid ID format)' });
    }

    const post = await Post.findById(id).populate('author', 'name email');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error(`Get Post By ID Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving post', error: error.message });
  }
};

/**
 * @desc    Get all posts created by the logged-in user
 * @route   GET /api/posts/mine
 * @access  Private
 */
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    console.error(`Get My Posts Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving user posts', error: error.message });
  }
};

/**
 * @desc    Create a new blog post
 * @route   POST /api/posts
 * @access  Private
 */
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Please provide a post title' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Please provide post content' });
    }

    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      author: req.user._id,
    });

    await post.populate('author', 'name email');

    return res.status(201).json(post);
  } catch (error) {
    console.error(`Create Post Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error creating post', error: error.message });
  }
};

/**
 * @desc    Update an existing blog post (author only)
 * @route   PUT /api/posts/:id
 * @access  Private
 */
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Post not found (invalid ID format)' });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ensure the post belongs to the authenticated user
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: 'Title cannot be empty' });
      }
      post.title = title.trim();
    }

    if (content !== undefined) {
      if (!content.trim()) {
        return res.status(400).json({ message: 'Content cannot be empty' });
      }
      post.content = content.trim();
    }

    const updatedPost = await post.save();
    await updatedPost.populate('author', 'name email');

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error(`Update Post Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error updating post', error: error.message });
  }
};

/**
 * @desc    Delete a blog post (author only)
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Post not found (invalid ID format)' });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ensure the post belongs to the authenticated user
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();

    return res.status(200).json({ message: 'Post deleted successfully', id });
  } catch (error) {
    console.error(`Delete Post Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error deleting post', error: error.message });
  }
};

