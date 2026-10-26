// client/src/components/ProtectedRoute.jsx
// Restricts access to authenticated users only; redirects unauthenticated users to /login

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  // If user is not logged in, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Render child components or nested route Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
