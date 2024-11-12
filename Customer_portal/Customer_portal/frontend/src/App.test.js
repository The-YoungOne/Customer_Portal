// src/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Create a mock of the App component
const MockApp = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<MockApp />);
    // Test for something you know exists in your App component
    expect(document.body).toBeInTheDocument();
  });
});
