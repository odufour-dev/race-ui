import React, { useState, useRef } from 'react';
import './LapByLap.css';

function LapByLap() {
  // Start with 1 row and 1 column
  const [rows, setRows] = useState([{ id: 1, values: [''] }]);
  const [columns, setColumns] = useState(1);
  const inputRefs = useRef({});

  // Focus helper
  const focusCell = (rowIdx, colIdx) => {
    const key = `${rowIdx}-${colIdx}`;
    if (inputRefs.current[key]) {
      inputRefs.current[key].focus();
    }
  };

  // Handle cell value change
  const handleChange = (rowIdx, colIdx, newValue) => {
    setRows(rows => rows.map((row, r) =>
      r === rowIdx
        ? { ...row, values: row.values.map((v, c) => c === colIdx ? newValue : v) }
        : row
    ));
  };

  // Handle Tab key navigation, column creation, and arrow navigation
  const handleKeyDown = (e, rowIdx, colIdx) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (colIdx === columns - 1) {
        // Add new column to all rows
        setColumns(cols => cols + 1);
        setRows(rows => rows.map(row => ({ ...row, values: [...row.values, ''] })));
        // Move focus to first row of new column
        setTimeout(() => focusCell(0, colIdx + 1), 0);
      } else {
        setTimeout(() => focusCell(rowIdx, colIdx + 1), 0);
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (colIdx < columns - 1) {
        focusCell(rowIdx, colIdx + 1);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (colIdx > 0) {
        focusCell(rowIdx, colIdx - 1);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (rowIdx < rows.length - 1) {
        focusCell(rowIdx + 1, colIdx);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (rowIdx > 0) {
        focusCell(rowIdx - 1, colIdx);
      }
    }
  };

  // Enter always moves to next row in same column, adding a new row if needed
  const handleEnter = (e, rowIdx, colIdx) => {
    if (e.key === 'Enter') {
      if (rowIdx === rows.length - 1) {
        const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
        setRows([...rows, { id: newId, values: Array(columns).fill('') }]);
        setTimeout(() => focusCell(rows.length, colIdx), 0);
      } else {
        setTimeout(() => focusCell(rowIdx + 1, colIdx), 0);
      }
    }
  };

  // Helper: get all values in a column
  const getColumnValues = colIdx => rows.map(row => row.values[colIdx]);

  // Helper: get all values in previous/next column
  const getPrevColumnValues = colIdx => colIdx > 0 ? rows.map(row => row.values[colIdx - 1]) : [];
  const getNextColumnValues = colIdx => colIdx < columns - 1 ? rows.map(row => row.values[colIdx + 1]) : [];

  return (
    <div className="editable-input-table-container">
      <table className="editable-input-table">
        <thead>
          <tr>
            {[...Array(columns)].map((_, colIdx) => (
              <th key={colIdx}>Colonne {colIdx + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={row.id}>
              {row.values.map((value, colIdx) => {
                // Highlight duplicate values in this column
                const colValues = getColumnValues(colIdx);
                const isDuplicate = value && colValues.filter(v => v === value).length > 1;
                return (
                  <td key={colIdx} className="editable-input-table-cell">
                    <input
                      type="text"
                      value={value}
                      ref={el => (inputRefs.current[`${rowIdx}-${colIdx}`] = el)}
                      onChange={e => handleChange(rowIdx, colIdx, e.target.value)}
                      onKeyDown={e => {
                        handleKeyDown(e, rowIdx, colIdx);
                        handleEnter(e, rowIdx, colIdx);
                      }}
                      className={`editable-input-table-input${isDuplicate ? ' duplicate' : ''}`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LapByLap;
