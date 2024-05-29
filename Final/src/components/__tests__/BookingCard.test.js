/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import BookingCard from '../BookingCard';

test('renders BookingCard component', () => {
  render(<BookingCard />);
  // Add assertions based on your component's rendering
  expect(screen.getByText(/Booking Details/i)).toBeInTheDocument();
});

// Add more tests based on your component's functionalities
