// client/src/pages/Dashboard.jsx
// Dashboard for viewing, creating, updating, searching, and pinning notes scoped to the user

import { useState, useEffect } from 'react';
import API from '../api/axios';

const COLOR_OPTIONS = [
  { label: 'White', value: '#ffffff' },
  { label: 'Yellow', value: '#fef9c3' },
  { label: 'Green', value: '#dcfce7' },
  { label: 'Blue', value: '#e0e7ff' },
  { label: 'Purple', value: '#f3e8ff' },
  { label: 'Pink', value: '#fce7f3' },
  { label: 'Orange', value: '#ffedd5' },
];

// Helper to sort notes: pinned notes first, then latest created first
const sortNotes = (list) => {
  return [...list].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // State for creating a new note
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    color: '#ffffff',
    pinned: false,
  });
  const [createLoading, setCreateLoading] = useState(false);

  // State for tracking which note is currently being edited
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    content: '',
    color: '#ffffff',
    pinned: false,
  });

  // Set document title
  useEffect(() => {
    document.title = 'NotesApp - Dashboard';
  }, []);

  // Fetch all notes belonging to the authenticated user on mount
  useEffect(() => {
    let ignore = false;

    API.get('/notes')
      .then((res) => {
        if (!ignore) {
          setNotes(sortNotes(res.data));
          setError('');
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.message || 'Failed to load notes.');
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

  // Handle new note form input changes
  const handleNewChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewNote((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Submit new note
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.title.trim()) return;

    setCreateLoading(true);
    try {
      const res = await API.post('/notes', newNote);
      setNotes((prev) => sortNotes([res.data, ...prev]));
      setNewNote({
        title: '',
        content: '',
        color: '#ffffff',
        pinned: false,
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create note.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Quick toggle pin on a card
  const handleTogglePin = async (id, currentPinned) => {
    try {
      const res = await API.put(`/notes/${id}`, { pinned: !currentPinned });
      setNotes((prev) =>
        sortNotes(prev.map((n) => (n._id === id ? res.data : n)))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle pin.');
    }
  };

  // Enable edit mode for a specific note card
  const startEdit = (note) => {
    setEditingId(note._id);
    setEditFormData({
      title: note.title,
      content: note.content || '',
      color: note.color || '#ffffff',
      pinned: Boolean(note.pinned),
    });
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({
      title: '',
      content: '',
      color: '#ffffff',
      pinned: false,
    });
  };

  // Save updated note
  const handleUpdateSubmit = async (id) => {
    if (!editFormData.title.trim()) return;

    try {
      const res = await API.put(`/notes/${id}`, editFormData);
      setNotes((prev) =>
        sortNotes(prev.map((note) => (note._id === id ? res.data : note)))
      );
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update note.');
    }
  };

  // Delete a note
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await API.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete note.');
    }
  };

  // Real-time search filter across title and content
  const filteredNotes = notes.filter((note) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      note.title.toLowerCase().includes(q) ||
      (note.content && note.content.toLowerCase().includes(q))
    );
  });

  return (
    <div className="dashboard-container">
      {/* Top Note Creation Card */}
      <section
        className="create-section"
        style={{ backgroundColor: newNote.color !== '#ffffff' ? newNote.color : undefined }}
      >
        <div className="create-section-header">
          <h2>Add New Note</h2>
          <button
            type="button"
            className={`pin-toggle-btn ${newNote.pinned ? 'pinned' : ''}`}
            onClick={() => setNewNote((prev) => ({ ...prev, pinned: !prev.pinned }))}
            title={newNote.pinned ? 'Unpin note' : 'Pin note'}
          >
            📌 {newNote.pinned ? 'Pinned' : 'Pin'}
          </button>
        </div>

        <form onSubmit={handleCreateSubmit} className="create-form">
          <input
            type="text"
            name="title"
            value={newNote.title}
            onChange={handleNewChange}
            placeholder="Note title *"
            required
            className="input-title"
          />

          <textarea
            name="content"
            value={newNote.content}
            onChange={handleNewChange}
            placeholder="Write your note content here..."
            rows="3"
            className="input-desc"
          ></textarea>

          <div className="create-form-footer">
            <div className="color-picker-group">
              <span className="color-label">Color:</span>
              <div className="color-swatches">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    className={`color-swatch ${newNote.color === c.value ? 'selected' : ''}`}
                    style={{ backgroundColor: c.value }}
                    onClick={() => setNewNote((prev) => ({ ...prev, color: c.value }))}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={createLoading}
            >
              {createLoading ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </form>
      </section>

      {/* Notes Controls & Search Section */}
      <section className="notes-controls-section">
        <div className="search-bar-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by title or content..."
            className="search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </section>

      {/* Notes Display Section */}
      <section className="items-section">
        <div className="items-header">
          <h2>Your Notes</h2>
          <span className="items-count">
            ({filteredNotes.length}{searchQuery ? ` of ${notes.length}` : ''})
          </span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <p>No notes yet. Create your first note above!</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <p>No notes matched &quot;{searchQuery}&quot;.</p>
          </div>
        ) : (
          <div className="card-grid">
            {filteredNotes.map((note) => {
              const isEditing = editingId === note._id;

              return (
                <div
                  key={note._id}
                  className={`note-card ${note.pinned ? 'is-pinned' : ''}`}
                  style={{ backgroundColor: note.color || '#ffffff' }}
                >
                  {isEditing ? (
                    // Note in Edit Mode
                    <div className="card-edit-mode">
                      <div className="edit-header-row">
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
                          placeholder="Note title *"
                          required
                        />
                        <button
                          type="button"
                          className={`pin-toggle-btn ${editFormData.pinned ? 'pinned' : ''}`}
                          onClick={() =>
                            setEditFormData((prev) => ({
                              ...prev,
                              pinned: !prev.pinned,
                            }))
                          }
                          title={editFormData.pinned ? 'Unpin note' : 'Pin note'}
                        >
                          📌
                        </button>
                      </div>

                      <textarea
                        value={editFormData.content}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        className="edit-textarea"
                        rows="4"
                        placeholder="Note content..."
                      />

                      <div className="color-picker-group">
                        <span className="color-label">Color:</span>
                        <div className="color-swatches">
                          {COLOR_OPTIONS.map((c) => (
                            <button
                              key={c.value}
                              type="button"
                              className={`color-swatch ${editFormData.color === c.value ? 'selected' : ''}`}
                              style={{ backgroundColor: c.value }}
                              onClick={() =>
                                setEditFormData((prev) => ({
                                  ...prev,
                                  color: c.value,
                                }))
                              }
                              title={c.label}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="card-actions">
                        <button
                          onClick={() => handleUpdateSubmit(note._id)}
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
                    // Note in View Mode
                    <>
                      <div className="card-header">
                        <h3 className="card-title">{note.title}</h3>
                        <button
                          type="button"
                          className={`card-pin-btn ${note.pinned ? 'active' : ''}`}
                          onClick={() => handleTogglePin(note._id, note.pinned)}
                          title={note.pinned ? 'Unpin note' : 'Pin note'}
                        >
                          📌 {note.pinned && <span className="pin-text">Pinned</span>}
                        </button>
                      </div>

                      <p className="card-description">
                        {note.content || <span className="empty-content">No content</span>}
                      </p>

                      <div className="card-footer">
                        <span className="card-date">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                        <div className="card-actions">
                          <button
                            onClick={() => startEdit(note)}
                            className="btn btn-secondary-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(note._id)}
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
