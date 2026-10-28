// client/src/pages/Dashboard.jsx
// Dashboard for viewing, creating, updating, and deleting blog posts scoped to the logged-in author

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for creating a new post
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
  });
  const [createLoading, setCreateLoading] = useState(false);

  // State for tracking which post is currently being edited
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    content: '',
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  // Fetch all posts belonging to the authenticated user on mount
  useEffect(() => {
    document.title = 'MERN Blog - Dashboard';

    let ignore = false;

    API.get('/posts/mine')
      .then((res) => {
        if (!ignore) {
          setPosts(res.data);
          setError('');
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.message || 'Failed to load your posts.');
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

  // Handle new post form input changes
  const handleNewChange = (e) => {
    setNewPost((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit new post
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    setCreateLoading(true);
    try {
      const res = await API.post('/posts', {
        title: newPost.title.trim(),
        content: newPost.content.trim(),
      });
      setPosts((prev) => [res.data, ...prev]);
      setNewPost({ title: '', content: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create post.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Enable edit mode for a specific post
  const startEdit = (post) => {
    setEditingId(post._id);
    setEditFormData({
      title: post.title,
      content: post.content,
    });
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({ title: '', content: '' });
  };

  // Save updated post
  const handleUpdateSubmit = async (id) => {
    if (!editFormData.title.trim() || !editFormData.content.trim()) {
      alert('Title and content are required.');
      return;
    }

    setUpdateLoading(true);
    try {
      const res = await API.put(`/posts/${id}`, {
        title: editFormData.title.trim(),
        content: editFormData.content.trim(),
      });
      setPosts((prev) =>
        prev.map((post) => (post._id === id ? res.data : post))
      );
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update post.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Delete a post
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await API.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="dashboard-container">
      {/* Top Creation Section */}
      <section className="create-section">
        <h2>Write a New Post</h2>
        <form onSubmit={handleCreateSubmit} className="create-form">
          <div className="form-group">
            <label htmlFor="post-title">Post Title</label>
            <input
              id="post-title"
              type="text"
              name="title"
              value={newPost.title}
              onChange={handleNewChange}
              placeholder="e.g. Getting Started with Modern Web Development"
              required
              className="input-title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="post-content">Post Content</label>
            <textarea
              id="post-content"
              name="content"
              value={newPost.content}
              onChange={handleNewChange}
              placeholder="Write your article or thoughts here..."
              rows="6"
              required
              className="input-desc"
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={createLoading}
          >
            {createLoading ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
      </section>

      {/* Posts Section */}
      <section className="items-section">
        <div className="items-header">
          <h2>My Posts</h2>
          <span className="items-count">({posts.length})</span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading your posts...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>You haven't written any posts yet. Publish your first post above!</p>
          </div>
        ) : (
          <div className="card-grid">
            {posts.map((post) => {
              const isEditing = editingId === post._id;

              return (
                <div key={post._id} className="item-card">
                  {isEditing ? (
                    // Card in Edit Mode
                    <div className="card-edit-mode">
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          value={editFormData.title}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="edit-input"
                          placeholder="Post title"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Content</label>
                        <textarea
                          value={editFormData.content}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              content: e.target.value,
                            }))
                          }
                          className="edit-textarea"
                          rows="6"
                          placeholder="Post content"
                          required
                        />
                      </div>

                      <div className="card-actions">
                        <button
                          type="button"
                          onClick={() => handleUpdateSubmit(post._id)}
                          className="btn btn-success-sm"
                          disabled={updateLoading}
                        >
                          {updateLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="btn btn-secondary-sm"
                          disabled={updateLoading}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Card in View Mode
                    <>
                      <div className="card-header">
                        <h3 className="card-title">
                          <Link to={`/post/${post._id}`} className="card-title-link">
                            {post.title}
                          </Link>
                        </h3>
                      </div>
                      <p className="card-description">
                        {post.content.length > 160
                          ? `${post.content.substring(0, 160)}...`
                          : post.content}
                      </p>
                      <div className="card-footer">
                        <span className="card-date">{formatDate(post.createdAt)}</span>
                        <div className="card-actions">
                          <Link
                            to={`/post/${post._id}`}
                            className="btn btn-secondary-sm"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => startEdit(post)}
                            className="btn btn-secondary-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="btn btn-danger-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
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
