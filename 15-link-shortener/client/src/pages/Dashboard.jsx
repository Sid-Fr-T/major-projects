// client/src/pages/Dashboard.jsx
// Dashboard for creating, listing, copying, and deleting shortened links with click tracking

import { useState, useEffect } from 'react';
import API from '../api/axios';

const BACKEND_BASE_URL = (API.defaults.baseURL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form input state
  const [originalUrl, setOriginalUrl] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  // Track copied link id for temporary visual feedback
  const [copiedId, setCopiedId] = useState(null);

  // Fetch links on component mount
  useEffect(() => {
    let ignore = false;

    API.get('/links')
      .then((res) => {
        if (!ignore) {
          setLinks(res.data);
          setError('');
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.message || 'Failed to load links.');
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

  // Manual refresh for click counts
  const handleRefresh = async () => {
    try {
      const res = await API.get('/links');
      setLinks(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to refresh links.');
    }
  };

  // Handle URL creation
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateError('');

    if (!originalUrl.trim()) {
      setCreateError('Please enter a valid URL.');
      return;
    }

    setCreateLoading(true);
    try {
      const res = await API.post('/links', { originalUrl });
      setLinks((prev) => [res.data, ...prev]);
      setOriginalUrl('');
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to shorten URL.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle deleting a link
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this short link?')) return;

    try {
      await API.delete(`/links/${id}`);
      setLinks((prev) => prev.filter((link) => link._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete link.');
    }
  };

  // Copy short link to clipboard
  const handleCopy = (link) => {
    const fullShortUrl = `${BACKEND_BASE_URL}/s/${link.shortCode}`;
    navigator.clipboard
      .writeText(fullShortUrl)
      .then(() => {
        setCopiedId(link._id);
        setTimeout(() => {
          setCopiedId(null);
        }, 2000);
      })
      .catch(() => {
        alert(`Could not copy link automatically. Here is the URL: ${fullShortUrl}`);
      });
  };

  // Calculate total clicks across all links
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);

  return (
    <div className="dashboard-container">
      {/* Top Creation Section */}
      <section className="create-section">
        <h2>Shorten a New Link</h2>
        <p className="section-subtitle">
          Enter any long URL to generate a compact, 6-character short link.
        </p>

        {createError && <div className="alert alert-error">{createError}</div>}

        <form onSubmit={handleCreateSubmit} className="create-form">
          <div className="form-row">
            <input
              type="text"
              name="originalUrl"
              value={originalUrl}
              onChange={(e) => {
                setOriginalUrl(e.target.value);
                if (createError) setCreateError('');
              }}
              placeholder="Paste long URL (e.g. https://example.com/very/long/path)..."
              required
              className="input-title url-input"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createLoading}
            >
              {createLoading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </div>
        </form>
      </section>

      {/* Stats Summary Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <span className="stat-label">Total Links</span>
          <span className="stat-value">{links.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Clicks</span>
          <span className="stat-value">{totalClicks}</span>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          className="btn btn-secondary-sm refresh-btn"
          title="Refresh click counts"
        >
          🔄 Refresh Counts
        </button>
      </div>

      {/* Links List Section */}
      <section className="items-section">
        <div className="items-header">
          <h2>Your Shortened Links</h2>
          <span className="items-count">({links.length})</span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading your links...</div>
        ) : links.length === 0 ? (
          <div className="empty-state">
            <p>No shortened links yet. Paste a long URL above to create your first short link!</p>
          </div>
        ) : (
          <div className="card-grid">
            {links.map((link) => {
              const fullShortUrl = `${BACKEND_BASE_URL}/s/${link.shortCode}`;
              const isCopied = copiedId === link._id;

              return (
                <div key={link._id} className="item-card link-card">
                  <div className="card-header link-card-header">
                    <div className="short-url-group">
                      <a
                        href={fullShortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="short-link-anchor"
                      >
                        {fullShortUrl}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(link)}
                        className={`btn-copy ${isCopied ? 'copied' : ''}`}
                        title="Copy to clipboard"
                      >
                        {isCopied ? '✓ Copied' : '📋 Copy'}
                      </button>
                    </div>
                    <span className="click-badge" title="Total times this link was clicked">
                      🎯 {link.clicks || 0} {link.clicks === 1 ? 'click' : 'clicks'}
                    </span>
                  </div>

                  <div className="original-url-group">
                    <span className="original-url-label">Original:</span>
                    <a
                      href={link.originalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="original-link-anchor"
                      title={link.originalUrl}
                    >
                      {link.originalUrl}
                    </a>
                  </div>

                  <div className="card-footer">
                    <span className="card-date">
                      Created: {new Date(link.createdAt).toLocaleDateString()}
                    </span>
                    <div className="card-actions">
                      <button
                        type="button"
                        onClick={() => handleDelete(link._id)}
                        className="btn btn-danger-sm"
                        title="Delete link"
                      >
                        Delete
                      </button>
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
