import React, { useEffect, useState } from 'react';

export default function AnnexItem({ translator, annex, onRemove }) {
  
  const [ item, setItem ] = useState( annex );

  return (

    <div className="annex-item">
      <div className="annex-header">
        <div className="annex-h-left">
          <input
            className="annex-title"
            placeholder={translator('event.settings.annex.title')}
            value={item.title ?? ''}
            onChange={e => setItem( item.update({title: e.target.value }))}
          />
          <input
            className="annex-priority"
            type="number"
            min="0"
            value={item.priority ?? 0}
            onChange={e => setItem( item.update({priority: e.target.value }))}
            title={translator('event.settings.annex.priority')}
          />
        </div>

        <div className="annex-h-right">
          <span>Type: { item.type }</span>
          <button type="button" className="btn small danger" onClick={() => onRemove && onRemove(item.id)}>{translator('event.settings.annex.remove')}</button>
        </div>
      </div>

    </div>
  );
}
