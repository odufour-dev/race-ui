import React from 'react';
import { render, screen } from '@testing-library/react';
import RegistrationTable from './RegistrationTable';

const mockDataModel = {
  data: [],
  setData: jest.fn(),
  addRow: jest.fn(),
  updateRow: jest.fn(),
  deleteRow: jest.fn(),
  setAllData: jest.fn(),
  categoryOptions: [],
  serieOptions: [],
};

describe('RegistrationTable', () => {
  it('renders table title', () => {
    render(<RegistrationTable dataModel={mockDataModel} />);
    expect(screen.getByText(/registration/i)).toBeInTheDocument();
  });
});
