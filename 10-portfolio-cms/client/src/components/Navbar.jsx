// client/src/components/Navbar.jsx
// Navigation bar displaying application title, user greeting, role badge, and navigation links

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">📁</span> Portfolio CMS
        </Link>
        <div className="nav-actions">
          <Link to="/" className="nav-link">
            Portfolio
          </Link>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link nav-link-admin">
                  Admin Panel
                </Link>
              )}
              <span className="nav-user">
                {user.name}{' '}
                <span className={`role-badge role-${user.role || 'user'}`}>
                  {user.role || 'user'}
                </span>
              </span>
              <button onClick={handleLogout} className="btn btn-secondary-sm">
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
