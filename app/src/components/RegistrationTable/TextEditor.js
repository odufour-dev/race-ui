import React from 'react';

function TextEditor({ value, setData, next }) {
  return (
    <input
      type="text"
      className="editable-input"
      value={value}
      autoFocus
      onChange={(e) => setData(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          setData(e.target.value);
          next.down();
          e.preventDefault();
        } else if (e.key === 'Tab') {
          setData(e.target.value);
          next.right();
          e.preventDefault();
        }
      }}
    />
  );
}

/*
onBlur={() => setEditingCell(null)}

const currentIdx = colKeys.indexOf(columnKey);
if (currentIdx < colKeys.length - 1) {
  setEditingCell({ rowIndex, columnKey: colKeys[currentIdx + 1] });
  setEditValue(propsRowOriginal[colKeys[currentIdx + 1]] ?? '');
} else {
  setEditingCell(null);
}
*/

export default TextEditor;
