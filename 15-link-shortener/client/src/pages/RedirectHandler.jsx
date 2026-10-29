// client/src/pages/RedirectHandler.jsx
// Handles client-side /s/:shortCode requests and forwards to backend redirect route

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const RedirectHandler = () => {
  const { shortCode } = useParams();

  useEffect(() => {
    if (shortCode) {
      window.location.href = `http://localhost:5000/s/${shortCode}`;
    }
  }, [shortCode]);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h2>Redirecting...</h2>
        <p className="auth-subtitle">Taking you to your destination URL...</p>
      </div>
    </div>
  );
};

export default RedirectHandler;

