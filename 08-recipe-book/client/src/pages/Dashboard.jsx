// client/src/pages/Dashboard.jsx
// Dashboard for viewing, creating, updating, and deleting items scoped to the user

import { useState, useEffect } from 'react';
import API from '../api/axios';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for creating a new item
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    status: 'pending',
  });
  const [createLoading, setCreateLoading] = useState(false);

  // State for tracking which item is currently being edited
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
  });

  // Fetch all items belonging to the authenticated user on mount
  useEffect(() => {
    let ignore = false;

    API.get('/items')
      .then((res) => {
        if (!ignore) {
          setItems(res.data);
          setError('');
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.message || 'Failed to load items.');
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

  // Handle new item form input changes
  const handleNewChange = (e) => {
    setNewItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit new item
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.title.trim()) return;

    setCreateLoading(true);
    try {
      const res = await API.post('/items', newItem);
      setItems((prev) => [res.data, ...prev]);
      setNewItem({ title: '', description: '', status: 'pending' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create item.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Enable edit mode for a specific card
  const startEdit = (item) => {
    setEditingId(item._id);
    setEditFormData({
      title: item.title,
      description: item.description || '',
      status: item.status || 'pending',
    });
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({ title: '', description: '', status: 'pending' });
  };

  // Save updated item
  const handleUpdateSubmit = async (id) => {
    if (!editFormData.title.trim()) return;

    try {
      const res = await API.put(`/items/${id}`, editFormData);
      setItems((prev) =>
        prev.map((item) => (item._id === id ? res.data : item))
      );
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update item.');
    }
  };

  // Delete an item
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await API.delete(`/items/${id}`);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item.');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Creation Card */}
      <section className="create-section">
        <h2>Add New Item</h2>
        <form onSubmit={handleCreateSubmit} className="create-form">
          <div className="form-row">
            <input
              type="text"
              name="title"
              value={newItem.title}
              onChange={handleNewChange}
              placeholder="Item title *"
              required
              className="input-title"
            />
            <select
              name="status"
              value={newItem.status}
              onChange={handleNewChange}
              className="select-status"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <textarea
            name="description"
            value={newItem.description}
            onChange={handleNewChange}
            placeholder="Item description (optional)"
            rows="2"
            className="input-desc"
          ></textarea>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createLoading}
          >
            {createLoading ? 'Adding...' : 'Add Item'}
          </button>
        </form>
      </section>

      {/* Items Section */}
      <section className="items-section">
        <div className="items-header">
          <h2>Your Items</h2>
          <span className="items-count">({items.length})</span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading items...</div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <p>No items yet. Create your first item above!</p>
          </div>
        ) : (
          <div className="card-grid">
            {items.map((item) => {
              const isEditing = editingId === item._id;

              return (
                <div key={item._id} className="item-card">
                  {isEditing ? (
                    // Card in Edit Mode
                    <div className="card-edit-mode">
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
                        placeholder="Title"
                      />
                      <textarea
                        value={editFormData.description}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="edit-textarea"
                        rows="3"
                        placeholder="Description"
                      />
                      <select
                        value={editFormData.status}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                        className="edit-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      <div className="card-actions">
                        <button
                          onClick={() => handleUpdateSubmit(item._id)}
                          className="btn btn-success-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="btn btn-secondary-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Card in View Mode
                    <>
                      <div className="card-header">
                        <h3 className="card-title">{item.title}</h3>
                        <span
                          className={`status-badge status-${item.status || 'pending'}`}
                        >
                          {item.status || 'pending'}
                        </span>
                      </div>
                      <p className="card-description">
                        {item.description || 'No description provided.'}
                      </p>
                      <div className="card-footer">
                        <span className="card-date">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <div className="card-actions">
                          <button
                            onClick={() => startEdit(item)}
                            className="btn btn-secondary-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
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

