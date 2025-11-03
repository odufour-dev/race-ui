import React, { useEffect, useState } from 'react';
import './EventSettings.css';
import AnnexItem from './AnnexItem';
import StageItem from './StageItem';

/**
 * EventSettings
 * Props:
 * - settings: the RaceModel instance (mutated directly when Apply is clicked)
 * - onApply?: optional callback(settings) called after applying settings
 * - onCancel?: optional callback() called when user cancels
 */
export default function EventSettings({ translator, settings, onApply }) {
  
  // Use safe defaults so inputs never receive `undefined` which causes
  // React's controlled -> uncontrolled warning.
  const [ evtSettings, setEvtSettings ]     = useState( settings );
  const [ annexType, setAnnexType ]         = useState( settings.annexRankingTypes[0] );
  
  function addAnnex() {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
    setEvtSettings( evtSettings.addAnnexRanking(annexType,id) );
  }

  return (
    <div className="event-settings">
      <h2>{translator("event.settings.title")}</h2>

      <div className="field">
        <label>{translator("event.settings.nstages")}</label>
        <div className="stage-list">
          {evtSettings.stages.length === 0 && <div className="muted">{translator("event.settings.nostage")}</div>}
          {(evtSettings.stages || []).map((s, idx) => (
            <StageItem
              translator={translator}
              key={s.id ?? idx}
              stage={s}
              onRemove={() => setEvtSettings(evtSettings.update({stages: evtSettings.stages.filter((_,i) => i != idx)}))}
            />
          ))}
        </div>
        <div className="stage-actions">
          <button type="button" className="btn" onClick={() => setEvtSettings( evtSettings.addStage() )}>{translator("event.settings.addstage")}</button>
        </div>
      </div>

      <div className="field">
        <label>{translator("event.settings.annexrankings")}</label>
        <div className="annex-list">
          {evtSettings.annexRankings.length === 0 && <div className="muted">{translator("event.settings.noannexranking")}</div>}
          {(evtSettings.annexRankings || []).map((a, idx) => (
            <AnnexItem
              translator={translator}
              key={a.id ?? idx}
              annex={a}
              onRemove={() => setEvtSettings(evtSettings.update({annexRankings: evtSettings.annexRankings.filter((r) => r.id != a.id)}))}
            />
          ))}
          <div className="annex-actions">
            <select value={annexType} onChange={e => setAnnexType(e.target.value)}>
            {
              evtSettings.annexRankingTypes.map((t) => (
                <option key={t} value={t}>{translator("event.settings.annex.type." + t)}</option>
              ))
            }
            </select>
            <button type="button" className="btn" onClick={addAnnex}>{translator("event.settings.addannexranking")}</button>
          </div>
        </div>
      </div>

      <div className="actions">
        <button type="button" className="btn primary" onClick={() => onApply( evtSettings )}>{translator("event.settings.apply")}</button>²
      </div>
    </div>
  );
}
