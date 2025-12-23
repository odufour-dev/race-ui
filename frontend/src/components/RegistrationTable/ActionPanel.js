import React, { useState } from 'react';
import PDFExport from '../PDFExport/PDFExport';

function ActionPanel({ data,columnDefs,onGenerateBibs, onApplyAge, onShuffle }) {
  const [ageValue, setAgeValue] = useState('');

  return (
    <div className="action-panel" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <button className="btn btn-sm" onClick={onGenerateBibs}>Generate Bibs</button>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="number"
          placeholder="Age"
          value={ageValue}
          onChange={e => setAgeValue(e.target.value)}
          style={{ width: '5rem', padding: '0.25rem' }}
        />
        <button className="btn btn-sm" onClick={() => { onApplyAge(Number(ageValue)); setAgeValue(''); }}>Apply Age</button>
      </div>
      <button className="btn btn-sm" onClick={onShuffle}>Shuffle Order</button>
      <PDFExport data={data} columnDefs={columnDefs} title="Registration" />
    </div>
  );
}

export default ActionPanel;
