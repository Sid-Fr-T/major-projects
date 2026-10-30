// client/src/components/ProtectedRoute.jsx
// Restricts access to authenticated users and optionally enforces admin role

import { Link, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { token, user } = useAuth();

  // If user is not logged in, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If route requires admin role and user is not an admin, show restricted notice
  if (adminOnly && user?.role !== 'admin') {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ maxWidth: '500px', textAlign: 'center' }}>
          <h2>Access Restricted</h2>
          <p className="auth-subtitle" style={{ marginBottom: '16px' }}>
            Only users with the <strong>Admin</strong> role can access the Portfolio CMS panel.
          </p>
          <div className="alert alert-error" style={{ marginBottom: '20px' }}>
            Your account is currently registered as a standard <strong>{user?.role || 'user'}</strong>.
          </div>
          <Link to="/" className="btn btn-primary btn-block">
            View Public Portfolio
          </Link>
        </div>
      </div>
    );
  }

  // Render child components or nested route Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
