import React, { useEffect, useState } from 'react';

export function TeamItem( {translator, data, onApply, onRemove} ) {

    const [ item, setItem ] = useState( data );

    useEffect(() => { onApply && onApply( item ) }, [ item ]);

    return (

        <div className="team-item">
            <div className="team-header">
                <div className="team-h-left">
                    <input
                        className="team-title"
                        placeholder={translator('event.settings.team.title')}
                        value={item.title ?? ''}
                        onChange={e => setItem( item.update({title: e.target.value }))}
                    />
                    <input
                        className="team-priority"
                        type="number"
                        min="0"
                        value={item.priority ?? 0}
                        onChange={e => setItem( item.update({priority: e.target.value }))}
                        title={translator('event.settings.team.priority')}
                    />
                </div>

                <div className="team-h-right">
                    <span>{ translator('event.settings.team.name') }</span>
                    <button type="button" className="btn small danger" onClick={() => onRemove && onRemove(item.id)}>{translator('event.settings.team.remove')}</button>
                </div>
            </div>

        </div>
    );
}