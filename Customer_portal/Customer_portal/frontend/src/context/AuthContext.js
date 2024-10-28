// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setIsLoggedIn(true);
        setUserRole(decodedToken.role);
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
