import React, { useEffect, useState } from 'react';
import './EventSettings.css';
import AnnexItem from './AnnexItem';

/**
 * EventSettings
 * Props:
 * - settings: the RaceModel instance (mutated directly when Apply is clicked)
 * - onApply?: optional callback(settings) called after applying settings
 * - onCancel?: optional callback() called when user cancels
 */
export default function EventSettings({ translator, settings, onApply, onCancel }) {
  
  // Use safe defaults so inputs never receive `undefined` which causes
  // React's controlled -> uncontrolled warning.
  const [numberOfStages, setNumberOfStages] = useState(settings?.nStages ?? 1);
  // annexRankings is an array of objects: { id, title, priority, type, props }
  const [annexRankings, setAnnexRankings] = useState(Array.isArray(settings?.annexRankings) ? settings.annexRankings.map(a => ({ ...a })) : []);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // keep local state in sync if settings changes externally
    if (!settings) return;
    setNumberOfStages(settings?.nStages ?? 1);
    setAnnexRankings(Array.isArray(settings?.annexRankings) ? settings?.annexRankings.map(a => ({ ...a })) : []);
  }, [settings]);

  function validate() {
    const e = {};
    if (!Number.isFinite(Number(numberOfStages)) || Number(numberOfStages) < 1) {
      e.numberOfStages = 'Number of stages must be >= 1';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function applySettings() {
    if (!validate()) return;
    if (typeof onApply === 'function') onApply({
      nStages: Number(numberOfStages),
      annexRankings: (annexRankings || []).slice(),
    });
  }

  function resetToInitial() {
    if (!settings) {
      setNumberOfStages(1);
      setAnnexRankings([]);
    } else {
      setNumberOfStages(settings?.nStages ?? 1);
      setAnnexRankings(Array.isArray(settings?.annexRankings) ? settings.annexRankings.slice() : []);
    }
    setErrors({});
    if (typeof onCancel === 'function') onCancel();
  }

  function addAnnex() {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
    const next = [...(annexRankings || [])];
    next.push({ id, title: '', priority: 0, type: 'points', props: { pointsForPlaces: '10,8,6,4,2,1' } });
    setAnnexRankings(next);
  }

  function updateAnnexById(id, updated) {
    const copy = (annexRankings || []).map(a => (a.id === id ? { ...a, ...updated } : a));
    setAnnexRankings(copy);
  }

  function removeAnnexById(id) {
    const copy = (annexRankings || []).filter(a => a.id !== id);
    setAnnexRankings(copy);
  }

  return (
    <div className="event-settings">
      <h2>{translator("event.settings.title")}</h2>

      <div className="field">
        <label>{translator("event.settings.nstages")}</label>
        <input
          type="number"
          min="1"
          value={numberOfStages}
          onChange={e => setNumberOfStages(e.target.value)}
        />
        {errors.numberOfStages && <div className="error">{errors.numberOfStages}</div>}
      </div>

      <div className="field">
        <label>{translator("event.settings.annexrankings")}</label>
        <div className="annex-list">
          {annexRankings.length === 0 && <div className="muted">{translator("event.settings.noannexranking")}</div>}
          {(annexRankings || []).map((a, idx) => (
            <AnnexItem
              translator={translator}
              key={a.id ?? idx}
              annex={a}
              onChange={(updated) => updateAnnexById(a.id, updated)}
              onRemove={() => removeAnnexById(a.id)}
            />
          ))}
          <div className="annex-actions">
            <button type="button" className="btn" onClick={addAnnex}>{translator("event.settings.addannexranking")}</button>
          </div>
        </div>
      </div>

      <div className="actions">
        <button type="button" className="btn primary" onClick={applySettings}>{translator("event.settings.apply")}</button>
        <button type="button" className="btn" onClick={resetToInitial}>{translator("event.settings.cancel")}</button>
      </div>
    </div>
  );
}
