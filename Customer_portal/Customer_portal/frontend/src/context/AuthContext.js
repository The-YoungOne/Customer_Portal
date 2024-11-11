import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  // Check if user is logged in and validate token with the backend
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setIsLoggedIn(true);
        setUserRole(decodedToken.role);

        // Optionally, verify token with the backend
        api.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
          setIsLoggedIn(true);
          setUserRole(response.data.role || decodedToken.role);
        })
        .catch((error) => {
          console.error('Token validation failed:', error);
          logout();
        });

      } catch (error) {
        console.error('Error decoding token:', error);
        setIsLoggedIn(false);
        setUserRole('');
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('jwtToken', token);
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    setIsLoggedIn(true);
    setUserRole(decodedToken.role);
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    setUserRole('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
