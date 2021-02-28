import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Welcome to qapp example', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to qapp example/i);
  expect(linkElement).toBeInTheDocument();
});
