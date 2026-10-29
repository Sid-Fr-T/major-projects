// client/src/components/Navbar.jsx
// Navigation bar with Quiz System brand, navigation links, and auth controls

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">📝</span> Quiz System
        </Link>
        <div className="nav-actions">
          {user ? (
            <>
              <div className="nav-links">
                <Link
                  to="/"
                  className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                >
                  Quizzes
                </Link>
                <Link
                  to="/history"
                  className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
                >
                  Score History
                </Link>
              </div>
              <span className="nav-user">
                Hello, <strong>{user.name}</strong>
              </span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <div className="nav-links">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link btn btn-primary-sm">
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
