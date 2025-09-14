import React from 'react';
import { render, screen } from '@testing-library/react';
import AppTabs from './AppTabs';

describe('AppTabs', () => {
  it('renders app-tabs-content', () => {
    render(<AppTabs tabs={[]} />);
    const contentDiv = document.querySelector('.app-tabs-content');
    expect(contentDiv).toBeInTheDocument();
  });
});
