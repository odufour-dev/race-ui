import React, { useEffect, useState } from 'react';
import './EventSettings.css';

/**
 * EventSettings
 * Props:
 * - settings: the RaceModel instance (mutated directly when Apply is clicked)
 * - onApply?: optional callback(settings) called after applying settings
 * - onCancel?: optional callback() called when user cancels
 */
export default function EventSettings({ settings, onApply, onCancel }) {
  
  // Use safe defaults so inputs never receive `undefined` which causes
  // React's controlled -> uncontrolled warning.
  const [numberOfStages, setNumberOfStages] = useState(settings?.nStages ?? 1);
  const [annexRankings, setAnnexRankings] = useState(Array.isArray(settings?.annexRankings) ? settings.annexRankings.slice() : []);
  const [teamRankingEnabled, setTeamRankingEnabled] = useState(!!settings?.teamRanking?.enable);
  const [teamSize, setTeamSize] = useState(settings?.teamRanking?.size ?? 4);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // keep local state in sync if settings changes externally
    if (!settings) return;
    setNumberOfStages(settings?.nStages ?? 1);
    setAnnexRankings(Array.isArray(settings?.annexRankings) ? settings.annexRankings.slice() : []);
    setTeamRankingEnabled(!!settings?.teamRanking?.enable);
    setTeamSize(settings?.teamRanking?.size ?? 4);
  }, [settings]);

  function validate() {
    const e = {};
    if (!Number.isFinite(Number(numberOfStages)) || Number(numberOfStages) < 1) {
      e.numberOfStages = 'Number of stages must be >= 1';
    }
    if (teamRankingEnabled) {
      if (!Number.isFinite(Number(teamSize)) || Number(teamSize) < 1) {
        e.teamSize = 'Team size must be >= 1';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function applySettings() {
    if (!validate()) return;
    if (typeof onApply === 'function') onApply({
      nStages: Number(numberOfStages),
      annexRankings: (annexRankings || []).slice(),
      teamRanking: { enable: !!teamRankingEnabled, size: teamRankingEnabled ? Number(teamSize) : null },
    });
  }

  function resetToInitial() {
    if (!settings) {
      setNumberOfStages(1);
      setAnnexRankings([]);
      setTeamRankingEnabled(false);
      setTeamSize(4);
    } else {
      setNumberOfStages(settings?.nStages ?? 1);
      setAnnexRankings(Array.isArray(settings?.annexRankings) ? settings.annexRankings.slice() : []);
      setTeamRankingEnabled(!!settings?.teamRanking?.enable);
      setTeamSize(settings?.teamRanking?.size ?? 4);
    }
    setErrors({});
    if (typeof onCancel === 'function') onCancel();
  }

  function addAnnex() {
    setAnnexRankings([...(annexRankings || []), '']);
  }

  function updateAnnex(idx, value) {
    const copy = annexRankings.slice();
    copy[idx] = value;
    setAnnexRankings(copy);
  }

  function removeAnnex(idx) {
    const copy = annexRankings.slice().filter((_, i) => i !== idx);
    setAnnexRankings(copy);
  }

  return (
    <div className="event-settings">
      <h2>Event settings</h2>

      <div className="field">
        <label>Number of stages</label>
        <input
          type="number"
          min="1"
          value={numberOfStages}
          onChange={e => setNumberOfStages(e.target.value)}
        />
        {errors.numberOfStages && <div className="error">{errors.numberOfStages}</div>}
      </div>

      <div className="field">
        <label>Annex rankings</label>
        <div className="annex-list">
          {annexRankings.length === 0 && <div className="muted">No annex rankings defined</div>}
          {(annexRankings || []).map((a, idx) => (
            <div className="annex-row" key={idx}>
              <input
                type="text"
                placeholder={`Annex ranking #${idx + 1}`}
                value={a ?? ''}
                onChange={e => updateAnnex(idx, e.target.value)}
              />
              <button type="button" className="btn small danger" onClick={() => removeAnnex(idx)}>Remove</button>
            </div>
          ))}
          <div className="annex-actions">
            <button type="button" className="btn" onClick={addAnnex}>Add annex ranking</button>
          </div>
        </div>
      </div>

      <div className="field">
        <label>
          <input
            type="checkbox"
            checked={!!teamRankingEnabled}
            onChange={e => setTeamRankingEnabled(!!e.target.checked)}
          />
          <span className="label-inline">Enable team ranking</span>
        </label>
      </div>

      {teamRankingEnabled && (
        <div className="field">
          <label>Team size</label>
          <input
            type="number"
            min="1"
            value={teamSize ?? ''}
            onChange={e => setTeamSize(e.target.value)}
          />
          {errors.teamSize && <div className="error">{errors.teamSize}</div>}
        </div>
      )}

      <div className="actions">
        <button type="button" className="btn primary" onClick={applySettings}>Apply</button>
        <button type="button" className="btn" onClick={resetToInitial}>Cancel</button>
      </div>
    </div>
  );
}
