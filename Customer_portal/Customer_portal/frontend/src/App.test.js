// App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the HomePage component', () => {
  render(<App />);
  const appElement = screen.getByText(/International Payment System/i);
  expect(appElement).toBeInTheDocument();
});
