// client/src/components/Navbar.jsx
// Navigation bar displaying Job Board branding, user identity, role badge, and logout

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userRole = user?.role || 'applicant';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          Job Board
        </Link>
        <div className="nav-actions">
          {user ? (
            <>
              <div className="nav-user-info">
                <span className="nav-user">
                  Hello, <strong>{user.name}</strong>
                </span>
                <span className={`role-pill role-pill-${userRole}`}>
                  {userRole === 'recruiter' ? 'Recruiter' : 'Applicant'}
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
