// client/src/components/Navbar.jsx
// Navigation bar displaying application title, user greeting, role badge, and logout button

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">📋</span> Complaint Portal
        </Link>
        <div className="nav-actions">
          {user ? (
            <>
              <div className="nav-user-info">
                <span className="nav-user">
                  Hello, <strong>{user.name}</strong>
                </span>
                <span className={`role-badge role-${user.role || 'user'}`}>
                  {user.role === 'admin' ? 'Admin' : 'User'}
                </span>
              </div>
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
