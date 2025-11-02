import React from 'react';

export default function AnnexItem({ translator, annex, onChange, onRemove }) {
  
  function update(patch) {
    onChange && onChange({ ...patch });
  }

  return (
    <div className="annex-item">
      <div className="annex-header">
        <div className="annex-h-left">
          <input
            className="annex-title"
            placeholder={translator('event.settings.annex.title')}
            value={annex.title ?? ''}
            onChange={e => update({ title: e.target.value })}
          />
          <input
            className="annex-priority"
            type="number"
            min="0"
            value={annex.priority ?? 0}
            onChange={e => update({ priority: Number(e.target.value) })}
            title={translator('event.settings.annex.priority')}
          />
        </div>

        <div className="annex-h-right">
          <span>Type: {annex.type}</span>
          <button type="button" className="btn small danger" onClick={() => onRemove && onRemove(annex.id)}>{translator('event.settings.annex.remove')}</button>
        </div>
      </div>

{
    /*
      <div className="annex-body">
        {annex.type === 'team' && (
          <div className="annex-field">
            <label>{translator('event.settings.annex.teamsize')}</label>
            <input type="number" min="1" value={annex.props?.teamSize ?? ''} onChange={e => update({ props: { ...(annex.props||{}), teamSize: Number(e.target.value) } })} />
          </div>
        )}

        {annex.type === 'points' && (
          <div className="annex-field">
            <label>{translator('event.settings.annex.points')}</label>
            <input type="text" value={annex.props?.pointsForPlaces ?? ''} onChange={e => update({ props: { ...(annex.props||{}), pointsForPlaces: e.target.value } })} />
            <small className="muted">Example: 10,8,6,4,2,1</small>
          </div>
        )}

        {annex.type === 'filter' && (
          <div className="annex-field">
            <label>{translator('event.settings.annex.filter')}</label>
            <input type="text" value={annex.props?.expression ?? ''} onChange={e => update({ props: { ...(annex.props||{}), expression: e.target.value } })} />
            <small className="muted">{translator('event.settings.annex.filterdescription')}</small>
          </div>
        )}
      </div>
      */
}
    </div>
  );
}
