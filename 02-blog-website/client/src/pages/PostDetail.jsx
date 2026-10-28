// client/src/pages/PostDetail.jsx
// Public single post page accessible to anyone, with author controls if authenticated

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/useAuth';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;

    API.get(`/posts/${id}`)
      .then((res) => {
        if (!ignore) {
          setPost(res.data);
          document.title = `${res.data.title} - MERN Blog`;
          setError('');
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.message || 'Failed to load post.');
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

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    setDeleting(true);
    try {
      await API.delete(`/posts/${id}`);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post.');
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="post-detail-container">
        <div className="loading-state">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-container">
        <div className="alert alert-error">{error || 'Post not found'}</div>
        <Link to="/" className="btn btn-secondary">
          ← Back to all posts
        </Link>
      </div>
    );
  }

  const isAuthor =
    user && (user._id === post.author?._id || user._id === post.author);

  return (
    <article className="post-detail-container">
      <div className="post-detail-nav">
        <Link to="/" className="btn btn-secondary-sm">
          ← Back to all posts
        </Link>
      </div>

      <header className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span className="post-author">
            By <strong>{post.author?.name || 'Anonymous'}</strong>
          </span>
          <span className="post-meta-separator">•</span>
          <span className="post-date">Published on {formatDate(post.createdAt)}</span>
        </div>
      </header>

      {isAuthor && (
        <aside className="post-author-bar">
          <span>You are the author of this post.</span>
          <div className="author-bar-actions">
            <Link to="/dashboard" className="btn btn-secondary-sm">
              Edit in Dashboard
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-danger-sm"
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Post'}
            </button>
          </div>
        </aside>
      )}

      <div className="post-content">
        {post.content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <footer className="post-footer">
        <Link to="/" className="btn btn-secondary">
          ← Back to all posts
        </Link>
      </footer>
    </article>
  );
};

export default PostDetail;

