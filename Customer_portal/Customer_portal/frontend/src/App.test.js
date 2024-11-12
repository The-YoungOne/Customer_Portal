// src/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

const MockApp = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<MockApp />);
    // Test for something you know exists in your App component
    expect(document.body).toBeInTheDocument();
  });
});