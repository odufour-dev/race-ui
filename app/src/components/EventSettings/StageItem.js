import React, { useEffect, useState } from 'react';

export default function StageItem({ translator, stage, onRemove }) {
  
  const [ item, setItem ] = useState( stage );

  return (

    <div className="stage-item">
      <div className="stage-header">
        <div className="stage-h-left">
            <span>{translator("event.settings.stage.stage")} #{ item.id }</span>
          <input
            className="stage-name"
            placeholder={translator('event.settings.stage.name')}
            value={item.name ?? ''}
            onChange={e => setItem( item.update({name: e.target.value }))}
          />
          <input
            className="stage-date"
            type="date"
            value={item.date ?? 0}
            onChange={e => setItem( item.update({date: e.target.value }))}
            title={translator('event.settings.stage.date')}
          />
          <input
            className="stage-distance"
            type="number"
            min="0"
            value={item.distance ?? 0}
            onChange={e => setItem( item.update({distance: e.target.value }))}
            title={translator('event.settings.stage.distance')}
          /><span>km</span>
        </div>

        <div className="stage-h-right">
          
          <button type="button" className="btn small danger" onClick={() => onRemove && onRemove(item.id)}>{translator('event.settings.stage.remove')}</button>
        </div>
      </div>


    </div>
  );
}
