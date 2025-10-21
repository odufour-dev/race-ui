import React from 'react';

function DropdownEditor({ rowIndex, columnKey, col, editValue, setEditValue, setEditingCell, setData, propsRowOriginal, colKeys, data }) {
  // Flip dropdown for last 3 rows
  const flipDropdown = rowIndex >= (data ? data.length : 0) - 3;
  return (
    <div className={`dropdown-container${flipDropdown ? ' dropdown-flip' : ''}`}>
      <input
        type="text"
        className="dropdown-input"
        value={editValue}
        autoFocus
        onChange={e => setEditValue(e.target.value)}
        onBlur={() => setTimeout(() => setEditingCell(null), 150)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            setData(prev => prev.map((row, idx) =>
              idx === rowIndex ? { ...row, [columnKey]: editValue } : row
            ));
            setEditingCell(null);
            e.preventDefault();
          } else if (e.key === 'Tab') {
            setData(prev => prev.map((row, idx) =>
              idx === rowIndex ? { ...row, [columnKey]: editValue } : row
            ));
            const currentIdx = colKeys.indexOf(columnKey);
            if (currentIdx < colKeys.length - 1) {
              setEditingCell({ rowIndex, columnKey: colKeys[currentIdx + 1] });
              setEditValue(propsRowOriginal[colKeys[currentIdx + 1]] ?? '');
            } else {
              setEditingCell(null);
            }
            e.preventDefault();
          }
        }}
      />
      <ul className="dropdown-list">
        {col.allowedValues.map(opt => (
          <li
            key={opt.value}
            className="dropdown-list-item"
            onMouseDown={() => {
              setEditValue(opt.value);
              setData(prev => prev.map((row, idx) =>
                idx === rowIndex ? { ...row, [columnKey]: opt } : row
              ));
              setEditingCell(null);
            }}
          >
            {opt}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DropdownEditor;
