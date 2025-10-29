import React from 'react';

function DropdownEditor({ rowIndex, columnKey, col, editValue, setEditValue, setEditingCell, setData, propsRowOriginal, colKeys, data }) {
  
  // Use native select for category editing. Support options that are strings or objects { value, label }.
  const options = (col.allowedValues || []).map(opt => {
    if (opt && typeof opt === 'object') return { value: opt.value ?? opt, label: opt.label ?? String(opt.value ?? opt) };
    return { value: opt, label: String(opt) };
  });

  const handleSave = (value) => {
    setData(value);
    setEditingCell(null);
  };

  return (
    <div className="dropdown-container">
      <select
        className="dropdown-input"
        value={editValue}
        autoFocus
        onChange={e => {
          const v = e.target.value;
          setEditValue(v);
          handleSave(v);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            handleSave(e.target.value);
            e.preventDefault();
          } else if (e.key === 'Tab') {
            handleSave(e.target.value);
            const currentIdx = colKeys.indexOf(columnKey);
            if (currentIdx < colKeys.length - 1) {
              setEditingCell({ rowIndex, columnKey: colKeys[currentIdx + 1] });
              setEditValue(propsRowOriginal[colKeys[currentIdx + 1]] ?? '');
            } else {
              setEditingCell(null);
            }
            e.preventDefault();
          } else if (e.key === 'ArrowDown') {
            // select next option in the dropdown without closing the editor
            e.preventDefault();
            const currentVal = e.target.value;
            const idx = options.findIndex(o => String(o.value) === String(currentVal));
            const nextIdx = Math.min(options.length - 1, Math.max(0, idx + 1));
            const nextVal = options[nextIdx] && options[nextIdx].value;
            if (typeof nextVal !== 'undefined') {
              setEditValue(nextVal);
            }
          } else if (e.key === 'ArrowUp') {
            // select previous option in the dropdown without closing the editor
            e.preventDefault();
            const currentVal = e.target.value;
            const idx = options.findIndex(o => String(o.value) === String(currentVal));
            const prevIdx = Math.max(0, idx - 1);
            const prevVal = options[prevIdx] && options[prevIdx].value;
            if (typeof prevVal !== 'undefined') {
              setEditValue(prevVal);
            }
          }
        }}
        onBlur={() => setEditingCell(null)}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export default DropdownEditor;
