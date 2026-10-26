// client/src/pages/Dashboard.jsx
// Dashboard for viewing, creating, updating, and filtering tasks scoped to the user

import { useState, useEffect, useMemo } from 'react';
import API from '../api/axios';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  // State for creating a new task
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
  });
  const [createLoading, setCreateLoading] = useState(false);

  // State for tracking which task is currently being edited
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
  });

  // Fetch all tasks belonging to the authenticated user on mount
  useEffect(() => {
    let ignore = false;

    API.get('/tasks')
      .then((res) => {
        if (!ignore) {
          setTasks(res.data);
          setError('');
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.message || 'Failed to load tasks.');
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

  // Format date for display without timezone displacement
  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.substring(0, 10).split('-');
    if (parts.length !== 3) return null;
    const [year, month, day] = parts;
    const d = new Date(Date.UTC(+year, +month - 1, +day));
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  };

  // Extract YYYY-MM-DD for date inputs
  const toDateInputValue = (dateString) => {
    if (!dateString) return '';
    return dateString.substring(0, 10);
  };

  // Handle new task form input changes
  const handleNewChange = (e) => {
    setNewTask((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit new task
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    setCreateLoading(true);
    try {
      const payload = {
        ...newTask,
        dueDate: newTask.dueDate ? newTask.dueDate : null,
      };
      const res = await API.post('/tasks', payload);
      setTasks((prev) => [res.data, ...prev]);
      setNewTask({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Enable edit mode for a specific task card
  const startEdit = (task) => {
    setEditingId(task._id);
    setEditFormData({
      title: task.title,
      description: task.description || '',
      status: task.status || 'pending',
      priority: task.priority || 'medium',
      dueDate: toDateInputValue(task.dueDate),
    });
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
    });
  };

  // Save updated task
  const handleUpdateSubmit = async (id) => {
    if (!editFormData.title.trim()) return;

    try {
      const payload = {
        ...editFormData,
        dueDate: editFormData.dueDate ? editFormData.dueDate : null,
      };
      const res = await API.put(`/tasks/${id}`, payload);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? res.data : task))
      );
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task.');
    }
  };

  // Delete a task
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task.');
    }
  };

  // Filter tasks based on selected status filter
  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [tasks, filter]);

  // Counts for filter tabs
  const counts = useMemo(() => {
    return {
      all: tasks.length,
      pending: tasks.filter((t) => t.status === 'pending').length,
      'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
    };
  }, [tasks]);

  return (
    <div className="dashboard-container">
      {/* Top Creation Card */}
      <section className="create-section">
        <h2>Add New Task</h2>
        <form onSubmit={handleCreateSubmit} className="create-form">
          <div className="form-row">
            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleNewChange}
              placeholder="Task title *"
              required
              className="input-title"
            />
            <select
              name="status"
              value={newTask.status}
              onChange={handleNewChange}
              className="select-field"
              title="Status"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In-progress</option>
              <option value="done">Done</option>
            </select>
            <select
              name="priority"
              value={newTask.priority}
              onChange={handleNewChange}
              className="select-field"
              title="Priority"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="date"
              name="dueDate"
              value={newTask.dueDate}
              onChange={handleNewChange}
              className="input-date"
              title="Due date"
            />
          </div>
          <textarea
            name="description"
            value={newTask.description}
            onChange={handleNewChange}
            placeholder="Task description (optional)"
            rows="2"
            className="input-desc"
          ></textarea>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createLoading}
          >
            {createLoading ? 'Adding...' : 'Add Task'}
          </button>
        </form>
      </section>

      {/* Tasks Section with Filter Buttons */}
      <section className="items-section">
        <div className="section-header-wrapper">
          <div className="items-header">
            <h2>Your Tasks</h2>
            <span className="items-count">({filteredTasks.length})</span>
          </div>

          {/* Filter Buttons */}
          <div className="filter-group" role="group" aria-label="Task status filters">
            <button
              type="button"
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({counts.all})
            </button>
            <button
              type="button"
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({counts.pending})
            </button>
            <button
              type="button"
              className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
              onClick={() => setFilter('in-progress')}
            >
              In-progress ({counts['in-progress']})
            </button>
            <button
              type="button"
              className={`filter-btn ${filter === 'done' ? 'active' : ''}`}
              onClick={() => setFilter('done')}
            >
              Done ({counts.done})
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>
              {tasks.length === 0
                ? 'No tasks yet. Create your first task above!'
                : `No tasks found with status "${filter}".`}
            </p>
          </div>
        ) : (
          <div className="card-grid">
            {filteredTasks.map((task) => {
              const isEditing = editingId === task._id;
              const formattedDue = formatDueDate(task.dueDate);

              return (
                <div key={task._id} className="item-card">
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
                        placeholder="Task title *"
                        required
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
                      <div className="edit-row">
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
                          <option value="in-progress">In-progress</option>
                          <option value="done">Done</option>
                        </select>
                        <select
                          value={editFormData.priority}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              priority: e.target.value,
                            }))
                          }
                          className="edit-select"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                        </select>
                      </div>
                      <input
                        type="date"
                        value={editFormData.dueDate}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            dueDate: e.target.value,
                          }))
                        }
                        className="edit-input"
                        title="Due Date"
                      />
                      <div className="card-actions">
                        <button
                          onClick={() => handleUpdateSubmit(task._id)}
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
                        <h3 className="card-title">{task.title}</h3>
                        <div className="badge-group">
                          <span
                            className={`priority-badge priority-${task.priority || 'medium'}`}
                          >
                            {task.priority || 'medium'}
                          </span>
                          <span
                            className={`status-badge status-${task.status || 'pending'}`}
                          >
                            {task.status || 'pending'}
                          </span>
                        </div>
                      </div>

                      <p className="card-description">
                        {task.description || 'No description provided.'}
                      </p>

                      <div className="card-meta">
                        {formattedDue ? (
                          <span className="card-due-date">
                            📅 Due: <strong>{formattedDue}</strong>
                          </span>
                        ) : (
                          <span className="card-no-due">No due date</span>
                        )}
                      </div>

                      <div className="card-footer">
                        <span className="card-date">
                          Created: {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                        <div className="card-actions">
                          <button
                            onClick={() => startEdit(task)}
                            className="btn btn-secondary-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(task._id)}
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
