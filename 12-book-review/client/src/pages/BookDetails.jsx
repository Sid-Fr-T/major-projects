// client/src/pages/BookDetails.jsx
// Book details page displaying book info, average rating, reviews, and a single-review submission form

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/useAuth';
import { normalizeImageUrl } from '../utils/resolveImage';

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Review submission form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Fetch book details, average rating, and reviews
  useEffect(() => {
    let ignore = false;

    API.get(`/books/${id}`)
      .then((res) => {
        if (!ignore) {
          setBook(res.data);
          setError('');
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.message || 'Failed to load book details.');
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  // Handle posting a review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');

    if (!rating || rating < 1 || rating > 5) {
      setReviewError('Please select a rating between 1 and 5.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await API.post(`/books/${id}/reviews`, {
        rating: Number(rating),
        comment: comment.trim(),
      });

      // Update book state with the new review and recalculate average rating
      const updatedReviews = [res.data, ...(book.reviews || [])];
      const newReviewCount = updatedReviews.length;
      const newAverageRating = Number(
        (
          updatedReviews.reduce((sum, r) => sum + r.rating, 0) / newReviewCount
        ).toFixed(1)
      );

      setBook((prev) => ({
        ...prev,
        reviews: updatedReviews,
        reviewCount: newReviewCount,
        averageRating: newAverageRating,
        userReviewed: true,
      }));

      // Reset form
      setRating(5);
      setComment('');
    } catch (err) {
      setReviewError(
        err.response?.data?.message || 'Failed to submit review.'
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;

    try {
      await API.delete(`/books/${id}/reviews/${reviewId}`);
      const updatedReviews = (book.reviews || []).filter((r) => r._id !== reviewId);
      const newReviewCount = updatedReviews.length;
      const newAverageRating =
        newReviewCount > 0
          ? Number(
              (
                updatedReviews.reduce((sum, r) => sum + r.rating, 0) / newReviewCount
              ).toFixed(1)
            )
          : 0;

      const stillReviewed = updatedReviews.some(
        (r) => r.user?._id === user?._id || r.user === user?._id
      );

      setBook((prev) => ({
        ...prev,
        reviews: updatedReviews,
        reviewCount: newReviewCount,
        averageRating: newAverageRating,
        userReviewed: stillReviewed,
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete review.');
    }
  };

  // Render star rating graphic
  const renderStars = (score) => {
    const rounded = Math.round(score);
    return (
      <span className="stars-rendered" aria-label={`${score} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rounded ? 'star-filled' : 'star-empty'}
          >
            ★
          </span>
        ))}
      </span>
    );
  };

  if (loading) {
    return <div className="loading-state">Loading book details...</div>;
  }

  if (error || !book) {
    return (
      <div className="book-page-container">
        <Link to="/" className="btn btn-secondary-sm back-link">
          ← Back to Books
        </Link>
        <div className="alert alert-error">{error || 'Book not found.'}</div>
      </div>
    );
  }

  // Check if current logged in user has already reviewed
  const hasUserReviewed =
    book.userReviewed ||
    book.reviews?.some(
      (r) => r.user?._id === user?._id || r.user === user?._id
    );

  const displayCover = normalizeImageUrl(book.coverUrl);

  return (
    <div className="book-page-container">
      <div className="page-nav">
        <Link to="/" className="btn btn-secondary-sm back-link">
          ← Back to All Books
        </Link>
      </div>

      {/* Book Summary Card */}
      <section className="book-hero-card">
        <div className="book-hero-cover-wrapper">
          {displayCover ? (
            <img
              src={displayCover}
              alt={book.title}
              className="book-hero-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://placehold.co/300x420/e2e8f0/475569?text=No+Cover';
              }}
            />
          ) : (
            <div className="book-hero-placeholder">
              <span className="placeholder-icon">📖</span>
              <span>No Cover Provided</span>
            </div>
          )}
        </div>

        <div className="book-hero-info">
          <div className="book-hero-header">
            <h1 className="book-hero-title">{book.title}</h1>
            <h2 className="book-hero-author">by {book.author}</h2>
          </div>

          {/* Average Rating Display */}
          <div className="average-rating-panel">
            <div className="avg-rating-main">
              <span className="avg-score">
                {book.averageRating > 0 ? book.averageRating.toFixed(1) : '0.0'}
              </span>
              <div className="avg-meta">
                {renderStars(book.averageRating)}
                <span className="avg-count">
                  Average based on {book.reviewCount}{' '}
                  {book.reviewCount === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>
          </div>

          <div className="book-hero-desc">
            <h3>Overview</h3>
            <p>{book.description || 'No description provided for this book.'}</p>
          </div>

          <div className="book-hero-footer">
            <span>Added by: <strong>{book.user?.name || 'Community Member'}</strong></span>
            <span>Date: {new Date(book.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </section>

      {/* Reviews & Form Section */}
      <section className="reviews-section">
        {/* Post a Review Form or Already-Reviewed Message */}
        <div className="review-form-card">
          <h3>Write a Review</h3>
          {hasUserReviewed ? (
            <div className="already-reviewed-banner">
              <span className="banner-icon">✓</span>
              <div>
                <strong>You have reviewed this book.</strong>
                <p>Each user can post one review per book. You can see your review below.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="review-form">
              {reviewError && (
                <div className="alert alert-error">{reviewError}</div>
              )}

              <div className="form-group">
                <label htmlFor="rating-select">Rating (1 to 5 Stars):</label>
                <div className="rating-selector">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setRating(val)}
                      className={`star-button ${val <= rating ? 'active' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="selected-rating-text">
                    {rating} {rating === 1 ? 'Star' : 'Stars'}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="review-comment">Your Review / Comment:</label>
                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share what you liked, disliked, or learned from this book..."
                  rows="3"
                  className="input-desc"
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submittingReview}
              >
                {submittingReview ? 'Submitting Review...' : 'Post Review'}
              </button>
            </form>
          )}
        </div>

        {/* All Reviews Feed */}
        <div className="reviews-feed">
          <div className="reviews-feed-header">
            <h3>Community Reviews</h3>
            <span className="items-count">({book.reviews?.length || 0})</span>
          </div>

          {(!book.reviews || book.reviews.length === 0) ? (
            <div className="empty-state">
              <p>No reviews yet for this book. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="reviews-list">
              {book.reviews.map((rev) => {
                const isMyReview =
                  rev.user?._id === user?._id || rev.user === user?._id;

                return (
                  <div
                    key={rev._id}
                    className={`review-card ${isMyReview ? 'my-review' : ''}`}
                  >
                    <div className="review-card-header">
                      <div className="reviewer-info">
                        <strong>{rev.user?.name || 'Anonymous User'}</strong>
                        {isMyReview && (
                          <span className="badge-you">Your Review</span>
                        )}
                        <span className="review-date">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="review-stars">
                        {renderStars(rev.rating)}
                        <span className="review-rating-num">({rev.rating}/5)</span>
                      </div>
                    </div>

                    <p className="review-comment">
                      {rev.comment || <em>No comment written.</em>}
                    </p>

                    {isMyReview && (
                      <div className="review-card-actions">
                        <button
                          onClick={() => handleDeleteReview(rev._id)}
                          className="btn btn-danger-sm"
                        >
                          Delete Your Review
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BookDetails;
