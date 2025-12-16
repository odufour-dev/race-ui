import React, { useEffect, useState } from 'react';
import "./TeamItem.css"

export function TeamItem( {helper, data, onApply, onRemove} ) {

    const [ item, setItem ] = useState( data );

    useEffect(() => { onApply && onApply( item ) }, [ item ]);

    return (

        <div className="team-item">
            <div className="team-header">
                <div className="team-h-left">
                    <input
                        className="team-title"
                        placeholder={helper.translator('event.settings.team.title')}
                        value={item.title ?? ''}
                        onChange={e => setItem( item.update({title: e.target.value }))}
                    />
                    <span>{ helper.translator( 'event.settings.team.priority' ) }</span>
                    <input
                        className="team-priority"
                        type="number"
                        min="0"
                        value={item.priority ?? 0}
                        onChange={e => setItem( item.update({priority: e.target.value }))}
                        title={helper.translator('event.settings.team.priority')}
                    />
                    <span>{ helper.translator( 'event.settings.team.nracers' ) }</span>
                    <input
                        className="team-nracers"
                        type="number"
                        min="0"
                        value={item.nracers ?? 0}
                        onChange={e => setItem( item.update({nracers: e.target.value }))}
                        title={helper.translator('event.settings.team.nracers')}
                    />
                </div>

                <div className="team-h-right">
                    <span>{ helper.translator('event.settings.team.name') }</span>
                    <button type="button" className="btn small danger" onClick={() => onRemove && onRemove(item.id)}>{helper.translator('event.settings.team.remove')}</button>
                </div>
            </div>

        </div>
    );
}