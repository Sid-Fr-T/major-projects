// client/src/pages/Dashboard.jsx
// Event Booking dashboard: browse all events, register, cancel bookings, view My Bookings, and create new events

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/useAuth';

const Dashboard = ({ initialTab = 'all' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(
    location.pathname === '/my-bookings' || initialTab === 'my-bookings'
      ? 'my-bookings'
      : 'all'
  );

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [actionId, setActionId] = useState(null);

  // Toggle for host / create event form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    seats: '',
  });

  // Synchronize tab if route changes
  useEffect(() => {
    if (location.pathname === '/my-bookings') {
      setActiveTab('my-bookings');
    } else if (location.pathname === '/') {
      setActiveTab('all');
    }
  }, [location.pathname]);

  // Fetch all events on component mount
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get('/events');
      setEvents(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Clear success notification after 4 seconds
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Check if current logged-in user is registered for a specific event
  const isBookedByUser = (event) => {
    if (!user || !event.registeredUsers) return false;
    return event.registeredUsers.some((uid) => {
      const regId = typeof uid === 'object' && uid !== null ? uid._id : uid;
      return String(regId) === String(user._id);
    });
  };

  // Filter events based on active tab
  const displayedEvents =
    activeTab === 'my-bookings'
      ? events.filter((e) => isBookedByUser(e))
      : events;

  const myBookingsCount = events.filter((e) => isBookedByUser(e)).length;

  // Handle Event Registration (seats decrease, duplicate prevented)
  const handleRegister = async (eventId, eventTitle) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setActionId(eventId);
    setError('');
    try {
      const res = await API.post(`/events/${eventId}/register`);
      const updatedEvent = res.data.event;

      setEvents((prev) =>
        prev.map((ev) => (ev._id === eventId ? updatedEvent : ev))
      );
      setSuccessMsg(`Reserved your seat for "${eventTitle}"!`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setActionId(null);
    }
  };

  // Handle Booking Cancellation (seats increase, removed from user bookings)
  const handleCancelBooking = async (eventId, eventTitle) => {
    if (!user) return;

    if (!window.confirm(`Are you sure you want to cancel your booking for "${eventTitle}"?`)) {
      return;
    }

    setActionId(eventId);
    setError('');
    try {
      const res = await API.post(`/events/${eventId}/cancel`);
      const updatedEvent = res.data.event;

      setEvents((prev) =>
        prev.map((ev) => (ev._id === eventId ? updatedEvent : ev))
      );
      setSuccessMsg(`Cancelled booking for "${eventTitle}". Seat freed.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Cancellation failed.');
    } finally {
      setActionId(null);
    }
  };

  // Handle creating a new event
  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.date || !newEvent.location.trim() || !newEvent.seats) {
      setError('Please fill in all required event fields.');
      return;
    }

    setCreateLoading(true);
    setError('');
    try {
      const res = await API.post('/events', {
        title: newEvent.title.trim(),
        description: newEvent.description.trim(),
        date: newEvent.date,
        location: newEvent.location.trim(),
        seats: Number(newEvent.seats),
      });

      setEvents((prev) => [...prev, res.data].sort((a, b) => new Date(a.date) - new Date(b.date)));
      setNewEvent({ title: '', description: '', date: '', location: '', seats: '' });
      setShowCreateModal(false);
      setSuccessMsg('New event posted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle deleting an event
  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (!window.confirm(`Delete the event "${eventTitle}" permanently?`)) return;

    try {
      await API.delete(`/events/${eventId}`);
      setEvents((prev) => prev.filter((ev) => ev._id !== eventId));
      setSuccessMsg(`Event "${eventTitle}" deleted.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event.');
    }
  };

  // Helper date formatter
  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Hero / Header Section */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <h1>Discover & Book Remarkable Events</h1>
          <p className="hero-subtext">
            Explore conferences, workshops, and meetups. Reserve your seat with one click.
          </p>
        </div>
        {user && (
          <button
            onClick={() => setShowCreateModal(!showCreateModal)}
            className="btn btn-primary create-toggle-btn"
          >
            {showCreateModal ? '✕ Close Form' : '+ Host New Event'}
          </button>
        )}
      </section>

      {/* Success Notification */}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {/* Error Notification */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Create Event Form (Visible when toggled) */}
      {showCreateModal && user && (
        <section className="create-section">
          <h2>Create New Event</h2>
          <form onSubmit={handleCreateSubmit} className="create-form">
            <div className="form-row">
              <div className="form-group flex-2">
                <label htmlFor="title">Event Title *</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleNewChange}
                  placeholder="e.g. AI Summit 2026"
                  required
                />
              </div>

              <div className="form-group flex-1">
                <label htmlFor="seats">Total Seats *</label>
                <input
                  id="seats"
                  type="number"
                  name="seats"
                  min="1"
                  value={newEvent.seats}
                  onChange={handleNewChange}
                  placeholder="e.g. 50"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label htmlFor="date">Date & Time *</label>
                <input
                  id="date"
                  type="datetime-local"
                  name="date"
                  value={newEvent.date}
                  onChange={handleNewChange}
                  required
                />
              </div>

              <div className="form-group flex-1">
                <label htmlFor="location">Location *</label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={newEvent.location}
                  onChange={handleNewChange}
                  placeholder="e.g. San Francisco, CA or Online"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Event Description</label>
              <textarea
                id="description"
                name="description"
                value={newEvent.description}
                onChange={handleNewChange}
                placeholder="What will attendees learn, experience, or network about?"
                rows="3"
                className="input-desc"
              ></textarea>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createLoading}
              >
                {createLoading ? 'Publishing...' : 'Publish Event'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Navigation Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('all');
            if (location.pathname !== '/') navigate('/');
          }}
        >
          All Events ({events.length})
        </button>
        {user && (
          <button
            className={`tab-btn ${activeTab === 'my-bookings' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('my-bookings');
              if (location.pathname !== '/my-bookings') navigate('/my-bookings');
            }}
          >
            My Bookings ({myBookingsCount})
          </button>
        )}
      </div>

      {/* Events Listing Section */}
      <section className="events-section">
        {loading ? (
          <div className="loading-state">Loading upcoming events...</div>
        ) : displayedEvents.length === 0 ? (
          <div className="empty-state">
            {activeTab === 'my-bookings' ? (
              <>
                <p>You haven't registered for any events yet.</p>
                <button
                  onClick={() => {
                    setActiveTab('all');
                    navigate('/');
                  }}
                  className="btn btn-primary-sm mt-3"
                >
                  Browse Available Events
                </button>
              </>
            ) : (
              <p>No events found. Be the first to create one!</p>
            )}
          </div>
        ) : (
          <div className="card-grid">
            {displayedEvents.map((event) => {
              const booked = isBookedByUser(event);
              const isActionRunning = actionId === event._id;
              const isSoldOut = event.seats <= 0;
              const isCreator = user && event.createdBy && String(event.createdBy) === String(user._id);

              return (
                <div
                  key={event._id}
                  className={`item-card event-card ${booked ? 'event-card-booked' : ''}`}
                >
                  <div className="card-header">
                    <h3 className="card-title">{event.title}</h3>
                    {booked ? (
                      <span className="badge badge-booked">✓ Booked</span>
                    ) : isSoldOut ? (
                      <span className="badge badge-soldout">Sold Out</span>
                    ) : (
                      <span className="badge badge-available">
                        {event.seats} {event.seats === 1 ? 'seat' : 'seats'} left
                      </span>
                    )}
                  </div>

                  <div className="event-meta">
                    <div className="meta-item">
                      <span className="meta-icon">📅</span>
                      <span className="meta-text">{formatDate(event.date)}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">📍</span>
                      <span className="meta-text">{event.location}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">🎟️</span>
                      <span className="meta-text">
                        <strong>{event.seats}</strong> available seats
                      </span>
                    </div>
                  </div>

                  <p className="card-description">
                    {event.description || 'No detailed description provided for this event.'}
                  </p>

                  <div className="card-footer event-footer">
                    <div className="event-action-buttons">
                      {booked ? (
                        <button
                          onClick={() => handleCancelBooking(event._id, event.title)}
                          disabled={isActionRunning}
                          className="btn btn-danger-sm"
                        >
                          {isActionRunning ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                      ) : isSoldOut ? (
                        <button disabled className="btn btn-secondary-sm btn-disabled">
                          Fully Booked
                        </button>
                      ) : user ? (
                        <button
                          onClick={() => handleRegister(event._id, event.title)}
                          disabled={isActionRunning}
                          className="btn btn-primary-sm"
                        >
                          {isActionRunning ? 'Registering...' : 'Register (Book Seat)'}
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate('/login')}
                          className="btn btn-primary-sm"
                        >
                          Log in to Register
                        </button>
                      )}

                      {isCreator && (
                        <button
                          onClick={() => handleDeleteEvent(event._id, event.title)}
                          className="btn btn-secondary-sm delete-btn"
                          title="Delete this event"
                        >
                          🗑️
                        </button>
                      )}
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
