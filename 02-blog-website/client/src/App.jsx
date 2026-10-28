// client/src/App.jsx
// Main application layout with route configuration for public and protected blog pages

import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
  return (
    <div className="app-wrapper">
      {/* Top Navbar accessible across the app */}
      <Navbar />

      {/* Main page content area */}
      <main>
        <Routes>
          {/* Public blog reading routes */}
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />

          {/* Public authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes: accessible only to authenticated authors */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect to public home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
