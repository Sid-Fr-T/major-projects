// client/src/App.jsx
// Main application layout with route configuration for public portfolio and admin CMS

import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <div className="app-wrapper">
      {/* Top Navbar accessible across the app */}
      <Navbar />

      {/* Main page content area */}
      <main>
        <Routes>
          {/* Public Portfolio Showcase */}
          <Route path="/" element={<Home />} />

          {/* Public authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Admin CMS Panel: accessible only to users with role "admin" */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Alias /dashboard route redirecting to /admin */}
          <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

          {/* Catch-all redirect to public portfolio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
