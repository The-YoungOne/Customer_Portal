// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:5000', // Ensure HTTPS is used
  headers: {
    'Content-Type': 'application/json'
  }
});

// Optionally add interceptors here for logging, error handling, etc.

export default api;
