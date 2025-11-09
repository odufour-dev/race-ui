import React, { useEffect, useState } from 'react';
import "./AnnexItem.css"

export function AnnexItem( {translator, data, onApply, onRemove} ) {
  
  const [ item, setItem ] = useState( data );

  useEffect(() => { onApply && onApply( item ) }, [ item ]);

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
          <span>{ translator( 'event.settings.annex.priority' ) }</span>
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
          <span>{ translator('event.settings.annex.name') }</span>
          <button type="button" className="btn small danger" onClick={() => onRemove && onRemove(item.id)}>{translator('event.settings.annex.remove')}</button>
        </div>
      </div>

    </div>
  );
}
