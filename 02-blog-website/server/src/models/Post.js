// server/src/models/Post.js
// Defines the Post schema and model: title, content, author (user ref), and createdAt

import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a post title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide post content'],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post must have an author'],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;

