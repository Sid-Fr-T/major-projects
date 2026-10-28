// client/src/pages/Dashboard.jsx
// Main Dashboard for Complaint Portal:
// - Regular users raise complaints and track status & admin remarks
// - Admin users can view all complaints and update status with remarks

import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/useAuth';

const CATEGORIES = [
  'Technical',
  'Billing',
  'Customer Service',
  'Facilities',
  'Account & Access',
  'General',
];

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering & search states
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // State for raising a new complaint
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    category: 'Technical',
    description: '',
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [showRaiseForm, setShowRaiseForm] = useState(!isAdmin);

  // State for user editing an existing complaint (title/desc/category)
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    category: 'Technical',
    description: '',
  });

  // State for admin status & remark update per complaint
  const [adminUpdateData, setAdminUpdateData] = useState({});
  const [updateLoadingId, setUpdateLoadingId] = useState(null);

  // Fetch complaints on component mount
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get('/complaints');
      setComplaints(res.data);
      setError('');

      // Pre-populate admin update state
      const initialAdminState = {};
      res.data.forEach((item) => {
        initialAdminState[item._id] = {
          status: item.status || 'open',
          remark: item.remark || '',
        };
      });
      setAdminUpdateData(initialAdminState);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Handle raise complaint form inputs
  const handleNewChange = (e) => {
    setNewComplaint((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit new complaint
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newComplaint.title.trim() || !newComplaint.description.trim()) {
      alert('Please fill in both title and description.');
      return;
    }

    setCreateLoading(true);
    try {
      const res = await API.post('/complaints', newComplaint);
      setComplaints((prev) => [res.data, ...prev]);
      setAdminUpdateData((prev) => ({
        ...prev,
        [res.data._id]: {
          status: res.data.status || 'open',
          remark: res.data.remark || '',
        },
      }));
      setNewComplaint({
        title: '',
        category: 'Technical',
        description: '',
      });
      if (isAdmin) {
        setShowRaiseForm(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit complaint.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Start editing a complaint (user)
  const startEdit = (complaint) => {
    setEditingId(complaint._id);
    setEditFormData({
      title: complaint.title,
      category: complaint.category || 'General',
      description: complaint.description || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({ title: '', category: 'Technical', description: '' });
  };

  // Save edited complaint (user)
  const handleUserUpdateSubmit = async (id) => {
    if (!editFormData.title.trim() || !editFormData.description.trim()) {
      alert('Title and description cannot be empty.');
      return;
    }

    try {
      const res = await API.put(`/complaints/${id}`, editFormData);
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? res.data : c))
      );
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update complaint.');
    }
  };

  // Admin handles status/remark input change for a card
  const handleAdminFieldChange = (id, field, value) => {
    setAdminUpdateData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // Admin submits status & remark update
  const handleAdminUpdateSubmit = async (id) => {
    const data = adminUpdateData[id];
    if (!data) return;

    setUpdateLoadingId(id);
    try {
      const res = await API.put(`/complaints/${id}`, {
        status: data.status,
        remark: data.remark,
      });

      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? res.data : c))
      );
      alert('Complaint status and remark updated successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update complaint.');
    } finally {
      setUpdateLoadingId(null);
    }
  };

  // Delete complaint
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;

    try {
      await API.delete(`/complaints/${id}`);
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete complaint.');
    }
  };

  // Calculate statistics
  const totalCount = complaints.length;
  const openCount = complaints.filter((c) => c.status === 'open').length;
  const inProgressCount = complaints.filter((c) => c.status === 'in-progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length;

  // Filter complaints based on status, category, and search query
  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus =
      statusFilter === 'all' ? true : c.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'all' ? true : c.category === categoryFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      (c.remark && c.remark.toLowerCase().includes(query)) ||
      (c.user?.name && c.user.name.toLowerCase().includes(query));

    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <div className="dashboard-container">
      {/* Page Title & Role Banner */}
      <div className="dashboard-header">
        <div>
          <h1>{isAdmin ? 'Admin Portal — All Complaints' : 'Complaint Portal'}</h1>
          <p className="dashboard-subtitle">
            {isAdmin
              ? 'Review, track, and update complaint statuses with admin remarks.'
              : 'Raise new complaints and track resolution progress in real time.'}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowRaiseForm((prev) => !prev)}
            className="btn btn-secondary-sm"
          >
            {showRaiseForm ? 'Hide Raise Form' : '＋ Raise a Complaint'}
          </button>
        )}
      </div>

      {/* Stats Summary Cards */}
      <section className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-value">{totalCount}</div>
          <div className="stat-label">Total Complaints</div>
        </div>
        <div className="stat-card stat-open">
          <div className="stat-value">{openCount}</div>
          <div className="stat-label">Open</div>
        </div>
        <div className="stat-card stat-progress">
          <div className="stat-value">{inProgressCount}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card stat-resolved">
          <div className="stat-value">{resolvedCount}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </section>

      {/* Raise Complaint Form */}
      {showRaiseForm && (
        <section className="create-section">
          <h2>Raise a New Complaint</h2>
          <form onSubmit={handleCreateSubmit} className="create-form">
            <div className="form-row">
              <input
                type="text"
                name="title"
                value={newComplaint.title}
                onChange={handleNewChange}
                placeholder="Complaint Title * (e.g. WiFi issue in block B)"
                required
                className="input-title"
              />
              <select
                name="category"
                value={newComplaint.category}
                onChange={handleNewChange}
                className="select-category"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              name="description"
              value={newComplaint.description}
              onChange={handleNewChange}
              placeholder="Describe your complaint in detail... *"
              rows="3"
              required
              className="input-desc"
            ></textarea>
            <div className="form-actions-right">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createLoading}
              >
                {createLoading ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Complaints Section */}
      <section className="items-section">
        <div className="items-header">
          <div className="header-left">
            <h2>{isAdmin ? 'All Submitted Complaints' : 'My Complaints'}</h2>
            <span className="items-count">({filteredComplaints.length})</span>
          </div>

          {/* Search bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="filters-bar">
          <div className="status-filters">
            <button
              onClick={() => setStatusFilter('all')}
              className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('open')}
              className={`filter-btn ${statusFilter === 'open' ? 'active' : ''}`}
            >
              Open ({openCount})
            </button>
            <button
              onClick={() => setStatusFilter('in-progress')}
              className={`filter-btn ${statusFilter === 'in-progress' ? 'active' : ''}`}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`filter-btn ${statusFilter === 'resolved' ? 'active' : ''}`}
            >
              Resolved ({resolvedCount})
            </button>
          </div>

          <div className="category-filter">
            <label htmlFor="cat-filter">Category: </label>
            <select
              id="cat-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="select-cat-filter"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading complaints...</div>
        ) : filteredComplaints.length === 0 ? (
          <div className="empty-state">
            <p>
              {complaints.length === 0
                ? 'No complaints registered yet. Raise your first complaint above!'
                : 'No complaints match the selected filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="card-grid">
            {filteredComplaints.map((item) => {
              const isEditing = editingId === item._id;
              const adminState = adminUpdateData[item._id] || {
                status: item.status || 'open',
                remark: item.remark || '',
              };

              return (
                <div key={item._id} className={`item-card card-status-${item.status}`}>
                  {isEditing ? (
                    // Card in Edit Mode (Owner updating complaint)
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
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Category</label>
                        <select
                          value={editFormData.category}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          className="edit-select"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Description</label>
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
                          required
                        />
                      </div>
                      <div className="card-actions">
                        <button
                          onClick={() => handleUserUpdateSubmit(item._id)}
                          className="btn btn-success-sm"
                        >
                          Save Changes
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
                      <div className="card-top-row">
                        <span className="category-tag">{item.category || 'General'}</span>
                        <span className={`status-badge status-${item.status || 'open'}`}>
                          {item.status === 'in-progress'
                            ? 'In Progress'
                            : item.status === 'resolved'
                            ? 'Resolved'
                            : 'Open'}
                        </span>
                      </div>

                      <h3 className="card-title">{item.title}</h3>

                      <p className="card-description">{item.description}</p>

                      {/* Display Creator info if Admin view */}
                      {isAdmin && item.user && (
                        <div className="user-info-tag">
                          <span>👤 Raised by: <strong>{item.user.name}</strong> ({item.user.email})</span>
                        </div>
                      )}

                      {/* Display Admin Remark Callout */}
                      {item.remark ? (
                        <div className="admin-remark-callout">
                          <div className="remark-header">
                            <span className="remark-icon">💬</span>
                            <strong>Admin Remark:</strong>
                          </div>
                          <p className="remark-text">{item.remark}</p>
                        </div>
                      ) : (
                        !isAdmin && (
                          <div className="no-remark-hint">
                            <span>No remark added yet by admin.</span>
                          </div>
                        )
                      )}

                      {/* Admin Update Controls */}
                      {isAdmin && (
                        <div className="admin-controls-box">
                          <label className="admin-controls-title">Update Status & Remark:</label>
                          <div className="admin-form-row">
                            <select
                              value={adminState.status}
                              onChange={(e) =>
                                handleAdminFieldChange(item._id, 'status', e.target.value)
                              }
                              className="admin-status-select"
                            >
                              <option value="open">Open</option>
                              <option value="in-progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </div>
                          <textarea
                            value={adminState.remark}
                            onChange={(e) =>
                              handleAdminFieldChange(item._id, 'remark', e.target.value)
                            }
                            placeholder="Add admin resolution remark or update notes..."
                            rows="2"
                            className="admin-remark-input"
                          />
                          <div className="admin-actions-bar">
                            <button
                              onClick={() => handleAdminUpdateSubmit(item._id)}
                              disabled={updateLoadingId === item._id}
                              className="btn btn-primary-sm"
                            >
                              {updateLoadingId === item._id ? 'Updating...' : 'Update Status'}
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="btn btn-danger-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="card-footer">
                        <span className="card-date">
                          📅 {new Date(item.createdAt).toLocaleDateString()} at{' '}
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>

                        {!isAdmin && (
                          <div className="card-actions">
                            {item.status === 'open' && (
                              <button
                                onClick={() => startEdit(item)}
                                className="btn btn-secondary-sm"
                              >
                                Edit
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="btn btn-danger-sm"
                            >
                              Delete
                            </button>
                          </div>
                        )}
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
