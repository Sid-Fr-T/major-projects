// client/src/App.jsx
// Main application layout with public event viewing, login, register, and protected bookings route

import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
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
          {/* Public route: Everyone can view events */}
          <Route path="/" element={<Dashboard />} />

          {/* Public authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected route: My Bookings */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <Dashboard initialTab="my-bookings" />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect to public events page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
