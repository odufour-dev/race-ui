import React from 'react';

function TextEditor({ rowIndex, columnKey, editValue, setEditValue, setEditingCell, setData, propsRowOriginal, colKeys }) {
  return (
    <input
      type="text"
      className="editable-input"
      value={editValue}
      autoFocus
      onChange={e => setEditValue(e.target.value)}
      onBlur={() => setEditingCell(null)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          setData(prev => prev.map((row, idx) =>
          {
            if (idx === rowIndex){
                console.log(row);
                return { ...row, [columnKey]: editValue };
            } else {
                return row;
            }
        }
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
  );
}

export default TextEditor;
