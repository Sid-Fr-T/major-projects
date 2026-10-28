// client/src/pages/RedirectHandler.jsx
// Handles redirecting frontend /s/:shortCode visits to the backend redirect endpoint

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const RedirectHandler = () => {
  const { shortCode } = useParams();

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    window.location.href = `${backendUrl}/s/${shortCode}`;
  }, [shortCode]);

  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
      <h2>Redirecting...</h2>
      <p>Taking you to your destination...</p>
    </div>
  );
};

export default RedirectHandler;

