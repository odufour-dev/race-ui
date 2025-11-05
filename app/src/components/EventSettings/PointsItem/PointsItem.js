import React, { useEffect, useState } from 'react';
import "./PointsItem.css"

export function PointsItem( {translator, data, onApply, onRemove} ) {

    const [ item, setItem ] = useState( data );

    useEffect(() => { onApply && onApply( item ) }, [ item ]);

    return (

        <div className="points-item">
            <div className="points-header">
                <div className="points-h-left">
                    <input
                        className="points-title"
                        placeholder={translator('event.settings.points.title')}
                        value={item.title ?? ''}
                        onChange={e => setItem( item.update({title: e.target.value }))}
                    />
                    <input
                        className="points-priority"
                        type="number"
                        min="0"
                        value={item.priority ?? 0}
                        onChange={e => setItem( item.update({priority: e.target.value }))}
                        title={translator('event.settings.points.priority')}
                    />
                </div>

                <div className="points-h-right">
                    <span>{ translator('event.settings.points.name') }</span>
                    <button type="button" className="btn small danger" onClick={() => onRemove && onRemove(item.id)}>{translator('event.settings.points.remove')}</button>
                </div>
            </div>

        </div>
    );
}