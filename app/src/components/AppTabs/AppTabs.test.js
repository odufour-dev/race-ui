import React from 'react';
import { render, screen } from '@testing-library/react';
import AppTabs from './AppTabs';

describe('AppTabs', () => {
  it('renders tabs', () => {
    render(<AppTabs tabs={[]} />);
    expect(screen.getByText(/tabs/i)).toBeInTheDocument();
  });
});
