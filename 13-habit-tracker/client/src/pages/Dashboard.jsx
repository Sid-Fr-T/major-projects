// client/src/pages/Dashboard.jsx
// Dashboard for tracking habits, viewing streaks, weekly view, and toggling completions

import { useState, useEffect } from 'react';
import API from '../api/axios';
import {
  formatDateKey,
  isCompletedOnDate,
  isCompletedToday,
  getLast7Days,
  calculateStreak,
} from '../utils/habitUtils';

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for creating a new habit
  const [newHabit, setNewHabit] = useState({
    name: '',
    frequency: 'daily',
  });
  const [createLoading, setCreateLoading] = useState(false);

  // State for tracking which habit is currently being edited
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    frequency: 'daily',
  });

  const [actionLoadingId, setActionLoadingId] = useState(null);

  // 7-day window for the weekly view
  const weekDays = getLast7Days();

  // Fetch all habits belonging to the authenticated user on mount
  useEffect(() => {
    let ignore = false;

    API.get('/habits')
      .then((res) => {
        if (!ignore) {
          setHabits(res.data);
          setError('');
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.message || 'Failed to load habits.');
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

  // Handle new habit form inputs
  const handleNewChange = (e) => {
    setNewHabit((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit new habit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newHabit.name.trim()) return;

    setCreateLoading(true);
    try {
      const res = await API.post('/habits', newHabit);
      setHabits((prev) => [res.data, ...prev]);
      setNewHabit({ name: '', frequency: 'daily' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create habit.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Toggle habit completion for a specific date (defaults to today)
  const handleToggleDate = async (habitId, targetDateKey = null) => {
    const dateToToggle = targetDateKey || formatDateKey(new Date());
    setActionLoadingId(habitId);

    try {
      const res = await API.post(`/habits/${habitId}/toggle`, { date: dateToToggle });
      setHabits((prev) =>
        prev.map((habit) => (habit._id === habitId ? res.data : habit))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update habit completion.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Enable edit mode
  const startEdit = (habit) => {
    setEditingId(habit._id);
    setEditFormData({
      name: habit.name,
      frequency: habit.frequency || 'daily',
    });
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({ name: '', frequency: 'daily' });
  };

  // Save updated habit
  const handleUpdateSubmit = async (id) => {
    if (!editFormData.name.trim()) return;

    try {
      const res = await API.put(`/habits/${id}`, editFormData);
      setHabits((prev) =>
        prev.map((habit) => (habit._id === id ? res.data : habit))
      );
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update habit.');
    }
  };

  // Delete a habit
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;

    try {
      await API.delete(`/habits/${id}`);
      setHabits((prev) => prev.filter((habit) => habit._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete habit.');
    }
  };

  // Derived stats
  const totalHabits = habits.length;
  const completedTodayCount = habits.filter((h) =>
    isCompletedToday(h.completedDates)
  ).length;

  return (
    <div className="dashboard-container">
      {/* Overview Statistics Banner */}
      <section className="stats-banner">
        <div className="stat-card">
          <span className="stat-label">Total Habits</span>
          <span className="stat-value">{totalHabits}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Done Today</span>
          <span className="stat-value">
            {completedTodayCount} / {totalHabits}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Today's Progress</span>
          <span className="stat-value">
            {totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0}%
          </span>
        </div>
      </section>

      {/* Add New Habit Section */}
      <section className="create-section">
        <h2>Add New Habit</h2>
        <form onSubmit={handleCreateSubmit} className="create-form">
          <div className="form-row">
            <input
              type="text"
              name="name"
              value={newHabit.name}
              onChange={handleNewChange}
              placeholder="Habit name (e.g. Drink 2L water, Morning Run) *"
              required
              className="input-title"
            />
            <select
              name="frequency"
              value={newHabit.frequency}
              onChange={handleNewChange}
              className="select-status"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createLoading}
            >
              {createLoading ? 'Adding...' : 'Add Habit'}
            </button>
          </div>
        </form>
      </section>

      {/* Habits List Section */}
      <section className="habits-section">
        <div className="habits-header">
          <h2>My Habits</h2>
          <span className="habits-count">({habits.length})</span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading your habits...</div>
        ) : habits.length === 0 ? (
          <div className="empty-state">
            <p>No habits tracked yet. Create your first habit above to begin building consistency!</p>
          </div>
        ) : (
          <div className="card-grid">
            {habits.map((habit) => {
              const isEditing = editingId === habit._id;
              const streak = calculateStreak(habit);
              const doneToday = isCompletedToday(habit.completedDates);
              const isBusy = actionLoadingId === habit._id;

              return (
                <div key={habit._id} className="habit-card">
                  {isEditing ? (
                    // Card in Edit Mode
                    <div className="card-edit-mode">
                      <div className="form-group">
                        <label>Habit Name</label>
                        <input
                          type="text"
                          value={editFormData.name}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="edit-input"
                          placeholder="Habit Name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Frequency</label>
                        <select
                          value={editFormData.frequency}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              frequency: e.target.value,
                            }))
                          }
                          className="edit-select"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </div>
                      <div className="card-actions">
                        <button
                          onClick={() => handleUpdateSubmit(habit._id)}
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
                        <div>
                          <h3 className="card-title">{habit.name}</h3>
                          <div className="habit-badges">
                            <span className={`frequency-badge freq-${habit.frequency}`}>
                              {habit.frequency === 'weekly' ? 'Weekly' : 'Daily'}
                            </span>
                            <span className="streak-badge" title="Current streak">
                              🔥 {streak.label}
                            </span>
                          </div>
                        </div>
                        <div className="card-actions">
                          <button
                            onClick={() => startEdit(habit)}
                            className="btn btn-secondary-sm"
                            title="Edit Habit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(habit._id)}
                            className="btn btn-danger-sm"
                            title="Delete Habit"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Today's Quick Action Button */}
                      <div className="today-action-row">
                        <button
                          onClick={() => handleToggleDate(habit._id)}
                          disabled={isBusy}
                          className={`btn btn-block ${
                            doneToday ? 'btn-done-today' : 'btn-mark-today'
                          }`}
                        >
                          {doneToday ? '✓ Done for Today' : '+ Mark Done for Today'}
                        </button>
                      </div>

                      {/* Weekly View (Last 7 Days) */}
                      <div className="weekly-view-section">
                        <div className="weekly-view-title">
                          <span>Last 7 Days</span>
                          <span className="weekly-hint">Click a day to toggle</span>
                        </div>
                        <div className="weekly-grid">
                          {weekDays.map((day) => {
                            const isDone = isCompletedOnDate(
                              habit.completedDates,
                              day.date
                            );

                            return (
                              <button
                                key={day.dateKey}
                                type="button"
                                className={`week-day-col ${day.isToday ? 'is-today' : ''} ${
                                  isDone ? 'is-completed' : ''
                                }`}
                                onClick={() => handleToggleDate(habit._id, day.dateKey)}
                                title={`${day.dayName}, ${day.monthName} ${day.dayNumber}: ${
                                  isDone ? 'Completed' : 'Not completed'
                                } (click to toggle)`}
                                disabled={isBusy}
                              >
                                <span className="day-name">{day.dayName}</span>
                                <span className="day-number">{day.dayNumber}</span>
                                <div className="day-indicator">
                                  {isDone ? '✓' : day.isToday ? '•' : ''}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="card-footer">
                        <span className="card-date">
                          Created {new Date(habit.createdAt).toLocaleDateString()}
                        </span>
                        <span className="completions-count">
                          Total completions: {habit.completedDates?.length || 0}
                        </span>
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
