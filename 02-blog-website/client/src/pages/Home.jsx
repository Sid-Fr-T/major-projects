// client/src/pages/Home.jsx
// Public home page displaying all blog posts available for anyone to read

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/useAuth';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'MERN Blog - Home';

    let ignore = false;
    API.get('/posts')
      .then((res) => {
        if (!ignore) {
          setPosts(res.data);
          setError('');
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.message || 'Failed to load blog posts.');
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

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="home-container">
      {/* Hero Welcome Section */}
      <section className="hero-section">
        <h1 className="hero-title">Welcome to the Blog</h1>
        <p className="hero-subtitle">
          Discover stories, ideas, and perspectives from authors around the globe.
        </p>
        <div className="hero-actions">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary">
              Write a Post
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary">
              Join & Write
            </Link>
          )}
        </div>
      </section>

      {/* Main Blog Feed */}
      <section className="feed-section">
        <div className="feed-header">
          <h2>Latest Articles</h2>
          <span className="feed-count">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>No blog posts published yet.</p>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary-sm" style={{ marginTop: '12px' }}>
                Publish the first post
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary-sm" style={{ marginTop: '12px' }}>
                Log in to publish a post
              </Link>
            )}
          </div>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => {
              const isAuthor =
                user &&
                (user._id === post.author?._id || user._id === post.author);

              return (
                <article key={post._id} className="blog-card">
                  <div className="blog-card-header">
                    <h3 className="blog-card-title">
                      <Link to={`/post/${post._id}`}>{post.title}</Link>
                    </h3>
                    {isAuthor && <span className="author-badge">Your Post</span>}
                  </div>

                  <div className="blog-meta">
                    <span className="blog-author">
                      ✍ {post.author?.name || 'Anonymous'}
                    </span>
                    <span className="blog-separator">•</span>
                    <span className="blog-date">{formatDate(post.createdAt)}</span>
                  </div>

                  <p className="blog-excerpt">
                    {post.content.length > 200
                      ? `${post.content.substring(0, 200)}...`
                      : post.content}
                  </p>

                  <div className="blog-card-footer">
                    <Link to={`/post/${post._id}`} className="read-more-link">
                      Read Article →
                    </Link>
                    {isAuthor && (
                      <Link to="/dashboard" className="manage-link">
                        Manage
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

