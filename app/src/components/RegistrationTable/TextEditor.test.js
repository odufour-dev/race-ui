import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TextEditor from './TextEditor';

describe('TextEditor', () => {
  it('renders input, calls setEditValue on change and handles Enter/Tab', () => {
    const setEditValue = jest.fn();
    const setEditingCell = jest.fn();
    const setData = jest.fn();
    const propsRowOriginal = { col2: 'nextVal' };
    const colKeys = ['col1', 'col2', 'col3'];

    render(
      <TextEditor
        rowIndex={0}
        columnKey="col1"
        editValue="init"
        setEditValue={setEditValue}
        setEditingCell={setEditingCell}
        setData={setData}
        propsRowOriginal={propsRowOriginal}
        colKeys={colKeys}
      />
    );

    const input = screen.getByDisplayValue('init');

    fireEvent.change(input, { target: { value: 'new' } });
    expect(setEditValue).toHaveBeenCalledWith('new');

    // Enter key should call setData and clear editing
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(setData).toHaveBeenCalled();
    expect(setEditingCell).toHaveBeenCalledWith(null);

    // Tab should call setData and move editing cell to next column
    setData.mockClear();
    setEditingCell.mockClear();
    fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
    expect(setData).toHaveBeenCalled();
    expect(setEditingCell).toHaveBeenCalled();
  });
});
