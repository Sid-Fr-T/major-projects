// client/src/context/AuthContext.jsx
// Manages authentication state, token persistence in localStorage, and auth actions

import { useState } from 'react';
import API from '../api/axios';
import { AuthContext } from './authContextInstance';

export const AuthProvider = ({ children }) => {
  // Read initial user and token from localStorage
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Login handler
  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;

    // Save token and user info to state and localStorage
    localStorage.setItem('token', receivedToken);
    localStorage.setItem('user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);

    return res.data;
  };

  // Register handler
  const register = async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password });
    const { token: receivedToken, user: receivedUser } = res.data;

    // Save token and user info to state and localStorage
    localStorage.setItem('token', receivedToken);
    localStorage.setItem('user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);

    return res.data;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

