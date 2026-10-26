// client/src/api/axios.js
// Configured Axios instance with backend base URL and JWT auth header interceptor

import axios from 'axios';

// Base API instance targeting the Express backend
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to automatically attach the JWT token from localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;

