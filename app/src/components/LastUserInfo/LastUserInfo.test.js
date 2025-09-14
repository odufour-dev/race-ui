import React from 'react';
import { render, screen } from '@testing-library/react';
import LastUserInfo from './LastUserInfo';

describe('LastUserInfo', () => {
  it('renders without crashing', () => {
    render(<LastUserInfo lastUser={null} />);
    expect(screen.getByText(/last user/i)).toBeInTheDocument();
  });
});
