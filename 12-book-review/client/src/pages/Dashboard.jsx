// client/src/pages/Dashboard.jsx
// Main catalog of books with ability to add books, search, and navigate to book review pages

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/useAuth';
import { normalizeImageUrl } from '../utils/resolveImage';

const Dashboard = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // State for creating a new book
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    coverUrl: '',
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(true);

  // Fetch all books on mount
  useEffect(() => {
    let ignore = false;

    API.get('/books')
      .then((res) => {
        if (!ignore) {
          setBooks(res.data);
          setError('');
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.message || 'Failed to load books.');
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
  }, []);

  // Handle new book form inputs
  const handleNewChange = (e) => {
    setNewBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit new book
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newBook.title.trim() || !newBook.author.trim()) return;

    setCreateLoading(true);
    try {
      const res = await API.post('/books', newBook);
      setBooks((prev) => [res.data, ...prev]);
      setNewBook({ title: '', author: '', description: '', coverUrl: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create book.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Delete a book (creator only)
  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book and its reviews?')) return;

    try {
      await API.delete(`/books/${id}`);
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete book.');
    }
  };

  // Filter books by search term
  const filteredBooks = books.filter(
    (b) =>
      b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const previewCover = normalizeImageUrl(newBook.coverUrl);

  return (
    <div className="dashboard-container">
      {/* Header Banner */}
      <section className="welcome-banner">
        <div>
          <h2>Book Review Catalog</h2>
          <p className="welcome-subtitle">
            Discover books, post reviews, and check community ratings.
          </p>
        </div>
        <button
          onClick={() => setFormVisible(!formVisible)}
          className="btn btn-secondary"
        >
          {formVisible ? 'Hide Add Book Form' : '+ Add New Book'}
        </button>
      </section>

      {/* Book Creation Card */}
      {formVisible && (
        <section className="create-section">
          <h2>Add a New Book</h2>
          <form onSubmit={handleCreateSubmit} className="create-form">
            <div className="form-row">
              <input
                type="text"
                name="title"
                value={newBook.title}
                onChange={handleNewChange}
                placeholder="Book Title *"
                required
                className="input-title"
              />
              <input
                type="text"
                name="author"
                value={newBook.author}
                onChange={handleNewChange}
                placeholder="Author *"
                required
                className="input-title"
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="coverUrl"
                value={newBook.coverUrl}
                onChange={handleNewChange}
                placeholder="Cover Image URL (Direct image, Wikipedia File/article link, Google Drive, OpenLibrary, etc.)"
                className="input-title"
              />
            </div>

            {/* Live Preview for cover URL */}
            {newBook.coverUrl && (
              <div className="cover-preview-box">
                <span className="preview-label">Cover Preview:</span>
                <div className="preview-thumbnail-wrapper">
                  <img
                    src={previewCover}
                    alt="Cover preview"
                    className="preview-thumbnail"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://placehold.co/120x160/e2e8f0/475569?text=Invalid+Image';
                    }}
                  />
                  <span className="preview-hint">
                    Using direct link: <code className="url-code">{previewCover.substring(0, 70)}...</code>
                  </span>
                </div>
              </div>
            )}

            <textarea
              name="description"
              value={newBook.description}
              onChange={handleNewChange}
              placeholder="Book description or summary (optional)"
              rows="3"
              className="input-desc"
            ></textarea>
            <div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createLoading}
              >
                {createLoading ? 'Adding Book...' : 'Add Book'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Books List Section */}
      <section className="items-section">
        <div className="catalog-toolbar">
          <div className="items-header">
            <h2>Explore Books</h2>
            <span className="items-count">({filteredBooks.length})</span>
          </div>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading books...</div>
        ) : filteredBooks.length === 0 ? (
          <div className="empty-state">
            <p>
              {searchTerm
                ? 'No books match your search.'
                : 'No books added yet. Be the first to add one!'}
            </p>
          </div>
        ) : (
          <div className="card-grid">
            {filteredBooks.map((book) => {
              const isOwner =
                book.user?._id === user?._id || book.user === user?._id;
              const displayCover = normalizeImageUrl(book.coverUrl);

              return (
                <div key={book._id} className="book-card">
                  <div className="book-card-cover-wrapper">
                    {displayCover ? (
                      <img
                        src={displayCover}
                        alt={book.title}
                        className="book-card-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'https://placehold.co/300x420/e2e8f0/475569?text=No+Cover';
                        }}
                      />
                    ) : (
                      <div className="book-card-placeholder">
                        <span className="placeholder-icon">📖</span>
                        <span>No Cover</span>
                      </div>
                    )}
                  </div>

                  <div className="book-card-content">
                    <div className="book-card-header">
                      <h3 className="card-title" title={book.title}>
                        {book.title}
                      </h3>
                      <p className="book-author">by {book.author}</p>
                    </div>

                    {/* Rating badge */}
                    <div className="rating-badge-container">
                      <span className="star-icon">⭐</span>
                      <strong className="rating-score">
                        {book.averageRating > 0
                          ? book.averageRating.toFixed(1)
                          : 'No ratings'}
                      </strong>
                      <span className="rating-count">
                        ({book.reviewCount}{' '}
                        {book.reviewCount === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>

                    <p className="card-description">
                      {book.description || 'No description provided.'}
                    </p>

                    <div className="card-footer">
                      <span className="card-date">
                        Added by {book.user?.name || 'User'}
                      </span>
                      <div className="card-actions">
                        <Link
                          to={`/books/${book._id}`}
                          className="btn btn-primary-sm"
                        >
                          View & Review
                        </Link>
                        {isOwner && (
                          <button
                            onClick={() => handleDeleteBook(book._id)}
                            className="btn btn-danger-sm"
                            title="Delete book"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
