import { render, screen } from '@testing-library/react';
import App from './App';

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

test('renders learn react link', () => {
  render(<App dataModel={mockDataModel} />);
  const linkElement = screen.getByText(/Tan Stack Table/i);
  expect(linkElement).toBeInTheDocument();
});
