import React from 'react';

// Simple id generator (no external deps)
const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;

const DEFAULTS_BY_TYPE = {
  team: { teamSize: 4 },
  points: { pointsForPlaces: '10,8,6,4,2,1' },
  filter: { expression: '' },
};

export default function AnnexItem({ translator, annex, onChange, onRemove }) {
  // ensure annex object has expected props (defensive)
  const a = annex || { id: makeId(), title: '', priority: 0, type: 'points', props: {} };

  function update(patch) {
    onChange && onChange({ ...a, ...patch });
  }

  function onTypeChange(e) {
    const type = e.target.value;
    const defaults = DEFAULTS_BY_TYPE[type] ? { ...DEFAULTS_BY_TYPE[type] } : {};
    update({ type, props: { ...defaults } });
  }

  return (
    <div className="annex-item">
      <div className="annex-header">
        <div className="annex-h-left">
          <input
            className="annex-title"
            placeholder={translator('event.settings.annex.title')}
            value={a.title ?? ''}
            onChange={e => update({ title: e.target.value })}
          />
          <input
            className="annex-priority"
            type="number"
            min="0"
            value={a.priority ?? 0}
            onChange={e => update({ priority: Number(e.target.value) })}
            title={translator('event.settings.annex.priority')}
          />
        </div>

        <div className="annex-h-right">
          <select value={a.type ?? 'points'} onChange={onTypeChange}>
            <option value="team">{translator('event.settings.annex.type.team')}</option>
            <option value="points">{translator('event.settings.annex.type.points')}</option>
            <option value="filter">{translator('event.settings.annex.type.filter')}</option>
          </select>
          <button type="button" className="btn small danger" onClick={() => onRemove && onRemove(a.id)}>{translator('event.settings.annex.remove')}</button>
        </div>
      </div>

      <div className="annex-body">
        {a.type === 'team' && (
          <div className="annex-field">
            <label>{translator('event.settings.annex.teamsize')}</label>
            <input type="number" min="1" value={a.props?.teamSize ?? ''} onChange={e => update({ props: { ...(a.props||{}), teamSize: Number(e.target.value) } })} />
          </div>
        )}

        {a.type === 'points' && (
          <div className="annex-field">
            <label>{translator('event.settings.annex.points')}</label>
            <input type="text" value={a.props?.pointsForPlaces ?? ''} onChange={e => update({ props: { ...(a.props||{}), pointsForPlaces: e.target.value } })} />
            <small className="muted">Example: 10,8,6,4,2,1</small>
          </div>
        )}

        {a.type === 'filter' && (
          <div className="annex-field">
            <label>{translator('event.settings.annex.filter')}</label>
            <input type="text" value={a.props?.expression ?? ''} onChange={e => update({ props: { ...(a.props||{}), expression: e.target.value } })} />
            <small className="muted">{translator('event.settings.annex.filterdescription')}</small>
          </div>
        )}
      </div>
    </div>
  );
}
