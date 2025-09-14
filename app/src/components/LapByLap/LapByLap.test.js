import React from 'react';
import { render, screen } from '@testing-library/react';
import LapByLap from './LapByLap';

describe('LapByLap', () => {
  it('renders LapByLap component', () => {
    render(<LapByLap />);
    expect(screen.getByText(/lap/i)).toBeInTheDocument();
  });
});
