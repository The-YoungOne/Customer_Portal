// src/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App'; // Import your actual App component

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />); // Directly render the App component
    // Test for something you know exists in your App component
    expect(document.body).toBeInTheDocument();
  });
});
