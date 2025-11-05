import React, { useEffect, useState } from 'react';
import "./FilterItem.css"

export function FilterItem( {translator, data, onApply, onRemove} ) {

    const [ item, setItem ] = useState( data );

    useEffect(() => { onApply && onApply( item ) }, [ item ]);

    return (

        <div className="filter-item">
            <div className="filter-header">
                <div className="filter-h-left">
                    <input
                        className="filter-title"
                        placeholder={translator('event.settings.filter.title')}
                        value={item.title ?? ''}
                        onChange={e => setItem( item.update({title: e.target.value }))}
                    />
                    <span>{ translator( 'event.settings.filter.priority' ) }</span>
                    <input
                        className="filter-priority"
                        type="number"
                        min="0"
                        value={item.priority ?? 0}
                        onChange={e => setItem( item.update({priority: e.target.value }))}
                        title={translator('event.settings.filter.priority')}
                    />
                    <input
                        className="filter-pattern"
                        placeholder={translator('event.settings.filter.pattern')}
                        value={item.pattern ?? ''}
                        onChange={e => setItem( item.update({pattern: e.target.value }))}
                    />
                </div>

                <div className="filter-h-right">
                    <span>{ translator('event.settings.filter.name') }</span>
                    <button type="button" className="btn small danger" onClick={() => onRemove && onRemove(item.id)}>{translator('event.settings.filter.remove')}</button>
                </div>
            </div>

        </div>
    );
}