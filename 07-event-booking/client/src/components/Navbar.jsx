// client/src/components/Navbar.jsx
// Navigation bar with EventHub branding, events navigation, user greeting, and auth controls

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="nav-brand">
            🎟️ EventHub
          </Link>
          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Browse Events
            </Link>
            {user && (
              <Link
                to="/my-bookings"
                className={`nav-link ${location.pathname === '/my-bookings' ? 'active' : ''}`}
              >
                My Bookings
              </Link>
            )}
          </div>
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user">
                Hello, <strong>{user.name}</strong>
              </span>
              <button onClick={handleLogout} className="btn btn-secondary-sm">
                Logout
              </button>
            </>
          ) : (
            <div className="nav-links">
              <Link to="/login" className="nav-link">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
