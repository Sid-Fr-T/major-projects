// server/src/controllers/bookController.js
// Handles operations for Books and Reviews

import mongoose from 'mongoose';
import Book from '../models/Book.js';
import Review from '../models/Review.js';
import { resolveCoverUrl, normalizeImageUrl } from '../utils/resolveImage.js';

/**
 * @desc    Get all books with their calculated average ratings and review counts
 * @route   GET /api/books
 * @access  Private
 */
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .lean();

    // Aggregate rating statistics for each book
    const stats = await Review.aggregate([
      {
        $group: {
          _id: '$book',
          avgRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const statsMap = {};
    stats.forEach((s) => {
      statsMap[s._id.toString()] = {
        avgRating: Number(s.avgRating.toFixed(1)),
        reviewCount: s.reviewCount,
      };
    });

    const booksWithStats = books.map((book) => ({
      ...book,
      coverUrl: normalizeImageUrl(book.coverUrl),
      averageRating: statsMap[book._id.toString()]?.avgRating || 0,
      reviewCount: statsMap[book._id.toString()]?.reviewCount || 0,
    }));

    return res.status(200).json(booksWithStats);
  } catch (error) {
    console.error(`Get Books Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving books', error: error.message });
  }
};

/**
 * @desc    Get single book details including its reviews and average rating
 * @route   GET /api/books/:id
 * @access  Private
 */
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Book not found (invalid ID format)' });
    }

    const book = await Book.findById(id).populate('user', 'name').lean();
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const reviews = await Review.find({ book: id })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const reviewCount = reviews.length;
    const averageRating =
      reviewCount > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
        : 0;

    const userReviewed = reviews.some(
      (r) => r.user?._id?.toString() === req.user._id.toString()
    );

    return res.status(200).json({
      ...book,
      coverUrl: normalizeImageUrl(book.coverUrl),
      averageRating,
      reviewCount,
      reviews,
      userReviewed,
    });
  } catch (error) {
    console.error(`Get Book Details Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving book', error: error.message });
  }
};

/**
 * @desc    Create a new book
 * @route   POST /api/books
 * @access  Private
 */
export const createBook = async (req, res) => {
  try {
    const { title, author, description, coverUrl } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Please provide a book title' });
    }
    if (!author || !author.trim()) {
      return res.status(400).json({ message: 'Please provide an author name' });
    }

    // Auto-resolve cover URL from Wikipedia, OpenGraph, Google Drive, etc.
    const resolvedCover = await resolveCoverUrl(coverUrl);

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      description: description ? description.trim() : '',
      coverUrl: resolvedCover,
      user: req.user._id,
    });

    const populated = await Book.findById(book._id).populate('user', 'name');

    return res.status(201).json({
      ...populated.toObject(),
      averageRating: 0,
      reviewCount: 0,
    });
  } catch (error) {
    console.error(`Create Book Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error creating book', error: error.message });
  }
};

/**
 * @desc    Delete a book and its associated reviews
 * @route   DELETE /api/books/:id
 * @access  Private
 */
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Book not found (invalid ID format)' });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Only creator can delete book
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    await book.deleteOne();
    await Review.deleteMany({ book: id });

    return res.status(200).json({ message: 'Book and reviews removed successfully', id });
  } catch (error) {
    console.error(`Delete Book Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error deleting book', error: error.message });
  }
};

/**
 * @desc    Post a review for a book (one review per user per book)
 * @route   POST /api/books/:id/reviews
 * @access  Private
 */
export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Book not found (invalid ID format)' });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
    }

    // Enforce one review per user per book
    const alreadyReviewed = await Review.findOne({
      book: id,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        message: 'You have already reviewed this book. Only one review per book is allowed.',
      });
    }

    const review = await Review.create({
      book: id,
      user: req.user._id,
      rating: numericRating,
      comment: comment ? comment.trim() : '',
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name');

    return res.status(201).json(populatedReview);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'You have already reviewed this book. Only one review per book is allowed.',
      });
    }
    console.error(`Add Review Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error adding review', error: error.message });
  }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/books/:bookId/reviews/:reviewId
 * @access  Private
 */
export const deleteReview = async (req, res) => {
  try {
    const { bookId, reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(404).json({ message: 'Review not found (invalid ID format)' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check ownership
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();

    return res.status(200).json({ message: 'Review removed successfully', id: reviewId });
  } catch (error) {
    console.error(`Delete Review Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error deleting review', error: error.message });
  }
};
